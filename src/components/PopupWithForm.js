import Popup from './Popup.js';
import FormValidator from './FormValidator.js';

export default class PopupWithForm extends Popup {
  constructor(popupSelector, {handleFormSubmit, validationObject}) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._serverErrorVisibleClass = validationObject.serverErrorVisibleClass;
    this._formElement = this._popupElement.querySelector(validationObject.formSelector);
    this._inputList = Array.from(this._formElement.querySelectorAll(validationObject.inputSelector));
    this._submitButton = this._formElement.querySelector(validationObject.submitButtonSelector);
    this._serverError = this._formElement.querySelector(validationObject.serverErrorSelector);
    this._originalButtonText = this._submitButton.textContent;
    this._buttonUxText = `${this._submitButton.getAttribute('data-ux') || 'Сохранение'}...`;
    if (this._inputList.length) {
      this._formValidator = new FormValidator(validationObject, this._formElement);
      this._formValidator.enableValidation();
    } else
    this._handleEnter = (evt) => {
      if (evt.key === 'Enter') this._formElement.requestSubmit();
    };
  }

  setEventListeners() {
    super.setEventListeners();
    this._formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(this.getInputValues());
    });
  }

  getInputValues() {
    const inputValues = {};
    this._inputList.forEach(inputElement => {
      inputValues[inputElement.getAttribute("name")] = inputElement.value;
    });
    return inputValues;
  }

  setInputValues(data) {
    this._inputList.forEach(inputElement => {
      inputElement.value = data[inputElement.getAttribute("name")];
    });
  }

  _showServerError(err) {
    this._serverError.textContent = `${err.message}`;
    this._serverError.classList.add(this._serverErrorVisibleClass);
  }

  _hideServerError() {
    this._serverError.classList.remove(this._serverErrorVisibleClass);
  }

  open(origin) {
    if (this._formValidator) this._formValidator.resetValidation();
    super.open(origin);
    if (!this._inputList.length)
      window.addEventListener('keydown', this._handleEnter);
  }

  close(submitted = false) {
    super.close();
    if (submitted) this._formElement.reset();
    this._hideServerError();
    if (!this._inputList.length)
      window.removeEventListener('keydown', this._handleEnter);
  }

  wrapRequestInUX(requestPromise) {
    this._submitButton.textContent = this._buttonUxText;
    return requestPromise
      .then(
        result => { this.close(true); return result; },
        this._showServerError.bind(this)
      )
      .finally(() => this._submitButton.textContent = this._originalButtonText);
  }
}
