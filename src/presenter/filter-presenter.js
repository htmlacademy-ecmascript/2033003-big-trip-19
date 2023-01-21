import { FilterType, UpdateType } from '../const.js';
import { remove, replace } from '../framework/render.js';
import { render } from '../render.js';
import { filter } from '../utils/util-filter.js';
import FilterContainerView from '../view/filter-container-view.js';

export default class FilterPresenter{
  #filterContainer = null;
  #filterModel = null;
  #waypointModel = null;
  #filterComponent = null;

  constructor({ filterContainer, filterModel, waypointModel}){
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#waypointModel = waypointModel;

    this.#waypointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters(){
    const waypoints = this.#waypointModel.humanizedWaypoints;

    return [
      {
        type: FilterType.EVERYTHING,
        name:'everything',
        count: filter[FilterType.EVERYTHING](waypoints).length,
      },
      {
        type: FilterType.FUTURE,
        name:'future',
        count: filter[FilterType.FUTURE](waypoints).length,
      },
      {
        type: FilterType.PRESENT,
        name:'present',
        count: filter[FilterType.PRESENT](waypoints).length,
      },
      {
        type: FilterType.PAST,
        name:'past',
        count: filter[FilterType.PAST](waypoints).length,
      },
    ];
  }

  init(){
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterContainerView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if(prevFilterComponent === null){
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if(this.#filterModel.filter === filterType){
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}