export default class Api {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    const {authorization} = headers;
    this._postHeaders = headers;
    this._getHeaders = {authorization};
  }

  _getData(res) {
    return res.json().then(obj => {
      if (res.ok) return obj; else throw obj;
    });
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._getHeaders
    })
    .then(this._getData)
    .catch(err => {
      console.log(`Api.getUserInfo() failed with: ${err.message}`);
      throw err;
    });
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: this._getHeaders
    })
    .then(this._getData)
    .catch(err => {
      console.log(`Api.getInitialCards() failed with: ${err.message}; empty array returned`);
      return [];
    });
  }

  editProfile(newData) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._postHeaders,
      body: JSON.stringify(newData)
    })
    .then(this._getData);
  }

  addNewCard(cardData) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._postHeaders,
      body: JSON.stringify(cardData)
    })
    .then(this._getData);
  }

  removeCard(cardID) {
    return fetch(`${this._baseUrl}/cards/${cardID}`, {
      method: 'DELETE',
      headers: this._getHeaders
    })
    .then(this._getData);
  }

  likeCard(isLiked, cardID) {
    return fetch(`${this._baseUrl}/cards/${cardID}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this._getHeaders
    })
    .then(this._getData);
  }

  setAvatar(url) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._postHeaders,
      body: JSON.stringify({avatar: url})
    })
    .then(this._getData);
  }
}
