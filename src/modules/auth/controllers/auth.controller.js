import AuthService from '../services/auth.service.js';
import ResponseUtil from '../../../utils/response.util.js';
import AppError from '../../../utils/AppError.js';
import { AuthMessages, AUTH_COOKIE_CONSTANTS } from '../constants/auth.constants.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  getAuditContext = (req) => ({
    ipAddress: req.ip || req.headers['x-forwarded-for'] || null,
    userAgent: req.get('user-agent') || null,
  });

  register = async (req, res, next) => {
    try {
      const result = await this.authService.register(req.body, this.getAuditContext(req));

      res.cookie(AUTH_COOKIE_CONSTANTS.REFRESH_TOKEN_NAME, result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: AUTH_COOKIE_CONSTANTS.MAX_AGE,
      });

      return res.status(201).json(ResponseUtil.created(AuthMessages.REGISTERED, {
        user: result.user,
        accessToken: result.accessToken,
      }));
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.authService.login(req.body, this.getAuditContext(req));

      res.cookie(AUTH_COOKIE_CONSTANTS.REFRESH_TOKEN_NAME, result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: AUTH_COOKIE_CONSTANTS.MAX_AGE,
      });

      return res.status(200).json(ResponseUtil.success(AuthMessages.LOGIN_SUCCESS, {
        user: result.user,
        accessToken: result.accessToken,
      }));
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const rawToken = req.cookies?.[AUTH_COOKIE_CONSTANTS.REFRESH_TOKEN_NAME] || req.body?.refreshToken;
      if (!rawToken) {
        throw new AppError(AuthMessages.REFRESH_TOKEN_REQUIRED, 401);
      }

      const result = await this.authService.refreshToken(rawToken, this.getAuditContext(req));

      res.cookie(AUTH_COOKIE_CONSTANTS.REFRESH_TOKEN_NAME, result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: AUTH_COOKIE_CONSTANTS.MAX_AGE,
      });

      return res.status(200).json(ResponseUtil.success(AuthMessages.REFRESH_SUCCESS, {
        user: result.user,
        accessToken: result.accessToken,
      }));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      if (req.session?.id) {
        await this.authService.logout(req.session.id);
      }

      res.clearCookie(AUTH_COOKIE_CONSTANTS.REFRESH_TOKEN_NAME);
      return res.status(200).json(ResponseUtil.success(AuthMessages.LOGOUT_SUCCESS));
    } catch (error) {
      next(error);
    }
  };

  logoutAll = async (req, res, next) => {
    try {
      await this.authService.logoutAll(req.user.id);
      res.clearCookie(AUTH_COOKIE_CONSTANTS.REFRESH_TOKEN_NAME);
      return res.status(200).json(ResponseUtil.success(AuthMessages.LOGOUT_ALL_SUCCESS));
    } catch (error) {
      next(error);
    }
  };

  me = async (req, res, next) => {
    try {
      return res.status(200).json(ResponseUtil.success('Current user fetched successfully', {
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          profile: req.user.profile,
        },
      }));
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
