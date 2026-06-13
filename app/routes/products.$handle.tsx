import {redirect, useLoaderData, Link} from 'react-router';
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
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useI18n} from '~/lib/i18n';

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

import { useState, useEffect } from 'react';

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const {t} = useI18n();
  const [activeTab, setActiveTab] = useState('description');

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

  const tabs = [
    { id: 'description', label: t('tab_description') },
    { id: 'specifications', label: t('tab_specifications') },
    { id: 'reviews', label: t('tab_reviews') },
  ];

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
              <span className="px-3 py-1.5 bg-white/95 text-xs font-semibold tracking-wide rounded-full text-gray-800 border border-gray-200 uppercase">
                🌾 {t('new_badge')}
              </span>
              <span className="px-3 py-1.5 bg-white/95 text-xs font-semibold tracking-wide rounded-full text-green-700 border border-green-200 flex items-center gap-1.5 uppercase">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Elite Class Certified
              </span>
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
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            <span className="text-[#10b981] text-xs font-bold tracking-[1px] uppercase">
              {selectedVariant?.availableForSale ? t('in_stock') : t('out_of_stock')}
            </span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-[#191C1D] mb-6 font-['Montserrat',sans-serif] leading-tight">
            {title}
          </h1>

          <div className="text-[32px] font-bold text-[#191C1D] mb-6 flex items-end gap-2 [&_.product-price]:text-[32px]">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          <div className="mb-8">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <AddToCartButton
                disabled={!selectedVariant || !selectedVariant.availableForSale}
                onClick={() => {
                  window.location.href = '/cart';
                }}
                className="flex-1 bg-white text-[#012D1D] border-2 border-[#012D1D] py-4 px-6 rounded font-semibold hover:bg-gray-50 transition-colors shadow-sm w-full block text-center"
                lines={
                  selectedVariant
                    ? [
                        {
                          merchandiseId: selectedVariant.id,
                          quantity: 1,
                          selectedVariant,
                        },
                      ]
                    : []
                }
              >
                {t('buy_now')}
              </AddToCartButton>
          </div>

          {/* Features widgets */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-[#F8F9FA] p-4 rounded-xl flex items-start gap-3 border border-gray-100">
              <div className="bg-white p-2.5 rounded shadow-sm text-blue-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5l-5 5-5-5M19 12H5M17 19l-5-5-5 5"/></svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">{t('winter_hardiness')}</span>
                <span className="font-bold text-[#191C1D] text-sm">{t('high')} <span className="text-gray-400 font-medium">(8.5/10)</span></span>
              </div>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-xl flex items-start gap-3 border border-gray-100">
              <div className="bg-white p-2.5 rounded shadow-sm text-orange-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">{t('drought_resistance')}</span>
                <span className="font-bold text-[#191C1D] text-sm">{t('maximum')} <span className="text-gray-400 font-medium">(9.0/10)</span></span>
              </div>
            </div>
          </div>

          {/* Bottom icons */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-auto px-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#f4f2ef] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B5731" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <span className="text-xs font-semibold text-gray-600 tracking-wide">{t('certified')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#f4f2ef] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B5731" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <span className="text-xs font-semibold text-gray-600 tracking-wide">{t('days_delivery')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#f4f2ef] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B5731" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
              </div>
              <span className="text-xs font-semibold text-gray-600 tracking-wide">{t('support')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="border-b border-gray-200 mb-8 mt-4">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-bold text-sm tracking-wide transition-colors relative ${activeTab === tab.id ? 'text-[#012D1D]' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#012D1D] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-[800px] mb-12">
        {activeTab === 'description' && (
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
        )}
        {activeTab === 'specifications' && (
          <div className="text-[#414844]">{t('specs_placeholder')}</div>
        )}
        {activeTab === 'reviews' && (
          <div className="text-[#414844]">{t('reviews_placeholder')}</div>
        )}
      </div>

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
