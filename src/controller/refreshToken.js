const RefreshTokenServices = require("../Services/RefreshTokenServices");

class RefreshTokenController {
  async handle(request, response) {
    const refreshToken = request.body.refreshToken;

    const refresh_token_service = new RefreshTokenServices();

    const refresh_token_response = await refresh_token_service.execute(
      refreshToken
    );

    console.log(refresh_token_response);

    return response.json(refresh_token_response);
  }
}

module.exports = RefreshTokenController;
