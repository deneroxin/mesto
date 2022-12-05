import PopupSendingRequest from './PopupSendingRequest.js';

export default class PopupWithForm extends PopupSendingRequest {
  constructor(popupSelector, {handleFormSubmit, formSelectors}) {
    super(popupSelector, formSelectors.submitButtonSelector, formSelectors);
    this._handleFormSubmit = handleFormSubmit;
    this._formElement = this._popupElement.querySelector(formSelectors.formSelector);
    this._inputList = Array.from(this._formElement.querySelectorAll(formSelectors.inputSelector));
    this._submitButton = this._formElement.querySelector(formSelectors.submitButtonSelector);
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

  close(submitted = false) {
    super.close();
    if (submitted) this._formElement.reset();
  }
}
