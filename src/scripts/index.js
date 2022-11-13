import '../pages/index.css';
import emptyIndicator from '../blocks/elements/__empty-indicator/elements__empty-indicator.jpg';
import {initialCards} from './initialCards.js';
import SectionWithCards from './SectionWithCards.js';
import Card from './Card.js';
import PopupWithForm from './PopupWithForm.js';
import PopupWithImage from './PopupWithImage.js';
import UserInfo from './UserInfo.js';
import FormValidator from './FormValidator.js';

const validationObject = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input-box',
  submitButtonSelector: '.popup__save-button',
  inactiveButtonClass: 'popup__save-button_disabled',
  inputErrorClass: 'popup__input-box_error',
  errorClass: 'popup__error_visible'
};

const popupWithImage = new PopupWithImage (
  '.popup_type_view-card',
  '.popup__image',
  '.popup__subscript'
);

const popupEditProfile = new PopupWithForm (
  '.popup_type_edit-profile',
  handleEditProfileFormSubmit,
  validationObject
);

const popupAddCard = new PopupWithForm (
  '.popup_type_add-card',
  handleAddCardFormSubmit,
  validationObject
);

const sectionWithCards = new SectionWithCards (
  {
    items: initialCards,
    renderer: renderCard
  },
  '.elements__cards',
  'elements__empty-indicator'
);

const userInfo = new UserInfo('.profile__name', '.profile__about');

function renderCard(data) {
  const card = new Card (
    data,
    'template.card-template',
    {
      handleCardClick: popupWithImage.open.bind(popupWithImage),
      removeItem: sectionWithCards.removeItem.bind(sectionWithCards)
    },
    emptyIndicator
  );
  return card.createCardElement();
}

function handleEditProfileFormSubmit(inputValues) {
  userInfo.setUserInfo(inputValues);
  this.close();
}

function handleAddCardFormSubmit(inputValues) {
  sectionWithCards.addItem(renderCard(inputValues));
  this.close(true);
}

function handleProfileEditButtonClick() {
  popupEditProfile.setInputValues(userInfo.getUserInfo());
  formValidators['edit-profile'].resetValidation();
  popupEditProfile.open();
}

function handleProfileAddButtonClick() {
  formValidators['add-card'].resetValidation();
  popupAddCard.open();
}

function enableValidation(validationObject) {
  const formValidators = {};
  const formList = Array.from(document.querySelectorAll(validationObject.formSelector));
  formList.forEach(formElement => {
    const formName = formElement.getAttribute('name');
    const formValidator = new FormValidator(validationObject, formElement);
    formValidators[formName] = formValidator;
    formValidator.enableValidation();
  });
  return formValidators;
}


const profileSection = document.querySelector('.profile');
profileSection.querySelector('.profile__edit-button')
  .addEventListener('click', handleProfileEditButtonClick);
profileSection.querySelector('.profile__add-button')
  .addEventListener('click', handleProfileAddButtonClick);

popupWithImage.setEventListeners();
popupEditProfile.setEventListeners();
popupAddCard.setEventListeners();
sectionWithCards.renderItems();
const formValidators = enableValidation(validationObject);
