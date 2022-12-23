import { createDataDestinations } from '../mock-destination.js';
import { getRandomArrayElement } from '../util.js';

export default class DestinationModel{
  #destinations = createDataDestinations();

  getRandomeDestination(){
    return getRandomArrayElement(this.#destinations);
  }

  get destinations(){
    return this.#destinations;
  }
}
