function showInputError(formElement, inputElement) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  errorElement.textContent = inputElement.validationMessage;
  inputElement.classList.add(formElement.classes.inputErrorClass);
  errorElement.classList.add(formElement.classes.errorClass);
}

function hideInputError(formElement, inputElement) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(formElement.classes.inputErrorClass);
  errorElement.classList.remove(formElement.classes.errorClass);
  errorElement.textContent = '';
}

function isFormValid(formElement) {
  return formElement.inputList.every(inputElement => inputElement.validity.valid);
}

function validateSubmitButton(formElement) {
  if (isFormValid(formElement)) {
    formElement.submitButton.removeAttribute('disabled');
    formElement.submitButton.classList.remove(formElement.classes.inactiveButtonClass)
  } else {
    formElement.submitButton.setAttribute('disabled', true);
    formElement.submitButton.classList.add(formElement.classes.inactiveButtonClass);
  }
}

function validateInput(formElement, inputElement, updateSubmitButtonState = true) {
  if (inputElement.validity.valid) {
    hideInputError(formElement, inputElement);
  } else {
    showInputError(formElement, inputElement);
  }
  if (updateSubmitButtonState) validateSubmitButton(formElement);
}

function validateAllInputs(formElement) {
  formElement.inputList.forEach(inputElement => validateInput(formElement, inputElement, false));
  validateSubmitButton(formElement);
}

function enableFormValidation(formElement, classes) {
  formElement.classes = classes;
  formElement.inputList = Array.from(formElement.querySelectorAll(classes.inputSelector));
  formElement.submitButton = formElement.querySelector(classes.submitButtonSelector);
  formElement.inputList.forEach(inputElement => inputElement.addEventListener(
    'input', () => validateInput(formElement, inputElement)
  ))
}

function enableValidation(classes) {
  const formList = Array.from(document.querySelectorAll(classes.formSelector));
  formList.forEach(formElement => enableFormValidation(formElement, classes));
}
