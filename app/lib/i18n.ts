import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';

export const translations = {
  uk: {
    // Header
    nav_catalog: "Каталог",
    nav_about: "Про нас",
    nav_contacts: "Контакти",
    nav_home: "Головна",
    nav_account: "Кабінет",
    nav_cart: "Кошик",
    nav_search: "Пошук",
    nav_menu: "Меню",
    search_placeholder: "Пошук товарів...",
    search_submit: "Знайти",
    popular_queries: "ПОПУЛЯРНІ ЗАПИТИ",
    recent_searches: "ОСТАННІ ПОШУКИ",
    clear: "Очистити",
    no_recent_searches: "Немає останніх пошуків",
    recommended_products_title: "РЕКОМЕНДОВАНІ ТОВАРИ",
    query_fertilizers: "Добрива",
    query_seeds: "Насіння",
    query_machinery: "Техніка",
    query_protection: "Засоби захисту",
    remove: "Видалити",
    decrease_quantity: "Зменшити кількість",
    increase_quantity: "Збільшити кількість",
    quick_view: "ШВИДКИЙ ПЕРЕГЛЯД",
    empty_cart: "Ваш кошик порожній",
    empty_cart_desc: "Схоже, ви ще нічого не додали. Час розпочати покупки!",
    go_to_catalog: "Перейти до каталогу",
    cart_total: "Разом",
    checkout: "Оформити замовлення",
    loading: "Завантаження...",
    
    // Index Page
    hero_title: "Якість, що вирощена з любов'ю",
    hero_desc: "Найкращі добрива, насіння та техніка для вашого господарства. Надійний партнер для комерційних фермерів та агро-інвесторів.",
    hero_button: "Переглянути каталог",
    feature_eco_title: "Екологічність",
    feature_eco_desc: "Ми пропонуємо сертифіковані органічні рішення, які зберігають родючість ґрунту та забезпечують сталий розвиток.",
    feature_delivery_title: "Швидка доставка",
    feature_delivery_desc: "Оптимізована логістика дозволяє доставляти насіння та добрива безпосередньо до вашого господарства точно в строк.",
    feature_support_title: "Професійна підтримка",
    feature_support_desc: "Наші агрономи завжди готові надати кваліфіковані консультації щодо вибору та застосування продукції.",
    catalog_title: "Каталог продукції",
    catalog_desc: "Оберіть категорію для вашого господарства",
    recommended_title: "Рекомендовані товари",
    recommended_desc: "Популярні пропозиції від нашого магазину",
    all_products: "Всі товари",
    no_recommended: "Не знайдено рекомендованих товарів. Опублікуйте товари в каналі продажів Headless.",
    about_title: "Про нас",
    about_desc_1: "AgroTrade — це більше, ніж просто магазин. Ми — ваш надійний партнер у світі сучасного агробізнесу. Наша місія полягає в тому, щоб забезпечити українських фермерів інноваційними та високоякісними рішеннями, які сприяють підвищенню врожайності та рентабельності.",
    about_desc_2: "Ми об'єднуємо передові технології з глибоким розумінням потреб землі, створюючи платформу, де ефективність зустрічається з екологічностю.",
    certified_quality: "Сертифікована якість",
    contact_title: "Залишилися питання?",
    contact_desc: "Зв'яжіться з нашими експертами для отримання індивідуальної консультації.",
    contact_name: "Ім'я",
    contact_name_placeholder: "Введіть ваше ім'я",
    contact_phone: "Телефон",
    contact_submit: "Відправити запит",
    contact_success: "Дякуємо, {name}! Запит надіслано! Ми зв'яжемося з вами за телефоном {phone}",
    
    // Product Page
    in_stock: "В наявності",
    out_of_stock: "Немає в наявності",
    add_to_cart: "Додати в кошик",
    buy_now: "Купити зараз",
    winter_hardiness: "Зимостійкість",
    drought_resistance: "Посухостійкість",
    high: "Висока",
    maximum: "Максимальна",
    certified: "Сертифіковано",
    days_delivery: "1-3 дні",
    support: "Підтримка",
    tab_description: "Опис",
    tab_specifications: "Характеристики",
    tab_reviews: "Відгуки (24)",
    specs_placeholder: "Тут будуть детальні характеристики товару.",
    reviews_placeholder: "Тут будуть відгуки клієнтів.",
    new_badge: "Новинка",
    yield_potential: "Потенціал врожайності:",
    protein_content: "Вміст білка:",
    intensive_variety: "Сорт інтенсивного типу",
    plant_height: "Висота рослини:",
    no_image: "Немає зображення",
    
    // Footer
    rights_reserved: "Всі права захищені.",
    
    // Category list page
    categories_title: "Категорії товарів",
    categories_desc: "Оберіть необхідну категорію для перегляду товарів",
    all_products_desc: "Повний каталог нашої продукції для професійного фермерства.",
    
    // Search page
    search_page_title: "Пошук",
    search_query_placeholder: "Пошук...",
    no_results_found: "Результатів не знайдено для",
    view_all_results: "Переглянути всі результати для",
    search_error: "Помилка пошуку:",
    search_title_articles: "Статті",
    search_title_collections: "Колекції",
    search_title_pages: "Сторінки",
    search_title_products: "Товари",
    load_previous: "Завантажити попередні",
    load_more: "Завантажити ще",
    no_results_empty: "Результатів не знайдено, спробуйте інший запит.",
  },
  en: {
    // Header
    nav_catalog: "Catalog",
    nav_about: "About us",
    nav_contacts: "Contacts",
    nav_home: "Home",
    nav_account: "Account",
    nav_cart: "Cart",
    nav_search: "Search",
    nav_menu: "Menu",
    search_placeholder: "Search products...",
    search_submit: "Search",
    popular_queries: "POPULAR QUERIES",
    recent_searches: "RECENT SEARCHES",
    clear: "Clear",
    no_recent_searches: "No recent searches",
    recommended_products_title: "RECOMMENDED PRODUCTS",
    query_fertilizers: "Fertilizers",
    query_seeds: "Seeds",
    query_machinery: "Machinery",
    query_protection: "Crop protection",
    remove: "Remove",
    decrease_quantity: "Decrease quantity",
    increase_quantity: "Increase quantity",
    quick_view: "QUICK VIEW",
    empty_cart: "Your cart is empty",
    empty_cart_desc: "Looks like you haven't added anything yet. Time to start shopping!",
    go_to_catalog: "Go to catalog",
    cart_total: "Total",
    checkout: "Checkout",
    loading: "Loading...",
    
    // Index Page
    hero_title: "Quality Grown with Love",
    hero_desc: "The best fertilizers, seeds, and machinery for your farm. A reliable partner for commercial farmers and agro-investors.",
    hero_button: "View catalog",
    feature_eco_title: "Sustainability",
    feature_eco_desc: "We offer certified organic solutions that preserve soil fertility and ensure sustainable development.",
    feature_delivery_title: "Fast Delivery",
    feature_delivery_desc: "Optimized logistics allow us to deliver seeds and fertilizers directly to your farm right on time.",
    feature_support_title: "Professional Support",
    feature_support_desc: "Our agronomists are always ready to provide expert advice on product selection and application.",
    catalog_title: "Product Catalog",
    catalog_desc: "Select a category for your farm",
    recommended_title: "Recommended Products",
    recommended_desc: "Popular offers from our store",
    all_products: "All products",
    no_recommended: "No recommended products found. Publish products in the Headless sales channel.",
    about_title: "About Us",
    about_desc_1: "AgroTrade is more than just a store. We are your reliable partner in the world of modern agribusiness. Our mission is to provide Ukrainian farmers with innovative and high-quality solutions that increase yield and profitability.",
    about_desc_2: "We combine advanced technologies with a deep understanding of the land's needs, creating a platform where efficiency meets sustainability.",
    certified_quality: "Certified quality",
    contact_title: "Still have questions?",
    contact_desc: "Contact our experts for a personal consultation.",
    contact_name: "Name",
    contact_name_placeholder: "Enter your name",
    contact_phone: "Phone",
    contact_submit: "Send request",
    contact_success: "Thank you, {name}! Request sent! We will contact you by phone at {phone}",
    
    // Product Page
    in_stock: "In stock",
    out_of_stock: "Out of stock",
    add_to_cart: "Add to cart",
    buy_now: "Buy now",
    winter_hardiness: "Winter hardiness",
    drought_resistance: "Drought resistance",
    high: "High",
    maximum: "Maximum",
    certified: "Certified",
    days_delivery: "1-3 days",
    support: "Support",
    tab_description: "Description",
    tab_specifications: "Specifications",
    tab_reviews: "Reviews (24)",
    specs_placeholder: "Detailed product specifications will be displayed here.",
    reviews_placeholder: "Customer reviews will be displayed here.",
    new_badge: "New",
    yield_potential: "Yield potential:",
    protein_content: "Protein content:",
    intensive_variety: "Intensive type variety",
    plant_height: "Plant height:",
    no_image: "No image",
    
    // Footer
    rights_reserved: "All rights reserved.",
    
    // Category list page
    categories_title: "Product Categories",
    categories_desc: "Choose the required category to browse products",
    all_products_desc: "Full catalog of our products for professional farming.",
    
    // Search page
    search_page_title: "Search",
    search_query_placeholder: "Search...",
    no_results_found: "No results found for",
    view_all_results: "View all results for",
    search_error: "Search error:",
    search_title_articles: "Articles",
    search_title_collections: "Collections",
    search_title_pages: "Pages",
    search_title_products: "Products",
    load_previous: "Load previous",
    load_more: "Load more",
    no_results_empty: "No results, try a different search.",
  }
};

export type TranslationKey = keyof typeof translations.uk;

export function useI18n() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const locale = (rootData?.locale as 'uk' | 'en') || 'uk';

  const t = (key: TranslationKey, variables?: Record<string, string>) => {
    let text = translations[locale]?.[key] || translations.uk[key] || String(key);
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  const changeLocale = (newLocale: 'uk' | 'en') => {
    if (typeof document !== 'undefined') {
      document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
      window.location.reload();
    }
  };

  return {locale, t, changeLocale};
}

export function getLocaleFromCookie(cookieHeader: string | null): 'uk' | 'en' {
  if (!cookieHeader) return 'uk';
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [key, val] = part.split('=').map((str) => str.trim());
    if (key === 'locale' && (val === 'uk' || val === 'en')) {
      return val;
    }
  }
  return 'uk';
}
