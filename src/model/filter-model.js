import { filterTypes } from '../mocks/mock-filter.js';

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

export default class FilterModel {
  #filters = filterTypes;
  #humanizedWaypoints = null;
  constructor(humanizedWaypoints) {
    this.#humanizedWaypoints = humanizedWaypoints;
  }

  get filters() {
    return this.#filters;
  }

  get humanizedFilters() {
    const humanisedDataFilters = [];
    for(const filter of this.#filters){
      const humanizedFilter = createFilter(filter,this.#humanizedWaypoints, this.#filters);
      humanisedDataFilters.push(humanizedFilter);
    }
    return humanisedDataFilters;
  }
}
