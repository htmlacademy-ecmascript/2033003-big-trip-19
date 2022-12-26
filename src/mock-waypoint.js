import { MAX_BASE_PRICE, MAX_COUNT_OBJECTS, MAX_DATE, MAX_INTEGER_DATE, MIN_BASE_PRICE, MIN_DATE, MIN_LENGTH_ARRAY_ID_OFFERS, OFFERS, POINT_TYPES} from './const';
import { addDays, getRandomArrayElement, returnRandomBool, returnRandomDate, returnRandomInteger } from './util.js';

const lengthArrayPointType = (type) => {
  const pointTypes = OFFERS.find((pointType) => pointType.type === type);
  return pointTypes.offers.length;
};
const generateArrayIdOffers = (length, max, min) => (
  [...new Array(length)]
    .map(() => Math.round(Math.floor(Math.random() * (max - min + 1)) + min))
);
const getUniqIdOffers = (offersIds) => {
  const newSet = new Set(offersIds);
  return Array.from(newSet);
};
const createDataPoint = (integer, maxRandomDate, minRandomDate, maxIntegerDate, pointType, destinations) =>{
  const dateFrom = returnRandomDate(minRandomDate, maxRandomDate);
  const destinationElement = getRandomArrayElement(destinations);
  const arrayOffersByTypeLength = lengthArrayPointType(pointType);
  const randomeOffersIds = getUniqIdOffers(generateArrayIdOffers(arrayOffersByTypeLength,arrayOffersByTypeLength,MIN_LENGTH_ARRAY_ID_OFFERS));
  const dateTo = addDays(dateFrom,returnRandomInteger(maxIntegerDate)).toISOString();
  return{
    basePrice:returnRandomInteger(MIN_BASE_PRICE,MAX_BASE_PRICE),
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination: destinationElement.id,
    id: String(integer),
    isFavorite: returnRandomBool(),
    offers: randomeOffersIds,
    type: pointType,
  };
};
const createDataPoints = (destinations)=> Array.from({ length: MAX_COUNT_OBJECTS }, (_element,integer) =>
  createDataPoint(integer + 1, MAX_DATE, MIN_DATE,MAX_INTEGER_DATE, getRandomArrayElement(POINT_TYPES), destinations));

export {createDataPoints};
