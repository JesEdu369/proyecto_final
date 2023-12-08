const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// Configuración de middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '250909Lalo',
  database: 'accesos'
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

// Manejo de la solicitud GET en la ruta raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/new_user.html');
});
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.post('/login', (req, res) => {

  console.log('Usuario recibido:', usuario);
  console.log('Contraseña recibida:', contraseña);

  // Consultar la base de datos para verificar las credenciales
  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?';
  connection.query(sql, [usuario, contraseña], (error, resultados) => {
    if (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).send('Error al intentar iniciar sesión');
      return;
    }

    if (resultados.length > 0) {
      // Las credenciales son válidas
      res.json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      // Las credenciales no son válidas
      res.json({ success: false, message: 'Nombre de usuario o contraseña incorrectos' });
    }
  });
});
// Manejo de la solicitud POST para verificar disponibilidad
app.post('/verificar_disponibilidad', (req, res) => {
  const usuario = req.body.usuario;
  const email = req.body.email;

  // Consultar la base de datos para verificar la disponibilidad
  const sql = `SELECT usuario, correo FROM usuarios WHERE usuario = ? OR correo = ?`;
  connection.query(sql, [usuario, email], (error, resultados) => {
    if (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).send('Error al verificar la disponibilidad');
      return;
    }

    if (resultados.length > 0) {
      // El nombre de usuario o correo ya está registrado
      res.json({ available: false, message: 'El nombre de usuario o correo ya está registrado. Por favor, elige otro.' });
    } else {
      // El nombre de usuario y correo están disponibles
      res.json({ available: true, message: 'Nombre de usuario y correo disponibles.' });
    }
  });
});


// Manejo de la solicitud POST para guardar datos
app.post('/guardar_datos', (req, res) => {
  // Lógica para insertar datos en la base de datos
  const { nombre, usuario, correo, contraseña } = req.body;
  const sql = 'INSERT INTO usuarios (nombre, usuario, correo, contraseña, nivel_usuario) VALUES (?, ?, ?, ?, 2)';
  const values = [nombre, usuario, correo, contraseña];

  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      res.status(500).json({ message: 'Error al insertar datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});

// Configuración del servidor para escuchar en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Node.js en ejecución en http://localhost:${PORT}`);
});
