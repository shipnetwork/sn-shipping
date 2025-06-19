import {
  ORDER_HANDLING_RATES,
  PACKAGING_CLASSIFICATIONS,
  PACKAGING_RATES,
  PICKING_RATES,
  RECEIVING_RATES,
  VOLUME_TIERS,
} from './constants';
import type { PackagingType } from './types';

export function getVolumeTier(volume: number) {
  const tiers = Object.values(VOLUME_TIERS);
  return tiers.find((tier) => volume <= tier.volume) || tiers[tiers.length - 1];
}

export function calculateOrderHandling(packaging: PackagingType, volume: number): number {
  const tier = getVolumeTier(volume);
  const packagingClass = PACKAGING_CLASSIFICATIONS[packaging];
  if (!packagingClass) {
    console.error('Unknown packaging type:', packaging);
    return 0;
  }
  const { ohClass } = packagingClass;
  const baseRate = ORDER_HANDLING_RATES.find((r) => r.class === ohClass)?.rate || 0;
  return baseRate * (1 - tier.oh);
}

export function calculatePicking(
  packaging: PackagingType,
  averagePicks: number,
  averageWeight: string,
  volume: number
): number {
  const tier = getVolumeTier(volume);
  const packagingClass = PACKAGING_CLASSIFICATIONS[packaging];
  if (!packagingClass) {
    console.error('Unknown packaging type:', packaging);
    return 0;
  }
  const { pickClass } = packagingClass;
  const baseRate = PICKING_RATES.find((r) => r.class === pickClass)?.rate || 0;
  return baseRate * averagePicks * (1 - tier.pick);
}

export function calculateReceiving(volume: number, skuCount: string): number {
  const tier = getVolumeTier(volume);
  const baseRate = RECEIVING_RATES[0]?.rate || 0;
  return baseRate * (1 - tier.receive);
}

export function calculatePackaging(packaging: PackagingType): number {
  if (packaging === 'Label Only') {
    return 0;
  }
  const packagingClass = PACKAGING_CLASSIFICATIONS[packaging];
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
