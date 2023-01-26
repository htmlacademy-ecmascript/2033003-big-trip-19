const waypointDate = {
  min: new Date(2018, 0, 1),
  max: new Date(2024, 11, 31)
};

const Integer = {
  MIN_RANDOME_HOUR: 1,
  MAX_RANDOME_HOUR: 1200,
  MAX_INTEGER_DATE_DURATION : 3,
  MIN_LENGTH_ARRAY_ID_OFFERS: 1,
  MAX_COUNT_OBJECTS: 3,
  MIN_BASE_PRICE: 30,
  MAX_BASE_PRICE: 2000,
  MIN_COUNT_DESCRIPRIONS: 1,
  MAX_COUNT_DESCRIPRIONS: 5,
  MAX_RANDOM_IMAGE_INTEGER: 400
};
const DateFormat = {
  MONTH_AND_DATE: 'MMM DD',
  HOURS_AND_MINUTES: 'HH:mm',
  FULL_DATE_AND_TIME: 'DD/MM/YY HH:mm'
};

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DESTINATION_NAMES = ['Moscow', 'Saint-Petersburg', 'Rostov', 'Ulan-Ude','Saratov', 'Samara','Izevsk','Krasnodar','Sochi','Adler'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
];

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const OFFERS = [
  {
    type: 'taxi',
    offers: [{
      id: 1,
      title: 'Meet with a sign',
      price: 120
    },
    {
      id: 2,
      title: 'Change music',
      price: 80
    },
    {
      id: 3,
      title: 'Open the door',
      price: 10
    }]
  },{
    type: 'bus',
    offers: []
  },{
    type: 'train',
    offers: [{
      id: 1,
      title: 'Place on the bottom shelf',
      price: 40
    },
    {
      id: 2,
      title: 'Tea',
      price: 10
    },
    {
      id: 3,
      title: 'Shower',
      price: 100
    }]
  },{
    type: 'ship',
    offers: [{
      id: 1,
      title: 'Cabin with a window',
      price: 155
    },
    {
      id: 2,
      title: 'Car',
      price: 1330
    },
    {
      id: 3,
      title: 'Dinner',
      price: 130
    }]
  },{
    type: 'drive',
    offers: [{
      id: 1,
      title: 'Insurance',
      price: 800
    }]
  },{
    type: 'flight',
    offers: [{
      id: 1,
      title: 'Seat in business class',
      price: 800
    },
    {
      id: 2,
      title: 'Window seat',
      price: 130
    },
    {
      id: 3,
      title: 'Baggage',
      price: 235
    }]
  },{
    type: 'check-in',
    offers: [{
      id: 1,
      title: 'sea view',
      price: 135
    },
    {
      id: 2,
      title: 'Coffee in bed',
      price: 300
    },
    {
      id: 3,
      title: 'Breakfast',
      price: 105
    },
    {
      id: 4,
      title: 'Dinner',
      price: 132
    }]
  },{
    type: 'sightseeing',
    offers: [{
      id: 1,
      title: 'Coffee',
      price: 80
    },
    {
      id: 2,
      title: 'Guide',
      price: 300
    },
    {
      id: 3,
      title: 'Translator',
      price: 125
    }]
  },{
    type: 'restaurant',
    offers: []
  }
];

const newWaypoint = {
    basePrice: 0,
    offers: [],
    type: POINT_TYPES[0],
    allTypes: POINT_TYPES,
    allDestinationNames: DESTINATION_NAMES,
    offersByType: (allOffers) => allOffers.find((offer) => offer.type === POINT_TYPES[0])
};

const UserAction = {
  UPDATE_WAYPOINT: 'UPDATE_WAYPOINT',
  ADD_WAYPOINT: 'ADD_WAYPOINT',
  DELETE_WAYPOINT: 'DELETE_WAYPOINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PRESENT: 'PRESENT',
  PAST: 'PAST'
};

export {
  Integer,
  DateFormat,
  POINT_TYPES,
  OFFERS,
  DESTINATION_NAMES,
  DESCRIPTIONS,
  waypointDate,
  SortType,
  newWaypoint,
  UserAction,
  UpdateType,
  FilterType};
