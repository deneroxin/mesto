export default class Section {
  constructor({items, renderer}, containerSelector, emptyIndicatorClass) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
    this._emptyIndicatorElement = this._container.querySelector(`.${emptyIndicatorClass}`);
    this._emptyIndicatorHiddenClass = `${emptyIndicatorClass}_hidden`;
  }

  setEmptyIndicator() {
    if (this._container.children.length == 1) {
      this._emptyIndicatorElement.classList.remove(this._emptyIndicatorHiddenClass);
    }
  }

  _clearEmptyIndicator() {
    if (this._container.children.length == 1) {
      this._emptyIndicatorElement.classList.add(this._emptyIndicatorHiddenClass);
    }
  }

  addItem(element) {
    this._clearEmptyIndicator();
    this._container.prepend(element);
  }

  renderItems() {
    this._items.forEach(item => {
      const element = this._renderer(item);
      this.addItem(element);
    });
  }
}
