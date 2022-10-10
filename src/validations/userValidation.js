const yup = require("yup");

// Regex para validar telefone e celular
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const userSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas nao sao iguais")
    .required(),
  birthday: yup.date().required(),
  emergencynumber: yup
    .string()
    .required()
    .matches(phoneRegExp, "Numero de telefone invalido")
    .max(11, "Numero de telefone invalido muito grande"),
  gender: yup.string().required(),
  name: yup.string().required(),
});

module.exports = userSchema;
