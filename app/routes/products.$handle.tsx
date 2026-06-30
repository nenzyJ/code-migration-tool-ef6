import {redirect, useLoaderData, Link} from 'react-router';
import {useState, useEffect, useCallback} from 'react';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useI18n} from '~/lib/i18n';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}



export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const {t} = useI18n();
  const {open} = useAside();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const [selectedImage, setSelectedImage] = useState<any>(selectedVariant?.image || product?.images?.nodes?.[0]);

  // Update selected image when variant changes
  useEffect(() => {
    if (selectedVariant?.image) {
      setSelectedImage(selectedVariant.image);
    }
  }, [selectedVariant?.image]);

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  // Quantity state for order block
  const [quantity, setQuantity] = useState(1);
  const decreaseQty = useCallback(() => setQuantity((q: number) => Math.max(1, q - 1)), []);
  const increaseQty = useCallback(() => setQuantity((q: number) => q + 1), []);

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-8 w-full bg-white font-['Inter',sans-serif]">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-8 font-medium">
        <Link to="/collections/all" className="hover:text-gray-800 transition-colors">{t('nav_catalog')}</Link> &gt; 
        <span className="text-[#012D1D] ml-2">{title}</span>
      </div>

      {/* Top Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left: Images */}
        <div className="flex flex-col gap-4">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[4/3] [&_.product-image]:w-full [&_.product-image]:h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover">
            <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10">
              <Badge variant="outline" className="px-3 py-1 bg-white/95 text-xs font-semibold tracking-wide rounded-full text-gray-800 border-gray-200 uppercase">
                🌾 {t('new_badge')}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 bg-white/95 text-xs font-semibold tracking-wide rounded-full text-green-700 border-green-200 flex items-center gap-1.5 uppercase">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Elite Class Certified
              </Badge>
            </div>
            <ProductImage image={selectedImage} />
          </div>
          {/* Thumbnails */}
          {product.images?.nodes?.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.nodes.map((image: any, index: number) => (
                <div 
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`rounded-lg overflow-hidden border-2 cursor-pointer h-24 bg-gray-50 transition-colors ${
                    selectedImage?.url === image.url 
                      ? 'border-[#012D1D]' 
                      : 'border-transparent hover:border-gray-400'
                  }`}
                >
                  <img src={image.url} alt={image.altText || `Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-5">
            <Badge variant="outline" className="px-3 py-1 bg-[#f4f2ef] text-xs font-semibold tracking-wide rounded-full text-[#7B5731] border-[#e8e3dc] shadow-none">
              ⭐ Premium Quality
            </Badge>
            <Badge variant="outline" className="px-3 py-1 bg-[#eef5e6] text-xs font-semibold tracking-wide rounded-full text-[#3d7a1c] border-[#d5e8c3] shadow-none">
              🌾 Winter Wheat
            </Badge>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-[#191C1D] mb-4 font-['Montserrat',sans-serif] leading-tight">
            {title}
          </h1>

          {/* Rating + Reviews + Availability */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((star) => (
                <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={star <= 4 ? '#facc15' : 'none'} stroke="#facc15" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">12 {t('tab_reviews').toLowerCase().replace(/\s*\(.*\)/, '')}</span>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              <span className="text-sm font-medium text-[#10b981]">
                {selectedVariant?.availableForSale ? t('in_stock') : t('out_of_stock')}
              </span>
            </div>
          </div>

          {/* Order Block */}
          <div className="border border-gray-200 rounded-xl p-6 mb-8">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <div className="text-[32px] font-bold text-[#012D1D] [&_.product-price]:text-[32px] [&_.product-price]:font-bold">
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>
              <span className="text-sm text-gray-500 font-medium">/ тонна</span>
            </div>

            {/* Variant Options (if any) */}
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#191C1D] mb-2">Кількість (тонн)</label>
              <div className="flex items-center border border-gray-300 rounded w-32 overflow-hidden focus-within:border-[#012D1D] focus-within:ring-1 focus-within:ring-[#012D1D] transition-all">
                <button
                  type="button"
                  onClick={decreaseQty}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors outline-none flex-shrink-0"
                  aria-label="Decrease quantity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="qty-input flex-1 min-w-0 h-10 text-center text-sm font-bold text-[#191C1D] bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={increaseQty}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors outline-none flex-shrink-0"
                  aria-label="Increase quantity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            </div>

            {/* Add to Cart Button (primary) */}
            <div className="flex flex-col gap-3">
              <AddToCartButton
                disabled={!selectedVariant || !selectedVariant.availableForSale}
                onClick={() => {
                  open('cart');
                }}
                className="w-full bg-[#012D1D] text-white py-3.5 px-6 border-2 border-transparent rounded flex items-center justify-center gap-2 font-semibold hover:bg-[#023d27] transition-colors text-sm"
                lines={
                  selectedVariant
                    ? [
                        {
                          merchandiseId: selectedVariant.id,
                          quantity,
                          selectedVariant,
                        },
                      ]
                    : []
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                {selectedVariant?.availableForSale ? t('add_to_cart') : t('out_of_stock')}
              </AddToCartButton>

              {/* Buy Now Button (outline) */}
              <AddToCartButton
                disabled={!selectedVariant || !selectedVariant.availableForSale}
                redirectTo="/cart"
                className="w-full bg-white text-[#012D1D] border-2 border-[#012D1D] py-3.5 px-6 rounded font-semibold hover:bg-[#f4f2ef] transition-colors text-sm text-center"
                lines={
                  selectedVariant
                    ? [
                        {
                          merchandiseId: selectedVariant.id,
                          quantity,
                          selectedVariant,
                        },
                      ]
                    : []
                }
              >
                {t('buy_now')}
              </AddToCartButton>
            </div>
          </div>

          {/* Bottom icons */}
          <div className="flex items-start justify-between px-2">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-11 h-11 rounded-full bg-[#f4f2ef] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B5731" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-800 tracking-wide">{t('certified')}</span>
              <span className="text-[11px] text-gray-500">100% Оригінал</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-11 h-11 rounded-full bg-[#f4f2ef] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B5731" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-800 tracking-wide">{t('days_delivery')}</span>
              <span className="text-[11px] text-gray-500">По всій Україні</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-11 h-11 rounded-full bg-[#f4f2ef] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B5731" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-800 tracking-wide">{t('support')}</span>
              <span className="text-[11px] text-gray-500">Консультація агронома</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="description" className="mb-12 max-w-[800px]">
        <div className="border-b border-gray-200 mb-8 mt-4 flex">
          <TabsList className="bg-transparent h-auto p-0 flex justify-start gap-8">
            <TabsTrigger 
              value="description" 
              className="product-tab rounded-none p-0 pb-4 -mb-[1px] font-bold text-sm tracking-wide text-gray-500 hover:text-gray-800 transition-colors relative z-10"
            >
              {t('tab_description')}
            </TabsTrigger>
            <TabsTrigger 
              value="specifications" 
              className="product-tab rounded-none p-0 pb-4 -mb-[1px] font-bold text-sm tracking-wide text-gray-500 hover:text-gray-800 transition-colors relative z-10"
            >
              {t('tab_specifications')}
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="product-tab rounded-none p-0 pb-4 -mb-[1px] font-bold text-sm tracking-wide text-gray-500 hover:text-gray-800 transition-colors relative z-10"
            >
              {t('tab_reviews')}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <TabsContent value="description">
          <div className="flex flex-col gap-6 text-[#414844] leading-relaxed">
            <h2 className="text-2xl font-bold text-[#191C1D] mb-1 font-['Montserrat',sans-serif]">{title}</h2>
            
            <div dangerouslySetInnerHTML={{__html: descriptionHtml}} className="prose prose-sm sm:prose-base text-gray-600 max-w-none" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <span className="text-[#414844] text-sm"><span className="font-medium text-[#191C1D]">{t('yield_potential')}</span> 90-110 ц/га</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <span className="text-[#414844] text-sm"><span className="font-medium text-[#191C1D]">{t('protein_content')}</span> 14.5% - 15.2%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <span className="text-[#414844] text-sm"><span className="font-medium text-[#191C1D]">{t('intensive_variety')}</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <span className="text-[#414844] text-sm"><span className="font-medium text-[#191C1D]">{t('plant_height')}</span> 85-95 см</span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="specifications">
          <div className="text-[#414844] pt-4">{t('specs_placeholder')}</div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="text-[#414844] pt-4">{t('reviews_placeholder')}</div>
        </TabsContent>
      </Tabs>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </main>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 5) {
      nodes {
        __typename
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
