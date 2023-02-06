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

const UserAction = {
  UPDATE_WAYPOINT: 'UPDATE_WAYPOINT',
  ADD_WAYPOINT: 'ADD_WAYPOINT',
  DELETE_WAYPOINT: 'DELETE_WAYPOINT'
};

const ViewMode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADDING : 'ADDING'
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

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  DateFormat,
  POINT_TYPES,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  ViewMode,
  TimeLimit};
