export const AUTH_COOKIE_CONSTANTS = {
  REFRESH_TOKEN_NAME: 'ms_refresh',
  MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const AuthMessages = {
  REGISTERED: 'Registration successful.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logout successful.',
  LOGOUT_ALL_SUCCESS: 'All sessions have been logged out successfully.',
  REFRESH_SUCCESS: 'Token refreshed successfully.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_NOT_FOUND: 'Account not found.',
  ACCOUNT_INACTIVE: 'Your account is inactive.',
  ACCOUNT_LOCKED: 'Your account is temporarily locked. Please try again later.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  DEFAULT_ROLE_NOT_CONFIGURED: 'Registration is temporarily unavailable. Default user role is not configured.',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required.',
  INVALID_ACCESS_TOKEN: 'Invalid or expired access token.',
  SESSION_NOT_FOUND: 'Session not found.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  INVALID_CURRENT_PASSWORD: 'Current password is incorrect.',
};
