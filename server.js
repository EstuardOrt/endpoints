const express = require('express');
const connectDB = require('./config/database');
const rutas = require('./routes/routes');

const app = express();

app.use(express.json());

connectDB();

app.use('/api', rutas);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
