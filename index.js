require('dotenv').config();
const express = require('express');
const usersRoutes = require('./Routes/Users/index');
const groupTeachRoutes = require('./Routes/Class/index');
const app = express();
const PORT =  process.env.PORT || 3003;
app.use(express.json());
app.use('/api/usuarios',usersRoutes);
app.use('/api/grupos',groupTeachRoutes);
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.post('/', async ( req, res) => 
{

  let response = 
  {
    error: false,
    codigo: 200,
    mensaje: 'QS',
    datos: '.'
  };
  return res.status(200).send(response);
});

