import dayjs from 'dayjs';
import { DATE_FORMAT, MAX_INTEGER_DATE, MAX_RANDOME_TIME_INTEGER, MIN_RANDOME_TIME_INTEGER } from './const.js';
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
function returnRandomDate(minDate, maxDate) {
  return new Date(maxDate.getTime() + Math.random() * (minDate.getTime() - maxDate.getTime()));
}
function addDays(date) {
  const result = new Date(date);
  result.setDate(result.getDate() + returnRandomInteger(MAX_INTEGER_DATE));
  result.setHours(result.getHours() + returnRandomInteger(MAX_RANDOME_TIME_INTEGER,MIN_RANDOME_TIME_INTEGER));
  result.setMinutes(result.getMinutes() + returnRandomInteger(MAX_RANDOME_TIME_INTEGER,MIN_RANDOME_TIME_INTEGER));
  return result;
}
const upperCaseFirst = (str) => {
  if (!str){
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};
const lowwerCaseFirst = (str) => {
  if (!str){
    return str;
  }
  return str[0].toLowerCase() + str.slice(1);
};
const getTimeFromDate = (date) => {
  const withoutDate = dayjs(date).format('HH:mm');
  return withoutDate;
};
const getHumanizeTime = (diff) => {
  const humanaseTime = diff;
  return humanaseTime;
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
  let humanaseTime = '';
  if(days > 0){
    humanaseTime = `${PrependZeros(days,2)}D ${PrependZeros(hours,2)}H ${PrependZeros(minutes,2)}M`;
  }else if(days < 1 && hours > 0){
    humanaseTime = `${PrependZeros(hours,2)}H ${PrependZeros(minutes,2)}M`;
  }else{
    humanaseTime = `${PrependZeros(minutes,2)}M`;
  }
  return humanaseTime;
};
const isEmptyObject = (obj) => {
  if (Object.keys(obj).length === 0) {
    return true;
  }
  return false;
};
const humanizeWaypointDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : date;
const getRandomArrayElement = (elements) => elements[Math.floor(Math.random() * elements.length)];

export {upperCaseFirst, getTimeFromDate, getDateDifference, humanizeWaypointDate, getRandomArrayElement,returnRandomInteger,getHumanizeTime,returnRandomDate,addDays,returnRandomBool,lowwerCaseFirst,isEmptyObject};
