import { postgreSqlConnection } from "..";
import { randomUUID } from "node:crypto";
import { userAdmin } from "../../../configs/userAdmin";
import { hash } from "bcrypt";

export async function createAdminUser() {
  try {
    if (!userAdmin.email || !userAdmin.password) {
      throw new Error(
        "As variáveis de ambiente ADMIN_EMAIL ou ADMIN_PASSWORD não estão definidas"
      );
    }

    const db = await postgreSqlConnection();

    const quarySelect = "SELECT * FROM users WHERE email = $1;";
    const res = await db.query(quarySelect, [userAdmin.email]);

    if (res.rows[0]) {
      console.error("Usuário admin já existe!");
      return;
    }

    const id = randomUUID();
    const passwordHash = await hash(userAdmin.password, 10);
    const quaryInsert =
      "INSERT INTO users(id_user, name, email, password, type) VALUES($1, $2, $3, $4, $5);";
    const result = await db.query(quaryInsert, [
      id,
      userAdmin.name,
      userAdmin.email,
      passwordHash,
      userAdmin.isAdmin,
    ]);

    console.log("Usuário admin criado com sucesso!", result.rowCount);
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error);
  }
}