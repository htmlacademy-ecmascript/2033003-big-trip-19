import {createElement} from '../render.js';
import { upperCaseFirst } from '../util.js';

const FILTERS = {
  everything:{
    isChecked: false
  },
  future:{
    isChecked: false
  },
  present:{
    isChecked: false
  },
  past:{
    isChecked: false
  },
};

function createFilterContainerTemplate() {
  return `<form class="trip-filters" action="#" method="get">
          ${Object.entries(FILTERS).map(([name,isChecked]) => `<div class="trip-filters__filter">
          <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-${name}">${upperCaseFirst(name)}</label>
          </div>`).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
}

export default class FilterContainerView {
  getTemplate() {
    return createFilterContainerTemplate();
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
