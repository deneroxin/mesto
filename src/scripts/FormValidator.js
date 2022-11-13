export default class FormValidator {
  constructor(validationObject, formElement) {
    this._validationObject = validationObject;
    this._formElement = formElement;
    this._inputList = Array.from(formElement.querySelectorAll(validationObject.inputSelector));
    this._submitButton = formElement.querySelector(validationObject.submitButtonSelector);
  }

  _showInputError(inputElement) {
    const errorElement = this._formElement.querySelector(`.${inputElement.id}-error`);
    errorElement.textContent = inputElement.validationMessage;
    inputElement.classList.add(this._validationObject.inputErrorClass);
    errorElement.classList.add(this._validationObject.errorClass);
  }

  _hideInputError(inputElement) {
    const errorElement = this._formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(this._validationObject.inputErrorClass);
    errorElement.classList.remove(this._validationObject.errorClass);
    errorElement.textContent = '';
  }

  _activateSubmitButton() {
    this._submitButton.removeAttribute('disabled');
    this._submitButton.classList.remove(this._validationObject.inactiveButtonClass);
  }

  _deactivateSubmitButton() {
    this._submitButton.setAttribute('disabled', true);
    this._submitButton.classList.add(this._validationObject.inactiveButtonClass);
  }

  _isInputListValid() {
    return this._inputList.every(inputElement => inputElement.checkValidity());
  }

  _setSubmitButtonState() {
    if (this._isInputListValid()) {
      this._activateSubmitButton();
    } else {
      this._deactivateSubmitButton();
    }
  }

  _validateInput(inputElement) {
    if (inputElement.checkValidity()) {
      this._hideInputError(inputElement);
    } else {
      this._showInputError(inputElement);
    }
  }

  resetValidation() {
    this._inputList.forEach(inputElement => {
      if (inputElement.value === '') {
        this._hideInputError(inputElement);
      } else {
        this._validateInput(inputElement);
      }
    });
    this._setSubmitButtonState();
  }

  enableValidation() {
    this._inputList.forEach(inputElement =>
      inputElement.addEventListener('input', () => {
        this._validateInput(inputElement);
        this._setSubmitButtonState();
      })
    );
  }
}
