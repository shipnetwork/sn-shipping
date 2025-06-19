import confetti from 'canvas-confetti';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('ShipNetwork Calculator Initialized');

  const form = document.querySelector('[fs-element="form"]');
  const orderHandlingResult = document.querySelector('[fs-element="order-handling-price"]');
  const pickResult = document.querySelector('[fs-element="pick-price"]');
  const receivingResult = document.querySelector('[fs-element="receiving-price"]');
  const packagingResult = document.getElementById('packaging-price-display');
  const totalResult = document.querySelector('[fs-element="total-savings"]');

  if (
    !form ||
    !orderHandlingResult ||
    !pickResult ||
    !receivingResult ||
    !packagingResult ||
    !totalResult
  ) {
    console.log('Missing elements:', {
      form,
      orderHandlingResult,
      pickResult,
      receivingResult,
      packagingResult,
      totalResult,
    });
    return;
  }

  form.addEventListener('submit', (e) => {
    console.log('Form submitted');
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(form);
    const volume = Number(formData.get('Monthly-Volume-price'));
    const packaging = formData.get('Most-Common-Packaging');
    const skuRange = formData.get('Number-of-SKUs');
    const picks = Number(formData.get('Avg-Picks'));
    const weight = formData.get('Avg-Weight-Package');

    console.log('Form inputs:', {
      volume,
      packaging,
      skuRange,
      picks,
      weight,
    });

    if (!volume) {
      console.log('Missing volume');
      return;
    }

    const results: {
      orderHandling: number;
      picks: number;
      receiving: number;
      packaging: number;
      total: number;
    } = {
      orderHandling: calculateOrderHandling(String(packaging || ''), volume),
      picks: calculatePicking(String(packaging || ''), picks, String(weight || ''), volume),
      receiving: calculateReceiving(volume, skuRange, picks),
      packaging: calculatePackaging(String(packaging || '')),
      total: 0,
    };
    results.total = results.orderHandling + results.picks + results.receiving + results.packaging;

    console.log('Calculation results:', results);

    orderHandlingResult.textContent = `$${results.orderHandling.toFixed(2)}`;
    pickResult.textContent = `$${results.picks.toFixed(2)}`;
    receivingResult.textContent = `$${results.receiving.toFixed(2)}`;
    if (packagingResult) {
      packagingResult.textContent = `$${results.packaging.toFixed(2)}`;
    }
    totalResult.textContent = `$${results.total.toFixed(2)}`;

    console.log('Results displayed');

    document.getElementById('packaging-price-display')?.scrollIntoView({ behavior: 'smooth' });

    // Trigger confetti animation with custom parameters
    confetti({
      particleCount: 150,
      spread: 150,
      origin: { x: 0.5, y: 0.5 },
    });

    // Update savings-price with volume * total, formatted as currency
    const savingsPrice = document.getElementById('savings-price');
    if (savingsPrice) {
      const savingsValue = volume * results.total;
      savingsPrice.textContent = savingsValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  });
});

// =============== CONSTANTS ===============
const VOLUME_TIERS = {
  MICRO: { volume: 0, oh: 0.0, pick: 0.0, receive: 0.0 },
  '1': { volume: 25, oh: 0.0, pick: 0.0, receive: 0.0 },
  '2': { volume: 50, oh: 0.025, pick: 0.0, receive: 0.05 },
  '3': { volume: 75, oh: 0.025, pick: 0.0, receive: 0.05 },
  '4': { volume: 150, oh: 0.05, pick: 0.05, receive: 0.05 },
  '5': { volume: 200, oh: 0.05, pick: 0.05, receive: 0.1 },
  '6': { volume: 250, oh: 0.075, pick: 0.05, receive: 0.1 },
  '7': { volume: 300, oh: 0.075, pick: 0.05, receive: 0.1 },
  '8': { volume: 400, oh: 0.1, pick: 0.05, receive: 0.15 },
  '9': { volume: 525, oh: 0.1, pick: 0.1, receive: 0.15 },
  '10': { volume: 700, oh: 0.125, pick: 0.1, receive: 0.15 },
  '11': { volume: 900, oh: 0.125, pick: 0.1, receive: 0.2 },
  '12': { volume: 1200, oh: 0.15, pick: 0.1, receive: 0.2 },
  '13': { volume: 1600, oh: 0.15, pick: 0.1, receive: 0.2 },
  '14': { volume: 2100, oh: 0.175, pick: 0.15, receive: 0.25 },
  '15': { volume: 2700, oh: 0.175, pick: 0.15, receive: 0.25 },
  '16': { volume: 3500, oh: 0.2, pick: 0.15, receive: 0.25 },
  '17': { volume: 4800, oh: 0.2, pick: 0.15, receive: 0.3 },
  '18': { volume: 6300, oh: 0.225, pick: 0.2, receive: 0.3 },
  '19': { volume: 8000, oh: 0.225, pick: 0.2, receive: 0.3 },
  '20': { volume: 10500, oh: 0.25, pick: 0.2, receive: 0.35 },
  '21': { volume: 15500, oh: 0.25, pick: 0.2, receive: 0.35 },
  '22': { volume: 19000, oh: 0.275, pick: 0.25, receive: 0.35 },
  '23': { volume: 24500, oh: 0.275, pick: 0.25, receive: 0.4 },
  '24': { volume: 34000, oh: 0.3, pick: 0.25, receive: 0.4 },
  '25': { volume: 45000, oh: 0.3, pick: 0.25, receive: 0.4 },
};

const ORDER_HANDLING_RATES = [
  { class: 1, rate: 1.15 },
  { class: 2, rate: 1.85 },
  { class: 3, rate: 2.5 },
];

const PICKING_RATES = [
  { class: 1, rate: 0.4 },
  { class: 2, rate: 0.45 },
  { class: 3, rate: 0.55 },
  { class: 4, rate: 0.65 },
  { class: 5, rate: 0.75 },
];

const RECEIVING_RATES = [
  { class: 1, rate: 0.12 },
  { class: 2, rate: 0.13 },
  { class: 3, rate: 0.14 },
  { class: 4, rate: 0.14 },
  { class: 5, rate: 0.15 },
];

// =============== CLASSIFICATION CONSTANTS ===============

const PACKAGING_CLASSIFICATIONS = {
  'Label Only': { ohClass: 1, pickClass: 1, materialClass: 1 },
  Polybag: { ohClass: 1, pickClass: 1, materialClass: 2 },
  'Bubble Mailer': { ohClass: 2, pickClass: 1, materialClass: 3 },
  Box: { ohClass: 3, pickClass: 2, materialClass: 4 },
};

const SKU_CLASSIFICATIONS = {
  '< 50': 1,
  '50-200': 2,
  '201-500': 3,
  '501-1000': 4,
  '1001+': 5,
};

const PICKS_CLASSIFICATIONS = {
  1: 1,
  2: 1,
  3: 1,
  4: 3,
  5: 3,
  6: 5,
  7: 5,
  8: 5,
  9: 5,
  10: 5,
};

const WEIGHT_CLASSIFICATIONS = {
  '< 1lb': 1,
  '<= 1lb': 1,
  '1-2lbs': 2,
  '2-5lbs': 3,
  '5-10lbs': 4,
  '10+ lbs': 5,
};

const packagingClassData = [
  { packaging: 'Label Only', handlingClass: 1, materialClass: 1, pickClass: 1 },
  { packaging: 'Polybag', handlingClass: 1, materialClass: 2, pickClass: 1 },
  { packaging: 'Bubble Mailer', handlingClass: 2, materialClass: 3, pickClass: 1 },
  { packaging: 'Box', handlingClass: 3, materialClass: 4, pickClass: 5 },
];

const skuReceivingClassData = [
  { skus: '< 50', receivingClass: 1 },
  { skus: '50 - 200', receivingClass: 2 },
  { skus: '201 - 500', receivingClass: 3 },
  { skus: '501 - 1000', receivingClass: 4 },
  { skus: '1000+', receivingClass: 5 },
];

const pickClassData = [
  { averagePicks: 1, pickClass: 1 },
  { averagePicks: 2, pickClass: 1 },
  { averagePicks: 3, pickClass: 1 },
  { averagePicks: 4, pickClass: 3 },
  { averagePicks: 5, pickClass: 3 },
  { averagePicks: 6, pickClass: 5 },
  { averagePicks: 7, pickClass: 5 },
  { averagePicks: 8, pickClass: 5 },
  { averagePicks: 9, pickClass: 5 },
  { averagePicks: 10, pickClass: 5 },
];

const fullPackagingRates = [
  { material: '10x10x10 Box', quantity: 897, avgCost: 986.7, category: 'Box' },
  { material: '10x6x3 Box', quantity: 73, avgCost: 54.75, category: 'Box' },
  { material: '10x7x3 Box', quantity: 506, avgCost: 506.0, category: 'Box' },
  { material: '10x8x6 Box', quantity: 22179, avgCost: 14859.93, category: 'Box' },
  { material: '10x8x8 Box', quantity: 17, avgCost: 17.0, category: 'Box' },
  { material: '12x10x6 Box', quantity: 6, avgCost: 6.0, category: 'Box' },
  { material: '12x10x8 Box', quantity: 2886, avgCost: 2943.72, category: 'Box' },
  { material: '12x12x12 Box', quantity: 1672, avgCost: 2190.32, category: 'Box' },
  { material: '12x12x2 Box', quantity: 90, avgCost: 90.0, category: 'Box' },
  { material: '12x12x3 Box', quantity: 389, avgCost: 408.45, category: 'Box' },
  { material: '12x12x8 Box', quantity: 601, avgCost: 781.3, category: 'Box' },
  { material: '12x4x4 Box', quantity: 159, avgCost: 111.3, category: 'Box' },
  { material: '12x9x3 Box', quantity: 265, avgCost: 225.25, category: 'Box' },
  { material: '12x9x6 Box', quantity: 8704, avgCost: 8268.8, category: 'Box' },
  { material: '12x9x9 Box', quantity: 1, avgCost: 1.03, category: 'Box' },
  { material: '13x10x13 Box', quantity: 12, avgCost: 21.0, category: 'Box' },
  { material: '13x10x4 Box', quantity: 2310, avgCost: 2425.5, category: 'Box' },
  { material: '13x13x1 Box', quantity: 51, avgCost: 76.5, category: 'Box' },
  { material: '14x10x4 Box', quantity: 369, avgCost: 461.25, category: 'Box' },
  { material: '14x12x10 Box', quantity: 4, avgCost: 6.64, category: 'Box' },
  { material: '14x12x12 Box', quantity: 1727, avgCost: 3557.62, category: 'Box' },
  { material: '14x12x6 Box', quantity: 2822, avgCost: 3386.4, category: 'Box' },
  { material: '15x12x10 Box', quantity: 57, avgCost: 79.8, category: 'Box' },
  { material: '15x15x4 Box', quantity: 18, avgCost: 27.0, category: 'Box' },
  { material: '16x10x10 Box', quantity: 47, avgCost: 75.2, category: 'Box' },
  { material: '16x10x6 Box', quantity: 549, avgCost: 570.96, category: 'Box' },
  { material: '16x12x6 Box', quantity: 1, avgCost: 1.25, category: 'Box' },
  { material: '16x14x6 Box', quantity: 167, avgCost: 330.66, category: 'Box' },
  { material: '18x12x10 Box', quantity: 3178, avgCost: 4767.0, category: 'Box' },
  { material: '18x12x12 Box', quantity: 481, avgCost: 865.8, category: 'Box' },
  { material: '18x14x4 Box', quantity: 52, avgCost: 92.04, category: 'Box' },
  { material: '18x16x16 Box', quantity: 269, avgCost: 914.6, category: 'Box' },
  { material: '20x10x6 Box', quantity: 58, avgCost: 101.5, category: 'Box' },
  { material: '20x12x12 Box', quantity: 5, avgCost: 11.3, category: 'Box' },
  { material: '20x15x15 Box', quantity: 1095, avgCost: 2671.8, category: 'Box' },
  { material: '20x18x12 Box', quantity: 8, avgCost: 22.4, category: 'Box' },
  { material: '20x4x4 Box', quantity: 716, avgCost: 644.4, category: 'Box' },
  { material: '20x5x5 Box', quantity: 78, avgCost: 86.58, category: 'Box' },
  { material: '22x12x6 Box', quantity: 900, avgCost: 1575.0, category: 'Box' },
  { material: '22x18x12 Box', quantity: 8, avgCost: 27.28, category: 'Box' },
  { material: '24x12x12 Box', quantity: 62, avgCost: 151.9, category: 'Box' },
  { material: '24x14x14 Box', quantity: 1, avgCost: 2.75, category: 'Box' },
  { material: '24x18x10 Box', quantity: 104, avgCost: 439.92, category: 'Box' },
  { material: '24x18x24 Box', quantity: 79, avgCost: 384.73, category: 'Box' },
  { material: '25x16x16 Box', quantity: 1, avgCost: 4.3, category: 'Box' },
  { material: '26x16x10 Box', quantity: 21, avgCost: 74.34, category: 'Box' },
  { material: '28x24x12 Box', quantity: 14, avgCost: 65.94, category: 'Box' },
  { material: '30x10x10 Box', quantity: 49, avgCost: 98.0, category: 'Box' },
  { material: 'Bubble Poly #4', quantity: 17462, avgCost: 6635.56, category: 'Poly' },
  {
    material: 'Kraft Bubble Mailer #0 - 6x10',
    quantity: 168,
    avgCost: 35.28,
    category: 'Bubble',
  },
  {
    material: 'Kraft Bubble Mailer #3 - 8.5x14.5',
    quantity: 2,
    avgCost: 0.74,
    category: 'Bubble',
  },
  {
    material: 'Poly Bubble Mailer #3 - 8.5x14.5',
    quantity: 3874,
    avgCost: 1355.9,
    category: 'Bubble',
  },
  { material: 'Poly Mailer #1 - 6x9', quantity: 1866, avgCost: 279.9, category: 'Poly' },
  { material: 'Poly Mailer #4 - 10x13', quantity: 10194, avgCost: 2446.56, category: 'Poly' },
  { material: 'Poly Mailer #5 - 14x17', quantity: 1, avgCost: 0.32, category: 'Poly' },
  { material: 'Poly Mailer #6 - 14.5x19', quantity: 3208, avgCost: 1475.68, category: 'Poly' },
  { material: 'Poly Mailer #7 - 19x24', quantity: 427, avgCost: 294.63, category: 'Poly' },
  { material: 'Poly Mailer #9 - 24x36', quantity: 9, avgCost: 14.04, category: 'Poly' },
];

// =============== PACKAGING RATES DATA ===============

const PACKAGING_RATES = {
  Box: [
    { sku: '10x10x10 Box', price: 1.1, qty: 1000, category: 'Box' },
    { sku: '10x6x5 Box', price: 0.75, qty: 75, category: 'Box' },
    { sku: '10x7x5 Box', price: 1.05, qty: 25, category: 'Box' },
    { sku: '12x12x8 Box', price: 1.0, qty: 22717, category: 'Box' },
    { sku: '12x6x6 Box', price: 1.0, qty: 77, category: 'Box' },
    { sku: '12x9x6 Box', price: 1.31, qty: 2889, category: 'Box' },
    { sku: '12x12x12 Box', price: 1.51, qty: 2889, category: 'Box' },
    { sku: '12x12x2 Box', price: 1.32, qty: 100, category: 'Box' },
    { sku: '12x12x4 Box', price: 1.55, qty: 385, category: 'Box' },
    { sku: '12x9x4 Box', price: 0.85, qty: 265, category: 'Box' },
    { sku: '12x9x6 Box', price: 0.95, qty: 5704, category: 'Box' },
    { sku: '14x14x14 Box', price: 1.75, qty: 12, category: 'Box' },
    { sku: '14x10x4 Box', price: 1.5, qty: 2312, category: 'Box' },
    { sku: '14x14x4 Box', price: 1.5, qty: 51, category: 'Box' },
    { sku: '14x14x6 Box', price: 1.26, qty: 9, category: 'Box' },
    { sku: '14x14x8 Box', price: 2.0, qty: 144, category: 'Box' },
    { sku: '14x6x4 Box', price: 0.94, qty: 2, category: 'Box' },
    { sku: '14x8x4 Box', price: 1.1, qty: 50, category: 'Box' },
    { sku: '14x14x12 Box', price: 1.62, qty: 1727, category: 'Box' },
    { sku: '14x14x14 Box', price: 1.52, qty: 2622, category: 'Box' },
    { sku: '14x14x4 Box', price: 1.52, qty: 36, category: 'Box' },
    { sku: '14x14x6 Box', price: 1.88, qty: 1, category: 'Box' },
    { sku: '14x14x8 Box', price: 2.28, qty: 87, category: 'Box' },
    { sku: '14x14x10 Box', price: 1.85, qty: 145, category: 'Box' },
    { sku: '16x16x10 Box', price: 2.1, qty: 247, category: 'Box' },
    { sku: '16x16x12 Box', price: 2.25, qty: 9, category: 'Box' },
    { sku: '16x8x4 Box', price: 1.95, qty: 52, category: 'Box' },
    { sku: '17x6x4 Box', price: 1.35, qty: 673, category: 'Box' },
    { sku: '18x12x6 Box', price: 1.25, qty: 95, category: 'Box' },
    { sku: '18x12x10 Box', price: 1.9, qty: 3379, category: 'Box' },
    { sku: '18x12x12 Box', price: 1.92, qty: 1413, category: 'Box' },
    { sku: '18x14x4 Box', price: 2.48, qty: 77, category: 'Box' },
    { sku: '18x14x6 Box', price: 2.0, qty: 52, category: 'Box' },
    { sku: '18x14x8 Box', price: 2.0, qty: 37, category: 'Box' },
    { sku: '18x6x4 Box', price: 1.75, qty: 1, category: 'Box' },
    { sku: '18x8x4 Box', price: 1.75, qty: 58, category: 'Box' },
    { sku: '20x12x8 Box', price: 1.75, qty: 11, category: 'Box' },
    { sku: '20x15x10 Box', price: 2.44, qty: 1095, category: 'Box' },
    { sku: '20x15x6 Box', price: 2.35, qty: 30, category: 'Box' },
    { sku: '20x15x12 Box', price: 2.5, qty: 73, category: 'Box' },
    { sku: '20x15x15 Box', price: 4.12, qty: 1, category: 'Box' },
    { sku: '20x20x10 Box', price: 2.49, qty: 19, category: 'Box' },
    { sku: '20x8x4 Box', price: 1.75, qty: 776, category: 'Box' },
    { sku: '20x8x6 Box', price: 1.29, qty: 199, category: 'Box' },
    { sku: '22x12x6 Box', price: 1.75, qty: 900, category: 'Box' },
    { sku: '22x18x12 Box', price: 3.41, qty: 6, category: 'Box' },
    { sku: '22x18x6 Box', price: 3.02, qty: 41, category: 'Box' },
    { sku: '24x12x12 Box', price: 2.49, qty: 60, category: 'Box' },
    { sku: '24x14x14 Box', price: 2.75, qty: 1, category: 'Box' },
    { sku: '24x16x12 Box', price: 4.2, qty: 104, category: 'Box' },
    { sku: '24x18x12 Box', price: 4.39, qty: 156, category: 'Box' },
    { sku: '24x20x8 Box', price: 3.7, qty: 10, category: 'Box' },
    { sku: '24x24x4 Box', price: 3.5, qty: 2, category: 'Box' },
    { sku: '24x8x4 Box', price: 1.5, qty: 1, category: 'Box' },
    { sku: '24x15x10 Box', price: 2.5, qty: 1, category: 'Box' },
    { sku: '26x15x7 Box', price: 4.0, qty: 104, category: 'Box' },
    { sku: '26x16x12 Box', price: 3.54, qty: 21, category: 'Box' },
    { sku: '26x6x4 Box', price: 1.83, qty: 95, category: 'Box' },
    { sku: '28x24x12 Box', price: 4.71, qty: 14, category: 'Box' },
    { sku: '28x8x4 Box', price: 1.51, qty: 1920, category: 'Box' },
    { sku: '28x8x6 Box', price: 1.83, qty: 51, category: 'Box' },
    { sku: '29x4x7x3 Box', price: 3.09, qty: 270, category: 'Box' },
    { sku: '30x15x10 Box', price: 2.47, qty: 40, category: 'Box' },
    { sku: '30x20x10 Box', price: 3.2, qty: 5, category: 'Box' },
    { sku: '4x4x48 Box', price: 2.88, qty: 11, category: 'Box' },
    { sku: '6x6x48 Box', price: 2.47, qty: 21, category: 'Box' },
    { sku: '6x4x4 Box', price: 1.41, qty: 1, category: 'Box' },
    { sku: '6x6x6 Box', price: 1.51, qty: 11, category: 'Box' },
    { sku: '8x6x5 Box', price: 1.85, qty: 17485, category: 'Box' },
    { sku: '8x6x6 Box', price: 0.57, qty: 3, category: 'Box' },
    { sku: '9x6x5 Box', price: 0.52, qty: 84, category: 'Box' },
    { sku: '9x7x5 Box', price: 1.34, qty: 82, category: 'Box' },
    { sku: '9x6x2 Box', price: 0.53, qty: 3261, category: 'Box' },
    { sku: '9x6x4 Box', price: 0.63, qty: 11273, category: 'Box' },
    { sku: 'Retail Box', price: 0.68, qty: 385, category: 'Box' },
    { sku: 'Retail Box', price: 0.7, qty: 677, category: 'Box' },
    { sku: 'Retail Box', price: 0.58, qty: 17400, category: 'Box' },
  ],
  Poly: [
    { sku: 'Bubble Poly #6', price: 0.38, qty: 17462, category: 'Poly' },
    { sku: 'Poly Mailer #0', price: 0.15, qty: 1866, category: 'Poly' },
    { sku: 'Poly Mailer #1', price: 0.24, qty: 10104, category: 'Poly' },
    { sku: 'Poly Mailer #2', price: 0.32, qty: 5471, category: 'Poly' },
    { sku: 'Poly Mailer #3', price: 0.42, qty: 1, category: 'Poly' },
    { sku: 'Poly Mailer #4', price: 0.69, qty: 427, category: 'Poly' },
  ],
  Bubble: [
    { sku: 'Kraft Bubble Mailer #0', price: 0.37, qty: 2, category: 'Bubble' },
    { sku: 'Kraft Bubble Mailer #1', price: 0.38, qty: 2, category: 'Bubble' },
    { sku: 'Kraft Bubble Mailer #2', price: 0.38, qty: 4885, category: 'Bubble' },
    { sku: 'Kraft Bubble Mailer #3', price: 0.58, qty: 72123, category: 'Bubble' },
    { sku: 'Poly Bubble Mailer #0', price: 0.35, qty: 3874, category: 'Bubble' },
    { sku: 'Poly Bubble Mailer #1', price: 0.38, qty: 248, category: 'Bubble' },
    { sku: 'Poly Bubble Mailer #2', price: 1.0, qty: 2, category: 'Bubble' },
    { sku: 'Poly Mailer #0', price: 0.15, qty: 1866, category: 'Bubble' },
    { sku: 'Poly Mailer #1', price: 0.24, qty: 10104, category: 'Bubble' },
    { sku: 'Poly Mailer #2', price: 0.32, qty: 3298, category: 'Bubble' },
    { sku: 'Poly Mailer #3', price: 0.42, qty: 1, category: 'Bubble' },
    { sku: 'Poly Mailer #4', price: 0.69, qty: 427, category: 'Bubble' },
  ],
};

// =============== HELPER FUNCTIONS ===============

function getVolumeTier(volume: number) {
  const tiers = Object.values(VOLUME_TIERS);
  return tiers.find((tier) => volume <= tier.volume) || tiers[tiers.length - 1];
}

function getPickClass(packaging: string, averagePicks: number, averageWeight: string): number {
  // Get class from packaging type
  const packagingPickClass = PACKAGING_CLASSIFICATIONS[packaging].pickClass;

  // Get class from average picks - updated logic
  let picksClass;
  if (averagePicks >= 7) {
    picksClass = 5;
  } else if (averagePicks >= 4) {
    picksClass = 3;
  } else {
    picksClass = 1;
  }

  // Get class from weight
  let weightClass = 1;
  switch (averageWeight) {
    case '< 1lb':
    case '<=1lb':
      weightClass = 1;
      break;
    case '1-2lbs':
      weightClass = 2;
      break;
    case '2-5lbs':
      weightClass = 3;
      break;
    case '5-10lbs':
      weightClass = 4;
      break;
    case '10+ lbs':
      weightClass = 5;
      break;
  }

  // Return highest class among the three
  return Math.max(packagingPickClass, picksClass, weightClass);
}

function getSkuClass(skuRange: string): number {
  return SKU_CLASSIFICATIONS[skuRange] || 1;
}

function getPicksClass(picks: number): number {
  return (PICKS_CLASSIFICATIONS as Record<number, number>)[picks] || 1;
}

function getWeightClass(weight: string): number {
  return (WEIGHT_CLASSIFICATIONS as Record<string, number>)[weight] || 1;
}

function calculateWeightedAveragePrice(packagingType: string): number {
  const items = (PACKAGING_RATES as Record<string, { price: number; qty: number }[]>)[
    packagingType
  ];
  if (!items || items.length === 0) return 0;

  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const weightedSum = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Ensure precise calculation
  return Number((weightedSum / totalQty).toFixed(2));
}

// =============== CORE CALCULATION FUNCTIONS ===============

function calculateOrderHandling(packaging: string, volume: number): number {
  const tier = getVolumeTier(volume) as { oh: number };
  const packagingClass = (PACKAGING_CLASSIFICATIONS as Record<string, { ohClass: number }>)[
    packaging
  ];
  if (!packagingClass) {
    console.error('Unknown packaging type:', packaging);
    return 0;
  }
  const { ohClass } = packagingClass;
  const baseRate = ORDER_HANDLING_RATES.find((r) => r.class === ohClass)?.rate || 0;
  return baseRate * (1 - tier.oh);
}

function calculatePicking(
  packaging: string,
  averagePicks: number,
  averageWeight: string,
  volume: number
): number {
  const tier = getVolumeTier(volume) as { pick: number };
  const packagingClass = (PACKAGING_CLASSIFICATIONS as Record<string, { pickClass: number }>)[
    packaging
  ];
  if (!packagingClass) {
    console.error('Unknown packaging type:', packaging);
    return 0;
  }
  // Get pick class based on all three factors
  const packagingPickClass = packagingClass.pickClass;
  const picksClass = getPicksClass(averagePicks);
  const weightClass = getWeightClass(averageWeight);
  // Use the highest class from all factors
  const finalPickClass = Math.max(packagingPickClass, picksClass, weightClass);
  // Get base rate for the final pick class
  const baseRate = PICKING_RATES.find((r) => r.class === finalPickClass)?.rate || 0;
  // Apply the formula exactly as in Excel
  return baseRate * averagePicks * (1 - tier.pick);
}

function calculateReceiving(skuCount: string, volume: number): number {
  const tier = getVolumeTier(volume) as { receive: number };
  const receiveClass = getSkuClass(skuCount);
  const baseRate = RECEIVING_RATES.find((r) => r.class === receiveClass)?.rate || 0;
  // Calculate the discount first, then multiply by base rate
  const discount = 1 - tier.receive;
  return baseRate * discount;
}

function calculatePackaging(packaging: string): number {
  // Special case for Label Only
  if (packaging === 'Label Only') {
    return 0;
  }
  const packagingClass = (PACKAGING_CLASSIFICATIONS as Record<string, { materialClass: number }>)[
    packaging
  ];
  if (!packagingClass) {
    console.error('Unknown packaging type:', packaging);
    return 0;
  }
  const { materialClass } = packagingClass;

  // Map materialClass to correct PACKAGING_RATES key
  const rateKey = materialClass === 2 ? 'Poly' : materialClass === 3 ? 'Bubble' : 'Box';
  const rates = PACKAGING_RATES[rateKey];
  return rates?.[0]?.price || 0;
}

// =============== MAIN CALCULATION FUNCTION ===============

interface CalculationInputs {
  monthlyVolume: number;
  packaging: string;
  skuCount: number;
  averagePicks: number;
  averageWeight: string;
}

interface CalculationResults {
  orderHandling: number;
  picking: number;
  receiving: number;
  packaging: number;
  total: number;
}

function calculateFulfillmentCosts(inputs: CalculationInputs): CalculationResults {
  try {
    // Validate inputs
    if (!inputs.monthlyVolume || inputs.monthlyVolume < 0)
      throw new Error('Invalid monthly volume');
    if (!PACKAGING_CLASSIFICATIONS[inputs.packaging]) throw new Error('Invalid packaging type');
    if (!inputs.skuCount || inputs.skuCount < 0) throw new Error('Invalid SKU count');
    if (!inputs.averagePicks || inputs.averagePicks < 1) throw new Error('Invalid picks count');
    if (!inputs.averageWeight) throw new Error('Invalid weight');

    // Calculate individual components with proper precision
    const orderHandling = Number(
      calculateOrderHandling(String(inputs.packaging || ''), inputs.monthlyVolume).toFixed(2)
    );
    const picking = Number(
      calculatePicking(
        String(inputs.packaging || ''),
        inputs.averagePicks,
        String(inputs.averageWeight || ''),
        inputs.monthlyVolume
      ).toFixed(2)
    );
    const receiving = Number(calculateReceiving(inputs.skuCount, inputs.monthlyVolume).toFixed(2));
    const packaging = Number(calculatePackaging(String(inputs.packaging || '')).toFixed(2));

    // Calculate total with proper precision
    const total = Number((orderHandling + picking + receiving + packaging).toFixed(2));

    return {
      orderHandling,
      picking,
      receiving,
      packaging,
      total,
    };
  } catch (error) {
    console.error('Calculation error:', error);
    throw error;
  }
}

function calculateReceivingRate(selectedClass: number, monthlyVolume: number): number {
  // 1. Get base rate for the receiving class tier
  const baseRate = getReceivingBaseRate(selectedClass);

  // 2. Get volume tier discount (as a decimal)
  const volumeTierDiscount = getVolumeTierDiscount(monthlyVolume);

  // 3. Simple calculation: base rate minus the discount
  return baseRate - baseRate * volumeTierDiscount;
}

function getReceivingBaseRate(tier: number): number {
  const baseRates = {
    1: 0.12,
    2: 0.13,
    3: 0.14,
    4: 0.14,
    5: 0.15,
  };
  return baseRates[tier] || 0;
}

function getVolumeTierDiscount(monthlyVolume: number): number {
  if (monthlyVolume === 0) return 0;
  if (monthlyVolume <= 25) return 0; // Tier 1
  if (monthlyVolume <= 50) return 0.05; // Tier 2
  if (monthlyVolume <= 75) return 0.05; // Tier 3
  if (monthlyVolume <= 150) return 0.05; // Tier 4
  if (monthlyVolume <= 200) return 0.1; // Tier 5
  if (monthlyVolume <= 250) return 0.1; // Tier 6
  if (monthlyVolume <= 300) return 0.1; // Tier 7
  if (monthlyVolume <= 400) return 0.15; // Tier 8
  if (monthlyVolume <= 525) return 0.15; // Tier 9
  if (monthlyVolume <= 700) return 0.15; // Tier 10
  if (monthlyVolume <= 900) return 0.2; // Tier 11
  if (monthlyVolume <= 1200) return 0.2; // Tier 12
  if (monthlyVolume <= 1600) return 0.2; // Tier 13
  if (monthlyVolume <= 2100) return 0.25; // Tier 14
  if (monthlyVolume <= 2700) return 0.25; // Tier 15
  if (monthlyVolume <= 3500) return 0.3; // Tier 16
  if (monthlyVolume <= 4800) return 0.3; // Tier 17
  if (monthlyVolume <= 6300) return 0.3; // Tier 18
  if (monthlyVolume <= 8000) return 0.3; // Tier 19
  if (monthlyVolume <= 10500) return 0.35; // Tier 20
  if (monthlyVolume <= 15500) return 0.35; // Tier 21
  if (monthlyVolume <= 19000) return 0.35; // Tier 22
  if (monthlyVolume <= 24500) return 0.4; // Tier 23
  if (monthlyVolume <= 34000) return 0.4; // Tier 24
  return 0.4; // Tier 25 (45000 and above)
}
