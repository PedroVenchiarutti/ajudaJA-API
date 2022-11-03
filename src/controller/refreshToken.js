const RefreshTokenServices = require("../Services/RefreshTokenServices");
const ApiError = require("../error/apiError");

exports.handle = async (request, response, next) => {
  /*
            #swagger.tags = ['Public / Refresh Token']
            #swagger.security = [{
            "bearerAuth": []
          },
        ]
     */
  try {
    // pegando o refresh token do body
    const refreshToken = request.body.refreshToken;

    // Chamando o serviço para gerar um novo token
    const refresh_token_response = await RefreshTokenServices.execute(
      refreshToken
    );

    // Verificando se existe uma instancia do ApiError e se existir ele retorna o erro
    if (refresh_token_response instanceof ApiError) {
      return response.status(refresh_token_response.status).json({
        message: refresh_token_response.message,
      });
    }

    // retornando o novo token e refreshToken
    return response.status(200).json(refresh_token_response);
  } catch (error) {
    next(ApiError.badRequest(error.message));
  }
};
