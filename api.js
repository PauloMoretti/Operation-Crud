/**
 * OPERAÇÕES DE CRUD
 * Create -> Post
 * Read -> GET
 * Update -> Put / Patch
 * Delete -> Delete
 */

import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:3000/users/",
});

const messageError = (text, error) => {
  alert(`Não foi possível ${text}! \n${error}`)
}

const getAllUsers = async () => {
  try {
    return (await instance.get("")).data;
  } catch (e) {
    messageError("exibir todos os usuários!", e.message);
  }
};

const createUser = async (user) => {
  try {
    return (await instance.post("", user)).data;
  } catch (e) {
    messageError("criar um novo usuário!", e.message);
  }
};

const getUserById = async (id) => {
  try {
    return (await instance.get(id.toString())).data;
  } catch (e) {
    messageError("acessar os dados do usuário!", e.message);
  }
};

const updateUser = async (id, userAtualized) => {
  try {
    return (await instance.put(id.toString(), userAtualized)).data;
  } catch (e) {
    messageError("atualizar os dados do usuário!", e.message);
  }
};

const deleteUser = async (id) => {
  try {
    return (await instance.delete(id.toString())).data;
  } catch (e) {
    messageError("deletar o usuário!", e.message);
  }
};
export { getAllUsers, createUser, getUserById, updateUser, deleteUser };
