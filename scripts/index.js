const profileSection = document.querySelector('.profile');
const elements = document.querySelector('.elements');
const elementsCardTemplate = document.querySelector('template#card').content.querySelector('.card');
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
const popupEditProfileSubmit = popupEditProfileForm.querySelector('.popup__save-button');
const popupAddCardInputName = popupAddCardForm.querySelector('.popup__input-box_content_name');
const popupAddCardInputLink = popupAddCardForm.querySelector('.popup__input-box_content_link');
const popupAddCardSubmit = popupAddCardForm.querySelector('.popup__save-button');
const popupViewCardImage = popupViewCard.querySelector('.popup__image');
const popupViewCardSubscript = popupViewCard.querySelector('.popup__subscript');

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

function stripURL(string) { return string.slice(5, -2); }

function createCard(data) {
  const newElement = elementsCardTemplate.cloneNode(true);
  const newElementImage = newElement.querySelector('.card__image');
  newElementImage.style.backgroundImage = `url(${data.link})`;
  newElementImage.addEventListener('click', (evt) => openPopupViewCard (data));
  newElement.querySelector('.card__subscript').textContent = data.name;
  newElement.querySelector('.card__remove-button').addEventListener('click', handleCardRemoveButtonClick);
  newElement.querySelector('.card__like-button').addEventListener('click', handleCardLikeButtonClick);
  return newElement;
}

function renderCard(data) {
  clearEmptyIndicator();
  elementsCards.prepend(createCard(data));
}

function initializeCards() {
  initialCards.forEach(renderCard);
}

function handleCardRemoveButtonClick(evt) {
  evt.stopPropagation(); /* щелчок по корзине является и щелчком по изображению, предотвратить вызов просмотра */
  const card = evt.target.closest('.card');
  card.classList.add('card_removed');
  card.exists = true;
  card.addEventListener('transitionend', removeCardCompletely); /* setTimeout проще, но тогда придётся поддерживать единообразие значений времени здесь и в анимации */
}

function removeCardCompletely(evt) {
  const card = evt.target;   /* так как все анимации одной длительности, будем реагировать на первое попавшееся свойство */
  if (card.exists) {        /* если объекта уже нет, то card.exists === undefined, а это false (хотя как тогда событие сработает на несуществующем объекте? Но кто знает - вдруг такое возможно!) */
    card.exists = false;   /* гарантирует, что повторное событие не будет обрабатываться, если объект не успел удалиться */
    card.remove();        /* remove() не удаляет объект немедленно, событие успевает прийти повторно, причем порядок свойств может быть любым */
    setEmptyIndicator();
  }
}

function handleCardLikeButtonClick(evt) {
  evt.target.classList.toggle('card__like-button_active');
}

function handleProfileEditButtonClick() {
  popupEditProfileInputName.value = profileName.textContent;
  popupEditProfileInputAbout.value = profileAbout.textContent;
  validateAllInputs(popupEditProfileForm);
  openPopup(popupEditProfile);
}

function handleProfileAddButtonClick() {
  if (popupAddCard.submitted) {
    popupAddCardForm.reset();
    popupAddCard.submitted = false;
  }
  validateSubmitButton(popupAddCardForm);
  openPopup(popupAddCard);
}

function openPopupViewCard(cardData) {
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
  renderCard({ name: popupAddCardInputName.value, link: popupAddCardInputLink.value });
  popupAddCard.submitted = true;
  closePopup(popupAddCard);
}

function openPopup(element) {
  element.mousePushed = false;
  element.classList.add('popup_opened');
  element.handleKeydown = evt => {if (evt.key === 'Escape') closePopup(element)};
  window.addEventListener('keydown', element.handleKeydown);
}

/*
Событие клавиатуры навешивается на window, так как popup с картинкой не будет на него
реагировать, потому что в нём нет элементов, умеющих слушать события клавиатуры.
Кроме этого, для диалогового окна нужно, чтобы какое-то из полей <input> было в фокусе,
чтобы сработало событие нажатия, а это неудобно.
*/

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

/*
Клик по оверлею пришлось иммитировать через нажатие и отпускание,
так как в противном случае браузер считает кликом ситуацию, когда
клавиша была нажата на оверлее, затем курсор был перемещен в область окна,
после чего клавиша была отпущена; или наоборот, если нажать клавишу
внутри окна, переместить курсор за его пределы и там отпустить - срабатывает "клик".
Браузер не может следить, чтобы и нажатие, и отпускание возникли оба за пределами окна,
он лишь следит, что нажатие и отпускание происходят на одном том же элементе,
поэтому если хотя бы одна из фаз (нажатие или отпускание) сработала на оверлее,
браузер почему-то считает, что весь "клик" произошёл на оверлее.
(Хотя странно, что выбор целевого объекта не определяется лишь фазой отпускания)
Как вариант, можно было бы навесить слушатель-заглушку на само окно,
в котором прописать evt.stopPropagation()
чтобы при клике по окну событие не достигло своего приёмника - оверлея.
Однако это всё равно не помогает при неконсистентных кликах.
*/

enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input-box',
  submitButtonSelector: '.popup__save-button',
  inactiveButtonClass: 'popup__save-button_disabled',
  inputErrorClass: 'popup__input-box_error',
  errorClass: 'popup__error_visible'
})
