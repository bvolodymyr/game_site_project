const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

jest.mock('jsonwebtoken');
jest.mock('../models', () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

describe('Auth middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn().mockReturnValue('Bearer validtoken'),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'testsecret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should authenticate valid token and set req.user', async () => {
    const decodedToken = { id: 123 };
    const fakeUser = { id: 123, name: 'Test User' };

    jwt.verify.mockReturnValue(decodedToken);
    User.findByPk.mockResolvedValue(fakeUser);

    await auth(req, res, next);

    expect(req.user).toEqual(fakeUser);
    expect(req.token).toBe('validtoken');
    expect(next).toHaveBeenCalled();
  });

  test('should reject invalid token', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Please authenticate' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject if no user found', async () => {
    jwt.verify.mockReturnValue({ id: 123 });
    User.findByPk.mockResolvedValue(null); // no user

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Please authenticate' });
    expect(next).not.toHaveBeenCalled();
  });
});
