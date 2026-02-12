const STORAGE_KEY = 'cart_v1';

function sanitizeQty(qty) {
  const asInt = Number.parseInt(qty, 10);
  if (!Number.isFinite(asInt)) {
    return 1;
  }
  return Math.min(999, Math.max(1, asInt));
}

function normalizeState(state, activeItems) {
  const next = { items: {}, updatedAt: new Date().toISOString() };
  if (!state || typeof state !== 'object' || typeof state.items !== 'object') {
    return next;
  }

  for (const [itemId, qty] of Object.entries(state.items)) {
    if (!activeItems.has(itemId)) {
      continue;
    }
    next.items[itemId] = sanitizeQty(qty);
  }

  return next;
}

export function loadCart(activeItems) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { items: {}, updatedAt: new Date().toISOString() };
    }
    return normalizeState(JSON.parse(raw), activeItems);
  } catch {
    return { items: {}, updatedAt: new Date().toISOString() };
  }
}

export function saveCart(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addItem(state, itemId, activeItems) {
  if (!activeItems.has(itemId)) {
    return state;
  }
  const existing = Number.parseInt(state.items[itemId], 10);
  const current = Number.isFinite(existing) ? sanitizeQty(existing) : 0;
  state.items[itemId] = Math.min(999, current + 1);
  state.updatedAt = new Date().toISOString();
  saveCart(state);
  return state;
}

export function setQty(state, itemId, qty, activeItems) {
  if (!activeItems.has(itemId)) {
    return state;
  }
  state.items[itemId] = sanitizeQty(qty);
  state.updatedAt = new Date().toISOString();
  saveCart(state);
  return state;
}

export function removeItem(state, itemId) {
  delete state.items[itemId];
  state.updatedAt = new Date().toISOString();
  saveCart(state);
  return state;
}

export function getSummary(state, itemsById, resolver) {
  const lines = [];
  let totalEur = 0;

  for (const [itemId, qtyRaw] of Object.entries(state.items)) {
    const item = itemsById.get(itemId);
    if (!item) {
      continue;
    }
    const qty = sanitizeQty(qtyRaw);
    const lineTotalEur = Number((qty * item.priceEur).toFixed(2));
    totalEur += lineTotalEur;
    lines.push({
      itemId,
      qty,
      priceEur: item.priceEur,
      lineTotalEur,
      name: resolver(item)
    });
  }

  return {
    lines,
    totalEur: Number(totalEur.toFixed(2))
  };
}
