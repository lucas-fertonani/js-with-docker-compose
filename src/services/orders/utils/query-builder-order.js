import pool from "../../../config/db";

export const queryBuilderOrder = async (req, res) => {
  const userId = req.user.id;
  const clienteId = req.params.id;

  const value_column = await pool.query(
    `
    SELECT valor pedidos
    WHERE id = $1
      AND userid = $2
    `,
    [clienteId, userId]
  );

  const descount_column = await pool.query(
    `
    SELECT desconto pedidos
    WHERE id = $1
      AND userid = $2
    `,
    [clienteId, userId]
  );

  const update_value_and_descount = await pool.query(
    `
      UPDATE pedidos
      SET valor = $1, desconto = $2
      WHERE id = $3
        AND userid = $4
        AND deleted_at IS NULL
      `[(value_column, descount_column, clienteId, userId)]
  );
};
