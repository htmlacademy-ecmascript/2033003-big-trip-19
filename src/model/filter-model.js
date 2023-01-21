import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

const createFilter = (filter, humanizedWaypoints, filters) =>{
  const waypointsByFilterType = filters.find((filterElement) => filterElement.name === filter.name).waypoints(humanizedWaypoints.waypoints);
  return {
    name: filter.name,
    message: filter.message,
    waypoints: waypointsByFilterType,
    isDisabled: waypointsByFilterType.length < 1,
    isChecked: filter.isChecked
  };
};

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }

}
