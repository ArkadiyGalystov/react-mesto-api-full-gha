import React from 'react';
import '../index.css';
import { usePopupClose } from '../hooks/usePopupClose';

function ImagePopup({ card, onClose }) {
  usePopupClose(card.link, onClose);

  return (
    <div
      className={`popup popup-image ${card.link ? 'popup_opened' : ''}`}
    >
      <div className='popup-image__container'>
        <button
          type='button'
          className='popup__close'
          aria-label='Кнопка закрытия попап'
          onClick={onClose}
        />
        <figure className='figure'>
          <img className='popup-image__pic' src={card.link} alt={card.name} />
          <figcaption className='popup-image__title'>{card.name}</figcaption>
        </figure>
      </div>
    </div>
  );
}

export { ImagePopup };
