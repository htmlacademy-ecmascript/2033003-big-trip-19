import { DESCRIPTIONS, DESTINATION_NAMES, MAX_COUNT_DESCRIPRIONS, MAX_COUNT_OBJECTS, MAX_RANDOM_IMAGE_INTEGER, MIN_COUNT_DESCRIPRIONS } from './const.js';
import { getRandomArrayElement, returnRandomInteger } from './util';

const returnDescriptionWithoutDuplicate = (descriptions) => {
  const uniqueDescriptions = [...new Set(descriptions)];
  let descriptionString = '';
  for(let i = 0; i < Array.from(uniqueDescriptions).length; i++){
    descriptionString += `${uniqueDescriptions[i]} `;
  }
  return descriptionString;
};

const getDescriptionsForDestination = () =>{
  const countDescriptions = returnRandomInteger(MAX_COUNT_DESCRIPRIONS,MIN_COUNT_DESCRIPRIONS);
  const descriptions = [];
  for(let i = 0; i < countDescriptions; i++){
    descriptions.push(getRandomArrayElement(DESCRIPTIONS));
  }
  return descriptions;
};

const createDataDestination = (integer) =>{
  const destinationName = getRandomArrayElement(DESTINATION_NAMES);
  const destinationDescription = returnDescriptionWithoutDuplicate(getDescriptionsForDestination());
  return {
    id: integer,
    description: destinationDescription,
    name: destinationName,
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${returnRandomInteger(MAX_RANDOM_IMAGE_INTEGER)}`,
        description: 'Chamonix parliament building'
      }
    ]
  };
};
const createDataDestinations = ()=> Array.from({ length: MAX_COUNT_OBJECTS }, (_element,integer) =>
  createDataDestination(integer + 1));

export{createDataDestinations};
