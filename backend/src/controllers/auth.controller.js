const ApiResponse = require('../utils/response.js');
const { ApiError } = require('../middleware/error.middleware.js');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require('../utils/jwt.js');
const User = require('../models/user.js');
const AuthToken = require('../models/authToken.js');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const asynchandler = require('../utils/asynchandler.js');

class AuthController {
  // Register a new user
  static register = asynchandler(async (req, res) => {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password || !name) {
      throw new ApiError(
        400,
        'Username, email, password, and name are required'
      );
    }
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });
    if (existingUser) {
      throw new ApiError(409, 'Username or email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
    });

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);
    await AuthToken.create({ userId: newUser.id, token: refreshToken });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res
      .status(201)
      .json(
        ApiResponse.success(
          'User registered successfully',
          { accessToken },
          201
        )
      );
  });

  // Login user
  static login = asynchandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ApiError(400, 'Username and password are required');
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new ApiError(401, 'Invalid username or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid username or password');
    }
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await AuthToken.create({ userId: user.id, token: refreshToken });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res
      .status(200)
      .json(
        ApiResponse.success('User logged in successfully', { accessToken }, 200)
      );
  });

  // logout user
  static logout = asynchandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token is required');
    }
    await AuthToken.destroy({ where: { token: refreshToken } });
    res.clearCookie('refreshToken');
    res
      .status(200)
      .json(ApiResponse.success('User logged out successfully', null, 200));
  });

  // Username availability check
  static UsernameAvailability = asynchandler(async (req, res) => {
    const { username } = req.params;
    if (!username) {
      throw new ApiError(400, 'Username is required');
    }
    const user = await User.findOne({ where: { username } });
    if (user) {
      return res
        .status(200)
        .json(
          ApiResponse.success('Username is taken', { available: false }, 200)
        );
    } else {
      return res
        .status(200)
        .json(
          ApiResponse.success('Username is available', { available: true }, 200)
        );
    }
  });

  // Refresh access token using refresh token
  static refreshAccessToken = asynchandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token is required');
    }

    let payload;
    try {
      payload = verifyToken(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new ApiError(
        403,
        'Refresh token is invalid or expired please login again'
      );
    }

    const storedToken = await AuthToken.findOne({
      where: { token: refreshToken },
    });
    if (!storedToken) {
      throw new ApiError(
        401,
        'Refresh token is invalid or expired please login again'
      );
    }

    const findUser = await User.findByPk(payload.userId);
    if (!findUser) {
      throw new ApiError(404, 'User not found');
    }

    const newAccessToken = generateAccessToken(findUser.id);
    const newRefreshToken = generateRefreshToken(findUser.id);
    await AuthToken.update(
      { token: newRefreshToken },
      { where: { token: refreshToken } }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie('refreshToken', newRefreshToken, cookieOptions);
    res
      .status(200)
      .json(
        ApiResponse.success(
          'Token refreshed successfully',
          { accessToken: newAccessToken },
          200
        )
      );
  });

  static setUsername = asynchandler(async (req, res) => {
    const { username } = req.body;
    const userId = req.user.id;
    if (!username) {
      throw new ApiError(400, 'Username is required');
    }
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new ApiError(409, 'Username already exists');
    }
    await User.update({ username }, { where: { id: userId } });
    res
      .status(200)
      .json(
        ApiResponse.success(
          'Username set successfully',
          { availability: true },
          200
        )
      );
  });

  static googleCallback = asynchandler(async (req, res) => {
    // Successful authentication, generate tokens and redirect or respond
    const userProfile = req.user; // Retrieved from passport

    if (!userProfile) {
      throw new ApiError(400, 'Google authentication failed'); // This should not happen
    }

    // Check if user exists
    let user = await User.findOne({
      where: { email: userProfile.emails[0].value },
    });

    if (!user) {
      // If user doesn't exist, create a new user
      user = await User.create({
        username: userProfile.emails[0].value.split('@')[0],
        email: userProfile.emails[0].value,
        name: userProfile.displayName,
        password: null, // No password since it's OAuth
        oauth_provider: 'google',
        oauth_id: userProfile.id,
      });
    }

    if (!user.username) {
      // Redirect to frontend to set username
      return res.redirect(`${process.env.FRONTEND_URL}/set-username`);
    }

    const accessToken = generateAccessToken(user.id); // Generate access token
    const refreshToken = generateRefreshToken(user.id); // Generate refresh token
    await AuthToken.create({ userId: user.id, token: refreshToken }); // Store refresh token

    // Set refresh token in HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res
      .status(200)
      .json(
        ApiResponse.success(
          'User authenticated successfully',
          { accessToken },
          200
        )
      );
  });
}

module.exports = AuthController;
