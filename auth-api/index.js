const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const db = knex(require('./knexfile'));

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // verifica se o email com o validator
    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Por favor, insira um email válido' });
    }

    // verifica se o email ja existe na bd
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Este email já está registrado' });
    }

    await db('users').insert({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
});

// Código de Login de utilizador
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user.id }, 'secreto', { expiresIn: '1h' });

    res.json({ message: 'Login efutuado com sucesso!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});