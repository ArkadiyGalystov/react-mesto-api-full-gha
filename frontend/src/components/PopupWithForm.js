/** Вынеcли общий компонент попапов */
/** В этих попапах много общей разметки: элементы внешнего и внутреннего контейнера, сама форма, заголовок и две кнопки. Вся общая разметка в новом компоненте */

/** на основе пропcа isOpen в JSX задается CSS-класс, отвечающий за видимость попапа. 
  Кроме заголовка и идентификатора в компонент PopupWithForm будет передаваться вложенное содержимое в виде JSX-разметки, отличающейся для всех четырёх попапов.
  Внутри самого компонента оно будет доступно через специальный пропс children */
  
import React from "react";
import { usePopupClose } from "../hooks/usePopupClose.js";

function PopupWithForm({
  isOpen,
  title,
  name,
  text,
  children,
  onClose,
  onSubmit,
}) {
  const popupOpened = isOpen ? 'popup_opened' : '';
  usePopupClose(isOpen, onClose);;

  return (
    <div className={`popup ${popupOpened}`}>

      <div className='popup__container'>
        <form className='form' name={name} onSubmit={onSubmit}>
          <button className='popup__close' type='button' onClick={onClose} />
          <h2 className='form__name'>{title}</h2>

          {children}

          <button
            className='form__submit-button'
            type='submit'
            aria-label='Кнопка сохранения изменений в профиле'
          >
            {text || 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  );
}

export { PopupWithForm };
