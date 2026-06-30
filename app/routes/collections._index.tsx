import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {useI18n} from '~/lib/i18n';

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
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
      cache: context.storefront.CacheShort(),
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();
  const {t} = useI18n();

  return (
    <div className="bg-white font-sans text-agro-dark">
      <section className="py-20 border-b border-agro-border/30 bg-agro-bg">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
          <h1 className="font-montserrat font-bold text-4xl sm:text-5xl text-agro-dark mb-4">
            {t('categories_title')}
          </h1>
          <p className="text-agro-body text-base sm:text-lg max-w-[800px] mx-auto leading-7">
            {t('categories_desc')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
          <PaginatedResourceSection<CollectionFragment>
            connection={collections}
            resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {({node: collection, index}) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                index={index}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </section>
    </div>
  );
}

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
    <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#012D1D"/>
  </svg>
);

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  const {t} = useI18n();
  return (
    <Link
      className="flex flex-col rounded border border-agro-border bg-agro-bg overflow-hidden hover:shadow-md transition-shadow group"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      <div className="h-48 overflow-hidden bg-[#E7E8E9]">
        {collection?.image ? (
          <Image
            alt={collection.image.altText || collection.title}
            data={collection.image}
            loading={index < 3 ? 'eager' : undefined}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(min-width: 45em) 400px, 100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-agro-body/40 group-hover:scale-105 transition-transform duration-300">
            {t('no_image')}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-4 py-4">
        <span className="font-montserrat font-semibold text-xl text-agro-dark leading-8 line-clamp-1">
          {collection.title}
        </span>
        <ArrowRight />
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
