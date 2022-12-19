const MIN_DATE = new Date(2018, 0, 1);
const MAX_DATE = new Date(2018, 12, 31);
const MAX_COUNT_OBJECTS = 3;
const MAX_INTEGER_DATE = 3;
const MIN_RANDOME_TIME_INTEGER = 1;
const MAX_RANDOME_TIME_INTEGER = 12;
const DATE_FORMAT = 'MMM DD';
const MIN_LENGTH_ARRAY_ID_OFFERS = 1;
const MAX_LENGTH_ARRAY_ID_OFFERS = 3;
const MIN_BASE_PRICE = 30;
const MAX_BASE_PRICE = 2000;
const MIN_COUNT_DESCRIPRIONS = 1;
const MAX_COUNT_DESCRIPRIONS = 5;
const MAX_RANDOM_IMAGE_INTEGER = 1000;
const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESTINATION_NAMES = ['Moscow', 'Saint-Petersburd', 'Rostov'];
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
const SORTINGS = {
  day: {
    isDisabled: false,
    isChecked: false
  },
  event: {
    isDisabled: true,
    isChecked: false
  },
  time: {
    isDisabled: false,
    isChecked: false
  },
  price: {
    isDisabled: false,
    isChecked: true
  },
  offer: {
    isDisabled: true,
    isChecked: false
  }
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
      title: 'sea ​​view',
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
const FILTERS = {
  everything:{
    isChecked: false
  },
  future:{
    isChecked: false
  },
  present:{
    isChecked: false
  },
  past:{
    isChecked: false
  },
};
export {
  POINT_TYPES,
  MIN_DATE,
  MAX_DATE,
  MAX_COUNT_OBJECTS,
  MAX_INTEGER_DATE,
  MIN_RANDOME_TIME_INTEGER,
  MAX_RANDOME_TIME_INTEGER,
  DATE_FORMAT,
  MIN_LENGTH_ARRAY_ID_OFFERS,
  MAX_LENGTH_ARRAY_ID_OFFERS,
  MIN_BASE_PRICE,
  MAX_BASE_PRICE,
  OFFERS,
  DESTINATION_NAMES,
  DESCRIPTIONS,
  MIN_COUNT_DESCRIPRIONS,
  MAX_COUNT_DESCRIPRIONS,
  MAX_RANDOM_IMAGE_INTEGER,
  SORTINGS,
  FILTERS};
