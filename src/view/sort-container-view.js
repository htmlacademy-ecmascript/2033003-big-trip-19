import AbstractView from '../framework/view/abstract-view.js';
import { upperCaseFirst } from '../utils/common.js';

// ${state.isChecked ? 'checked' : ''} ${state.isDisabled ? 'disabled' : ''}
const createSortContainerTemplate = (sortings, selectedType) => (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${sortings.map((sorting) => `<div class="trip-sort__item  trip-sort__item--${sorting.name}">
            <input data-sort-type="${sorting.name}" id="sort-${sorting.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sorting.name}" ${sorting.name === selectedType ? 'checked' : ''} ${sorting.isDisabled ? 'disabled' : ''}>
            <label class="trip-sort__btn" for="sort-${sorting.name}">${upperCaseFirst(sorting.name)}</label>
            </div>`).join('')}
            <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`);
export default class SortContainerView extends AbstractView {
  #sortings = null;
  #handleSortTypeChange = null;
  #selectedSortType = null;

  constructor({sortings, selectedSortType, onSortTypeChange}) {
    super();
    this.#sortings = sortings;
    this.#selectedSortType = selectedSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortContainerTemplate(this.#sortings, this.#selectedSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT'){
      return;
    }
    evt.preventDefault();
    const sorting = this.#sortings.find((sortingElement) => sortingElement.name === evt.target.dataset.sortType);
    this.#handleSortTypeChange(evt.target.dataset.sortType, {...sorting, isChecked: !sorting.isChecked});
  };
}
