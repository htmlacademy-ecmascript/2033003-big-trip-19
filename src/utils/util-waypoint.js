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

function returnRandomDate(minDate, maxDate) {
  return new Date(maxDate.getTime() + Math.random() * (minDate.getTime() - maxDate.getTime()));
}

const getTimeFromDate = (date) => {
  const withoutDate = dayjs(date).format(DateFormat.HOURS_AND_MINUTES);
  return withoutDate;
};
const getFullFormatDate = (date) => {
  const withoutDate = dayjs(date).format(DateFormat.FULL_DATE_AND_TIME);
  return withoutDate;
};
const getHumanizeTime = (diff) => {
  const humaniseTime = diff;
  return humaniseTime;
};

const PrependZeros = (str, len, seperator) => {
  if (typeof str === 'number' || Number(str)) {
    str = str.toString();
    return (len - str.length > 0) ? new Array(len + 1 - str.length).join('0') + str : str;
  }
  else {
    const spl = str.split(seperator || ' ');
    for (let i = 0 ; i < spl.length; i++) {
      if (Number(spl[i]) && spl[i].length < len) {
        spl[i] = PrependZeros(spl[i], len);
      }
    }
    return spl.join(seperator || ' ');
  }
};

const getDateDifference = (startDate, endDate) =>{
  const diff = Date.parse(endDate) - Date.parse(startDate);
  const days = Math.floor(diff / (1000 * 3600 * 24));
  const hours = Math.floor((diff / (1000 * 3600)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  let humaniseTime = '';
  if(days > 0){
    humaniseTime = `${PrependZeros(days,2)}D ${PrependZeros(hours,2)}H ${PrependZeros(minutes,2)}M`;
  }else if(days < 1 && hours > 0){
    humaniseTime = `${PrependZeros(hours,2)}H ${PrependZeros(minutes,2)}M`;
  }else{
    humaniseTime = `${PrependZeros(minutes,2)}M`;
  }
  return humaniseTime;
};

const isEmptyObject = (obj) => {
  if (Object.keys(obj).length === 0) {
    return true;
  }
  return false;
};

const humanizeWaypointDate = (date) => date ? dayjs(date).format(DateFormat.MONTH_AND_DATE) : date;

const getRandomArrayElement = (elements) => elements[Math.floor(Math.random() * elements.length)];
export {
  returnRandomBool,
  returnRandomInteger,
  addDays,
  returnRandomDate,
  getTimeFromDate,
  getFullFormatDate,
  getHumanizeTime,
  getDateDifference,
  isEmptyObject,
  humanizeWaypointDate,
  getRandomArrayElement
};
