import type { ServiceImageKey } from '@/types';

/** Replace these with high-resolution photography before launch (same file names). */
export const serviceImages: Record<ServiceImageKey, number> = {
  'dry-cleaning': require('../../../assets/services/dry-cleaning.jpg'),
  'garment-care': require('../../../assets/services/garment-care.jpg'),
  'shoe-cleaning': require('../../../assets/services/shoe-cleaning.jpg'),
  tailoring: require('../../../assets/services/tailoring.jpg'),
  'pickup-delivery': require('../../../assets/services/pickup-delivery.jpg'),
};

export const logo = require('../../../assets/brand/logo.png');
