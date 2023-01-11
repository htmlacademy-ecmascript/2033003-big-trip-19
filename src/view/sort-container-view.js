import AbstractView from '../framework/view/abstract-view.js';

// ${state.isChecked ? 'checked' : ''} ${state.isDisabled ? 'disabled' : ''}
const createSortContainerTemplate = (sortings) => (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${Object.entries(sortings).map(([key, value]) => `<div class="trip-sort__item  trip-sort__item--${value}">
            <input data-sort-type="${value}" id="sort-${value}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${value}">
            <label class="trip-sort__btn" for="sort-${value}">${key}</label>
            </div>`).join('')}
            <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`);
export default class SortContainerView extends AbstractView {
  #sortings = null;
  #handleSortTypeChange = null;

  constructor({sortings, onSortTypeChange}) {
    super();
    this.#sortings = sortings;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortContainerTemplate(this.#sortings);
  }

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT'){
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
