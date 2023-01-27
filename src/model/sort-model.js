import { nanoid } from 'nanoid';
import { sortTypes } from '../mocks/mock-sort.js';

const createSorting = (sorting) =>({
  id: nanoid(),
  ...{
    name: sorting.name,
    isChecked: false,
    isDisabled: sorting.waypoints === undefined,
    waypoints: sorting.waypoints
  }
});

export default class SortModel {
  #sortings = sortTypes;

  get sortings() {
    return this.#sortings;
  }

  get humanizedSortings() {
    const humanisedDataSortings = [];
    for(const sorting of this.#sortings){
      const humanizedSorting = createSorting(sorting);
      humanisedDataSortings.push(humanizedSorting);
    }
    return humanisedDataSortings;
  }
}
