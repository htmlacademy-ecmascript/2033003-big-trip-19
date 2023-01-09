import AbstractView from '../framework/view/abstract-view.js';

const createContentTemplate = () => '<ul class="trip-events__list"></ul>';
export default class ContentView extends AbstractView{
  get template() {
    return createContentTemplate();
  }
}
