import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <Link
      className="flex flex-col rounded border border-agro-border bg-white overflow-hidden hover:shadow-lg hover:border-agro-green/30 transition-all duration-300 group"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-square overflow-hidden bg-agro-gray flex-shrink-0">
        {image ? (
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={loading}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(min-width: 45em) 400px, 100vw"
          />
        ) : (
          <div className="w-full h-full bg-agro-gray flex items-center justify-center text-agro-body/40">
            Немає зображення
          </div>
        )}
        
        {/* Hover overlay badge */}
        <div className="absolute inset-0 bg-agro-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <span className="w-full py-2 bg-agro-green text-white text-xs font-semibold tracking-wider uppercase text-center rounded shadow">
            Детальніше
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col p-4 flex-grow justify-between gap-2">
        <h4 className="font-montserrat font-semibold text-base text-agro-dark group-hover:text-agro-green transition-colors line-clamp-2">
          {product.title}
        </h4>
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-agro-gray">
          <span className="text-agro-green font-bold text-lg font-sans">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
          
          {/* Arrow indicator */}
          <span className="text-agro-green/50 group-hover:text-agro-green transform translate-x-0 group-hover:translate-x-1 transition-all">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current">
              <path d="M6 12L10 8L6 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
