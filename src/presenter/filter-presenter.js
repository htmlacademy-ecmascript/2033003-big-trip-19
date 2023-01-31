import { FilterType, UpdateType } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
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
      },
      {
        type: FilterType.FUTURE,
        name:'future',
      },
      {
        type: FilterType.PRESENT,
        name:'present',
      },
      {
        type: FilterType.PAST,
        name:'past',
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

  #handleModelEvent = () => {
    this.init();
  };

  setFilter(filterType){
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  #handleFilterTypeChange = (filterType) => {
    if(this.#filterModel.filter === filterType){
      return;
    }
    this.setFilter(filterType);
  };
}
