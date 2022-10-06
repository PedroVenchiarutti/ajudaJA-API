const yup = require("yup");

const userSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas nao sao iguais")
    .required(),
});

module.exports = userSchema;
