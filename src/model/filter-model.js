import { FILTERS } from '../const.js';

export default class FilterModel {
  #filters = FILTERS;

  get filters() {
    return this.#filters;
  }
}
