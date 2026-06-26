import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

const GOLD = '#C3A343';

const cornerBase: React.CSSProperties = {
  position: 'absolute',
  width: 28,
  height: 28,
  opacity: 0,
  transition: 'opacity 0.4s ease',
  zIndex: 10,
  pointerEvents: 'none',
};

export function ProductItem({
  product,
  loading,
  hidePrice,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
  hidePrice?: boolean;
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  const allImages = (product as any).images?.nodes as
    | {id: string; altText: string | null; url: string; width: number; height: number}[]
    | undefined;
  const secondImage = allImages && allImages.length > 1 ? allImages[1] : null;

  return (
    <Link
      key={product.id}
      to={variantUrl}
      prefetch="intent"
      className="product-card group block"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-agro-gray mb-4">
        {image ? (
          <>
            <Image
              alt={image.altText || product.title}
              data={image}
              loading={loading}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover w-full h-full transition-opacity duration-500 group-hover:opacity-0"
            />
            {secondImage && (
              <Image
                alt={secondImage.altText || product.title}
                data={secondImage}
                loading={loading}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="absolute inset-0 w-full object-cover h-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 transition-colors duration-500 product-card-overlay" />

            {/* View Details — fade + slight slide */}
            <div className="absolute bottom-0 left-0 right-0 p-3 product-card-details">
              <div className="bg-white/90 backdrop-blur-sm py-3 px-4 text-center">
                <span className="text-agro-dark text-sm font-medium tracking-wide">
                  View Details
                </span>
              </div>
            </div>

            {/* Corner brackets — top-left */}
            <div className="product-card-corner-tl" />
            {/* Corner brackets — bottom-right */}
            <div className="product-card-corner-br" />
          </>
        ) : (
          <div className="w-full h-full bg-agro-gray flex items-center justify-center text-agro-body/40">
            Немає зображення
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h4 className="text-base text-agro-dark mb-1 transition-colors duration-400 group-hover:text-brand-gold">
          {product.title}
        </h4>
        <div className="flex justify-between items-center">
          {!hidePrice && (
            <Money
              data={product.priceRange.minVariantPrice}
              className="text-agro-body text-sm"
            />
          )}
          <span className="product-card-explore flex items-center text-sm gap-1">
            Explore
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
