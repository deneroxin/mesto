export default class Popup {
  constructor(popupSelector) {
    this._popupElement = document.querySelector(popupSelector);
    this._handleEsc = (evt) => {
      if (evt.key === 'Escape') this.close();
    };
  }

  setEventListeners() {
    // Цель разделённых слушателей - обеспечить правильный клик,
    // исключающий возможность закрыть окно в следующих случаях:
    // когда кнопка нажата внутри окна и отпущена на оверлее, или
    // когда кнопка нажата на оверлее и отпущена внутри окна.
    this._popupElement.addEventListener('mousedown', (evt) => {
      if (evt.target.classList.contains('popup-close')) {
        this._mousePushedOnOverlay = true;
      }
    });
    this._popupElement.addEventListener('mouseup', (evt) => {
      if (evt.target.classList.contains('popup-close')
        && this._mousePushedOnOverlay) this.close();
      this._mousePushedOnOverlay = false;
    });
  }

  open() {
    this._mousePushedOnOverlay = false;
    this._popupElement.classList.add('popup_opened');
    window.addEventListener('keydown', this._handleEsc);
  }

  close() {
    window.removeEventListener('keydown', this._handleEsc);
    this._popupElement.classList.remove('popup_opened');
  }
}
