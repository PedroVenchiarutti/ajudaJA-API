const yup = require("yup");

const recoveryYup = yup.object().shape({
  password: yup
    .string()
    .required()
    .min(6, "A senha deve ter no minimo 6 caracteres"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas nao sao iguais")
    .required(),
});

module.exports = recoveryYup;
