import Popup from './Popup.js';

export default class PopupWithImage extends Popup {
  constructor(popupSelector, imageSelector, subscriptSelector) {
    super(popupSelector);
    this._imageElement = this._popupElement.querySelector(imageSelector);
    this._subscriptElement = this._popupElement.querySelector(subscriptSelector);
  }

  open({link, name}) {
    this._imageElement.src = link;
    this._imageElement.alt = name;
    this._subscriptElement.textContent = name;
    super.open();
  }
}
