import type {Route} from './+types/api.featured';

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;
  const data = await storefront.query(
    `#graphql
    query FeaturedProductsSearch {
      products(first: 4, sortKey: BEST_SELLING) {
        nodes {
          id
          title
          handle
          trackingParameters
          selectedOrFirstAvailableVariant(
            selectedOptions: []
            ignoreUnknownOptions: true
            caseInsensitiveMatch: true
          ) {
            id
            image {
              url
              altText
              width
              height
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
    `
  );
  return data;
}
