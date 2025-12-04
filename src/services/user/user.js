import { json } from "express";
import pool from "../../config/db.js";
import { v4 as uuid } from "uuid";

export const createUser = async (req, res) => {
  const { name, age, user, password } = req.body;

  if (!(name && age && user && password)) {
    return res.status(400).json({
      success: false,
      error: "name, age, user and password are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      error: "password need be greater 8",
    });
  }

  const userExists = await pool.query(
    "SELECT id FROM users WHERE username = $1",
    [user]
  );

  if (userExists.rows.length > 0) {
    return res.status(409).json({
      success: false,
      error: "user already exists",
    });
  }

  try {
    const userToken = uuid();

    await pool.query(
      "INSERT INTO users (name, age, username, password, user_token) VALUES($1, $2, $3, $4, $5)",
      [name, age, user, password, userToken]
    );

    return res.status(201).json({
      success: true,
      message: "User has been created",
      token: userToken,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

// Caso o usuario nao coloque user e password
export const loginUser = async (req, res) => {
  const { user, password } = req.body;

  if (!(user && password)) {
    return res.status(400).json({
      sucess: false,
      error: "user and password are required",
    });
  }

  // Caso a senha tem que ter 8 digitos
  if (password.length < 8) {
    return res.status(400).json({
      sucess: false,
      error: "The password is decrease than 8",
    });
  }

  // Caso o user nao exista
  const loginExists = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [user]
  );

  if (loginExists.rows.length == 0) {
    return res.status(401).json({
      sucess: false,
      error: "User not exists",
    });
  }

  try {
    const findUser = loginExists.rows[0];
    if (findUser.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Invalid password",
      });
    }

    const newToken = uuid();

    await pool.query(
      `
        UPDATE users
        SET user_token = $1, updated_at = $2
        WHERE id = $3
        `,
      [newToken, new Date(), findUser.id]
    );

    return res.status(200).json({
      success: true,
      message: "User be logged",
      token: newToken,
    });
  } catch (e) {
    return res.status(500).json({
      sucess: false,
      error: e.message,
    });
  }
};

export const meUser = async (req, res) => {
  const { token } = req.headers;

  const exists = await pool.query("SELECT * FROM users WHERE user_token = $1", [
    token,
  ]);


  if (exists.rows.length == 0) {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  const user = exists.rows[0];

  delete user.password
  delete user.user_token
  
  return res.status(200).json({
    success: true,
    message: "Success verified",
    user: user,
  });
};
