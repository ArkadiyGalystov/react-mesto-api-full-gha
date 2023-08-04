import React, { useContext } from 'react';
import { Card } from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main({
  cards,
  onEditProfile,
  onEditAvatar,
  onAddPlace,
  onCardClick,
  onCardLike,
  onCardDeleteClick
}) {
  const currentUser =
    useContext(CurrentUserContext);
  const { name, about, avatar } = currentUser;

  return (
    <div className='Main'>
      <main className='content'>
        <section className='profile'>
          <img
            className='profile__avatar'
            src={avatar}
            alt='Аватар пользователя'
          />
          <button
            type='button'
            className='profile__avatar-edit'
            aria-label='Редактирование аватара пользователя'
            onClick={onEditAvatar}
          />
          <div className='profile__info'>
            <h1 className='profile__name'>{name}</h1>
            <button
              className='profile__edit-button'
              type='button'
              aria-label='кнопка редактирования профиля'
              onClick={onEditProfile}
            />
            <p className='profile__about'>{about}</p>
          </div>
          <button
            className='profile__add-button'
            type='button'
            aria-label='Кнопка добавления фотографии'
            onClick={onAddPlace}
          />
        </section>
        <section className='cards' aria-label='Фотографии'>
          {cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDeleteClick={onCardDeleteClick}
              />
            )
          )}
        </section>
      </main>
    </div>
  );
}

export { Main };
