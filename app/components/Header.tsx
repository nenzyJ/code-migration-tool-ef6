import {Suspense} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-agro-green">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-between h-[69px]">
        {/* Logo */}
        <Link to="/" className="font-montserrat font-bold text-xl text-white tracking-wide">
          AgroTrade
        </Link>

        {/* Desktop Navigation */}
        <HeaderMenu viewport="desktop" />

        <HeaderMenuMobileToggle />
      </div>
    </header>
  );
}

const NAV_LINKS = [
  { label: "Каталог", href: "/collections" },
  { label: "Про нас", href: "/#about" },
  { label: "Контакти", href: "/#contacts" },
];

export function HeaderMenu({
  viewport,
}: {
  viewport: Viewport;
}) {
  const {close} = useAside();



  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col gap-4 py-4" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          className={({isActive}) =>
            `text-base font-medium transition-colors ${isActive ? 'text-white font-semibold' : 'text-white/70 hover:text-white'}`
          }
          to="/"
        >
          Головна
        </NavLink>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.href}
            className={({isActive}) =>
              `text-base font-medium transition-colors ${isActive ? 'text-white font-semibold' : 'text-white/70 hover:text-white'}`
            }
            end
            onClick={close}
            prefetch="intent"
            to={link.href}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-8" role="navigation">
      {NAV_LINKS.map((link) => (
        <NavLink
          className={({isActive}) =>
            `text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors`
          }
          end
          key={link.href}
          onClick={close}
          prefetch="intent"
          to={link.href}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-4 sm:gap-6" role="navigation">
      <SearchToggle />
      <AccountToggle isLoggedIn={isLoggedIn} />
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="md:hidden text-white"
      onClick={() => open('mobile')}
      aria-label="Меню"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="text-white/80 hover:text-white transition-colors focus:outline-none cursor-pointer"
      onClick={() => open('search')}
      aria-label="Пошук"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </button>
  );
}

function AccountToggle({isLoggedIn}: {isLoggedIn: HeaderProps['isLoggedIn']}) {
  return (
    <NavLink
      prefetch="intent"
      to="/account"
      className="text-white/80 hover:text-white transition-colors focus:outline-none"
      aria-label="Кабінет"
    >
      <Suspense fallback={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      }>
        <Await resolve={isLoggedIn}>
          {(loggedIn) => (
            <div className="flex items-center gap-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {loggedIn && <span className="hidden lg:inline text-xs font-semibold">Кабінет</span>}
            </div>
          )}
        </Await>
      </Suspense>
    </NavLink>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative flex items-center text-white/80 hover:text-white transition-colors focus:outline-none cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label="Кошик"
    >
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-white text-agro-green text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-agro-green shadow-sm animate-pulse">
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Каталог',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: null,
      tags: [],
      title: 'Блог',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Політика',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
  ],
};
