import { toast } from 'react-toastify';

// Custom toast functions with consistent styling and messaging
export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      position: "top-right",
      autoClose: 5000, // Longer for errors
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  warning: (message, options = {}) => {
    return toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  info: (message, options = {}) => {
    return toast.info(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Custom toast with loading state
  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      ...options
    });
  },

  // Update existing toast (useful for loading states)
  update: (toastId, message, type = 'default', options = {}) => {
    return toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Dismiss specific toast
  dismiss: (toastId) => {
    return toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    return toast.dismiss();
  }
};

// Pre-configured messages for common scenarios
export const toastMessages = {
  auth: {
    loginSuccess: "Welcome back! 🎉",
    loginError: "Login failed. Please check your credentials.",
    logoutSuccess: "Logged out successfully 👋",
    registerSuccess: "Account created successfully! 🎉",
    registerError: "Registration failed. Please try again.",
    passwordResetSent: "Password reset email sent! 📧",
    passwordResetError: "Failed to send reset email. Please try again.",
    usernameSetupSuccess: "Username set successfully! ✨",
    usernameSetupError: "Failed to set username. Please try again."
  },
  
  chat: {
    messageSent: "Message sent 📤",
    messageError: "Failed to send message. Please try again.",
    groupCreated: "Group created successfully! 👥",
    groupCreateError: "Failed to create group. Please try again.",
    userJoined: "User joined the chat 👋",
    userLeft: "User left the chat 👋"
  },
  
  general: {
    loading: "Loading...",
    success: "Operation completed successfully! ✅",
    error: "Something went wrong. Please try again.",
    networkError: "Network error. Please check your connection.",
    unauthorized: "You are not authorized to perform this action.",
    notFound: "The requested resource was not found."
  }
};

export default showToast;
