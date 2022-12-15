import dayjs from 'dayjs';

const upperCaseFirst = (str) => {
  if (!str){
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};
const getTimeFromDate = (date) => date.split('T').pop();
const getDateDifference = (startDate, endDate) =>{
  const date1 = dayjs(startDate);
  const date2 = dayjs(endDate);
  return date2.diff(date1, 'minute');
};
const DATE_FORMAT = 'MMM DD';
const humanizeWaypointDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : date;
const getRandomArrayElement = (elements) => elements[Math.floor(Math.random() * elements.length)];

export {upperCaseFirst, getTimeFromDate, getDateDifference, humanizeWaypointDate, getRandomArrayElement};
