import { sortTypes } from '../utils/util-sort.js';

export default class SortModel {
  #sortings = sortTypes

  get sortings() {
    return this.#sortings;
  }
}
