/**
 * OPERAÇÕES DE CRUD
 * Create -> Post
 * Read -> GET
 * Update -> Put / Patch
 * Delete -> Delete
 */
const getAllUsers = async () => {
  try {
    const connection = await fetch("http://localhost:3000/users");
    if (!connection.ok) {
      throw new Error(
        `${connection.status} ${connection.statusText}\nNão foi possível exibir todos os usuários!`
      );
    }
    const connectionConversion = await connection.json();
    return connectionConversion;
  } catch (e) {
    alert(e);
  }
};

const createUser = async (user) => {
  try {
    const newUser = await fetch(`http://localhost:3000/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!newUser.ok) {
      throw new Error(
        `${newUser.status} ${newUser.statusText}\nNão foi possível criar um novo usuário!`
      );
    }
    const newUserConvertion = await newUser.json();
    return newUserConvertion;
  } catch (e) {
    alert(e);
  }
};

const getUserById = async (id) => {
  try {
    const getUserId = await fetch(`http://localhost:3000/users/${id}`);
    if (!getUserId.ok) {
      throw new Error(
        `${getUserId.status} ${getUserId.statusText}\nNão foi possível acessar os dados do usuário!`
      );
    }
    const getUserIdConvertion = await getUserId.json();
    return getUserIdConvertion;
  } catch (e) {
    alert(e);
  }
};

const updateUser = async (id, userAtualized) => {
  try {
    const newUser = await fetch(`http://localhost:3000/users/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userAtualized),
    });

    if (!newUser.ok) {
      throw new Error(
        `${newUser.status} ${newUser.statusText}\nNão foi possível atualizar os dados do usuário!`
      );
    }
    const newUserConvertion = newUser.json();
    return newUserConvertion;
  } catch (e) {
    alert(e);
  }
};

const deleteUser = async (id) => {
  const urlCompleted = `http://localhost:3000/users/${id}`;
  try {
    const deletUser = await fetch(urlCompleted, {
      method: "DELETE",
    });
    if (!deletUser.ok) {
      throw new Error(
        `${deletUser.status} ${deletUser.statusText}\nNão foi possível deletar o usuário!`
      );
    }
  } catch (e) {
    alert(e);
  }
};
export { getAllUsers, createUser, getUserById, updateUser, deleteUser };
