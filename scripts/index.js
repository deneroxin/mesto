import {initialCards} from './initialCards.js';
import {Card} from './Card.js';
import {FormValidator} from './FormValidator.js';

const validationObject = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input-box',
  submitButtonSelector: '.popup__save-button',
  inactiveButtonClass: 'popup__save-button_disabled',
  inputErrorClass: 'popup__input-box_error',
  errorClass: 'popup__error_visible'
};

const objectsForCard = {
  handleCardClick,
  setEmptyIndicator,
  noImage: '../blocks/elements/__empty-indicator/elements__empty-indicator.jpg'
}

const profileSection = document.querySelector('.profile');
const elements = document.querySelector('.elements');
const popupEditProfile = document.querySelector('.popup_type_edit-profile');
const popupAddCard = document.querySelector('.popup_type_add-card');
const popupViewCard = document.querySelector('.popup_type_view-card');
const popupOverlays = document.querySelectorAll('.popup');
const profileEditButton = profileSection.querySelector('.profile__edit-button');
const profileAddButton = profileSection.querySelector('.profile__add-button');
const elementsCards = elements.querySelector('.elements__cards');
const elementEmptyIndicator = elements.querySelector('.elements__empty-indicator');
const profileName = profileSection.querySelector('.profile__name');
const profileAbout = profileSection.querySelector('.profile__about');
const popupEditProfileForm = popupEditProfile.querySelector('.popup__form');
const popupAddCardForm = popupAddCard.querySelector('.popup__form');
const popupEditProfileInputName = popupEditProfileForm.querySelector('.popup__input-box_content_name');
const popupEditProfileInputAbout = popupEditProfileForm.querySelector('.popup__input-box_content_about');
const popupAddCardInputName = popupAddCardForm.querySelector('.popup__input-box_content_name');
const popupAddCardInputLink = popupAddCardForm.querySelector('.popup__input-box_content_link');
const popupViewCardImage = popupViewCard.querySelector('.popup__image');
const popupViewCardSubscript = popupViewCard.querySelector('.popup__subscript');
const formValidators = {};

let mousePushedOnOverlay = false;


function setEmptyIndicator() {
  if (!elementsCards.children.length) {
    elementsCards.empty = true;
    elementEmptyIndicator.classList.remove('elements__empty-indicator_hidden');
  }
}

function clearEmptyIndicator() {
  if (elementsCards.empty) {
    elementEmptyIndicator.classList.add('elements__empty-indicator_hidden');
    elementsCards.empty = false;
  }
}

function createCard(data) {
  return new Card(data, 'template.card-template', objectsForCard);
}

function renderCard(data) {
  clearEmptyIndicator();
  const card = createCard(data);
  elementsCards.prepend(card.createCardElement());
}

function initializeCards() {
  initialCards.forEach(renderCard);
}

function handleProfileEditButtonClick() {
  popupEditProfileInputName.value = profileName.textContent;
  popupEditProfileInputAbout.value = profileAbout.textContent;
  formValidators['edit-profile'].resetValidation();
  openPopup(popupEditProfile);
}

function handleProfileAddButtonClick() {
  const validator = formValidators['add-card'];
  if (validator.submitted) {
    popupAddCardForm.reset();
    validator.submitted = false;
  }
  validator.resetValidation();
  openPopup(popupAddCard);
}

function handleCardClick(cardData) {
  popupViewCardImage.src = cardData.link;
  popupViewCardImage.alt = cardData.name;
  popupViewCardSubscript.textContent = cardData.name;
  openPopup(popupViewCard);
}

function handlePopupEditProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = popupEditProfileInputName.value;
  profileAbout.textContent = popupEditProfileInputAbout.value;
  closePopup(popupEditProfile);
}

function handlePopupAddCardFormSubmit(evt) {
  evt.preventDefault();
  renderCard({name: popupAddCardInputName.value, link: popupAddCardInputLink.value});
  formValidators['add-card'].submitted = true;
  closePopup(popupAddCard);
}

function closeByEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_opened');
    closePopup(openedPopup);
  }
}

function openPopup(element) {
  element.classList.add('popup_opened');
  window.addEventListener('keydown', closeByEscape);
}

function closePopup(element) {
  window.removeEventListener('keydown', closeByEscape);
  element.classList.remove('popup_opened');
}

//Хочется всё же, чтобы окно закрывалось только после отпускания кнопки, не сразу по mouseDown.
function handlePopupOverlayMouseDown(evt) {
  if (evt.target.classList.contains('popup-close')) mousePushedOnOverlay = true;
}

function handlePopupOverlayMouseUp(evt) {
  if (evt.target.classList.contains('popup-close') && mousePushedOnOverlay) {
    closePopup(evt.currentTarget);
  }
  mousePushedOnOverlay = false;
}

function enableValidation(validationObject) {
  const formList = Array.from(document.querySelectorAll(validationObject.formSelector));
  formList.forEach(formElement => {
    const name = formElement.getAttribute('name');
    const validator = new FormValidator(validationObject, formElement);
    formValidators[name] = validator;
    validator.enableValidation();
  });
}

initializeCards();
profileEditButton.addEventListener('click', handleProfileEditButtonClick);
profileAddButton.addEventListener('click', handleProfileAddButtonClick);
popupEditProfileForm.addEventListener('submit', handlePopupEditProfileFormSubmit);
popupAddCardForm.addEventListener('submit', handlePopupAddCardFormSubmit);
popupOverlays.forEach(element => {
  element.addEventListener('mousedown', handlePopupOverlayMouseDown);
  element.addEventListener('mouseup', handlePopupOverlayMouseUp);
});

enableValidation(validationObject);
