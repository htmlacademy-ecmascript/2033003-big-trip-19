import { DateFormat, Integer } from '../const.js';
import dayjs from 'dayjs';

const returnRandomBool = (() => {
  const a = new Uint8Array(1);
  return function() {
    crypto.getRandomValues(a);
    return a[0] > 127;
  };
})();

const returnRandomInteger = (max, min = 0) => {
  if (min < 0 || max < 0 || typeof min !== 'number' || typeof max !== 'number')
  {
    return NaN;
  }
  if (max < min)
  {
    [min, max] = [max, min];
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function addDays(date) {
  const {MIN_RANDOME_HOUR, MAX_RANDOME_HOUR, MAX_INTEGER_DATE_DURATION} = Integer;
  const result = new Date(date);
  result.setDate(result.getDate() + returnRandomInteger(MAX_INTEGER_DATE_DURATION));
  result.setHours(result.getHours() + returnRandomInteger(MAX_RANDOME_HOUR, MIN_RANDOME_HOUR));
  result.setMinutes(result.getMinutes() + returnRandomInteger(MAX_RANDOME_HOUR, MIN_RANDOME_HOUR));
  return result;
}

function returnRandomDate(start, end) {
  let timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(timestamp);
}

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
  if (!waypointA.dateFrom && !waypointB.dateFrom) {return 0};
  if (!waypointA.dateFrom) {return 1};
  if (!waypointB.dateFrom) {return -1};
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

export {
  returnRandomBool,
  returnRandomInteger,
  addDays,
  returnRandomDate,
  getTimeFromDate,
  getFullFormatDate,
  getDateDifference,
  isEmptyObject,
  humanizeWaypointDate,
  getRandomArrayElement,
  sortWaypointByDate,
  sortWaypointByDuration,
  sortWaypointByPrice
};
