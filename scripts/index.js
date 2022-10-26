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

export const noImage = '../blocks/elements/__empty-indicator/elements__empty-indicator.jpg';

const profileSection = document.querySelector('.profile');
const elements = document.querySelector('.elements');
const popupEditProfile = document.querySelector('.popup_type_edit-profile');
const popupAddCard = document.querySelector('.popup_type_add-card');
const popupViewCard = document.querySelector('.popup_type_view-card');
const popupCloseButtons = document.querySelectorAll('.popup__close-button');
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

const cards = [];

export function setEmptyIndicator() {
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

export function removeCardInstance(card) {
  const i = card.getMyIndex(); //Узнаём индекс удаляемого элемента в массиве (это ведь быстрее, чем искать элемент по значению)
  cards[i] = cards.pop();  //Ставим последний элемент массива на место удаляемого элемента (затёрли ссылку на него)
  cards[i].setMyIndex(i);  //Обновляем поле "индекс" перемещённому элементу в соответствии с новым положением
  //Теперь сборщику мусора можно съедать экземпляр объекта Card, на который не осталось ссылок.
  //Такой способ мне НЕ нравится.
  //Почему бы не хранить ссылку на объект Card в самом DOM элементе, добвив ему кастомное свойство?
  //Ведь тогда при удалении элемента из DOM, автоматически удалится и связанный с ним экземпляр класса Card.
  //Не нужно будет массива, не нужно будет функции removeCardInstance.
  //(! А может просто не создавать массив и положиться на те самые анонимные обработчики?
  // С удалением DOM элемента, они также все удалятся, и сслылок на экземпляр Card не останется?)
}

function renderCard(data) {
  clearEmptyIndicator();
  const card = new Card(data, 'template.card-template');
  card.setMyIndex(cards.length);  //Запоминаем индекс элемента в массиве, чтобы находить его сразу, не используя indexOf.
  cards.push(card); //Запоминаем ссылку на созданную карточку, чтобы сборщик мусора её не съел.
  elementsCards.prepend(card.createCardElement()); // (Хотя он и так не ест, но лишь потому наверное, что анонимные обработчики неявно содержат ссылку на карточку в параметре this)
}

function initializeCards() {
  initialCards.forEach(renderCard);
}

function handleProfileEditButtonClick() {
  popupEditProfileInputName.value = profileName.textContent;
  popupEditProfileInputAbout.value = profileAbout.textContent;
  editProfileValidator.validateAllInputs();
  editProfileValidator.setSubmitButtonState();
  openPopup(popupEditProfile);
}

function handleProfileAddButtonClick() {
  if (popupAddCard.submitted) {
    popupAddCardForm.reset();
    popupAddCard.submitted = false;
  }
  addCardValidator.setSubmitButtonState();
  openPopup(popupAddCard);
}

export function openPopupViewCard(card) {
  popupViewCardImage.src = card.getLink();
  popupViewCardImage.alt = card.getName();
  popupViewCardSubscript.textContent = card.getName();
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
  renderCard({ name: popupAddCardInputName.value, link: popupAddCardInputLink.value });
  popupAddCard.submitted = true;
  closePopup(popupAddCard);
}

export function openPopup(element) {
  element.mousePushed = false;
  element.classList.add('popup_opened');
  element.handleKeydown = evt => {if (evt.key === 'Escape') closePopup(element)};
  window.addEventListener('keydown', element.handleKeydown);
}

function closePopup(element) {
  window.removeEventListener('keydown', element.handleKeydown);
  element.classList.remove('popup_opened');
}

function handlePopupCloseButtonClick(evt) {
  closePopup(this.closest('.popup'));
}

function handlePopupOverlayMouseDown(evt) {
  if (evt.target === this) this.mousePushed = true;
}

function handlePopupOverlayMouseUp(evt) {
  if (evt.target === this && this.mousePushed) closePopup(this);
  this.mousePushed = false;
}

initializeCards();
popupAddCard.submitted = true;
profileEditButton.addEventListener('click', handleProfileEditButtonClick);
profileAddButton.addEventListener('click', handleProfileAddButtonClick);
popupEditProfileForm.addEventListener('submit', handlePopupEditProfileFormSubmit);
popupAddCardForm.addEventListener('submit', handlePopupAddCardFormSubmit);
popupCloseButtons.forEach(element => element.addEventListener('click', handlePopupCloseButtonClick));
popupOverlays.forEach(element => {
  element.addEventListener('mousedown', handlePopupOverlayMouseDown);
  element.addEventListener('mouseup', handlePopupOverlayMouseUp);
});

const editProfileValidator = new FormValidator(validationObject, popupEditProfileForm);
const addCardValidator = new FormValidator(validationObject, popupAddCardForm);
editProfileValidator.enableValidation();
addCardValidator.enableValidation();
