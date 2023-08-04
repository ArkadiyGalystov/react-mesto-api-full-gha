import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import '../index.css';
//--------------------------------------------------
import { Header } from './Header.js';
import { Main } from './Main.js';
import { Footer } from './Footer.js';
import { Login } from './Login.js';
import { Register } from './Register.js';
//--------------------------------------------------
import { AddPlacePopup } from './AddPlacePopup.js';
import { EditAvatarPopup } from './EditAvatarPopup.js';
import { EditProfilePopup } from './EditProfilePopup.js';
import { ImagePopup } from './ImagePopup.js';
//--------------------------------------------------
import { ProtectedRoute } from './ProtectedRoute.js';
import { InfoTooltip } from './InfoTooltip.js';
import { ConfirmDeletePopup } from './ConfirmDeletePopup.js';
//--------------------------------------------------
import { api } from '../utils/Api.js';
import { auth } from '../utils/Auth.js';
//--------------------------------------------------
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
//--------------------------------------------------


function App() {
  // проверка токена
  useEffect(() => {
    checkToken();
  }, []);

  //-----------------данные пользователя---------------------------------
  const [cards, setCards] = useState([]);
  const [deletedCard, setDeletedCard] = useState({});

  //-----------------стейты---------------------------------
  const [currentUser, setCurrentUser] = useState({});

  //-----------------регистрация и авторизация---------------------------------
  const navigate = useNavigate();
  const [isLogIn, setLogIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (isLogIn == true) {
      Promise.all([api.getUserInfoApi(), api.getInitialCards()])
        .then(([currentUser, initialCards]) => {
          setCurrentUser(currentUser);
          setCards(initialCards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isLogIn]);

  useEffect(() => {
    if (isLogIn) {
      navigate('/')
    }
  }, [isLogIn, navigate]);

  // регистрация пользователя
  function handleRegister(data) {
    return auth
      .register(data)
      .then((res) => {
        setIsSuccessInfoTooltipStatus(true);
        openInfoTooltip();
        navigate('/sign-in');
      })
      .catch((err) => {
        console.log(err);
        setIsSuccessInfoTooltipStatus(false);
        openInfoTooltip();
      })
  }

  // авторизация пользователя
  function handleLogin(data) {
    return auth
      .login(data)
      .then((res) => {
        localStorage.setItem('jwt', res.token);
        setUserEmail(data.email)
        setLogIn(true);
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //------------перенаправляем пользователя после успешной проверки--------------------------------------
  function checkToken() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }
    auth
      .checkToken(jwt)
      .then((res) => {
        setUserEmail(res.data.email);
        setLogIn(true);
        navigate('/')
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
  //------------выход--------------------------------------
  function handleSignOut() {
    localStorage.removeItem('jwt');
    setLogIn(false);
    navigate('/sign-in');
  }

  //-----------------аватар---------------------------------
  const [editAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isLoadingEditAvatarPopup, setIsLoadingEditAvatarPopup] = useState(false);

  function handleUpdateAvatar(inputValues) {
    setIsLoadingEditAvatarPopup(true)
    function makeRequest() {
      return api
        .editUserAvatar(inputValues)
        .then(setCurrentUser)
        .finally(() => { setIsLoadingEditAvatarPopup(false) })
    }
    handleSubmit(makeRequest);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  //-----------------профиль---------------------------------
  const [editProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isLoadingEditProfilePopup, setIsLoadingEditProfilePopup] = useState(false);

  function handleUpdateUser(inputValues) {
    setIsLoadingEditProfilePopup(true)
    function makeRequest() {
      return api
        .editUserInfo(inputValues)
        .then(setCurrentUser)
        .finally(() => { setIsLoadingEditProfilePopup(false) })
    }
    handleSubmit(makeRequest);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  //-----------------новая карточка---------------------------------
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isLoadingAddPlacePopup, setIsLoadingAddPlacePopup] = useState(false);

  function handleNewCardSubmit(inputValues) {
    setIsLoadingAddPlacePopup(true)
    function makeRequest() {
      return api
        .addCards(inputValues)
        .then((newCard) => {
          setCards([newCard, ...cards])
        })
        .finally(() => { setIsLoadingAddPlacePopup(false) })
    }
    handleSubmit(makeRequest);
  }

  function handleNewCardClick() {
    setIsAddPlacePopupOpen(true);
  }

  //-----------------удаление карточки---------------------------------
  const [deleteCardPopupOpen, setDeleteCardPopupOpen] = useState(false);
  const [isLoadingConfirmDeletePopup, setIsLoadingConfirmDeletePopup] = useState(false);

  function handleCardDelete(card) {
    setIsLoadingConfirmDeletePopup(true)
    function makeRequest() {
      return api
        .removeCard(card._id)
        .then(() => {
          setCards((cards) => cards.filter((c) => c._id !== card._id));
        })
        .finally(() => { setIsLoadingConfirmDeletePopup(false) })
    }
    handleSubmit(makeRequest);
  }

  function handleDeleteClick(card) {
    setDeletedCard(card);
    setDeleteCardPopupOpen(true);
  }

  //-----------------слайдер карточки---------------------------------
  const [selectedCard, setSelectedCard] = useState({});

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  //-----------------закрытие всех попап---------------------------------
  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setDeleteCardPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setDeletedCard({});
    setSelectedCard({});
  }

  //---информирует пользователя об успешной (или не очень) регистрации----
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccessInfoTooltipStatus, setIsSuccessInfoTooltipStatus] = useState(false);
  function openInfoTooltip() {
    setIsInfoTooltipOpen(true);
  }

  //------------лайки--------------------------------------
  function handleCardLike(card) {
    const isLiked = card.likes.some(
      (i) => i._id === currentUser._id);
    api
      .toggleLikeCard(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((l) => (l._id === card._id ? newCard : l))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //------------изменяем текст кнопки до вызова--------------------------------------
  function handleSubmit(request) {

    //setIsLoading(true);
    request()
      .then(data => { closeAllPopups(data) })
      .catch((err) => console.log(err)) // используется для логирования ошибок
      //.finally(() => setIsLoading(false)); // возвращаем обратно начальный текст кнопки
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='root'>
        <Header loggedIn={isLogIn} userEmail={userEmail} onSignOut={handleSignOut} />

        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute
                element={Main}
                loggedIn={isLogIn}
                onEditProfile={handleEditProfileClick}
                onEditAvatar={handleEditAvatarClick}
                onAddPlace={handleNewCardClick}
                cards={cards}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDeleteClick={handleDeleteClick}
                onConfirmDelete={handleDeleteClick}
              />
            }
          />

          <Route
            path='/sign-in'
            element={
              <Login navigate={navigate} onLogin={handleLogin} />
            }
          />

          <Route
            path='/sign-up'
            element={
              <Register navigate={navigate} onRegister={handleRegister} />
            }
          />

          <Route path='*'
            element={isLogIn ? <Navigate to='/' /> : <Navigate to='/sign-in' />}
          />
        </Routes>

        <Footer />

        <EditProfilePopup
          isOpen={editProfilePopupOpen}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoadingEditProfilePopup}
          onClose={closeAllPopups}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleNewCardSubmit}
          isLoading={isLoadingAddPlacePopup}
        />

        <ConfirmDeletePopup
          isOpen={deleteCardPopupOpen}
          onClose={closeAllPopups}
          card={deletedCard}
          onSubmit={handleCardDelete}
          isLoading={isLoadingConfirmDeletePopup}
        />

        <EditAvatarPopup
          isOpen={editAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoadingEditAvatarPopup}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          isConfirmStatus={isSuccessInfoTooltipStatus}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
