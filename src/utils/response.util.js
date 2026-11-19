export class ResponseUtil {
  static success(message = 'Success', data = undefined, meta = undefined) {
    const response = {
      success: true,
      message,
    };
    if (data !== undefined) response.data = data;
    if (meta !== undefined) response.meta = meta;
    return response;
  }

  static created(message = 'Resource created successfully', data = undefined) {
    const response = {
      success: true,
      message,
    };
    if (data !== undefined) response.data = data;
    return response;
  }

  static badRequest(message = 'Bad request', error = undefined) {
    const response = {
      success: false,
      message,
    };
    if (error !== undefined) response.error = error;
    return response;
  }

  static unauthorized(message = 'Unauthorized') {
    return {
      success: false,
      message,
    };
  }

  static forbidden(message = 'Forbidden') {
    return {
      success: false,
      message,
    };
  }

  static notFound(message = 'Resource not found') {
    return {
      success: false,
      message,
    };
  }

  static validationError(message = 'Validation error', error = undefined) {
    const response = {
      success: false,
      message,
    };
    if (error !== undefined) response.error = error;
    return response;
  }

  static serverError(message = 'Internal server error', error = undefined) {
    const response = {
      success: false,
      message,
    };
    if (error !== undefined) response.error = error;
    return response;
  }
}

export default ResponseUtil;
