const { User } = require('../models');
const asyncHandler = require('../utils/asynchandler.js');
const ApiResponse = require('../utils/response.js');
const { ApiError } = require('../middleware/error.middleware.js');
const bcrypt = require('bcrypt');

class UserController {
  //get user profile
  static getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res
      .status(200)
      .json(ApiResponse.success('User profile fetched successfully', user));
  });
  //get another user's profile
  static getUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res
      .status(200)
      .json(ApiResponse.success('User profile fetched successfully', user));
  });

  //update user profile
  static updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { name, email, password } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    await user.save();
    res
      .status(200)
      .json(ApiResponse.success('User profile updated successfully', user));
  });

  //delete user account
  static deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    await user.destroy();
    res
      .status(200)
      .json(ApiResponse.success('User account deleted successfully'));
  });

  //set or update avatar

  static updateAvatar = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { avatarUrl } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    user.avatarUrl = avatarUrl;
    await user.save();
    res
      .status(200)
      .json(ApiResponse.success('User avatar updated successfully', user));
  });

  //set or update status message
  static updateStatusMessage = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { statusMessage } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    user.statusMessage = statusMessage;
    await user.save();
    res
      .status(200)
      .json(
        ApiResponse.success('User status message updated successfully', user)
      );
  });

  //set or update display name
  static updateName = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { name } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    user.name = name;
    await user.save();
    res
      .status(200)
      .json(
        ApiResponse.success('User display name updated successfully', user)
      );
  });

  //set or update username
  static updateUsername = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { username } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser && existingUser.id !== userId) {
      throw new ApiError(409, 'Username already exists');
    }
    user.username = username;
    await user.save();
    res
      .status(200)
      .json(ApiResponse.success('Username updated successfully', user));
  });

  //update password
  static updatePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect');
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json(ApiResponse.success('Password updated successfully'));
  });
}
module.exports = UserController;
