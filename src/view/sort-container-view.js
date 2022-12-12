import { createElement } from '../render.js';
import { upperCaseFirst } from '../util.js';

const SORTINGS = {
  day: {
    isDisabled: false,
    isChecked: false
  },
  event: {
    isDisabled: true,
    isChecked: false
  },
  time: {
    isDisabled: false,
    isChecked: false
  },
  price: {
    isDisabled: false,
    isChecked: true
  },
  offer: {
    isDisabled: true,
    isChecked: false
  }
};
function createSortContainerTemplate() {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${Object.entries(SORTINGS).map(([name,state]) => `<div class="trip-sort__item  trip-sort__item--${name}">
            <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${state.isChecked ? 'checked' : ''} ${state.isDisabled ? 'disabled' : ''}>
            <label class="trip-sort__btn" for="sort-${name}">${upperCaseFirst(name)}</label>
            </div>`).join('')}
            <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`;
}
export default class SortContainerView {
  getTemplate() {
    return createSortContainerTemplate();
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
