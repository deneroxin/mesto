let profileSection = document.querySelector('.profile');
let profileEditButton = profileSection.querySelector('.profile__edit-button');
let popupEditProfile = document.querySelector('.popup');
let popupEditProfileForm = popupEditProfile.querySelector('.popup__form');
let popupEditProfileCloseButton = popupEditProfile.querySelector('.popup__close-button');
let profileName = profileSection.querySelector('.profile__name');
let profileAbout = profileSection.querySelector('.profile__about');
let popupEditProfileName = popupEditProfileForm.querySelector('.popup__input-box_content_name');
let popupEditProfileAbout = popupEditProfileForm.querySelector('.popup__input-box_content_about');

function openPopupEditProfile() {
  popupEditProfileName.value = profileName.textContent;
  popupEditProfileAbout.value = profileAbout.textContent;
  popupEditProfile.classList.add('popup_opened');
}

function closePopupEditProfile() {
  popupEditProfile.classList.remove('popup_opened');
}

function submitPopupEditProfile(event) {
  event.preventDefault();
  profileName.textContent = popupEditProfileName.value;
  profileAbout.textContent = popupEditProfileAbout.value;
  closePopupEditProfile();
}

profileEditButton.addEventListener('click', openPopupEditProfile);
popupEditProfileCloseButton.addEventListener('click', closePopupEditProfile);
popupEditProfileForm.addEventListener('submit', submitPopupEditProfile);
