import React, { useEffect } from 'react';
import { PopupWithForm } from './PopupWithForm.js';
import { useForm } from '../hooks/useForm.js';

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {

  const {values, handleChange, setValues} = useForm({}); 

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: values.name,
      link: values.link,
    });
  }

  /** чистим инпуты */
  useEffect(() => {
    setValues({
      link: '',
      name: ''
    })
  }, [isOpen]);

  return (
    <PopupWithForm
      name='popup-add'
      title='Новое место'
      text={isLoading? 'Создаем...' : 'Создать'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className='form__input-container'>
        <input
          type='text'
          name='name'
          id='cardname-input'
          className='form__item form__item_image_name'
          placeholder='Название'
          minLength={2}
          maxLength={30}
          required
          value={values.name || ''}
          onChange={handleChange}
        />
        <span className='form__item-error cardname-input-error' />
        <input
          type='url'
          name='link'
          id='link-input'
          className='form__item form__item_image_link'
          placeholder='Ссылка на картинку'
          required
          value={values.link || ''}
          onChange={handleChange}
        />
        <span className='form__item-error link-input-error' />
      </fieldset>
    </PopupWithForm>
  );
}

export { AddPlacePopup };
