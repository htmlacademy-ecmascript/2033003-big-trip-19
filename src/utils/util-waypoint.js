import { DateFormat, FilterType, POINT_TYPES} from '../const.js';
import dayjs from 'dayjs';

const newWaypointTemplate = {
  basePrice: '',
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: 0,
  isFavorite: false,
  offers: [],
  type: POINT_TYPES[0]
};

const getTimeFromDate = (date) => {
  const withoutDate = dayjs(date).format(DateFormat.HOURS_AND_MINUTES);
  return withoutDate;
};
const getFullFormatDate = (date) => {
  const withoutDate = dayjs(date).format(DateFormat.FULL_DATE_AND_TIME);
  return withoutDate;
};

const getDateDifference = (startDate, endDate) =>{
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diff = end.diff(start, 'day');
  const days = diff < 10 ? `0${diff}` : diff;
  const hours = end.diff(start, 'hour') % 24;
  const minutes = end.diff(start, 'minute') % 60;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  let humaniseTime = '';
  if(days > 0){
    humaniseTime = `${days}D ${formattedHours}H ${formattedMinutes}M`;
  }else if(days < 1 && hours > 0){
    humaniseTime = `${formattedHours}H ${formattedMinutes}M`;
  }else{
    humaniseTime = `${formattedMinutes}M`;
  }
  return humaniseTime;
};

const isEmptyObject = (obj) => Object.entries(obj).length === 0;

const sortWaypointByDate = (waypointA, waypointB) => {
  if (!waypointA.dateFrom && !waypointB.dateFrom) {return 0;}
  if (!waypointA.dateFrom) {return 1;}
  if (!waypointB.dateFrom) {return -1;}
  return new Date(waypointA.dateFrom) - new Date(waypointB.dateFrom);
};

const sortWaypointByDuration = (waypointA, waypointB) => {
  const durationA = dayjs(waypointA.dateTo).diff(dayjs(waypointA.dateFrom), 'millisecond');
  const durationB = dayjs(waypointB.dateTo).diff(dayjs(waypointB.dateFrom), 'millisecond');
  return durationB - durationA;
};

const sortWaypointByPrice = (waypointA, waypointB) => waypointB.basePrice - waypointA.basePrice;

const humanizeWaypointDate = (date) => date ? dayjs(date).format(DateFormat.MONTH_AND_DATE) : date;

const getRandomArrayElement = (elements) => elements[Math.floor(Math.random() * elements.length)];

const NoWaypointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const isCheckedOffer = (offer, pointOffers) => pointOffers.some((pointOffer) => pointOffer.id === offer.id);

export {
  NoWaypointsTextType,
  newWaypointTemplate,
  getTimeFromDate,
  getFullFormatDate,
  getDateDifference,
  isEmptyObject,
  humanizeWaypointDate,
  getRandomArrayElement,
  sortWaypointByDate,
  sortWaypointByDuration,
  sortWaypointByPrice,
  isCheckedOffer
};
