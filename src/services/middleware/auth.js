import pool from "../../config/db.js";

export const auth = async (req, res, next) => {
  console.log(`HTTP -> ${req.path}`);
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

  delete user.password;
  delete user.user_token;

  req.user = user;
  next();
};
