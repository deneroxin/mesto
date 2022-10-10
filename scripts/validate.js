function showInputError(formElement, inputElement, validationObject) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  errorElement.textContent = inputElement.validationMessage;
  inputElement.classList.add(validationObject.inputErrorClass);
  errorElement.classList.add(validationObject.errorClass);
}

function hideInputError(formElement, inputElement, validationObject) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationObject.inputErrorClass);
  errorElement.classList.remove(validationObject.errorClass);
  errorElement.textContent = '';
}

function activateSubmitButton(submitButton, validationObject) {
  submitButton.removeAttribute('disabled');
  submitButton.classList.remove(validationObject.inactiveButtonClass);
}

function deactivateSubmitButton(submitButton, validationObject) {
  submitButton.setAttribute('disabled', true);
  submitButton.classList.add(validationObject.inactiveButtonClass);
}

function isInputListValid(inputList) {
  return inputList.every(inputElement => inputElement.checkValidity());
}

export function validateSubmitButton(inputList, submitButton, validationObject) {
  if (isInputListValid(inputList)) {
    activateSubmitButton(submitButton, validationObject);
  } else {
    deactivateSubmitButton(submitButton, validationObject);
  }
}

function validateInput(formElement, inputElement, validationObject) {
  if (inputElement.checkValidity()) {
    hideInputError(formElement, inputElement, validationObject);
  } else {
    showInputError(formElement, inputElement, validationObject);
  }
}

export function validateAllInputs(formElement, inputList, validationObject) {
  inputList.forEach(inputElement => validateInput(formElement, inputElement, validationObject));
}

function enableFormValidation(formElement, validationObject) {
  const inputList = Array.from(formElement.querySelectorAll(validationObject.inputSelector));
  const submitButton = formElement.querySelector(validationObject.submitButtonSelector);
  inputList.forEach(inputElement => inputElement.addEventListener('input', () => {
    validateInput(formElement, inputElement, validationObject);
    validateSubmitButton(inputList, submitButton, validationObject);
  }));
}

export function enableValidation(validationObject) {
  const formList = Array.from(document.querySelectorAll(validationObject.formSelector));
  formList.forEach(formElement => enableFormValidation(formElement, validationObject));
}
