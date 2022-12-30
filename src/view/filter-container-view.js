import {createElement} from '../render.js';
import { upperCaseFirst } from '../util.js';

function createFilterContainerTemplate(filters) {
  return `<form class="trip-filters" action="#" method="get">
          ${filters.map((filter) => `<div class="trip-filters__filter">
          <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${filter.isChecked ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-${filter.name}">${upperCaseFirst(filter.name)}</label>
          </div>`).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
}

export default class FilterContainerView {
  #element = null;
  #filters = null;
  constructor({filters}) {
    this.#filters = filters;
  }

  get template() {
    return createFilterContainerTemplate(this.#filters);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
