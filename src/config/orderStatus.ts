import type { NotificationTemplate, OrderStatus } from '@/types';

export type StatusTone = 'info' | 'warning' | 'progress' | 'success' | 'neutral' | 'danger';

export interface StatusMeta {
  label: string;
  icon: string; // MaterialCommunityIcons glyph
  tone: StatusTone;
  /** Admin dashboard bucket. */
  bucket: 'new' | 'scheduled' | 'active' | 'cleaning' | 'ready' | 'completed' | 'cancelled';
}

export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  request_received: { label: 'Request Received', icon: 'file-document-outline', tone: 'info', bucket: 'new' },
  pickup_confirmed: { label: 'Pickup Confirmed', icon: 'calendar-check', tone: 'warning', bucket: 'scheduled' },
  driver_on_the_way: { label: 'Driver on the Way', icon: 'car-outline', tone: 'warning', bucket: 'scheduled' },
  picked_up: { label: 'Picked Up', icon: 'shopping-outline', tone: 'progress', bucket: 'active' },
  cleaning_in_progress: { label: 'Cleaning in Progress', icon: 'hanger', tone: 'progress', bucket: 'cleaning' },
  ready_for_pickup: { label: 'Ready for Pickup', icon: 'check-circle', tone: 'success', bucket: 'ready' },
  ready_for_delivery: { label: 'Ready for Delivery', icon: 'package-variant-closed-check', tone: 'success', bucket: 'ready' },
  out_for_delivery: { label: 'Out for Delivery', icon: 'truck-fast-outline', tone: 'success', bucket: 'active' },
  completed: { label: 'Completed', icon: 'star-circle-outline', tone: 'neutral', bucket: 'completed' },
  cancelled: { label: 'Cancelled', icon: 'close-circle-outline', tone: 'danger', bucket: 'cancelled' },
};

/** The happy path shown on the customer's timeline (delivery flow). */
export const DELIVERY_TIMELINE: OrderStatus[] = [
  'request_received',
  'pickup_confirmed',
  'driver_on_the_way',
  'picked_up',
  'cleaning_in_progress',
  'ready_for_delivery',
  'out_for_delivery',
  'completed',
];

/** Timeline when the customer collects in store. */
export const PICKUP_TIMELINE: OrderStatus[] = [
  'request_received',
  'pickup_confirmed',
  'driver_on_the_way',
  'picked_up',
  'cleaning_in_progress',
  'ready_for_pickup',
  'completed',
];

export const timelineFor = (status: OrderStatus, history: OrderStatus[]): OrderStatus[] => {
  const storePickup = status === 'ready_for_pickup' || history.includes('ready_for_pickup');
  const base = storePickup ? PICKUP_TIMELINE : DELIVERY_TIMELINE;
  return status === 'cancelled' ? [...base.filter((s) => history.includes(s)), 'cancelled'] : base;
};

export const isOpenStatus = (s: OrderStatus) => s !== 'completed' && s !== 'cancelled';

export const DEFAULT_NOTIFICATION_TEMPLATES: Record<OrderStatus, NotificationTemplate> = {
  request_received: {
    title: 'Request received',
    body: "Thank you! We've received your pickup request and will confirm it shortly.",
  },
  pickup_confirmed: {
    title: 'Pickup confirmed',
    body: 'Your pickup has been confirmed. See you soon!',
  },
  driver_on_the_way: {
    title: 'Driver on the way',
    body: 'Our driver is on the way to collect your garments.',
  },
  picked_up: {
    title: 'Garments picked up',
    body: "We've picked up your items. They're headed to our Burbank studio.",
  },
  cleaning_in_progress: {
    title: 'Cleaning in progress',
    body: 'Your order is being cleaned with care.',
  },
  ready_for_pickup: {
    title: 'Ready for pickup',
    body: 'Great news! Your Suzy Cleaners order is ready for pickup.',
  },
  ready_for_delivery: {
    title: 'Ready for delivery',
    body: 'Your order is ready for delivery. We will bring it to you shortly.',
  },
  out_for_delivery: {
    title: 'Delivery on the way',
    body: 'Your delivery is on the way!',
  },
  completed: {
    title: 'Order complete',
    body: "Your order is complete. Thank you for choosing Suzy's Cleaners!",
  },
  cancelled: {
    title: 'Order cancelled',
    body: 'Your order has been cancelled. Message us anytime if you have questions.',
  },
};
