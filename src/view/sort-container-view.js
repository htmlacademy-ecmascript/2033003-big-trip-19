import { upperCaseFirst } from '../utils/common.js';
import AbstractView from '../framework/view/abstract-view.js';

const createSortContainerTemplate = (sortings) => (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${Object.entries(sortings).map(([name,state]) => `<div class="trip-sort__item  trip-sort__item--${name}">
            <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${state.isChecked ? 'checked' : ''} ${state.isDisabled ? 'disabled' : ''}>
            <label class="trip-sort__btn" for="sort-${name}">${upperCaseFirst(name)}</label>
            </div>`).join('')}
            <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`);
export default class SortContainerView extends AbstractView {
  #sortings = null;
  constructor({sortings}) {
    super();
    this.#sortings = sortings;
  }

  get template() {
    return createSortContainerTemplate(this.#sortings);
  }
}
