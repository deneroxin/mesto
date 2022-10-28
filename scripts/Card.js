export class Card {
  constructor(data, templateSelector, externalObjects) {
    this._templateSelector = templateSelector;
    this._data = data;
    this._isLiked = false;
    this._external = externalObjects;
  }

  _buildImageURL(link)  {
    return `url(${link}), url(${this._external.noImage})`;
  }

  _addEventListeners(image) {
    image.addEventListener('click', () => this._external.handleCardClick(this._data));
    this._cardElement.querySelector('.card__subscript').textContent = this._data.name;
    this._cardElement.querySelector('.card__remove-button')
      .addEventListener('click', evt => this._handleCardRemoveButtonClick(evt));
    this._cardElement.querySelector('.card__like-button')
      .addEventListener('click', evt => this._handleCardLikeButtonClick(evt));
  }

  createCardElement() {
    this._cardElement = document
      .querySelector(this._templateSelector).content
      .querySelector('.card').cloneNode(true);
    const image = this._cardElement.querySelector('.card__image')
    image.style.backgroundImage = this._buildImageURL(this._data.link);
    this._addEventListeners(image);
    return this._cardElement;
  }

  _handleCardRemoveButtonClick(evt) {
    evt.stopPropagation();
    this._cardElement.classList.add('card_removed');
    const style = window.getComputedStyle(this._cardElement);
    const transDur = style.getPropertyValue('transition-duration');
    const durSec = Number(transDur.slice(0, transDur.indexOf('s')));
    setTimeout(() => this._removeCardCompletely(), durSec * 1000);
    // this._cardElement.addEventListener('transitionend', () => this._removeCardCompletely(), {once: true});
    //Метод с 'transitionend' работает плохо: событие иногда наступает раньше, чем положено,
    //и тогда карточка удаляется резко, не успев отыграть анимацию. Непонятно, почему: длина всех анимаций 0.5s
  }

  _removeCardCompletely() {
    this._cardElement.remove();
    this._cardElement = null;
    this._external.setEmptyIndicator();
  }

  _handleCardLikeButtonClick(evt) {
    evt.target.classList.toggle('card__like-button_active');
    this._isLiked = !this._isLiked;
  }
}
