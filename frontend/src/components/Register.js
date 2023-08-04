import { Link } from 'react-router-dom';
import { useForm } from '../hooks/useForm.js';

function Register({ onRegister }) {
  const { values, handleChange } = useForm({ email: '', password: '' });

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(values);
  }

  return (
    <section className='auth'>
      <div className='auth__container'>
        <h3 className='auth__title'>Регистрация</h3>
        <form
          className='auth__form'
          name='auth-login'
          onSubmit={handleSubmit}
        >
          <input
            className='auth__input'
            name='email'
            value={values.email || ''}
            onChange={handleChange}
            type='email'
            placeholder='e-mail'
            minLength='2'
            maxLength='30'
          />

          <input
            className='auth__input'
            name='password'
            value={values.password || ''}
            onChange={handleChange}
            type='password'
            placeholder='Пароль'
            minLength='8'
            maxLength='15'
          />

          <button
            className='auth__submit-button' type='submit' aria-label='Кнопка регистрации'>Зарегистрироваться</button>
          <div className='auth__signup'>
            <p>Уже зарегистрированы?</p>
            <Link to='/sign-in' className='auth__link'>Войти</Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export { Register };
