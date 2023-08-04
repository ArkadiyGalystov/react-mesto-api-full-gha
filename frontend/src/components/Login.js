import { Link } from 'react-router-dom';
import { useForm } from '../hooks/useForm.js';

function Login({ onLogin }) {
  const { values, handleChange } = useForm({ email: '', password: '' });

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin(values);
  }

  return (
    <section className='auth'>
      <div className='auth__container'>
        <h3 className='auth__title'>Вход</h3>
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
            placeholder='E-mail'
            minLength='2'
            maxLength='30'
            autoComplete='email'
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
            autoComplete='off'
          />

          <button to='/sign-up' className='auth__submit-button' type='submit'>Войти</button>
        </form>
        <div className='auth__signup'>
          <p>Еще не зарегистрированы?</p>
          <Link to='/sign-up' className='auth__link'>Регистрация</Link>
        </div>
      </div>
    </section>
  );
}

export { Login };
