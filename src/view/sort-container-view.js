import AbstractView from '../framework/view/abstract-view.js';
import { upperCaseFirst } from '../utils/common.js';

// ${state.isChecked ? 'checked' : ''} ${state.isDisabled ? 'disabled' : ''}
const createSortContainerTemplate = (sortings, selectedType) => (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${Object.entries(sortings).map((sorting) => `<div class="trip-sort__item  trip-sort__item--${sorting[1].name}">
            <input data-sort-type="${sorting[1].name}" id="sort-${sorting[1].name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sorting[1].name}" ${sorting[1].name === selectedType ? 'checked' : ''} ${sorting[1].isDisabled ? 'disabled' : ''}>
            <label class="trip-sort__btn" for="sort-${sorting[1].name}">${sorting[1].name}</label>
            </div>`).join('')}
            <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`);
export default class SortContainerView extends AbstractView {
  #handleSortTypeChange = null;
  #selectedSortType = null;
  #sortTypes =null;

  constructor({sortTypes, selectedSortType, onSortTypeChange}) {
    super();
    this.#sortTypes = sortTypes;
    this.#selectedSortType = selectedSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortContainerTemplate(this.#sortTypes, this.#selectedSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT'){
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
