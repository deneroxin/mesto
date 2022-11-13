import Section from './Section.js';

export default class SectionWithCards extends Section {
  constructor(externalObject, containerSelector, emptyIndicatorClass) {
    super(externalObject, containerSelector);
    this._emptyIndicatorElement = this._container.querySelector(`.${emptyIndicatorClass}`);
    this._emptyIndicatorHiddenClass = `${emptyIndicatorClass}_hidden`;
  }

  _setEmptyIndicator() {
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
    super.addItem(element);
  }

  removeItem(element) {
    element.remove();
    this._setEmptyIndicator();
  }
}
