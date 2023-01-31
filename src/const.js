const DateFormat = {
  MONTH_AND_DATE: 'MMM DD',
  HOURS_AND_MINUTES: 'HH:mm',
  FULL_DATE_AND_TIME: 'DD/MM/YY HH:mm'
};

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const newWaypoint = {
  basePrice: 0,
  offers: [],
  type: POINT_TYPES[0],
  allTypes: POINT_TYPES,
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
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PRESENT: 'PRESENT',
  PAST: 'PAST'
};

export {
  DateFormat,
  POINT_TYPES,
  SortType,
  newWaypoint,
  UserAction,
  UpdateType,
  FilterType};
