import {Suspense, useState, useEffect} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {useI18n} from '~/lib/i18n';

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

  const [scrolled, setScrolled] = useState(false);
  const [scrollingUp, setScrollingUp] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const {type: asideType} = useAside();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--header-height', scrolled ? '64px' : '80px');
  }, [scrolled]);

  useEffect(() => {
    const handleScroll = () => {
      if (asideType !== 'closed') return;

      const currentScrollTop = window.scrollY;
      
      setLastScrollTop((prevScrollTop) => {
        setScrollingUp(currentScrollTop < prevScrollTop);
        return currentScrollTop;
      });

      setScrolled(currentScrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, [asideType]);

  return (
    <header 
      style={{
        transform: !scrollingUp && scrolled && asideType === 'closed' ? 'translateY(-100%)' : 'translateY(0)'
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-transparent' : 'bg-white border-agro-border/30'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-between h-[69px]">
        {/* Logo */}
        <Link to="/" className="font-montserrat font-bold text-xl text-agro-green tracking-wide">
          AgroTrade
        </Link>

        {/* Desktop Navigation */}
        <HeaderMenu viewport="desktop" />

        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  viewport,
}: {
  viewport: Viewport;
}) {
  const {close} = useAside();
  const {t} = useI18n();

  const navLinks = [
    { label: t('nav_catalog'), href: "/collections" },
    { label: t('nav_about'), href: "/#about" },
    { label: t('nav_contacts'), href: "/#contacts" },
  ];

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col flex-1 gap-6 p-6 overflow-y-auto h-full" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          className={({isActive}) =>
            `text-lg font-medium transition-colors ${isActive ? 'text-agro-green font-bold' : 'text-gray-900 hover:text-agro-green'}`
          }
          to="/"
        >
          {t('nav_home')}
        </NavLink>
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            className={({isActive}) =>
              `text-lg font-medium transition-colors ${isActive ? 'text-agro-green font-bold' : 'text-gray-900 hover:text-agro-green'}`
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
      {navLinks.map((link) => (
        <NavLink
          className={({isActive}) =>
            `${isActive ? 'text-brand-gold font-semibold' : 'text-agro-green/75'} text-sm font-medium tracking-wide transition-colors duration-200 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full hover:text-brand-gold`
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

function LanguageSwitcher() {
  const {locale, changeLocale} = useI18n();
  return (
    <div className="flex items-center gap-1 bg-agro-green-bg rounded-full p-1 border border-agro-green/10 text-xs font-semibold select-none">
      <button
        onClick={() => changeLocale('uk')}
        className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
          locale === 'uk'
            ? 'bg-agro-green text-white shadow-sm'
            : 'text-agro-green/75 hover:text-agro-green hover:bg-agro-green/5'
        }`}
      >
        UA
      </button>
      <button
        onClick={() => changeLocale('en')}
        className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
          locale === 'en'
            ? 'bg-agro-green text-white shadow-sm'
            : 'text-agro-green/75 hover:text-agro-green hover:bg-agro-green/5'
        }`}
      >
        EN
      </button>
    </div>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-4 sm:gap-5" role="navigation">
      <SearchToggle />
      <AccountToggle isLoggedIn={isLoggedIn} />
      <CartToggle cart={cart} />
      <LanguageSwitcher />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  const {t} = useI18n();
  return (
    <button
      className="md:hidden text-agro-green cursor-pointer"
      onClick={() => open('mobile')}
      aria-label={t('nav_menu')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  const {t} = useI18n();
  return (
    <button
      className="text-agro-green/80 flex items-center focus:outline-none cursor-pointer transition-colors duration-200 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full hover:text-brand-gold"
      onClick={() => open('search')}
      aria-label={t('nav_search')}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </button>
  );
}

function AccountToggle({isLoggedIn}: {isLoggedIn: HeaderProps['isLoggedIn']}) {
  const {t} = useI18n();
  return (
    <NavLink
      prefetch="intent"
      to="/account"
      className={({isActive}) =>
        `${isActive ? 'text-brand-gold font-semibold' : 'text-agro-green/80'} flex items-center focus:outline-none transition-colors duration-200 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full hover:text-brand-gold`
      }
      aria-label={t('nav_account')}
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
              {loggedIn && <span className="hidden lg:inline text-xs font-semibold">{t('nav_account')}</span>}
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
  const {t} = useI18n();

  return (
    <a
      href="/cart"
      className="relative flex items-center text-agro-green/80 focus:outline-none cursor-pointer transition-colors duration-200 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full hover:text-brand-gold"
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
      aria-label={t('nav_cart')}
    >
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-agro-green text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
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
