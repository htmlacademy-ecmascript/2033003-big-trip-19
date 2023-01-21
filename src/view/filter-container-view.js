import AbstractView from '../framework/view/abstract-view.js';
import { upperCaseFirst } from '../utils/common.js';

function createFilterContainerTemplate(filters) {
  return `<form class="trip-filters" action="#" method="get">
          ${filters.map((filter) => `<div class="trip-filters__filter">
          <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${filter.isChecked ? 'checked' : ''} ${filter.isDisabled ? 'disabled' : ''}>
          <label class="trip-filters__filter-label" for="filter-${filter.name}">${upperCaseFirst(filter.name)}</label>
          </div>`).join('')}
          
          </form>`;
}
const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<div class="trip-filters__filter">
          <input id="filter-${type}" 
          class="trip-filters__filter-input  visually-hidden" 
          type="radio" 
          name="trip-filter" 
          value="${type}" 
          ${type === currentFilterType ? 'checked' : ''}
          ${count === 0 ? 'disabled' : ''}>
          <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
          </div>`
  );
}
const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType))
  .join('');
  return (`<form class="trip-filters" action="#" method="get">
  ${filterItemsTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`);
};
export default class FilterContainerView extends AbstractView {
  #filters = null;
  #currenFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currenFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currenFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

}
