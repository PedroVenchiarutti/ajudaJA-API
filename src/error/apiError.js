class ApiError {
  constructor(code, message) {
    this.message = message;
    this.code = code;
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static notFound(msg) {
    return new ApiError(404, msg);
  }

  static forbidden(msg) {
    return new ApiError(403, msg);
  }

  static notAcceptable(msg) {
    return new ApiError(406, msg);
  }

  static internalError(msg) {
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;
