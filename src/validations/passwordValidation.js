const yup = require("yup");

const passwordToExchange = yup.object().shape({
  password: yup.string().required({ message: "Senha atual é obrigatória" }),
  newPassword: yup
    .string()
    .required({ message: "A nova senha é obrigatória" })
    .min(6, { message: "A senha deve ter no minimo 6 caracteres" }),
  confirmPassword: yup.string().oneOf([yup.ref("newPassword"), null], {
    message: "As senhas nao sao iguais",
  }),
});

module.exports = passwordToExchange;
