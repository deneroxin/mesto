import PopupSendingRequest from './PopupSendingRequest.js';
import FormValidator from './FormValidator.js';

export default class PopupWithForm extends PopupSendingRequest {
  constructor(popupSelector, {handleFormSubmit, validationObject}) {
    super(popupSelector, validationObject.submitButtonSelector, validationObject);
    this._handleFormSubmit = handleFormSubmit;
    this._formElement = this._popupElement.querySelector(validationObject.formSelector);
    this._inputList = Array.from(this._formElement.querySelectorAll(validationObject.inputSelector));
    this._submitButton = this._formElement.querySelector(validationObject.submitButtonSelector);
    this._formValidator = new FormValidator(validationObject, this._formElement);
    this._formValidator.enableValidation();
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

  open() {
    if (this._formValidator) this._formValidator.resetValidation();
    super.open();
  }

  close(submitted = false) {
    super.close();
    if (submitted) this._formElement.reset();
  }
}
