import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./api";

const inputFocus = document.querySelector("[data-name]");
const divTable = document.querySelector("[data-table]");
let dynamicId = 0;
const getModifiedPhone = (phone) => phone.replace(/[\(\)\s-]/g, "");

const hideDisplay = () => {
  formEdit.style.display = "none";
};
const showDisplay = () => {
  formEdit.style.display = "flex";
};

//Função para decidir se o formulário dinamico será escondido
const hideOrShow = (id) => {
  if (id === dynamicId) {
    hideDisplay();
    inputFocus.focus();
  } else {
    inputNameEdit.focus();
  }
};

//Criar célula da tabela
const createRowCell = (text) => {
  const td = document.createElement("td");
  td.textContent = text;
  td.className = "py-3 px-6";
  return td;
};

//Criar célula de botão na tabela
const createRowButton = (text, fn) => {
  const td = document.createElement("td");
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = fn;
  btn.className =
    "h-10 px-6 font-semibold rounded-md border bg-black text-white";
  td.append(btn);
  return td;
};

//Atualizar e exibir a tabela de usuários
const updateTable = async () => {
  const allUsers = await getAllUsers();
  const tBody = document.querySelector("#tbody");
  tBody.innerHTML = "";

  allUsers.forEach((user) => {
    const tr = document.createElement("tr");

    const tdName = createRowCell(user.name);
    const tdNickname = createRowCell(user.nickname);
    const tdEmail = createRowCell(user.email);
    const tdPhone = createRowCell(user.phone);
    const tdDelete = createRowButton("Deletar", () => onDelete(user.id));
    const tdEdit = createRowButton("Editar", () => onEditTable(user.id));

    tr.append(tdName, tdNickname, tdEmail, tdPhone, tdEdit, tdDelete);

    tBody.append(tr);
  });
};
const btnUpdateTable = document.querySelector("[data-table-btn]");
btnUpdateTable.addEventListener("click", () => updateTable());

//Criar novo usuário
const onSubmit = async (event) => {
  event.preventDefault();

  const inputPhoneFormatted = getModifiedPhone(
    document.querySelector("[data-phone]").value
  );

  const newUser = {
    name: document.querySelector("[data-name]").value,
    nickname: document.querySelector("[data-nickname]").value,
    email: document.querySelector("[data-email]").value,
    phone: inputPhoneFormatted,
    password: document.querySelector("[data-password]").value,
    passwordConfirm: document.querySelector("[data-confirm-password]").value,
  };

  const invalidPassword = checkPassword(newUser);
  if (invalidPassword) return;

  const allUsers = await getAllUsers();

  const hasDuplicated = validateForm(newUser, allUsers);
  if (hasDuplicated) return;

  try {
    await createUser(newUser);
    alert("Usuário criado com sucesso!");
    updateTable();
    form.reset();
    inputFocus.focus();
  } catch (e) {
    alert(e);
  }
};
const form = document.querySelector("[data-static-form]");
form.addEventListener("submit", onSubmit);

//Deletar usuário
const onDelete = async (id) => {
  const confirmation = confirm(`Tem certeza que deseja deletar este usuário?`);

  if (confirmation) {
    await deleteUser(id);
    alert("Usuário deletado!");
    hideOrShow(id);
    updateTable();
    inputFocus.focus();
  } else {
    alert("Operação cancelada!");
    inputNameEdit.focus();
  }
};

//Inputs de editar usuário
const inputNameEdit = document.querySelector("[data-edit-name]");
const inputNicknameEdit = document.querySelector("[data-edit-nickname]");
const inputEmailEdit = document.querySelector("[data-edit-email]");
const inputPhoneEdit = document.querySelector("[data-edit-number]");
const inputPasswordEdit = document.querySelector("[data-edit-password]");
const inputPasswordConfirmEdit = document.querySelector(
  "[data-edit-password-confirm]"
);

//Abrir formulário de edição
const onEditTable = async (id) => {
  const user = await getUserById(id);
  dynamicId = id;

  showDisplay();
  inputNameEdit.focus();

  inputNameEdit.value = user.name;
  inputNicknameEdit.value = user.nickname;
  inputEmailEdit.value = user.email;
  inputPhoneEdit.value = user.phone;
  inputPasswordEdit.value = user.password;
};

//Cancelar edição de usuário
const onEditCancel = () => {
  const confirm = window.confirm("Deseja cancelar a edição ?");
  if (confirm) {
    // esconder formulario de edicao
    dynamicId = 0;
    hideDisplay();
    inputFocus.focus();
  } else {
    // mostrar formulario de edicao
    showDisplay();
    inputNameEdit.focus();
  }
};
const btnCancelEdit = document.querySelector("[data-cancel-btn]");
btnCancelEdit.onclick = () => onEditCancel();

//Salvar edição de usuário
const onEdit = async (event) => {
  event.preventDefault();

  const modifiedUser = {
    name: inputNameEdit.value,
    nickname: inputNicknameEdit.value,
    email: inputEmailEdit.value,
    phone: getModifiedPhone(inputPhoneEdit.value),
    password: inputPasswordEdit.value,
    passwordConfirm: inputPasswordConfirmEdit.value,
  };

  const invalidPassword = checkPassword(modifiedUser);
  if (invalidPassword) return;

  const allUsers = await getAllUsers();
  const allUsersExceptEdit = allUsers.filter((user) => user.id !== dynamicId);

  const hasDuplicated = validateForm(modifiedUser, allUsersExceptEdit);
  if (hasDuplicated) return;

  await updateUser(dynamicId, modifiedUser);
  alert("As modificações foram salvas!");
  formEdit.reset();
  hideDisplay();
  updateTable();
  inputFocus.focus();
};
const formEdit = document.querySelector("[data-dynamic-form]");
formEdit.addEventListener("submit", (e) => onEdit(e));

//Possíveis tipos de erros
const errorTypes = [
  "patternMismatch",
  "tooLong",
  "tooShort",
  "typeMismatch",
  "valueMissing",
];

const getPatternMismatchMsg = (field, text) =>
  `É preciso que o formato do ${field} corresponda ao exigido. ${text}`;
const getMaxValueMsg = (field, num) =>
  `O campo de ${field} pode ter no máximo ${num} caracteres.`;
const getMinValueMsg = (field, num) =>
  `O campo de ${field} precisa ter no mínimo ${num} caracteres.`;
const getTypeMismatchMsg = (text) => `Caracteres permitidos: ${text}`;
const getValueMissingMsg = (field) => `O campo de ${field} está vazio!`;
const getPatternPasswordMsg = () =>
  `A senha pode conter caracteres alfanúmericos e especiais. (ex. @.#$%&*?_!)`;

//Mensagens customizadas para possíveis erros
const errorMsgs = {
  name: {
    patternMismatch: getPatternMismatchMsg(
      "nome",
      "Não é permitido números e caracteres especiais."
    ),
    tooLong: getMaxValueMsg("nome", "40"),
    tooShort: getMinValueMsg("nome", "3"),
    typeMismatch: getTypeMismatchMsg("de A-Z."),
    valueMissing: getValueMissingMsg("nome"),
  },
  nickname: {
    patternMismatch: getPatternMismatchMsg(
      "apelido",
      "Não é permitido números e caracteres especiais."
    ),
    tooLong: getMaxValueMsg("apelido", "20"),
    tooShort: getMinValueMsg("apelido", "2"),
    typeMismatch: getTypeMismatchMsg("de A-Z e ponto(.)"),
    valueMissing: getValueMissingMsg("apelido"),
  },
  email: {
    patternMismatch: getPatternMismatchMsg(
      "email",
      "Exemplo: email@hotmail.com"
    ),
    tooLong: getMaxValueMsg("email", "64"),
    tooShort: getMinValueMsg("email", "13"),
    typeMismatch: getTypeMismatchMsg("@_-."),
    valueMissing: getValueMissingMsg("email"),
  },
  phone: {
    patternMismatch: getPatternMismatchMsg(
      "telefone",
      "Exemplo: (12)91234-5678"
    ),
    tooLong: getMaxValueMsg("telefone", "15"),
    tooShort: getMinValueMsg("telefone", "10"),
    typeMismatch: getTypeMismatchMsg("() - 0-9"),
    valueMissing: getValueMissingMsg("telefone"),
  },
  password: {
    patternMismatch: getPatternPasswordMsg(),
    tooLong: getMaxValueMsg("senha", "20"),
    tooShort: getMinValueMsg("senha", "8"),
    typeMismatch: getTypeMismatchMsg("A-z, 0-9, (@.#$%&*?_!)"),
    valueMissing: getValueMissingMsg("senha"),
  },
  confirmPassword: {
    patternMismatch: getPatternPasswordMsg(),
    tooLong: getMaxValueMsg("confirmar senha", "20"),
    tooShort: getMinValueMsg("senha", "8"),
    typeMismatch: getTypeMismatchMsg("A-z, 0-9, (@.#$%&*?_!)"),
    valueMissing: getValueMissingMsg("confirmar senha"),
  },
};

//Validação de campos
const validateField = (field) => {
  const smallMsgError = field.parentNode.querySelector("[data-small]");
  const name = field.name;
  const errorMsg = errorMsgs[name];

  for (let i = 0; i < errorTypes.length; i++) {
    const errorType = errorTypes[i];
    const hasError = field.validity[errorType] === true;
    if (hasError) {
      const error = errorMsg[errorType];
      smallMsgError.textContent = `${error}`;
      break;
    } else {
      smallMsgError.textContent = "";
    }
  }
};
const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("blur", () => validateField(input));
});

const validateForm = (user, allUsers) => {
  const validatedFields = {
    email: "e-mail",
    phone: "telefone",
  };

  const keys = Object.keys(validatedFields);

  const hasDuplicated = keys.find((key) =>
    validateDuplicatedField({
      allUsers,
      field: key,
      value: user[key],
      label: validatedFields[key],
    })
  );

  return !!hasDuplicated;
};

//Validando emails e telefones duplicados
const validateDuplicatedField = (param) => {
  //Desestruturando objetos
  const { allUsers, field, value, label } = param;
  if (value === "") return false;

  const duplicatedField = !!allUsers.find((user) => user[field] === value);

  if (duplicatedField) {
    alert(`Este ${label} já está cadastrado no sistema, tente outro!`);
  }

  return duplicatedField;
};

//Testando senhas
const checkPassword = (userObj) => {
  const { password, passwordConfirm } = userObj;

  const samePasswords = validatePassword(password, passwordConfirm);
  return !samePasswords;
};

const validatePassword = (password, confirmPassword) => {
  if (password === confirmPassword) return true;

  alert("As senhas não coincidem. Tente novamente!");
  return false;
};

inputFocus.focus();
updateTable();
