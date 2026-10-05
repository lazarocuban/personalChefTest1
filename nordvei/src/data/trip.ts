/**
 * All trip content and pricing lives in this file.
 * Edit text, distances, prices or FAQ here; the landing page and the booking
 * flow both read from it, so they always agree.
 *
 * The trail model: the full Nordvei route is 10 stages (one per day).
 * A trip of N days walks stages 1..N and leaves the trail at the end of stage N
 * using that stage's `exit` transfer. Nights on the trail = N - 1.
 */

import type { ImageKey } from './images'

/* ------------------------------------------------------------------ */
/* Brand and limits                                                    */
/* ------------------------------------------------------------------ */

export const brand = {
  name: 'Nordvei',
  tagline: 'Ten days of lake, forest and fjell. Walk as many as you like.',
  email: 'hello@nordvei.example',
  phone: '+47 000 00 000',
}

export const limits = {
  minDays: 3,
  maxDays: 10,
  minHikers: 1,
  maxHikers: 8,
  /** Guided departures run from the first day of `seasonStartMonth` to the last day of `seasonEndMonth` (1 = January). */
  seasonStartMonth: 6,
  seasonEndMonth: 9,
}

export const currency = { code: 'EUR', locale: 'en-IE' }

/* ------------------------------------------------------------------ */
/* Route: stages and map waypoints                                      */
/* ------------------------------------------------------------------ */

export type SleepType = 'hut' | 'cabin'

export type Stage = {
  day: number
  title: string
  from: string
  to: string
  km: number
  ascent: number
  descent: number
  terrain: string
  /** Where you sleep at the end of this stage (if the trip continues). */
  sleep: { name: string; type: SleepType; campingAllowed: boolean } | null
  meals: string
  summary: string
  /** How you get off the trail if your trip ends after this stage. */
  exit: string
}

export const stages: Stage[] = [
  {
    day: 1,
    title: 'Into the quiet',
    from: 'Fjellstad station',
    to: 'Stillvatn',
    km: 12,
    ascent: 380,
    descent: 160,
    terrain: 'Wide forest tracks, soft needles underfoot, one steady climb',
    sleep: { name: 'Stillvatn Lodge', type: 'cabin', campingAllowed: true },
    meals: 'Trail lunch, three-course dinner',
    summary:
      'Step off the train and straight into spruce forest. The day ends at Stillvatn, a lake so calm it mirrors the far shore. Most people swim before dinner.',
    exit: 'Not available: the shortest trip is 3 days.',
  },
  {
    day: 2,
    title: 'The old spruce',
    from: 'Stillvatn',
    to: 'Granli',
    km: 16,
    ascent: 420,
    descent: 300,
    terrain: 'Old-growth forest, roots and boulders, moss carpets',
    sleep: { name: 'Granli Hut', type: 'hut', campingAllowed: false },
    meals: 'Breakfast, packed lunch, hut dinner',
    summary:
      'Granskogen is one of the oldest spruce stands in the region, some trees older than 300 years. We slow down here: it is the quietest walking of the trip.',
    exit: 'Not available: the shortest trip is 3 days.',
  },
  {
    day: 3,
    title: 'Bog and birch',
    from: 'Granli',
    to: 'Myrvann',
    km: 14,
    ascent: 250,
    descent: 390,
    terrain: 'Boardwalks over open bog, birch woodland, lakeshore path',
    sleep: { name: 'Myrvann Cabins', type: 'cabin', campingAllowed: true },
    meals: 'Breakfast, packed lunch, lakeside dinner',
    summary:
      'Open moorland with long views, cotton grass in early summer and cloudberries in late July. Myrvann has a wood-fired sauna on the jetty.',
    exit: '3-day trips end here: lake boat and bus back to Fjellstad station (1 h 15 min).',
  },
  {
    day: 4,
    title: 'Above the trees',
    from: 'Myrvann',
    to: 'Bjørkli',
    km: 18,
    ascent: 540,
    descent: 260,
    terrain: 'Gradual climb to the tree line, rocky in places',
    sleep: { name: 'Bjørkli Hut', type: 'hut', campingAllowed: false },
    meals: 'Breakfast, packed lunch, hut dinner',
    summary:
      'The forest thins and the first open fjell appears. Bjørkli is a staffed mountain hut with a long table, a drying room and a library of old maps.',
    exit: 'Minibus from the Bjørkli road end back to Fjellstad (1 h 30 min).',
  },
  {
    day: 5,
    title: 'Long water',
    from: 'Bjørkli',
    to: 'Langvatnet',
    km: 15,
    ascent: 200,
    descent: 450,
    terrain: 'Gentle descent, open heath, sandy lake beaches',
    sleep: { name: 'Langvatnet Cabins', type: 'cabin', campingAllowed: true },
    meals: 'Breakfast, packed lunch, fish dinner on the shore',
    summary:
      'Langvatnet stretches 9 km through the valley. The beaches here are the best wild camping on the route, and the evening light is long and low.',
    exit: '5-day trips end here: ferry along Langvatnet to Elvestrand station (50 min).',
  },
  {
    day: 6,
    title: 'Summer farm',
    from: 'Langvatnet',
    to: 'Fjellsætra',
    km: 17,
    ascent: 690,
    descent: 240,
    terrain: 'The biggest climb: switchbacks, then rolling fjell',
    sleep: { name: 'Fjellsætra summer farm', type: 'hut', campingAllowed: false },
    meals: 'Breakfast, packed lunch, farm dinner with local cheese',
    summary:
      'A hard but rewarding climb to a working summer farm. Goats, fresh brown cheese and a view across four valleys.',
    exit: 'Farm road taxi to Elvestrand station (1 h).',
  },
  {
    day: 7,
    title: 'The ridge',
    from: 'Fjellsætra',
    to: 'Høgtind',
    km: 13,
    ascent: 520,
    descent: 330,
    terrain: 'Exposed ridge walking, scrambling optional, weather dependent',
    sleep: { name: 'Høgtind Hut', type: 'hut', campingAllowed: false },
    meals: 'Breakfast, packed lunch, hut dinner',
    summary:
      'The high point of the Nordvei at 1,290 m. On a clear day you can see the glacier to the west. Your guide may choose the lower valley path in poor weather.',
    exit: '7-day trips end here: descend to the Fjellsætra road for a taxi to Elvestrand (1 h 20 min).',
  },
  {
    day: 8,
    title: 'Troll forest',
    from: 'Høgtind',
    to: 'Kvitvann',
    km: 19,
    ascent: 310,
    descent: 780,
    terrain: 'Long descent, then twisted pine forest and boulder fields',
    sleep: { name: 'Kvitvann Hut', type: 'hut', campingAllowed: true },
    meals: 'Breakfast, packed lunch, hut dinner',
    summary:
      'The longest day. Trollskogen is a forest of wind-bent pines and lichen-grey rocks that gave rise to more than one local legend.',
    exit: 'Boat across Kvitvann and minibus to Elvestrand (1 h 10 min).',
  },
  {
    day: 9,
    title: 'North water',
    from: 'Kvitvann',
    to: 'Nordvatn',
    km: 16,
    ascent: 280,
    descent: 390,
    terrain: 'Lakeshore paths and pine heath, easy underfoot',
    sleep: { name: 'Nordvatn Lodge', type: 'cabin', campingAllowed: true },
    meals: 'Breakfast, packed lunch, farewell dinner',
    summary:
      'A soft, unhurried day linking three lakes. Our last night together is at Nordvatn Lodge, with a sauna and a long dinner.',
    exit: 'Lodge minibus to Elvestrand station (40 min).',
  },
  {
    day: 10,
    title: 'Down to the river',
    from: 'Nordvatn',
    to: 'Elvestrand',
    km: 11,
    ascent: 120,
    descent: 500,
    terrain: 'Gentle descent through birch and pine to the river village',
    sleep: null,
    meals: 'Breakfast, celebration lunch',
    summary:
      'An easy final walk down to Elvestrand, where the river meets the railway. Lunch, a last swim if you like, then the afternoon train to Oslo.',
    exit: '10-day trips end here: afternoon train from Elvestrand to Oslo (3 h).',
  },
]

export type WaypointKind = 'start' | 'lake' | 'forest' | 'hut' | 'ridge' | 'end'

export type Waypoint = {
  id: string
  name: string
  kind: WaypointKind
  /** Position on the 1000 × 620 illustrated map. */
  x: number
  y: number
  /** Elevation in metres above sea level. */
  elevation: number
  /** The stage that ends here (0 = trailhead). */
  stageDay: number
  description: string
  highlights: string[]
}

export const waypoints: Waypoint[] = [
  {
    id: 'fjellstad',
    name: 'Fjellstad',
    kind: 'start',
    x: 90,
    y: 520,
    elevation: 420,
    stageDay: 0,
    description: 'A small railway town 2 h 30 min from Oslo. Your guide meets you on the platform.',
    highlights: ['Direct train from Oslo', 'Gear check and briefing', 'Luggage storage'],
  },
  {
    id: 'stillvatn',
    name: 'Stillvatn',
    kind: 'lake',
    x: 200,
    y: 430,
    elevation: 640,
    stageDay: 1,
    description: 'A sheltered forest lake known for its mirror-calm evenings.',
    highlights: ['First swim', 'Lakeside lodge', 'Beaver lodges on the north shore'],
  },
  {
    id: 'granli',
    name: 'Granskogen & Granli Hut',
    kind: 'forest',
    x: 300,
    y: 330,
    elevation: 760,
    stageDay: 2,
    description: 'Old-growth spruce forest with a cosy self-service hut at its edge.',
    highlights: ['300-year-old spruces', 'Capercaillie habitat', 'Wood stove hut'],
  },
  {
    id: 'myrvann',
    name: 'Myrvann',
    kind: 'lake',
    x: 395,
    y: 420,
    elevation: 620,
    stageDay: 3,
    description: 'Open bog and birch around a shallow, warm lake. The 3-day trip finishes here.',
    highlights: ['Jetty sauna', 'Cloudberries (late July)', 'Boat back to Fjellstad'],
  },
  {
    id: 'bjorkli',
    name: 'Bjørkli Hut',
    kind: 'hut',
    x: 475,
    y: 290,
    elevation: 900,
    stageDay: 4,
    description: 'A staffed mountain hut right at the tree line.',
    highlights: ['First open fjell views', 'Drying room', 'Reindeer often seen nearby'],
  },
  {
    id: 'langvatnet',
    name: 'Langvatnet',
    kind: 'lake',
    x: 560,
    y: 410,
    elevation: 650,
    stageDay: 5,
    description: 'A 9 km long lake with sandy beaches. The 5-day trip finishes here.',
    highlights: ['Best wild camping', 'Fish dinner on the shore', 'Ferry to Elvestrand'],
  },
  {
    id: 'fjellsaetra',
    name: 'Fjellsætra',
    kind: 'hut',
    x: 640,
    y: 250,
    elevation: 1100,
    stageDay: 6,
    description: 'A working summer farm where goats graze until September.',
    highlights: ['Fresh brown cheese', 'Four-valley view', 'Farm stay'],
  },
  {
    id: 'hogtind',
    name: 'Høgtind',
    kind: 'ridge',
    x: 735,
    y: 140,
    elevation: 1290,
    stageDay: 7,
    description: 'The highest point of the route, with a small hut below the summit ridge. The 7-day trip finishes here.',
    highlights: ['1,290 m high point', 'Glacier views', 'Optional scramble'],
  },
  {
    id: 'kvitvann',
    name: 'Trollskogen & Kvitvann',
    kind: 'forest',
    x: 800,
    y: 330,
    elevation: 820,
    stageDay: 8,
    description: 'Wind-bent pines and pale boulders, ending at a clear glacial lake.',
    highlights: ['Twisted pine forest', 'Glacial-blue water', 'Longest day: 19 km'],
  },
  {
    id: 'nordvatn',
    name: 'Nordvatn',
    kind: 'lake',
    x: 870,
    y: 450,
    elevation: 710,
    stageDay: 9,
    description: 'Three linked lakes and a timber lodge for the farewell night.',
    highlights: ['Farewell dinner', 'Lakeside sauna', 'Easy shoreline walking'],
  },
  {
    id: 'elvestrand',
    name: 'Elvestrand',
    kind: 'end',
    x: 930,
    y: 560,
    elevation: 330,
    stageDay: 10,
    description: 'A river village on the railway line. The full Nordvei ends here.',
    highlights: ['Celebration lunch', 'Train to Oslo', 'Optional hotel night'],
  },
]

/** Named versions of the trip, shown in the itinerary. Any length from 3 to 10 days is bookable. */
export const tripVersions = [
  { days: 3, name: 'Lakes taster', description: 'Forest and two lakes. Ideal first taste of hut-to-hut hiking.' },
  { days: 5, name: 'Forest & water', description: 'Adds the tree line and the long beaches of Langvatnet.' },
  { days: 7, name: 'Into the fjell', description: 'Adds the summer farm and the high ridge at Høgtind.' },
  { days: 10, name: 'The full Nordvei', description: 'The whole route, station to station: 151 km.' },
]

/* ------------------------------------------------------------------ */
/* Quick facts                                                         */
/* ------------------------------------------------------------------ */

export type QuickFact = {
  label: string
  /** Animated number, or a range [from, to]. Omit for text-only facts. */
  value?: number | [number, number]
  suffix?: string
  text?: string
  detail: string
}

export const quickFacts: QuickFact[] = [
  { label: 'Trip length', value: [3, 10], suffix: ' days', detail: 'Pick any length, end at a station' },
  { label: 'Distance per day', value: [11, 19], suffix: ' km', detail: '5 to 7 hours of walking' },
  { label: 'Difficulty', text: 'Moderate', detail: 'Regular hikers, no climbing skills' },
  { label: 'Group size', value: 8, suffix: ' max', detail: 'Two guides on every departure' },
  { label: 'Best season', text: 'Jun – Sep', detail: 'Long light, open huts' },
  { label: 'Starting point', text: 'Fjellstad', detail: '2 h 30 min by train from Oslo' },
]

/* ------------------------------------------------------------------ */
/* Inclusions                                                          */
/* ------------------------------------------------------------------ */

export const included = [
  'Two certified mountain guides (one per four hikers)',
  'All nights on the trail in huts, cabins or tents',
  'Breakfast, packed lunch and dinner every day',
  'Luggage transfer between cabins on comfort trips',
  'Boat, ferry and minibus transfers on the route',
  'Satellite communicator and full first-aid kit',
  'Trail map, route notes and a small gift at the end',
]

export const notIncluded = [
  'Flights and the train to Fjellstad',
  'Travel and rescue insurance (required)',
  'Personal hiking gear (rental available)',
  'Drinks other than water, coffee and tea',
  'Hotel nights before or after the trip',
  'Tips for guides and hut staff (optional)',
]

/* ------------------------------------------------------------------ */
/* Seasons                                                             */
/* ------------------------------------------------------------------ */

export type MonthInfo = {
  month: string
  short: string
  high: number
  low: number
  daylight: number
  title: string
  note: string
}

export const months: MonthInfo[] = [
  { month: 'January', short: 'Jan', high: -2, low: -9, daylight: 6.5, title: 'Deep snow', note: 'The trail sleeps under snow. Huts are closed; we run no hikes. Ski touring country.' },
  { month: 'February', short: 'Feb', high: -1, low: -9, daylight: 9, title: 'Blue light', note: 'Long blue dusks and frozen lakes. No guided hikes this month.' },
  { month: 'March', short: 'Mar', high: 3, low: -5, daylight: 11.7, title: 'Late winter', note: 'Bright days, cold nights, snow still deep in the forest. No guided hikes.' },
  { month: 'April', short: 'Apr', high: 8, low: -1, daylight: 14.3, title: 'Thaw', note: 'Snowmelt makes the bogs impassable. Rivers run high. No guided hikes.' },
  { month: 'May', short: 'May', high: 14, low: 4, daylight: 17, title: 'First green', note: 'Birch leaves appear and lakes thaw, but snow lingers on the ridge. No guided hikes yet.' },
  { month: 'June', short: 'Jun', high: 18, low: 8, daylight: 19.3, title: 'White nights', note: 'It never gets fully dark. Wildflowers, rushing streams and a few snow patches high up. Bring a sleep mask.' },
  { month: 'July', short: 'Jul', high: 20, low: 10, daylight: 18.5, title: 'High summer', note: 'The warmest month. Lake swims every day and cloudberries ripening on the bogs late in the month. Our busiest weeks.' },
  { month: 'August', short: 'Aug', high: 18, low: 9, daylight: 15.8, title: 'Berry season', note: 'Blueberries line the trail. Huts are quieter after mid-month and the first starry nights return.' },
  { month: 'September', short: 'Sep', high: 13, low: 5, daylight: 12.9, title: 'Autumn colours', note: 'Birch turns gold and bog plants red. Crisp mornings, first frosts and a small chance of northern lights on clear nights.' },
  { month: 'October', short: 'Oct', high: 7, low: 1, daylight: 10.5, title: 'Closing down', note: 'Huts close for winter and the first snow arrives up high. No guided hikes.' },
  { month: 'November', short: 'Nov', high: 2, low: -3, daylight: 8, title: 'Dark season', note: 'Short, grey days. No guided hikes.' },
  { month: 'December', short: 'Dec', high: -1, low: -7, daylight: 6, title: 'Polar dusk', note: 'Only six hours of low light. Beautiful, but not for walking. No guided hikes.' },
]

/* ------------------------------------------------------------------ */
/* Gear                                                                */
/* ------------------------------------------------------------------ */

export const gear: { category: string; items: { id: string; label: string; note?: string }[] }[] = [
  {
    category: 'Wear and carry',
    items: [
      { id: 'boots', label: 'Broken-in hiking boots', note: 'Waterproof, ankle support' },
      { id: 'pack', label: 'Daypack, 30–40 litres', note: 'With rain cover' },
      { id: 'poles', label: 'Trekking poles', note: 'Rental available' },
      { id: 'bottle', label: 'Water bottle, 1 litre', note: 'Streams are drinkable' },
    ],
  },
  {
    category: 'Layers',
    items: [
      { id: 'base', label: 'Merino base layers, top and bottom' },
      { id: 'fleece', label: 'Fleece or light insulated jacket' },
      { id: 'shell', label: 'Waterproof jacket and trousers', note: 'Essential, every season' },
      { id: 'hat', label: 'Warm hat and thin gloves' },
      { id: 'socks', label: 'Hiking socks, 3 pairs' },
      { id: 'camp-clothes', label: 'Dry clothes and slippers for the hut' },
    ],
  },
  {
    category: 'Personal',
    items: [
      { id: 'sleep-liner', label: 'Sleeping bag liner', note: 'Required in huts' },
      { id: 'mask', label: 'Eye mask', note: 'For the white nights' },
      { id: 'repellent', label: 'Insect repellent and head net' },
      { id: 'sun', label: 'Sunscreen and sunglasses' },
      { id: 'towel', label: 'Quick-dry towel and swimwear' },
      { id: 'meds', label: 'Personal medication and blister kit' },
    ],
  },
  {
    category: 'Documents and small things',
    items: [
      { id: 'passport', label: 'Passport or ID' },
      { id: 'insurance', label: 'Travel insurance details' },
      { id: 'cash', label: 'Card for hut drinks and snacks' },
      { id: 'powerbank', label: 'Power bank', note: 'Charging is limited in huts' },
      { id: 'headlamp', label: 'Headlamp', note: 'For September trips' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Accommodation                                                       */
/* ------------------------------------------------------------------ */

export const accommodationTypes: { title: string; image: ImageKey; body: string; facts: string[] }[] = [
  {
    title: 'Mountain huts',
    image: 'hut',
    body: 'Staffed and self-service huts with bunk rooms, a shared dining table and a wood stove. Simple, warm and full of stories.',
    facts: ['Bunk rooms of 4–6', 'Hot showers in most', 'Hearty three-course dinners'],
  },
  {
    title: 'Lakeside cabins',
    image: 'cabin',
    body: 'Timber cabins and small lodges on the shore. Private rooms on comfort trips, a sauna and a jetty for a morning swim.',
    facts: ['Private or twin rooms', 'Sauna at most cabins', 'Breakfast with a view'],
  },
  {
    title: 'Wild camping',
    image: 'camp',
    body: 'Sleep on the beach at Langvatnet or under the pines. We carry quality tents and cook on the shore; huts are used where camping is not possible.',
    facts: ['Tents and mats provided', 'Camp chef dinners', 'Huts on high nights'],
  },
]

/* ------------------------------------------------------------------ */
/* Safety and etiquette                                                */
/* ------------------------------------------------------------------ */

export const safety = {
  fitness: [
    'You can walk 5–7 hours on uneven ground, several days in a row.',
    'You are comfortable carrying a daypack of 6–8 kg.',
    'You do not need climbing skills; the ridge scramble on day 7 is optional.',
    'Train with a few long weekend hikes in the two months before you come.',
  ],
  guides: [
    'Two certified guides on every departure, trained in wilderness first aid.',
    'Satellite communicator and daily check-ins with our base.',
    'Your guide may change the route for weather. Safety always comes first.',
    'Travel insurance that covers mountain rescue is required.',
  ],
  allemannsretten: [
    'Walk freely on uncultivated land, but keep at least 150 m from houses and cabins.',
    'Camp for up to two nights in one place, then move on.',
    'Fires are banned in or near woodland from 15 April to 15 September.',
    'Leave no trace: carry out all rubbish, including food scraps.',
    'Close gates, give way to grazing animals and keep dogs on a lead.',
    'Pick berries and mushrooms for yourself, never from private gardens.',
  ],
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

export type AccommodationLevelId = 'wild' | 'classic' | 'comfort'

export const accommodationLevels: {
  id: AccommodationLevelId
  name: string
  perDay: number
  description: string
}[] = [
  {
    id: 'wild',
    name: 'Wild camping',
    perDay: 165,
    description: 'Tents on the shore where camping is allowed, huts on the high nights.',
  },
  {
    id: 'classic',
    name: 'Huts & cabins',
    perDay: 210,
    description: 'Shared rooms in mountain huts and lakeside cabins. Our most popular option.',
  },
  {
    id: 'comfort',
    name: 'Comfort',
    perDay: 285,
    description: 'Private rooms wherever they exist, plus luggage carried between cabins.',
  },
]

/** Discounts on the trip price (not add-ons). The highest matching tier applies. */
export const groupDiscounts = [
  { minHikers: 3, percent: 5, label: '3–4 hikers' },
  { minHikers: 5, percent: 10, label: '5–8 hikers' },
]

export type AddOnId = 'gear' | 'transfer' | 'photographer'
export type AddOnUnit = 'perPersonPerDay' | 'perPerson' | 'perGroup'

export const addOns: { id: AddOnId; name: string; price: number; unit: AddOnUnit; description: string }[] = [
  {
    id: 'gear',
    name: 'Gear rental',
    price: 28,
    unit: 'perPersonPerDay',
    description: 'Boots excluded: daypack, poles, waterproofs and sleeping bag liner.',
  },
  {
    id: 'transfer',
    name: 'Airport transfer',
    price: 65,
    unit: 'perPerson',
    description: 'Oslo Gardermoen to Fjellstad, and Elvestrand back to the airport.',
  },
  {
    id: 'photographer',
    name: 'Photographer day',
    price: 390,
    unit: 'perGroup',
    description: 'A professional photographer joins one day. 60+ edited photos.',
  },
]

export type MealPreference = 'standard' | 'vegetarian' | 'vegan'

export const mealOptions: { id: MealPreference; name: string; description: string }[] = [
  { id: 'standard', name: 'Standard', description: 'Local fish, meat and dairy' },
  { id: 'vegetarian', name: 'Vegetarian', description: 'No extra cost' },
  { id: 'vegan', name: 'Vegan', description: 'No extra cost' },
]

export const fitnessLevels = [
  { id: 'steady', label: 'Steady: I hike a few times a year' },
  { id: 'regular', label: 'Regular: I hike or train most weeks' },
  { id: 'strong', label: 'Strong: long days in the mountains are normal for me' },
] as const

/* ------------------------------------------------------------------ */
/* Social proof and FAQ                                                */
/* ------------------------------------------------------------------ */

export const testimonials = [
  {
    quote:
      'I booked the 5-day trip expecting a holiday and came home feeling like I had been somewhere very far away. The silence at Stillvatn stays with me.',
    name: 'Maren',
    detail: '5 days, July',
  },
  {
    quote:
      'Our guides read the weather like a book. They moved us off the ridge a day early and we watched the storm roll in from Høgtind Hut with cake.',
    name: 'Tom & Priya',
    detail: '10 days, August',
  },
  {
    quote:
      'Hard enough that I felt it, gentle enough that I never stopped enjoying it. The September colours were unreal.',
    name: 'Jonas',
    detail: '7 days, September',
  },
]

export const faq = [
  {
    q: 'How fit do I need to be?',
    a: 'If you can walk 5–7 hours on uneven ground with a light pack, and do it again the next day, you will be fine. The shorter trips stay low; the ridge on day 7 is the toughest part of the full route.',
  },
  {
    q: 'Can I choose any length between 3 and 10 days?',
    a: 'Yes. Every trip starts at Fjellstad and walks the route in order. You leave the trail at the end of your last day, using that day’s boat, ferry, minibus or train transfer, which is included.',
  },
  {
    q: 'Do I carry all my luggage?',
    a: 'You carry a daypack. On comfort trips we move your main bag between cabins. On huts and wild camping trips, a small extra bag can be sent ahead to the halfway point.',
  },
  {
    q: 'What happens in bad weather?',
    a: 'Norwegian weather changes fast. Your guides have lower-level alternatives for every exposed section and will reroute or wait it out when needed. We do not refund for weather changes, but we never take risks with it.',
  },
  {
    q: 'Can I come alone?',
    a: 'Absolutely. About half of our hikers travel solo. On huts and cabins trips you share rooms with other hikers of the same gender unless you choose comfort.',
  },
  {
    q: 'Is the water safe to drink?',
    a: 'Streams and lakes along the route are generally safe to drink from. Your guide will point out the best places to fill up.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Free cancellation up to 60 days before departure. Between 60 and 30 days we refund 50%. After that we can move your booking to another date this season or next.',
  },
  {
    q: 'Is this a real company?',
    a: 'No. Nordvei is a fictional company and this website is a design demo. No bookings are taken and nothing is charged.',
  },
]
