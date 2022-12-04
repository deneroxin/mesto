import Popup from './Popup.js';

export default class PopupSendingRequest extends Popup {
  constructor(popupSelector, viewStatusElementSelector, {serverErrorSelector, serverErrorVisibleClass}) {
    super(popupSelector);
    this._viewStatusElement = this._popupElement.querySelector(viewStatusElementSelector);
    this._originalTextContent = this._viewStatusElement.textContent;
    this._defaultStatusText = `${this._viewStatusElement.getAttribute('data-ux') || 'Сохранение'}...`;
    this._serverError = this._popupElement.querySelector(serverErrorSelector);
    this._serverErrorVisibleClass = serverErrorVisibleClass;
  }

  showServerError(err) {
    this._serverError.textContent = `${err.message}`;
    this._serverError.classList.add(this._serverErrorVisibleClass);
  }

  _hideServerError() {
    this._serverError.classList.remove(this._serverErrorVisibleClass);
  }

  showRequestStatusText(text = this._defaultStatusText) {
    this._viewStatusElement.textContent = text;
  }

  restoreOriginalText() {
    this._viewStatusElement.textContent = this._originalTextContent;
  }

  close() {
    super.close();
    this._hideServerError();
  }
}
