import pool from "../../config/db.js";
import { queryBuilder } from "./utils/query-builder.js";

export const getClients = async (req, res) => {
  const userId = req.user.id;

  const getClients = await pool.query(
    `
        SELECT * FROM clientes
        WHERE userid = $1
          AND deleted_at IS NULL
    `,
    [userId]
  );

  const clients = getClients.rows.map((client) => {
    delete client.userid;
    delete client.deleted_at;
    return client;
  });

  return res.status(200).json({
    success: true,
    data: clients,
  });
};

export const createClients = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      error: "body is required",
    });
  }

  const { name, phone, birthDate } = req.body;
  const userId = req.user.id;

  if (!(name && phone && birthDate)) {
    return res.status(400).json({
      success: false,
      error: "name, phone and birthDate are required",
    });
  }

  try {
    const clientInseted = await pool.query(
      `
        INSERT INTO clientes (name, phone, birthdate, userid)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [name, phone, birthDate, userId]
    );

    const client = clientInseted.rows[0];

    delete client.userid;
    delete client.updated_at;
    delete client.deleted_at;

    return res.status(201).json({
      success: true,
      data: client,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: `Error trying insert on database ${e}`,
    });
  }
};

export const getClientById = async (req, res) => {
  const clientId = req.params.id;
  const userId = req.user.id;

  if (!clientId) {
    return res.status(400).json({
      success: false,
      error: "Error: id is not found",
    });
  }

  const clients = await pool.query(
    `
      SELECT * FROM clientes
      WHERE id = $1
        AND userid = $2
        AND deleted_at IS NULL
    `,
    [clientId, userId]
  );

  if (clients.rows.length == 0) {
    return res.status(404).json({
      success: false,
      error: "clients rows is 0",
    });
  }

  const formatedClient = clients.rows[0];
  delete formatedClient.deleted_at;
  delete formatedClient.userid;

  return res.status(200).json({
    success: true,
    data: formatedClient,
  });
};

export const postClientById = async (req, res) => {
  const userId = req.user.id;
  const clientId = req.params.id;

  const allowedFields = ["name", "phone", "birthDate"];

  const bodyKeys = Object.keys(req.body);
  const hasInvalidFields = bodyKeys.some((key) => !allowedFields.includes(key));

  if (hasInvalidFields) {
    return res.status(400).json({
      success: false,
      error: `Invalid fields. Allowed fields: [${allowedFields.join(", ")}]`,
    });
  }

  if (!(req.body.name || req.body.phone || req.body.birthDate)) {
    return res.status(400).json({
      success: false,
      error: "send anyone of this filds: [name, phone, birthdate]",
    });
  }

  const query = queryBuilder(req.body, clientId, userId);

  try {
    await pool.query(query);
    return res.status(201).json({
      success: true,
      data: {
        clientId,
        fieldsUpdated: req.body,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e,
    });
  }
};

export const deleteClientById = async (req, res) => {
  const userId = req.user.id;
  const clientId = req.params.id;

  if (!clientId) {
    return res.status(400).json({
      success: false,
      error: "clientId is required",
    });
  }

  try {
    await pool.query(
      `
      UPDATE clientes
      SET deleted_at = CURRENT_DATE
      WHERE id = $1
        AND userid = $2
      `,
      [clientId, userId]
    );

    return res.status(200).json({
      success: true,
      data: {
        clientDeleted: clientId,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e,
    });
  }
};
