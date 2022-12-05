export default class Card {
  static _MyID;

  constructor(data, templateSelector, callbacks, fallbackImage) {
    this._cardTemplate =
      document.querySelector(templateSelector)
      .content.querySelector('.card');
    this._data = data;
    this._callbacks = callbacks;
    this._fallbackImage = fallbackImage;
  }

  static keepMyID(id) {
    Card._myID = id;
  }

  getCardID() {
    return this._data._id;
  }

  getLikeStatus() {
    return this._isLiked;
  }

  updateLikeStatus(updatedLikes) {
    if (updatedLikes) this._data.likes = updatedLikes;
    this._numLikesElement.textContent = this._data.likes.length;
    this._isLiked = this._data.likes.some(user => user._id == Card._myID);
    if (this._isLiked) {
      this._likeButtonElement.classList.add('card__like-button_active');
    } else {
      this._likeButtonElement.classList.remove('card__like-button_active');
    }
  }

  _buildImageURL(link)  {
    return `url(${link}), url(${this._fallbackImage})`;
  }

  _addEventListeners(imageElement, removeButtonElement) {
    imageElement.addEventListener('click', () =>
      this._callbacks.handleCardClick(this._data));
    this._cardElement.querySelector('.card__subscript').textContent = this._data.name;
    removeButtonElement.addEventListener('click',
      this._callbacks.handleCardRemove.bind(this));
    this._likeButtonElement.addEventListener('click',
      this._callbacks.handleCardLike.bind(this));
  }

  createCardElement() {
    this._cardElement = this._cardTemplate.cloneNode(true);
    const imageElement = this._cardElement.querySelector('.card__image');
    imageElement.style.backgroundImage = this._buildImageURL(this._data.link);
    this._numLikesElement = this._cardElement.querySelector('.card__num-likes');
    this._likeButtonElement = this._cardElement.querySelector('.card__like-button');
    const removeButtonElement = this._cardElement.querySelector('.card__remove-button');
    if (this._data.owner._id == Card._myID)
      removeButtonElement.classList.add('card__remove-button_visible');
    this.updateLikeStatus();
    this._addEventListeners(imageElement, removeButtonElement);
    return this._cardElement;
  }

  removeCardElement() {
    this._cardElement.classList.add('card_removed');
    const style = window.getComputedStyle(this._cardElement);
    const transDur = style.getPropertyValue('transition-duration');
    const durSec = Number(transDur.slice(0, transDur.indexOf('s')));
    setTimeout(() => {
      this._cardElement.remove();
      this._callbacks.setEmptyIndicator();
      this._cardElement = null;
    }, durSec * 1000);
  }
}
