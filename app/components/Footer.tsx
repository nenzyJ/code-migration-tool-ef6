import {Suspense} from 'react';
import {Await, Link, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {useI18n} from '~/lib/i18n';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  const {t} = useI18n();
  return (
    <Suspense fallback={
      <footer className="bg-agro-green py-10 text-white border-t border-agro-green/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link to="/" className="font-montserrat font-bold text-lg text-white">
            AgroTrade
          </Link>
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} AgroTrade. {t('rights_reserved')}
          </p>
        </div>
      </footer>
    }>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-agro-green py-12 text-white border-t border-agro-green/10">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-8">
              {/* Logo & Copyright */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <Link to="/" className="font-montserrat font-bold text-xl text-white tracking-wide">
                  AgroTrade
                </Link>
                <p className="text-white/60 text-sm">
                  © {new Date().getFullYear()} AgroTrade. {t('rights_reserved')}
                </p>
              </div>

              {/* Dynamic Footer Menu */}
              {footer?.menu && header.shop.primaryDomain?.url && (
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              )}
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  const menuItems = menu?.items || FALLBACK_FOOTER_MENU.items;

  return (
    <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8" role="navigation">
      {menuItems.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        
        const linkClass = "text-sm text-white/70 hover:text-white transition-colors hover:underline";

        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank" className={linkClass}>
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            className={linkClass}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Конфіденційність',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Повернення',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Доставка',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Умови використання',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
