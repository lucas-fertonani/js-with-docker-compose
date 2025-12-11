import express from "express";
import cors from "cors";
import { createUser, loginUser } from "./services/user/user.js";
import { auth } from "./services/middleware/auth.js";
import {
  getClientById,
  createClients,
  getClients,
  postClientById,
  deleteClientById,
} from "./services/customer/customer.js";
import {
  getOrders,
  getOrderById,
  createOrders,
  deleteOrdersById,
  getOrdersClientsById,
  postOrdersById,
} from "./services/orders/orders.js";

const port = 3000;

const app = express();
app.use(express.json());

// Habilita CORS para todas as origens e métodos
app.use(cors());

app.post("/api/user/cadastro", async (req, res) => {
  await createUser(req, res);
});

app.post("/api/user/login", async (req, res) => {
  await loginUser(req, res);
});

app.get("/api/user/me", auth, async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

app.get("/api/cliente", auth, async (req, res) => {
  await getClients(req, res);
});

app.get("/api/cliente/:id", auth, async (req, res) => {
  await getClientById(req, res);
});

app.post("/api/cliente", auth, async (req, res) => {
  await createClients(req, res);
});

app.post("/api/cliente/:id", auth, async (req, res) => {
  await postClientById(req, res);
});

app.delete("/api/cliente/:id", auth, async (req, res) => {
  await deleteClientById(req, res);
});

app.get("/api/pedidos", auth, async (req, res) => {
  await getOrders(req, res);
});

app.get("/api/pedidos/:id", auth, async (req, res) => {
  await getOrderById(req, res);
});

app.post("/api/pedidos", auth, async (req, res) => {
  await createOrders(req, res);
});

app.delete("/api/pedidos/:id", auth, async (req, res) => {
  await deleteOrdersById(req, res);
});

app.get("/api/pedidos/cliente/:id", auth, async (req, res) => {
  await getOrdersClientsById(req, res);
});

app.post("/api/pedidos/:id", auth, async (req, res) => {
  await postOrdersById(req, res);
});
app.listen(port, () => console.log(`Server has been started on port ${port}`));
