import '../pages/index.css';
import fallbackImage from '../blocks/card/__image/card__image-fallback.jpg';
import {initialCards, validationObject} from '../utils/constants.js';
import Section from '../components/Section.js';
import Card from '../components/Card.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import UserInfo from '../components/UserInfo.js';
import FormValidator from '../components/FormValidator.js';

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

const section = new Section (
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
      setEmptyIndicator: section.setEmptyIndicator.bind(section)
    },
    fallbackImage
  );
  return card.createCardElement();
}

function handleEditProfileFormSubmit(inputValues) {
  userInfo.setUserInfo(inputValues);
  this.close();
}

function handleAddCardFormSubmit(inputValues) {
  section.addItem(renderCard(inputValues));
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
section.renderItems();
const formValidators = enableValidation(validationObject);
