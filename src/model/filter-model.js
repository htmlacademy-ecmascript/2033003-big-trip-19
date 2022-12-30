import { filters } from '../const.js';

export default class FilterModel {
  #filters = filters;

  get filters() {
    return this.#filters;
  }
}
