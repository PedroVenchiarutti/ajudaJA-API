const express = require("express");
const querys = require("../helpers/querys");
const ApiError = require("../error/apiError");
const newDate = require("../helpers/newDate");

// Trazendo o Dados do client que esta vinculado com o user por chave estrangeira
exports.getAllKeys = async (req, res, next) => {
  /*
        #swagger.tags = ['Private / Client']
        #swagger.security = [{
            "bearerAuth": []
          },
        ]

   */

  try {
    querys
      .selectKey("users", req.params.id)
      .then((result) => {
        // convertendo a data para padrao brazileiro
        const date = result.birthday;
        const data = {
          ...result,
          birthday: newDate.dayFormat(date),
        };

        res.status(200).json({
          message: "Dados do cliente",
          user: {
            id: result.id,
            username: result.username,
            email: result.email,
          },
          user_informations: {
            idinfo: result.idinfo,
            birthday: data.birthday,
            emergencynumber: result.emergencynumber,
            helth_insurance: result.helth_insurance,
            gender: result.gender,
            name: result.name,
            lastname: result.lastname,
            avatar: result.avatar,
          },
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Atualizando os dados do cliente
exports.updateClient = async (req, res, next) => {
  /*
            #swagger.tags = ['Private / Client']
            #swagger.security = [{
            "bearerAuth": []
          },
        ]
     */

  const { emergencynumber, helth_insurance } = req.body;

  if (!emergencynumber || !helth_insurance) {
    next(ApiError.badRequest("Dados invalidos"));
  }

  try {
    querys
      .updateClient("users_informations", req.body, req.params.id)
      .then((result) => {
        res.status(200).json({
          message: "Dados atualizados com sucesso",
          client: result,
        });
      })
      .catch((err) => {
        console.log(err);
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Adicionando alergias ao cliente
exports.addAllergy = async (req, res, next) => {
  /*
            #swagger.tags = ['Public / Client']
            #swagger.security = [{
            "bearerAuth": []
          },
        ],
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Objeto com os dados da alergia',
            required: true,
            type: 'object',
            schema: { 
              $info_id: "35",
              $name_illness: "Alergia",
              $description: "Alergia a poeira"
            }
        }

     */
  const body = req.body;
  console.log(body);

  try {
    /*   querys
      .insert("ill_allergy", body)
      .then((result) => {
        res.status(200).json({
          message: "Alergia cadastrada com sucesso",
          allergyClient: result,
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      }); */
    querys
      .insertMulti("ill_allergy", body)
      .then((result) => {
        res.status(200).json({
          message: "Alergia cadastrada com sucesso",
          allergyClient: result,
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Atualizando alergias do cliente
exports.updateAllergy = async (req, res, next) => {
  /*
            #swagger.tags = ['Private / Client']
            #swagger.security = [{
            "bearerAuth": []
          },
        ],
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Objeto com os dados da alergia',
            required: true,
            type: 'object',
            schema: {
              $name_illness: "Alergia",
              $description: "Alergia a pelvis"
            }
        }

     */

  try {
    querys
      .updateAll("ill_allergy", req.body, req.params.id, "idallergy")
      .then((result) => {
        res.status(200).json({
          message: "Alergia atualizada com sucesso",
          allergyClient: result,
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Deletando uma alergia cadastrada
exports.deleteAllergy = async (req, res, next) => {
  /*
            #swagger.tags = ['Private / Client']
            #swagger.security = [{
            "bearerAuth": []
          },
        ]
     */

  try {
    querys
      .delete("ill_allergy", req.params.id, "idallergy")
      .then((result) => {
        res.status(200).json({
          message: "Alergia deletada com sucesso",
          allergyClient: result,
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

exports.getPublicDate = async (req, res, next) => {
  /*
            #swagger.tags = ['Public / Client']
            #swagger.security = [{
            "bearerAuth": []
          },
        ]
     */
  const { id } = req.params;

  try {
    querys.selectPublicData(id).then((result) => {
      const data = [];

      // buscando pelo user_id

      const map = result.map((item) => {
        const description = item.description;
        data.push({
          id: item.idallergy,
          description: description,
        });
        return data;
      });

      if (result.length == 0) {
        return next(ApiError.badRequest("Cliente nao tem alergia cadastrada"));
      }

      res.status(200).json({
        message: "Dados publicos do cliente",
        client: {
          name: result[0]?.name,
          lastname: result[0]?.lastname,
          emergencynumber: result[0]?.emergencynumber,
          helth_insurance: result[0]?.helth_insurance,
          birthday: result[0]?.birthday,
          avatar: result[0]?.avatar,
          allergy: data || [],
          idinfo: result[0]?.idinfo,
        },
      });
      console.log(result);
    });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};
