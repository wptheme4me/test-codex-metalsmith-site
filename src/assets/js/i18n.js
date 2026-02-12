const SUPPORTED_LANGS = new Set(['lt', 'en', 'ru']);
const LANG_KEY = 'lang_v1';

export function pick(value, lang) {
  if (!value || typeof value !== 'object') {
    return '';
  }
  return value[lang] ?? value.lt ?? value.en ?? value.ru ?? '';
}

export function normalizeLang(lang) {
  if (SUPPORTED_LANGS.has(lang)) {
    return lang;
  }
  return 'lt';
}

export function getLang() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('lang');
  if (SUPPORTED_LANGS.has(fromQuery)) {
    return fromQuery;
  }

  const fromStorage = localStorage.getItem(LANG_KEY);
  if (SUPPORTED_LANGS.has(fromStorage)) {
    return fromStorage;
  }

  const browser = navigator.language?.slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGS.has(browser)) {
    return browser;
  }

  return 'lt';
}

export function setLang(lang) {
  const safeLang = normalizeLang(lang);
  const params = new URLSearchParams(window.location.search);
  params.set('lang', safeLang);
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', nextUrl);
  localStorage.setItem(LANG_KEY, safeLang);
  return safeLang;
}

export function t(uiTexts, path, lang, fallback = '') {
  const parts = path.split('.');
  let node = uiTexts;
  for (const key of parts) {
    if (!node || typeof node !== 'object' || !(key in node)) {
      return fallback;
    }
    node = node[key];
  }

  if (typeof node === 'object') {
    return pick(node, lang) || fallback;
  }
  return node ?? fallback;
}
