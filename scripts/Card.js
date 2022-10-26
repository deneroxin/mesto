import {noImage, setEmptyIndicator} from './index.js';
import {openPopupViewCard} from './index.js';
import {removeCardInstance} from './index.js'; //Функция, которую надо вызвать, чтобы удалить экземпляр объекта Card

export class Card {
  constructor(data, templateSelector) {
    this._templateSelector = templateSelector;
    this._name = data.name;
    this._link = data.link;
    this._isLiked = false;
  }

  getMyIndex() { return this._index; }

  setMyIndex(index) { this._index = index; }

  getName() { return this._name; }

  getLink() { return this._link; }

  _buildImageURL(link)  {
    return `url(${link}), url(${noImage})`;
  }

  createCardElement() {
    this._cardElement = document
      .querySelector(this._templateSelector).content
      .querySelector('.card').cloneNode(true);
    const image = this._cardElement.querySelector('.card__image')
    image.style.backgroundImage = this._buildImageURL(this._link);
    image.addEventListener('click', () => openPopupViewCard(this));
    this._cardElement.querySelector('.card__subscript').textContent = this._name;
    this._cardElement.querySelector('.card__remove-button')
      .addEventListener('click', evt => this._handleCardRemoveButtonClick(evt));
    this._cardElement.querySelector('.card__like-button')
      .addEventListener('click', evt => this._handleCardLikeButtonClick(evt));
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
    setEmptyIndicator();
    // Раз мы удалили карточку из DOM, зачем нам теперь экземпляр класса Card?
    removeCardInstance(this);
  }

  _handleCardLikeButtonClick(evt) {
    evt.target.classList.toggle('card__like-button_active');
    this._isLiked = !this._isLiked;
  }
}
