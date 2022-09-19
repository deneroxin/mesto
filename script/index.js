const initialCards = [
  { name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg' },
  { name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg' },
  { name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg' },
  { name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg' },
  { name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg' },
  { name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg' } ];

const profileSection = document.querySelector('.profile');
const elements = document.querySelector('.elements');
const popup = document.querySelector('.popup');
const viewImage = document.querySelector('.view-image');
const profileEditButton = profileSection.querySelector('.profile__edit-button');
const profileAddButton = profileSection.querySelector('.profile__add-button');
const elementsCards = elements.querySelector('.elements__cards');
const elementsCardTemplate = elements.querySelector('template#card').content;
const popupCloseButton = popup.querySelector('.close-button');
const profileName = profileSection.querySelector('.profile__name');
const profileAbout = profileSection.querySelector('.profile__about');
const popupTitle = popup.querySelector('.popup__title');
const popupFormElement = popup.querySelector('.popup__form');
const popupName = popupFormElement.querySelector('.popup__input-box_content_name');
const popupData = popupFormElement.querySelector('.popup__input-box_content_data');
const viewImageImage = viewImage.querySelector('.view-image__image');
const viewImageSubscript = viewImage.querySelector('.view-image__subscript');
const viewImageCloseButton = viewImage.querySelector('.close-button');

function setEmptyIndicator() {
  if (!elementsCards.children.length) {
    elementsCards.empty = true;
    elementsCards.innerHTML = '<img src="./vendor/images/empty-indicator.jpg" style="width: 100%; object-fit: contain;" alt="">';
  }
}

function clearEmptyIndicator() {
  if (elementsCards.empty) {
    elementsCards.children[0].remove();
    elementsCards.empty = false;
  }
}

function addCard(name, url, first) {
  const newElement = elementsCardTemplate.cloneNode(true);
  const newElementImage = newElement.querySelector('.card__image');
  newElementImage.style.backgroundImage = `url(${url})`;
  newElementImage.addEventListener('click', openViewImage);
  newElement.querySelector('.card__subscript').textContent = name;
  newElement.querySelector('.card__remove-button').addEventListener('click', removeCard);
  newElement.querySelector('.card__like-button').addEventListener('click', likeCard);
  newElement.liked = false; // Пригодится для быстрого выяснения, поставлен ли лайк карточке
  clearEmptyIndicator();
  if (first) elementsCards.prepend(newElement); else elementsCards.append(newElement);
}

function removeCard(evt) {
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

function stripURL(string) { return string.slice(5, -2); }

function openViewImage(evt) {
  const subscript = evt.target.closest('.card').querySelector('.card__subscript').textContent;
  viewImageImage.src = stripURL(evt.target.style.backgroundImage);
  viewImageImage.alt = subscript;
  viewImageSubscript.textContent = subscript;
  viewImage.classList.add('cover-window_opened');
}

function closeViewImage() {
  viewImage.classList.remove('cover-window_opened');
}

function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_active');
  const card = evt.target.closest('.card');
  card.liked = !card.liked; // Пригодится для быстрого выяснения, поставлен ли лайк карточке
}

function initializeCards() {
  initialCards.forEach((item) => { addCard(item.name, item.link); });
}

function openPopup(evt) {
  let formName;
  if (evt.target === profileEditButton) {
    formName = 'edit-profile';
    popupTitle.textContent = 'Редактировать профиль';
    popupName.value = profileName.textContent;
    popupData.value = profileAbout.textContent;
    popupName.ariaLabel = 'Имя';
    popupData.ariaLabel = 'О себе';
  } else if (evt.target === profileAddButton) {
    formName = 'add-card';
    popupTitle.textContent = 'Новое место';
    popupName.value = popupName.previousValue;
    popupData.value = popupData.previousValue;
    popupName.ariaLabel = 'Название';
    popupData.ariaLabel = 'Ссылка на картинку';
  }
  popupFormElement.setAttribute('name', formName);
  popupName.setAttribute('placeholder', popupName.ariaLabel);
  popupData.setAttribute('placeholder', popupData.ariaLabel);
  popup.classList.add('cover-window_opened');
}

function clearPopup() {
  popup.classList.remove('cover-window_opened');
}

function submitPopup(evt) {
  evt.preventDefault();
  const formName = evt.target.getAttribute('name');
  if (formName === 'edit-profile') {
    profileName.textContent = popupName.value;
    profileAbout.textContent = popupData.value;
  } else if (formName === 'add-card') {
    addCard(popupName.value, popupData.value, 'first');
    popupName.previousValue = '';
    popupData.previousValue = '';
  }
  clearPopup();
}

function closePopup() {
  clearPopup();
  if (popupFormElement.getAttribute('name') === 'add-card') {
    popupName.previousValue = popupName.value;
    popupData.previousValue = popupData.value;
  }
}

initializeCards();
popupName.previousValue = '';
popupData.previousValue = '';
profileEditButton.addEventListener('click', openPopup);
profileAddButton.addEventListener('click', openPopup);
popupCloseButton.addEventListener('click', closePopup);
popupFormElement.addEventListener('submit', submitPopup);
viewImageCloseButton.addEventListener('click', closeViewImage);
