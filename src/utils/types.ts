export type PackagingType = 'Label Only' | 'Polybag' | 'Bubble Mailer' | 'Box';

export type VolumeTier = {
  volume: number;
  oh: number;
  pick: number;
  receive: number;
};

export type Rate = {
  class: number;
  rate: number;
};

export type PackagingItem = {
  sku: string;
  price: number;
  qty: number;
  category: 'Box' | 'Poly' | 'Bubble';
};

export type CalculationInputs = {
  monthlyVolume: number;
  packaging: PackagingType;
  skuCount: number;
  averagePicks: number;
  averageWeight: string;
};

export type CalculationResults = {
  orderHandling: number;
  picking: number;
  receiving: number;
  packaging: number;
  total: number;
};
