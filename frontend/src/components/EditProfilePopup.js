import React, { useState, useContext, useEffect } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { PopupWithForm } from './PopupWithForm.js';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleEditName(evt) {
    setName(evt.target.value);
  }

  function handleEditDescription(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
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
          id='about-input'
          className='form__item form__item_user_about'
          placeholder='О себе'
          minLength={2}
          maxLength={200}
          required
          onChange={handleEditDescription}
          value={description || ''}
        />
        <span className='form__item-error about-input-error' />
      </fieldset>
    </PopupWithForm>
  );
}

export { EditProfilePopup };
