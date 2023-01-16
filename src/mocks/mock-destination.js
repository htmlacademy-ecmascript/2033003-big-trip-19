import { DESCRIPTIONS, DESTINATION_NAMES, Integer } from '../const.js';
import { returnRandomInteger, getRandomArrayElement } from '../utils/util-waypoint.js';

const returnDescriptionWithoutDuplicate = (descriptions) => {
  const uniqueDescriptions = [...new Set(descriptions)];
  let descriptionString = '';
  for (let i = 0; i < Array.from(uniqueDescriptions).length; i++) {
    descriptionString += `${uniqueDescriptions[i]} `;
  }
  return descriptionString;
};

const getDescriptionsForDestination = () => {
  const { MIN_COUNT_DESCRIPRIONS, MAX_COUNT_DESCRIPRIONS } = Integer;
  const countDescriptions = returnRandomInteger(MAX_COUNT_DESCRIPRIONS, MIN_COUNT_DESCRIPRIONS);
  const descriptions = [];
  for (let i = 0; i < countDescriptions; i++) {
    descriptions.push(getRandomArrayElement(DESCRIPTIONS));
  }
  return descriptions;
};

const createDataDestination = (integer) => {
  const { MAX_RANDOM_IMAGE_INTEGER } = Integer;
  const destinationDescription = returnDescriptionWithoutDuplicate(getDescriptionsForDestination());
  return {
    id: integer,
    description: destinationDescription,
    name: DESTINATION_NAMES[integer],
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${returnRandomInteger(MAX_RANDOM_IMAGE_INTEGER)}`,
        description: 'Chamonix parliament building'
      }
    ]
  };
};
const createDataDestinations = (length) => Array.from({ length: length }, (_element, integer) =>
  createDataDestination(integer));

export { createDataDestinations };
