import PopupSendingRequest from './PopupSendingRequest.js';

export default class PopupConfirmation extends PopupSendingRequest {
  constructor(popupSelector, confirmButtonSelector, {handleConfirm, serverErrorSelectors}) {
    super(popupSelector, confirmButtonSelector, serverErrorSelectors);
    this._handleConfirm = handleConfirm;
    this._confirmButtonElement = this._popupElement.querySelector(confirmButtonSelector);
    this._handleKeypress = (evt) => {
      if (evt.key == 'Enter') this._handleConfirm();
    }
  }

  setEventListeners() {
    super.setEventListeners();
    this._confirmButtonElement.addEventListener('click', this._handleConfirm);
  }

  open(origin) {
    super.open();
    this._origin = origin;
    window.addEventListener('keydown', this._handleKeypress);
  }

  getOrigin() {
    return this._origin;
  }

  close() {
    super.close();
    window.removeEventListener('keydown', this._handleKeypress);
  }
}
