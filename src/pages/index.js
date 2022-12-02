import '../pages/index.css';
import fallbackImage from '../blocks/card/__image/card__image-fallback.jpg';
import {validationObject} from '../utils/constants.js';
import Section from '../components/Section.js';
import Card from '../components/Card.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import UserInfo from '../components/UserInfo.js';
import Api from '../components/Api.js';

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
  api.likeCard(!this._isLiked, this.getCardID())
  .then(updatedCard => {
    if (updatedCard) this._updateLikeStatus(updatedCard.likes);
  });
}

const popups = {};

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-54',
  headers: {
    authorization: 'e5727828-c175-4d60-8ac9-c1e0fda08d91',
    'Content-Type': 'application/json'
  }
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
  '.elements__cards',
  'elements__empty-indicator'
);

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, initialCards]) => {
    userInfo.setUserInfo(userData);
    Card.keepMyID(userData._id);
    initialCards.sort((a,b) => {
      if (a.likes.length != b.likes.length) return b.likes.length - a.likes.length;
      return (a.name < b.name ? -1 : (b.name < a.name) ? 1 : 0);
    });
    section.renderItems(initialCards);
  });

popups.editProfile = new PopupWithForm (
  '.popup_type_edit-profile',
  {
    handleFormSubmit: (inputValues) => {
      popups.editProfile.wrapRequestInUX(
        api.editProfile(inputValues)
      )
      .then(userInfo.setUserInfo.bind(userInfo));
    },
    validationObject
  }
);

popups.addCard = new PopupWithForm (
  '.popup_type_add-card',
  {
    handleFormSubmit: (inputValues) => {
      popups.addCard.wrapRequestInUX(
        api.addNewCard(inputValues)
      )
      .then(newCardData => {
        if (newCardData) section.addItem(renderCard(newCardData));
      });
    },
    validationObject
  }
);

popups.deleteCard = new PopupWithForm (
  '.popup_type_delete-card',
  {
    handleFormSubmit: () => {
      const targetCard = popups.deleteCard.getOrigin();
      popups.deleteCard.wrapRequestInUX(
        api.removeCard(targetCard.getCardID())
      )
      .then(res => {
        if (res) targetCard.removeCardElement();
      });
    },
    validationObject
  }
);

popups.setAvatar = new PopupWithForm (
  '.popup_type_change-avatar',
  {
    handleFormSubmit: () => {
      popups.setAvatar.wrapRequestInUX(
        api.setAvatar(popups.setAvatar.getInputValues().avatar)
      )
      .then(res => {
        if (res) userInfo.setAvatar(res.avatar);
      });
    },
    validationObject
  }
);

popups.viewImage = new PopupWithImage (
  '.popup_type_view-card',
  '.popup__image',
  '.popup__subscript'
);

Object.keys(popups).forEach(key => popups[key].setEventListeners());

const profileSection = document.querySelector('.profile');
profileSection.querySelector('.profile__edit-button')
  .addEventListener('click', () => {
    popups.editProfile.setInputValues(userInfo.getUserInfo());
    popups.editProfile.open();
  });
profileSection.querySelector('.profile__add-button')
  .addEventListener('click', () => {
    popups.addCard.open();
  });
profileSection.querySelector('.profile__avatar')
  .addEventListener('click', () => {
    popups.setAvatar.setInputValues(userInfo.getUserInfo());
    popups.setAvatar.open();
  });
