import { addItem, getSummary, loadCart, removeItem, saveCart, setQty } from './cart.js';
import { formatEur } from './format.js';
import { getLang, normalizeLang, pick, setLang, t } from './i18n.js';

function parseJsonScript(id) {
  const node = document.getElementById(id);
  if (!node) {
    return null;
  }
  return JSON.parse(node.textContent);
}

const itemsData = parseJsonScript('items-data');
const uiTexts = parseJsonScript('ui-texts-data');
const shippingData = parseJsonScript('shipping-data');

const categories = itemsData?.categories ?? [];
const activeItems = new Map();
for (const category of categories) {
  for (const item of category.items ?? []) {
    if (item.active) {
      activeItems.set(item.id, item);
    }
  }
}

let lang = setLang(getLang());
let cartState = loadCart(new Set(activeItems.keys()));

const languageSwitcher = document.getElementById('language-switcher');
const catalogEl = document.getElementById('catalog');
const cartEl = document.getElementById('cart');
const formEl = document.getElementById('order-form');
const shippingEl = document.getElementById('shippingCompany');
const rulesLinkEl = document.getElementById('rules-link');

function setTextI18n() {
  document.documentElement.lang = lang;
  for (const node of document.querySelectorAll('[data-i18n]')) {
    node.textContent = t(uiTexts, node.dataset.i18n, lang, node.textContent);
  }
}

function renderShipping() {
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '-';
  placeholder.disabled = true;
  placeholder.selected = true;
  const options = [placeholder];

  for (const company of shippingData.companies ?? []) {
    const option = document.createElement('option');
    option.value = company.id;
    option.textContent = pick(company.label, lang);
    options.push(option);
  }

  shippingEl.replaceChildren(...options);
}

function renderCatalog() {
  catalogEl.textContent = '';

  for (const category of categories) {
    const section = document.createElement('section');
    section.className = 'category';

    const header = document.createElement('h3');
    header.textContent = pick(category.name, lang);
    section.appendChild(header);

    const table = document.createElement('table');
    table.className = 'catalog-table';

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    const thItem = document.createElement('th');
    thItem.textContent = t(uiTexts, 'cart.item', lang, 'Item');
    const thPrice = document.createElement('th');
    thPrice.textContent = t(uiTexts, 'cart.price', lang, 'Price');
    const thAction = document.createElement('th');
    thAction.textContent = '';
    trHead.append(thItem, thPrice, thAction);
    thead.appendChild(trHead);

    const tbody = document.createElement('tbody');

    for (const item of category.items ?? []) {
      if (!item.active) {
        continue;
      }

      const row = document.createElement('tr');

      const name = document.createElement('td');
      const nameStrong = document.createElement('strong');
      nameStrong.textContent = pick(item.name, lang);
      const description = document.createElement('p');
      description.className = 'catalog-description';
      description.textContent = pick(item.description, lang);
      name.append(nameStrong, description);

      const price = document.createElement('td');
      price.textContent = formatEur(item.priceEur);

      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.itemId = item.id;
      button.textContent = t(uiTexts, 'buttons.addToCart', lang, 'Add to cart');
      const action = document.createElement('td');
      action.appendChild(button);

      row.append(name, price, action);
      tbody.appendChild(row);
    }

    table.append(thead, tbody);
    section.appendChild(table);
    catalogEl.appendChild(section);
  }
}

function renderCart() {
  cartEl.textContent = '';

  const summary = getSummary(cartState, activeItems, (item) => pick(item.name, lang));
  if (summary.lines.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = t(uiTexts, 'cart.empty', lang, 'Cart is empty');
    cartEl.appendChild(empty);
    return;
  }

  const table = document.createElement('table');
  table.className = 'cart-table';

  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  for (const key of ['cart.item', 'cart.qty', 'cart.price']) {
    const th = document.createElement('th');
    th.textContent = t(uiTexts, key, lang, key);
    trHead.appendChild(th);
  }
  const thAction = document.createElement('th');
  thAction.textContent = '';
  trHead.appendChild(thAction);
  thead.appendChild(trHead);

  const tbody = document.createElement('tbody');
  for (const line of summary.lines) {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = line.name;

    const tdQty = document.createElement('td');
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.dataset.action = 'minus';
    minus.dataset.itemId = line.itemId;
    minus.textContent = '-';

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '1';
    qtyInput.max = '999';
    qtyInput.value = String(line.qty);
    qtyInput.dataset.action = 'qty';
    qtyInput.dataset.itemId = line.itemId;

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.dataset.action = 'plus';
    plus.dataset.itemId = line.itemId;
    plus.textContent = '+';

    tdQty.append(minus, qtyInput, plus);

    const tdPrice = document.createElement('td');
    tdPrice.textContent = formatEur(line.lineTotalEur);

    const tdRemove = document.createElement('td');
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.dataset.action = 'remove';
    remove.dataset.itemId = line.itemId;
    remove.textContent = t(uiTexts, 'cart.remove', lang, 'Remove');
    tdRemove.appendChild(remove);

    tr.append(tdName, tdQty, tdPrice, tdRemove);
    tbody.appendChild(tr);
  }

  const tfoot = document.createElement('tfoot');
  const trTotal = document.createElement('tr');
  const tdLabel = document.createElement('td');
  tdLabel.colSpan = 2;
  tdLabel.textContent = t(uiTexts, 'cart.total', lang, 'Total');
  const tdValue = document.createElement('td');
  tdValue.textContent = formatEur(summary.totalEur);
  const tdEmpty = document.createElement('td');
  trTotal.append(tdLabel, tdValue, tdEmpty);
  tfoot.appendChild(trTotal);

  table.append(thead, tbody, tfoot);
  cartEl.appendChild(table);
}

function rerender() {
  setTextI18n();
  languageSwitcher.value = lang;
  rulesLinkEl.setAttribute('href', `rules/${lang}.html`);
  renderShipping();
  renderCatalog();
  renderCart();
}

languageSwitcher.addEventListener('change', () => {
  lang = setLang(normalizeLang(languageSwitcher.value));
  rerender();
});

catalogEl.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement) || !target.dataset.itemId) {
    return;
  }
  addItem(cartState, target.dataset.itemId, new Set(activeItems.keys()));
  renderCart();
});

cartEl.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.dataset.itemId) {
    return;
  }

  const itemId = target.dataset.itemId;
  const currentQty = Number.parseInt(cartState.items[itemId] ?? 1, 10);

  if (target.dataset.action === 'plus') {
    setQty(cartState, itemId, currentQty + 1, new Set(activeItems.keys()));
  }

  if (target.dataset.action === 'minus') {
    if (currentQty <= 1) {
      removeItem(cartState, itemId);
    } else {
      setQty(cartState, itemId, currentQty - 1, new Set(activeItems.keys()));
    }
  }

  if (target.dataset.action === 'remove') {
    removeItem(cartState, itemId);
  }

  renderCart();
});

cartEl.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.dataset.action !== 'qty') {
    return;
  }
  setQty(cartState, target.dataset.itemId, target.value, new Set(activeItems.keys()));
  renderCart();
});

formEl.addEventListener('submit', (event) => {
  const summary = getSummary(cartState, activeItems, (item) => pick(item.name, lang));
  if (summary.lines.length === 0) {
    event.preventDefault();
    window.alert(t(uiTexts, 'cart.emptyAlert', lang, 'You cannot submit an empty cart.'));
    return;
  }

  const hidden = formEl.querySelector('input[name="cartJson"]');
  hidden.value = JSON.stringify({
    lines: summary.lines.map((line) => ({
      itemId: line.itemId,
      qty: line.qty,
      priceEur: line.priceEur,
      lineTotalEur: line.lineTotalEur
    })),
    totalEur: summary.totalEur
  });

  cartState = { items: {}, updatedAt: new Date().toISOString() };
  saveCart(cartState);
});

rerender();
