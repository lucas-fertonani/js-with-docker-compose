import express from 'express';
import pool from './config/db.js';
import { createUser, loginUser, meUser } from './services/user/user.js';

const port = 3000;

const app = express();
app.use(express.json());

app.get('/api/user/me', async (req, res) => {
    await meUser(req, res);
});

app.post('/api/user/cadastro', async (req, res) => {
    await createUser(req, res);
});

app.post('/api/user/login', async (req, res) => {
    await loginUser(req, res);
});

app.listen(port, () => console.log(`Server has been started on port ${port}`));