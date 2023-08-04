class Auth {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _request(path, method, data) {
    let body = data;
    if ((method === 'PATCH' || method === 'POST') && data) {
      body = JSON.stringify(data);
    }
    return fetch(this._url + path, {
      method,
      headers: this._headers,
      body,
    })
    .then(this._getResponseData);
  }

  register(data) {
    return this._request(`/signup`, 'POST', data);
  }

  login(data) {
    return this._request(`/signin`, 'POST', data);
  }

  checkToken(jwt) {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${jwt}`,
      },
    }).then(this._getResponseData);
  }
}

const auth = new Auth({
  url: 'https://auth.nomoreparties.co', // сервер хранения данных
  headers: {
    'Content-Type': 'application/json',
  },
});

export { auth };