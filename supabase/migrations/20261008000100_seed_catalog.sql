-- Default catalog and business settings (generated from src/config/business.ts).
-- Staff can change all of this later in Admin → Settings.

insert into public.services (id, name, tagline, description, highlights, price, unit_label, icon, image, active, bookable, sort_order) values
  ('dry-cleaning', 'Dry Cleaning', 'Precision cleaning, hand-finished', 'Suits, dresses, silks and delicates cleaned with gentle, certified solvents, then hand-pressed and inspected button by button.', array['Hand-finished pressing', 'Stain treatment included', 'Eco-friendly options'], 14, 'per garment', 'hanger', 'dry-cleaning', true, true, 1),
  ('garment-care', 'Garment Care', 'Bridal, couture & heirlooms', 'Specialty care for wedding gowns, couture, leather, suede and heirloom pieces — including preservation boxing.', array['Gown cleaning & preservation', 'Leather & suede', 'Wash & fold laundry'], 10, 'per item', 'tshirt-crew-outline', 'garment-care', true, true, 2),
  ('shoe-cleaning', 'Luxury Shoe Cleaning', 'Sneakers, loafers & heels restored', 'Deep cleaning, deodorizing and conditioning for designer sneakers, leather dress shoes and heels.', array['Leather conditioning', 'Sole whitening', 'Deodorizing'], 35, 'per pair', 'shoe-sneaker', 'shoe-cleaning', true, true, 3),
  ('tailoring', 'Tailoring & Alterations', 'A perfect fit, every time', 'Hems, tapering, sleeves, zippers and full re-fits by our in-house tailor. Fittings available by appointment.', array['Hems & tapering', 'Zipper & button repair', 'Formalwear fittings'], 20, 'starting, per item', 'content-cut', 'tailoring', true, true, 4),
  ('pickup-delivery', 'Pickup & Delivery', 'Concierge service at your door', 'We collect from your home or office and return everything fresh, pressed and on hangers. $50 minimum order within our service area.', array['Free with $50 minimum', 'Same-day options', 'Contact-free drop-off'], 0, 'included', 'truck-delivery-outline', 'pickup-delivery', true, false, 5)
on conflict (id) do nothing;

insert into public.settings (id, data) values (1, '{
  "businessName": "Suzy''s Cleaners",
  "tagline": "Best Quality Dry Cleaners in Burbank",
  "phone": "(747) 333-0034",
  "altPhone": "(463) 583-0000",
  "email": "suzyscleaners@sbcglobal.net",
  "website": "https://suzyscleaners.com",
  "minimumOrder": 50,
  "serviceRadiusMiles": 20,
  "timeWindows": [
    "9–11 AM",
    "12–2 PM",
    "3–5 PM"
  ],
  "bookingDaysAhead": 7,
  "hours": [
    {
      "day": "Mon",
      "open": "7:00 AM",
      "close": "7:00 PM",
      "closed": false
    },
    {
      "day": "Tue",
      "open": "7:00 AM",
      "close": "7:00 PM",
      "closed": false
    },
    {
      "day": "Wed",
      "open": "7:00 AM",
      "close": "7:00 PM",
      "closed": false
    },
    {
      "day": "Thu",
      "open": "7:00 AM",
      "close": "7:00 PM",
      "closed": false
    },
    {
      "day": "Fri",
      "open": "7:00 AM",
      "close": "7:00 PM",
      "closed": false
    },
    {
      "day": "Sat",
      "open": "8:00 AM",
      "close": "5:00 PM",
      "closed": false
    },
    {
      "day": "Sun",
      "open": "",
      "close": "",
      "closed": true
    }
  ],
  "locations": [
    {
      "id": "loc-burbank",
      "name": "Burbank",
      "address": "540 N Glenoaks Blvd",
      "city": "Burbank",
      "state": "CA",
      "zip": "91502",
      "phone": "(747) 333-0034",
      "latitude": 34.1867,
      "longitude": -118.3089,
      "status": "open"
    },
    {
      "id": "loc-pasadena",
      "name": "Pasadena",
      "address": "",
      "city": "Pasadena",
      "state": "CA",
      "zip": "",
      "phone": "",
      "latitude": 34.1478,
      "longitude": -118.1445,
      "status": "coming_soon"
    },
    {
      "id": "loc-northridge",
      "name": "Northridge",
      "address": "",
      "city": "Northridge",
      "state": "CA",
      "zip": "",
      "phone": "",
      "latitude": 34.2283,
      "longitude": -118.5368,
      "status": "coming_soon"
    }
  ],
  "notificationTemplates": {
    "request_received": {
      "title": "Request received",
      "body": "Thank you! We''ve received your pickup request and will confirm it shortly."
    },
    "pickup_confirmed": {
      "title": "Pickup confirmed",
      "body": "Your pickup has been confirmed. See you soon!"
    },
    "driver_on_the_way": {
      "title": "Driver on the way",
      "body": "Our driver is on the way to collect your garments."
    },
    "picked_up": {
      "title": "Garments picked up",
      "body": "We''ve picked up your items. They''re headed to our Burbank studio."
    },
    "cleaning_in_progress": {
      "title": "Cleaning in progress",
      "body": "Your order is being cleaned with care."
    },
    "ready_for_pickup": {
      "title": "Ready for pickup",
      "body": "Great news! Your Suzy Cleaners order is ready for pickup."
    },
    "ready_for_delivery": {
      "title": "Ready for delivery",
      "body": "Your order is ready for delivery. We will bring it to you shortly."
    },
    "out_for_delivery": {
      "title": "Delivery on the way",
      "body": "Your delivery is on the way!"
    },
    "completed": {
      "title": "Order complete",
      "body": "Your order is complete. Thank you for choosing Suzy''s Cleaners!"
    },
    "cancelled": {
      "title": "Order cancelled",
      "body": "Your order has been cancelled. Message us anytime if you have questions."
    }
  },
  "about": "Since 1996, Suzy''s Cleaners has been Burbank''s trusted, family-owned garment care studio. Every piece is inspected by hand, cleaned with certified, eco-friendly methods and finished with the kind of care you would give it yourself — from everyday shirts to bridal gowns, designer suits and luxury sneakers. Our concierge pickup and delivery brings that same attention to your door.",
  "chamberMember": true
}'::jsonb)
on conflict (id) do nothing;
