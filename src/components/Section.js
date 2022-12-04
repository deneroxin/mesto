export default class Section {
  constructor({renderer}, sectionSelector, containerSelector, emptyIndicatorClass) {
    this._renderer = renderer;
    const section = document.querySelector(sectionSelector);
    this._container = section.querySelector(containerSelector);
    this._emptyIndicatorElement = section.querySelector(`.${emptyIndicatorClass}`);
    this._emptyIndicatorHiddenClass = `${emptyIndicatorClass}_hidden`;
  }

  setEmptyIndicator() {
    if (this._container.children.length == 0) {
      this._emptyIndicatorElement.classList.remove(this._emptyIndicatorHiddenClass);
    }
  }

  _clearEmptyIndicator() {
    if (this._container.children.length == 0) {
      this._emptyIndicatorElement.classList.add(this._emptyIndicatorHiddenClass);
    }
  }

  addItem(element, isNew = true) {
    this._clearEmptyIndicator();
    if (isNew) this._container.prepend(element);
      else this._container.append(element);
  }

  renderItems(cards) {
    if (!cards) return;
    cards.forEach(card => {
      const element = this._renderer(card);
      this.addItem(element, false);
    });
    this.setEmptyIndicator();
  }
}
