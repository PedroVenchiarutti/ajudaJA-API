const db = require("../config/dbconnection");
const querys = require("../helpers/querys");
const ApiError = require("../error/apiError");
const token = require("../config/token");
const rum = require("../config/nodemailer");

const crypto = require("../config/bcrypt");

// Consultar todos os usuarios
exports.getAll = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
      #swagger.security = [{
            "bearerAuth": []
          },
        ]
  */

  try {
    querys
      .select("users")
      .then((result) => {
        const data = result.map((item) => {
          return {
            id: item.id,
            username: item.username,
            email: item.email,
          };
        });
        res.status(200).json(data);
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Consultar Usuario por ID
exports.getById = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
      #swagger.security = [{
            "bearerAuth": []
          },
        ]
  */

  const { id } = req.params;

  try {
    querys.select("users", id).then((result) => {
      res.status(200).json(result);
    });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Adicionar Usuario
exports.add = async (req, res, next) => {
  /*
      #swagger.tags = ['public']
      #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Informações do usuario',
              required: true,
              type: 'object',
              schema: { 
              $username: "Pedro", 
              $email: "teste@teste.com",
              $password: "123456",
              $passwordConfirmation: "123456",
              $birthday: "DD-MM-YYYY",
              $emergencynumber: "11999999999",
              $helth_insurance: "Nao",
              $gender: "M",
              $name: "Pedro",
              $lastname: "Lucas"
              }
    }
  */

  try {
    const { username, email, password } = req.body;
    const hash = await crypto.getHash(password);
    const data = {
      username,
      email,
      password: hash,
    };

    // Verificar se o usuario ja existe
    querys
      .verifyEmail("users", email)
      .then((result) => {
        if (result.length > 0) {
          res.status(400).json({
            message: "Email ja cadastrado! ",
          });
        } else {
          querys
            .insert("users", data)
            .then((result) => {
              const id = result[0].id;
              const {
                birthday,
                emergencynumber,
                helth_insurance,
                gender,
                name,
                lastname,
                avatar,
              } = req.body;

              const data = {
                user_id: id,
                birthday,
                emergencynumber,
                helth_insurance,
                gender,
                name,
                lastname,
                avatar,
              };
              querys
                .insert("users_informations", data)
                .then((results) => {
                  res.status(200).json({
                    message: "Cliente cadastrado com sucesso! ",
                    data: {
                      user: {
                        id: result[0].id,
                        username: result[0].username,
                        email: result[0].email,
                      },
                      user_informations: {
                        ...results[0],
                      },
                    },
                  });
                })
                .catch((err) => {
                  next(ApiError.internal(err.message));
                });
            })
            .catch((err) => {
              next(ApiError.internal(err.message));
            });
        }
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Atualizar todos os dados do usuario por ID username, email
exports.updateAll = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
      #swagger.security = [{
            "bearerAuth": []
          },
        ]
  */
  try {
    const { username, email } = req.body;

    const data = {
      username,
      email,
    };

    querys
      .updateAll("users", data, req.params.id)
      .then((result) => {
        res.status(200).json({
          message: "Usuario atualizado com sucesso! ",
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Atualizar somente o password do usuario por ID
exports.updatePassword = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
      #swagger.security = [{
            "bearerAuth": []
          },
        ]
  */

  try {
    const { password } = req.body;
    const hash = await crypto.getHash(password);

    const data = {
      password: hash,
    };

    querys
      .updatePassword("users", data, req.params.id)
      .then((result) => {
        res.status(200).json({
          message: "Senha atualizada com sucesso! ",
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Deletar o usuario por ID
exports.delete = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
      #swagger.security = [{
            "bearerAuth": []
          },
        ]
  */

  try {
    querys
      .delete("users", req.params.id)
      .then((result) => {
        res.status(200).json({
          message: "Usuario deletado com sucesso! ",
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Password recovery
exports.passwordRecovery = async (req, res, next) => {
  try {
    const { password } = req.body;

    const newToken = await token.decodeToken(req.headers.authorization);

    const hash = await crypto.getHash(password);

    const data = {
      password: hash,
    };

    querys
      .updatePassword("users", data, newToken.id)
      .then((result) => {
        res.status(200).json({
          message: "Senha atualizada com sucesso! ",
        });
      })
      .catch((err) => {
        console.log(err);
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    console.log(e);
    next(ApiError.internal(e.message));
  }
};

exports.generateToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Verificar se o usuario ja existe
    querys
      .verifyEmail("users", email)
      .then(async (result) => {
        if (result.length > 0) {
          const newToken = await token.generateToken(result[0].id, "3m");
          rum(
            "guilherme.carvalho.clear@gmail.com",
            "Recuperação de senha",
            `Para recuperar sua senha utilize esse clique nesse link:http://localhost:3333/api/private/recovery/?token=${newToken}`
          );
          res.status(200).json({
            message: "Email enviado com sucesso. Aguarde alguns minutos! ",
            token: newToken,
          });
        } else {
          res.status(400).json({
            message: "Email nao cadastrado! ",
          });
        }
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};
