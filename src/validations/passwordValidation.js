const yup = require("yup");

const passwordToExchange = yup.object().shape({
  password: yup.string().required("Senha atual é obrigatória"),
  newPassword: yup
    .string()
    .required("A nova senha é obrigatória")
    .min(6, "A senha deve ter no minimo 6 caracteres"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "As senhas nao sao iguais"),
});

module.exports = passwordToExchange;
