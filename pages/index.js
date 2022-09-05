let profileSection = document.querySelector('.profile');
let editButton = profileSection.querySelector('.profile__edit-button');
/*
Следующие ссылки я решил инициализировать глобально, а не внутри обработчиков событий,
чтобы браузеру не искать элемент всякий раз заново при наступлении события.
Раз мы не используем в проекте innerHTML и подобные ему средства, провоцирующие перестройку DOM,
ссылки должны оставаться валидными на протяжение всего сеанса взаимодействия со страницей.
*/
let popup = document.querySelector('.popup');
let formElement = popup.querySelector('form'); /* вдруг мы припишем класс "popup__container" оболочке для формы, а не самой форме, если дизайн усложнится */
let closeButton = popup.querySelector('.popup__close-button');
let profileName = profileSection.querySelector('.profile__name');
let profileAbout = profileSection.querySelector('.profile__about');
let popupName = popup.querySelector('.popup__input-box_content_name');
let popupAbout = popup.querySelector('.popup__input-box_content_about');

editButton.addEventListener('click', function() {
  popup.classList.add('popup_opened');
  popupName.value = profileName.textContent;
  popupAbout.value = profileAbout.textContent;
});

function closePopup() {
  popup.classList.remove('popup_opened');
}

closeButton.addEventListener('click', closePopup);

formElement.addEventListener('submit', function(evt) {
  evt.preventDefault();
  profileName.textContent = popupName.value;
  profileAbout.textContent = popupAbout.value;
  closePopup();
});
