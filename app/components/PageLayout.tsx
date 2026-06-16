import {Await, Link, useFetcher} from 'react-router';
import {Suspense, useId, useEffect, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

import {useI18n} from '~/lib/i18n';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  const {t} = useI18n();
  return (
    <Aside type="cart" heading={t('nav_cart').toUpperCase()}>
      <Suspense fallback={<p>{t('loading')}</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const {t} = useI18n();
  const queriesDatalistId = useId();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const featuredFetcher = useFetcher<any>();

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved) as string[]);
      } catch (e) {}
    }
    if (featuredFetcher.state === 'idle' && !featuredFetcher.data) {
      featuredFetcher.load('/api/featured');
    }
  }, [featuredFetcher]);

  const addRecentSearch = (term: string) => {
    if (!term) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const popularQueries = [
    t('query_fertilizers'),
    t('query_seeds'),
    t('query_machinery'),
    t('query_protection'),
  ];

  return (
    <Aside type="search" heading={t('nav_search').toUpperCase()}>
      <div className="p-6 flex-1 overflow-y-auto min-h-0">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => {
            const handleSearchSubmit = () => {
              if (inputRef.current?.value) {
                addRecentSearch(inputRef.current.value);
              }
              goToSearch();
            };

            return (
              <div className="flex gap-2 mb-8">
                <div className="relative flex-1">
                  <input
                    name="q"
                    onChange={(e) => {
                      fetchResults(e);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (inputRef.current?.value) {
                          addRecentSearch(inputRef.current.value);
                        }
                      }
                    }}
                    onFocus={fetchResults}
                    placeholder={t('search_placeholder')}
                    ref={inputRef}
                    type="search"
                    list={queriesDatalistId}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-1 focus:ring-agro-green focus:border-agro-green outline-none transition-all text-base"
                  />
                </div>
                <button 
                  onClick={handleSearchSubmit}
                  className="bg-agro-green text-white px-8 py-3 rounded-lg font-medium text-sm active:scale-95 transition-transform"
                >
                  {t('search_submit')}
                </button>
              </div>
            );
          }}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            const handleQueryClick = (q: string) => {
              if (typeof document !== 'undefined') {
                const input = document.querySelector('input[type="search"]') as HTMLInputElement;
                if (input) {
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                  nativeInputValueSetter?.call(input, q);
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                  input.focus();
                }
              }
            };

            if (state === 'loading' && term.current) {
              return <div>{t('loading')}</div>;
            }

            if (!term.current) {
              return (
                <>
                  <div className="mb-8 mt-4">
                    <h3 className="font-semibold text-sm text-gray-500 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      {t('popular_queries')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularQueries.map(q => (
                        <button 
                          key={q}
                          onClick={() => handleQueryClick(q)}
                          className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-agro-green/10 hover:text-agro-green transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {t('recent_searches')}
                      </h3>
                      {recentSearches.length > 0 && (
                        <button onClick={clearRecentSearches} className="text-xs text-agro-green hover:underline">{t('clear')}</button>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {recentSearches.length > 0 ? recentSearches.map(s => (
                        <li key={s} className="flex items-center text-base text-gray-800 group cursor-pointer"
                          onClick={() => handleQueryClick(s)}
                        >
                          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          <span className="group-hover:text-agro-green">{s}</span>
                        </li>
                      )) : (
                        <li className="text-gray-500 text-sm">{t('no_recent_searches')}</li>
                      )}
                    </ul>
                  </div>

                  {featuredFetcher.data?.products?.nodes?.length > 0 && (
                    <div className="border-t border-gray-200 pt-6 mt-4">
                      <h3 className="font-semibold text-sm text-gray-500 mb-4">{t('recommended_products_title')}</h3>
                      <div className="space-y-4">
                        {featuredFetcher.data.products.nodes.map((product: any) => {
                          const productUrl = `/products/${product.handle}`;
                          const price = product?.selectedOrFirstAvailableVariant?.price;
                          const image = product?.selectedOrFirstAvailableVariant?.image;
                          return (
                            <Link 
                              to={productUrl} 
                              onClick={closeSearch} 
                              key={product.id}
                              className="flex gap-4 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                            >
                              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                                {image && (
                                  <Image
                                    alt={image.altText ?? ''}
                                    src={image.url}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex flex-col justify-center">
                                <span className="font-medium text-sm group-hover:text-agro-green transition-colors">{product.title}</span>
                                <span className="text-base font-bold text-gray-900">{price && <Money data={price} />}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              );
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      {t('view_all_results')} <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  const {t} = useI18n();
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading={t('nav_menu').toUpperCase()}>
        <HeaderMenu viewport="mobile" />
      </Aside>
    )
  );
}
