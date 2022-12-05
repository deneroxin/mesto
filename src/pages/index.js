import '../pages/index.css';
import fallbackImage from '../blocks/card/__image/card__image-fallback.jpg';
import {validationObject} from '../utils/constants.js';
import Section from '../components/Section.js';
import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupConfirmation from '../components/PopupConfirmation.js';
import PopupWithImage from '../components/PopupWithImage.js';
import UserInfo from '../components/UserInfo.js';
import Api from '../components/Api.js';

function showProfileSection() {
  profileSection.classList.remove('profile_hidden');
}

function renderCard(data) {
  const card = new Card (
    data,
    'template.card-template',
    {
      handleCardClick: popups.viewImage.open.bind(popups.viewImage),
      setEmptyIndicator: section.setEmptyIndicator.bind(section),
      handleCardRemove,
      handleCardLike
    },
    fallbackImage
  );
  return card.createCardElement();
}

function handleCardRemove(evt) {
  evt.stopPropagation();
  popups.deleteCard.open(this);
}

function handleCardLike() {
  api.likeCard(!this.getLikeStatus(), this.getCardID())
  .then(updatedCard => {
    if (updatedCard) this.updateLikeStatus(updatedCard.likes);
  })
  .catch(err => {
    console.log(`Api.likeCard() failed with: ${err.message}`);
  });
}

function wrapRequestInUX(requestPromise, popupElement) {
  popupElement.showRequestStatusText();
  return requestPromise
    .then(
      result => { popupElement.close(true); return result; },
      popupElement.showServerError.bind(popupElement)
    )
    .finally(() => popupElement.restoreOriginalText());
}

function enableTotalValidation() {
  const validators = {};
  Array.from(document.forms).forEach(form => {
    const name = form.getAttribute('name');
    validators[name] = new FormValidator(validationObject, document.forms[name]);
    validators[name].enableValidation();
  });
  return validators;
}


const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-54',
  headers: {
    authorization: 'e5727828-c175-4d60-8ac9-c1e0fda08d91',
    'Content-Type': 'application/json'
  }
});


Promise.all([api.getUserInfo(), api.getInitialCards()])
.then(([userData, initialCards]) => {
  userInfo.setUserInfo(userData);
  showProfileSection();
  Card.keepMyID(userData._id);
  initialCards.sort((a,b) => {
    if (a.likes.length != b.likes.length) return b.likes.length - a.likes.length;
     return (a.name < b.name ? -1 : (b.name < a.name) ? 1 : 0);
  });
  section.renderItems(initialCards);
})
.catch(err => {
  console.log(err);
  profileSection.style.display = 'none';
  section.renderItems([]);
});


const userInfo = new UserInfo(
  '.profile__name',
  '.profile__about',
  '.profile__avatar',
  fallbackImage
);

const section = new Section (
  {
    renderer: renderCard
  },
  '.elements',
  '.elements__cards',
  'elements__empty-indicator'
);

const popups = {};

popups.editProfile = new PopupWithForm (
  '.popup_type_edit-profile',
  {
    handleFormSubmit: (inputValues) => {
      wrapRequestInUX(api.editProfile(inputValues), popups.editProfile)
      .then(userInfo.setUserInfo.bind(userInfo));
    },
    formSelectors: validationObject
  }
);

popups.addCard = new PopupWithForm (
  '.popup_type_add-card',
  {
    handleFormSubmit: (inputValues) => {
      wrapRequestInUX(api.addNewCard(inputValues), popups.addCard)
      .then(newCardData => {
        if (newCardData) section.addItem(renderCard(newCardData));
      });
    },
    formSelectors: validationObject
  }
);

popups.deleteCard = new PopupConfirmation (
  '.popup_type_confirmation',
  '.popup__confirm-button',
  {
    handleConfirm: () => {
      const targetCard = popups.deleteCard.getOrigin();
      wrapRequestInUX(
        api.removeCard(targetCard.getCardID()),
        popups.deleteCard
      )
      .then(res => {
        if (res) targetCard.removeCardElement();
      });
    },
    serverErrorSelectors: validationObject
  }
);

popups.setAvatar = new PopupWithForm (
  '.popup_type_change-avatar',
  {
    handleFormSubmit: () => {
      wrapRequestInUX(
        api.setAvatar(popups.setAvatar.getInputValues().avatar),
        popups.setAvatar
      )
      .then(res => {
        if (res) userInfo.setAvatar(res.avatar);
      });
    },
    formSelectors: validationObject
  }
);

popups.viewImage = new PopupWithImage (
  '.popup_type_view-card',
  '.popup__image',
  '.popup__subscript'
);

Object.keys(popups).forEach(key => popups[key].setEventListeners());

const formValidators = enableTotalValidation();

const profileSection = document.querySelector('.profile');

profileSection.querySelector('.profile__edit-button')
  .addEventListener('click', () => {
    popups.editProfile.setInputValues(userInfo.getUserInfo());
    formValidators['edit-profile'].resetValidation();
    popups.editProfile.open();
  });
profileSection.querySelector('.profile__add-button')
  .addEventListener('click', () => {
    formValidators['add-card'].resetValidation();
    popups.addCard.open();
  });
profileSection.querySelector('.profile__avatar')
  .addEventListener('click', () => {
    formValidators['change-avatar'].resetValidation();
    popups.setAvatar.open();
  });
