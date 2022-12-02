export default class UserInfo {
  constructor(nameSelector, aboutSelector, avatarSelector, fallbackImage) {
    this._nameElement = document.querySelector(nameSelector);
    this._aboutElement = document.querySelector(aboutSelector);
    this._avatarElement = document.querySelector(avatarSelector);
    this._fallbackImage = fallbackImage;
    this._userData = this._getDataFromHtml();
  }

  getUserInfo() {
    return this._userData;
  }

  setUserInfo(data) {
    if (!data) return;
    this._userData = data;
    this._updateText();
    this._updateAvatar();
  }

  setAvatar(avatarUrl) {
    this._userData.avatar = avatarUrl;
    this._updateAvatar();
  }

  _updateAvatar() {
    this._avatarElement.style.backgroundImage = `url(${this._userData.avatar}), url(${this._fallbackImage})`;
  }

  _updateText() {
    this._nameElement.textContent = this._userData.name;
    this._aboutElement.textContent = this._userData.about;
  }

  _getDataFromHtml() {
    return {
      name: this._nameElement.textContent,
      about: this._aboutElement.textContent
    }
  }
}
