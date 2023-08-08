import React, { useState, useContext, useEffect } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { PopupWithForm } from './PopupWithForm.js';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) { /** TODO: добавить ux, добавить закрытие оверлеем */
  /** подписка на контекст */
  const currentUser = useContext(CurrentUserContext);

  /** стейт для пользователя */
  const [name, setName] = useState('');

  /** стейт для пользователя */
  const [description, setDescription] = useState('');

  useEffect(() => {
    setName(currentUser.name); /** после загрузки текушего пользователя из апи его данные будут использованыв управляемых компонентах */
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleEditName(e) {
    setName(e.target.value);
  }

  function handleEditDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    /** передаем значение управляемых компонентов во внешний обработчик */
    onUpdateUser({
      name: name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name='popup-profile'
      title='Редактировать профиль'
      text={isLoading? 'Сохраненяем...' : 'Сохранить'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className='form__input-container'>
        <input
          type='text'
          name='name'
          id='username-input'
          className='form__item form__item_user_name'
          placeholder='Имя'
          minLength={2}
          maxLength={40}
          required
          onChange={handleEditName}
          value={name || ''}
        />
        <span className='form__item-error username-input-error' />
        <input
          type='text'
          name='about'
          id='job-input'
          className='form__item form__item_user_job'
          placeholder='О себе'
          minLength={2}
          maxLength={200}
          required
          onChange={handleEditDescription}
          value={description || ''}
        />
        <span className='form__item-error job-input-error' />
      </fieldset>
    </PopupWithForm>
  );
}

export { EditProfilePopup };
