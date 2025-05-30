// authFunctions.test.js

// Імпортуємо функції (підкоригуй шлях під свій проект)
const {
  registerUser,
  loginUser,
  deleteUsers,
  isLoggedIn,
  getCurrentUser,
  logoutUser,
  getToken
} = require('../public/js/auth-client.js'); // Шлях відносно файлу тесту


// Мок для localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Мок для window.location.href (щоб тестувати logoutUser)
global.window = {};
Object.defineProperty(global.window, 'location', {
  writable: true,
  value: {
    href: '',
  },
});

// Перед кожним тестом чистимо моки
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe('registerUser', () => {
  it('успішно реєструє користувача і зберігає токен та юзера', async () => {
    const fakeResponse = {
      token: 'fake-token',
      user: { username: 'testuser', email: 'test@example.com' }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    const data = await registerUser('testuser', 'test@example.com', 'password123');

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }),
    }));

    expect(localStorage.setItem).toHaveBeenCalledWith('token', fakeResponse.token);
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(fakeResponse.user));
    expect(data).toEqual(fakeResponse);
  });

  it('викидає помилку при невдалому реєстрації', async () => {
    const errorMessage = { message: 'Registration failed' };

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => errorMessage,
    });

    await expect(registerUser('testuser', 'test@example.com', 'password123'))
      .rejects
      .toThrow('Registration failed');
  });
});

describe('loginUser', () => {
  it('успішно логінить користувача і зберігає токен та юзера', async () => {
    const fakeResponse = {
      token: 'login-token',
      user: { username: 'testuser' }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    const data = await loginUser('testuser', 'password123');

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'password123' }),
    }));

    expect(localStorage.setItem).toHaveBeenCalledWith('token', fakeResponse.token);
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(fakeResponse.user));
    expect(data).toEqual(fakeResponse);
  });

  it('викидає помилку при невдалому логіні', async () => {
    const errorMessage = { message: 'Login failed' };

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => errorMessage,
    });

    await expect(loginUser('testuser', 'wrongpassword'))
      .rejects
      .toThrow('Login failed');
  });
});

describe('isLoggedIn', () => {
  it('повертає true, якщо токен є', () => {
    localStorage.setItem('token', 'sometoken');
    expect(isLoggedIn()).toBe(true);
  });

  it('повертає false, якщо токена немає', () => {
    localStorage.removeItem('token');
    expect(isLoggedIn()).toBe(false);
  });
});

describe('getCurrentUser', () => {
  it('повертає обʼєкт користувача, якщо він є', () => {
    const user = { username: 'testuser' };
    localStorage.setItem('user', JSON.stringify(user));
    expect(getCurrentUser()).toEqual(user);
  });

  it('повертає null, якщо користувача немає', () => {
    localStorage.removeItem('user');
    expect(getCurrentUser()).toBeNull();
  });
});

describe('logoutUser', () => {
  it('видаляє токен і користувача з localStorage та редіректить', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));

    logoutUser();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(window.location.href).toBe('/pages/main.html');
  });
});

describe('getToken', () => {
  it('повертає токен з localStorage', () => {
    localStorage.setItem('token', 'token123');
    expect(getToken()).toBe('token123');
  });

  it('повертає null, якщо токена немає', () => {
    localStorage.removeItem('token');
    expect(getToken()).toBeNull();
  });
});
