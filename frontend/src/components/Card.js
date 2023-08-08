import React, { useContext } from "react"
import { CurrentUserContext } from "../contexts/CurrentUserContext"

function Card({ card, onCardClick, onCardLike, onCardDeleteClick }) {
  /** подписка на котекст */
  const currentUser = useContext(CurrentUserContext)

  /** определяем, является ли пользователь владельцем текущей карточки */
  const isOwn = (card.owner?._id || card.owner) === currentUser._id

  /** Создаём переменную, которую после зададим в `className` для кнопки удаления */
  const cardDeleteButtonClass = `card__trash ${isOwn && "card__trash_active"}`

  /** Определяем, есть ли у карточки лайк, поставленный текущим пользователем */
  const isLiked = card.likes.some((i) => i === currentUser._id)

  /** Создаём переменную, которую после зададим в `className` для кнопки лайка */
  const cardLikeButtonClassName = `card__like ${isLiked && "card__like_active"}`

  function handleClick() {
    onCardClick(card)
  }

  function handleLikeClick() {
    onCardLike(card)
  }

  function handleDeleteClick() {
    onCardDeleteClick(card)
  }

  return (
    <article className="card">
      <div className="card__image">
        <img
          className="card__pic"
          src={card.link}
          alt={card.name}
          onClick={handleClick}
        />
        {isOwn && (
          <button /** используем переменную для условного рендеринга в разметке */
            className={cardDeleteButtonClass}
            type="button"
            aria-label="Значок удаления карточки"
            onClick={handleDeleteClick}
          />
        )}
      </div>
      <div className="card__description">
        <h2 className="card__name">{card.name}</h2>
        <div className="card__like-container">
          <button
            className={cardLikeButtonClassName}
            type="button"
            aria-label="Значок лайк"
            onClick={handleLikeClick}
          />
          <span className="card__like-number">{card.likes.length}</span>
        </div>
      </div>
    </article>
  )
}

export { Card }
