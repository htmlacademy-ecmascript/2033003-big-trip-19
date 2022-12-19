import {createElement} from '../render.js';
import { upperCaseFirst } from '../util.js';

function createFilterContainerTemplate(filters) {
  return `<form class="trip-filters" action="#" method="get">
          ${Object.entries(filters).map(([name,isChecked]) => `<div class="trip-filters__filter">
          <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-${name}">${upperCaseFirst(name)}</label>
          </div>`).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
}

export default class FilterContainerView {
  constructor({filters}) {
    this.filters = filters;
  }

  getTemplate() {
    return createFilterContainerTemplate(this.filters);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
