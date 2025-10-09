const ApiResponse = require('../utils/response.js');
const { ApiError } = require('../middleware/error.middleware.js');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require('../utils/jwt.js');
const db = require('../models');
const { User, AuthToken, Sequelize } = db;
const { Op } = Sequelize;
const bcrypt = require('bcrypt');

const asynchandler = require('../utils/asynchandler.js');

class AuthController {
  // Register a new user
  static register = asynchandler(async (req, res) => {
    const { username, email, password, fullname } = req.body;
    if (!username || !email || !password || !fullname) {
      throw new ApiError(
        400,
        'Username, email, password, and fullname are required'
      );
    }

    console.log(`before user creation`, username, email, fullname, password);

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
      password_hash: hashedPassword,
      name: fullname,
    });

    const accessToken = generateAccessToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });

    const refreshToken = generateRefreshToken({ id: newUser.id });
    if (!accessToken || !refreshToken) {
      throw new ApiError(500, 'Token generation failed');
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Set expiration to 7 days from now

    await AuthToken.create({
      user_id: newUser.id,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.status(201).json(
      ApiResponse.success(
        'User registered successfully',
        {
          accessToken,

          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.profile_pic,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
          },

          needSetup: !newUser.username, // true if username is not set
        },
        201
      )
    );
  }); // Done working on it

  // Login user
  static login = asynchandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(400, 'Username and password are required');
    }

    const user = await User.findOne({
      // Allow login with username or email
      where: {
        [Op.or]: [{ username: username }, { email: username }],
      },
    }); // Allow login with username or email

    if (!user) {
      throw new ApiError(401, 'Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash); // Compare hashed passwords

    if (!isMatch) {
      throw new ApiError(401, 'Invalid username or password'); // Unauthorized
    }

    const accessToken = generateAccessToken({
      id: user.id,
      username: user.username,
      email: user.email,
    }); // Generate access token
    const refreshToken = generateRefreshToken({ id: user.id }); // Generate refresh token

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, 'Token generation failed'); // Internal Server Error
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Set expiration to 7 days from now

    await AuthToken.findOne({ user_id: user.id }).then(
      async (existingToken) => {
        if (existingToken) {
          await AuthToken.update(
            { token: refreshToken, expires_at: expiresAt },
            { where: { user_id: user.id } }
          );
        } else {
          await AuthToken.create({
            user_id: user.id,
            token: refreshToken,
            expires_at: expiresAt,
          });
        }
      }
    ); // Upsert refresh token

    // Set refresh token in HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.status(200).json(
      ApiResponse.success(
        'User logged in successfully',
        {
          accessToken,

          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.profile_pic,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          needSetup: !user.username, // true if username is not set
        },

        200
      )
    );
  }); // Done working on it

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

  static getUserData = asynchandler(async (req, res) => {
    // req.user is set by authMiddleware
    if (!req.user || !req.user.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: [
        'id',
        'username',
        'email',
        'name',
        'profile_pic',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res
      .status(200)
      .json(
        ApiResponse.success('User data fetched successfully', { user }, 200)
      );
  });
}

module.exports = AuthController;
