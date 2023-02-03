import { FilterType, UpdateType } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
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
    return [
      {
        type: FilterType.EVERYTHING,
        name:'everything',
        count: filter[FilterType.EVERYTHING](this.#waypointModel.humanizedWaypoints).length,
      },
      {
        type: FilterType.FUTURE,
        name:'future',
        count: filter[FilterType.FUTURE](this.#waypointModel.humanizedWaypoints).length,
      },
      {
        type: FilterType.PRESENT,
        name:'present',
        count: filter[FilterType.PRESENT](this.#waypointModel.humanizedWaypoints).length,
      },
      {
        type: FilterType.PAST,
        name:'past',
        count: filter[FilterType.PAST](this.#waypointModel.humanizedWaypoints).length,
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

  destroy() {
    remove(this.#filterComponent);
  }

  setFilter(filterType){
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if(this.#filterModel.filter === filterType){
      return;
    }
    this.setFilter(filterType);
  };
}
