import { upperCaseFirst } from '../util.js';
import AbstractView from '../framework/view/abstract-view.js';

function createFilterContainerTemplate(filters) {
  return `<form class="trip-filters" action="#" method="get">
          ${filters.map((filter) => `<div class="trip-filters__filter">
          <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${filter.isChecked ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-${filter.name}">${upperCaseFirst(filter.name)}</label>
          </div>`).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
}

export default class FilterContainerView extends AbstractView {
  #filters = null;
  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterContainerTemplate(this.#filters);
  }
}
