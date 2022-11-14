import Popup from './Popup.js';

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit, { formSelector, inputSelector }) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit.bind(this);
    this._formElement = this._popupElement.querySelector(formSelector);
    this._inputList = Array.from(this._formElement.querySelectorAll(inputSelector));
  }

  setEventListeners() {
    super.setEventListeners();
    this._formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }

  _getInputValues() {
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
