import pool from "../../config/db.js";

export const getOrders = async (req, res) => {
  const userId = req.user.id;

  const getOrders = await pool.query(
    `
      SELECT * FROM pedidos
      WHERE userid = $1
        AND deleted_at IS NULL
    `,
    [userId]
  );

  const orders = getOrders.rows.map((order) => {
    delete order.userid;
    delete order.deleted_at;
    return order;
  });

  return res.status(200).json({
    success: true,
    data: orders,
  });
};

export const getOrderById = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      error: "Error: id is not found",
    });
  }

  const orders = await pool.query(
    `
      SELECT * FROM pedidos
      WHERE id = $1
        AND userid = $2
        AND deleted_at IS NULL
    `,
    [orderId, userId]
  );

  if (orders.rows.length == 0) {
    return res.status(404).json({
      success: false,
      error: "orders rows is 0",
    });
  }

  const formatedOrder = orders.rows[0];
  delete formatedOrder.deleted_at;
  delete formatedOrder.userid;

  return res.status(200).json({
    success: true,
    data: formatedOrder,
  });
};

export const createOrders = async (req, res) => {
  const userId = req.user.id;

  if (!req.body) {
    return res.status(400).json({
      success: false,
      error: "body is required",
    });
  }

  const { valor, desconto, clienteid } = req.body;

  if (!(valor && desconto && clienteid)) {
    return res.status(400).json({
      success: false,
      error: "valor, desconto and clienteid are required",
    });
  }

  // conferir se o clienteid passado na request, pertence ao usuario que fez request

  const isValidCliente = await pool.query(
    `
      SELECT *
      FROM clientes
      WHERE id = $1
        AND userid = $2
    `,
    [clienteid, userId]
  );

  if (isValidCliente.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: "Client not found",
    });
  }

  try {
    const orderInseted = await pool.query(
      `
        INSERT INTO pedidos (valor, desconto, clienteid, userid)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [valor, desconto || 0, clienteid, userId]
    );

    const order = orderInseted.rows[0];

    delete order.userid;
    delete order.updated_at;
    delete order.deleted_at;

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: `Error trying insert on database ${e}`,
    });
  }
};
