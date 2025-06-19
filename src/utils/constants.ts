export const VOLUME_TIERS = {
  MICRO: { volume: 0, oh: 0.0, pick: 0.0, receive: 0.0 },
  '1': { volume: 25, oh: 0.0, pick: 0.0, receive: 0.0 },
  '2': { volume: 50, oh: 0.025, pick: 0.0, receive: 0.05 },
  // ... rest of VOLUME_TIERS
};

export const ORDER_HANDLING_RATES = [
  { class: 1, rate: 1.15 },
  { class: 2, rate: 1.85 },
  { class: 3, rate: 2.5 },
];

export const PICKING_RATES = [
  { class: 1, rate: 0.4 },
  { class: 2, rate: 0.45 },
  { class: 3, rate: 0.55 },
  { class: 4, rate: 0.65 },
  { class: 5, rate: 0.75 },
];

export const RECEIVING_RATES = [
  { class: 1, rate: 0.12 },
  { class: 2, rate: 0.13 },
  { class: 3, rate: 0.14 },
  { class: 4, rate: 0.14 },
  { class: 5, rate: 0.15 },
];

export const PACKAGING_CLASSIFICATIONS = {
  'Label Only': { ohClass: 1, pickClass: 1, materialClass: 1 },
  Polybag: { ohClass: 1, pickClass: 1, materialClass: 2 },
  'Bubble Mailer': { ohClass: 2, pickClass: 1, materialClass: 3 },
  Box: { ohClass: 3, pickClass: 2, materialClass: 4 },
} as const;

export const PACKAGING_RATES = {
  Box: [
    { sku: '10x10x10 Box', price: 1.1, qty: 1000, category: 'Box' },
    // ... rest of Box rates
  ],
  Poly: [
    { sku: 'Bubble Poly #6', price: 0.38, qty: 17462, category: 'Poly' },
    // ... rest of Poly rates
  ],
  Bubble: [
    { sku: 'Kraft Bubble Mailer #0', price: 0.37, qty: 2, category: 'Bubble' },
    // ... rest of Bubble rates
  ],
} as const;
