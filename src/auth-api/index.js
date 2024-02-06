const express = require("express");
const cors = require("cors");
const knexConfig = require("./knexfile").db;
const knex = require("knex")(knexConfig);

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Ola Express!" });
});

app.get("/teachers", async (req, res) => {
  try {
    const teachers = await knex.select("*").from("teachers");
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
});

app.post('/register', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Verifica se o usuário já existe
      const existingUser = await knex('users').where({ username }).first();
      if (existingUser) {
          return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash da senha antes de armazenar no banco de dados
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insere o novo usuário no banco de dados
      await knex('users').insert({
          username,
          password: hashedPassword,
      });

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error registering user');
  }
});

// Endpoint de login
app.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Verifica se o usuário existe
      const user = await knex('user').where({ username }).first();
      if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compara as senhas usando bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Gera um token JWT
      const token = jwt.sign({ userId: user.id, username: user.username }, 'your-secret-key', {
          expiresIn: '1h',
      });

      res.json({ token });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error during login');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
