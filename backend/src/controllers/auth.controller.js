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
            { refresh_token: refreshToken, expires_at: expiresAt },
            { where: { user_id: user.id } }
          );
        } else {
          await AuthToken.create({
            user_id: user.id,
            refresh_token: refreshToken,
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
    await AuthToken.destroy({ where: { refresh_token: refreshToken } });
    res.clearCookie('refreshToken');
    res
      .status(200)
      .json(ApiResponse.success('User logged out successfully', null, 200));
  });

  // Username availability check
  static UsernameAvailability = asynchandler(async (req, res) => {
    const { username } = req.params;

    if (!username || username.trim() === '') {
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
        'Refresh token is invalid or expired. Please login again.'
      );
    }

    const storedToken = await AuthToken.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!storedToken) {
      throw new ApiError(
        401,
        'Invalid or revoked refresh token. Please login again.'
      );
    }

    // Optional: check expiry if you store it in DB
    if (storedToken.expires_at && storedToken.expires_at < new Date()) {
      await storedToken.destroy();
      throw new ApiError(403, 'Session expired. Please login again.');
    }

    const user = await User.findByPk(storedToken.user_id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // ✅ Generate only a new short-lived access token
    const newAccessToken = generateAccessToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    // 🚫 Don't re-send refresh cookie — it's already there with its original 7-day expiry

    return res.status(200).json(
      ApiResponse.success('Access token refreshed successfully', {
        accessToken: newAccessToken,
      })
    );
  });

  // Set username for OAuth users
  static setUsername = asynchandler(async (req, res) => {
    const { username } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!username) {
      throw new ApiError(400, 'Username is required');
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new ApiError(409, 'Username already exists');
    }

    // Update username in the User table
    await User.update({ username }, { where: { id: userId } });

    // Fetch updated user data
    const updatedUser = await User.findByPk(userId, {
      attributes: [
        'id',
        'email',
        'username',
        'name',
        'profile_pic',
        'status_message',
      ],
    });

    // Generate new access and refresh tokens
    const accessToken = generateAccessToken({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
    const refreshToken = generateRefreshToken({ id: updatedUser.id });

    // Update refresh token in AuthToken table
    await AuthToken.update(
      {
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { where: { user_id: updatedUser.id } }
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return success response with new access token and updated user
    res
      .status(200)
      .json(
        ApiResponse.success(
          'Username set successfully',
          { accessToken, user: updatedUser },
          200
        )
      );
  });

  // Google OAuth callback
  static googleCallback = async (req, res) => {
    try {
      const profile = req.user; // Passport sets this

      if (!profile || !profile.emails?.[0]?.value) {
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
      }

      // Check if user exists
      let user = await User.findOne({
        where: { email: profile.emails[0].value },
      });

      // If user doesn't exist → create
      if (!user) {
        user = await User.create({
          email: profile.emails[0].value,
          username: null, // no username yet
          name: profile.displayName || profile.emails[0].value.split('@')[0],
          password_hash: '',
          oauth_provider: 'google',
          oauth_id: profile.id,
        });
      }

      // Generate tokens (even if username is null)
      const accessToken = generateAccessToken({
        id: user.id,
        username: user.username,
        email: user.email,
      });
      const refreshToken = generateRefreshToken({ id: user.id });

      // Store refresh token in DB
      await AuthToken.create({
        user_id: user.id,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to frontend with access token
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${accessToken}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error('Google OAuth callback error:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  };

  // get user data for state management
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
    console.log('User data retrieved:', !user.username);
    res
      .status(200)
      .json(
        ApiResponse.success(
          'User data fetched successfully',
          { user, needSetup: !user.username },
          200
        )
      );
  });
}

module.exports = AuthController;
