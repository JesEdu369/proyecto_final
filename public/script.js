function verificarDisponibilidad() {
  var usuario = document.getElementById('usuario').value;
  var email = document.getElementById('correo').value;

  // Realizar una solicitud AJAX al servidor para verificar la disponibilidad
  fetch('/verificar_disponibilidad', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usuario, email }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.available) {
        // Nombre de usuario y correo están disponibles, habilita el botón de enviar datos
        document.getElementById('logIn').classList.remove('disabled');
        const nombre = document.getElementById('nombre').value;
        const usuario = document.getElementById('usuario').value;
        const correo = document.getElementById('correo').value;
        const contraseña = document.getElementById('contraseña').value;
        const contraseña2 = document.getElementById('contraseña2').value;

        if (nombre === '' || usuario === '' || correo === '' || contraseña === '' || contraseña2 === '') {
          alert('Por favor, completa todos los campos.');
          return;
        } else if (contraseña !== contraseña2) {
          alert('Las contraseñas no coinciden');
          return;
        } else {
          // Crear objeto de datos para el registro
          const registroDatos = {
            nombre: nombre,
            usuario: usuario,
            correo: correo,
            contraseña: contraseña,
          };

          // Realizar la solicitud POST al servidor para registrar datos
          fetch('/guardar_datos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(registroDatos),
          })
            .then(response => response.json())
            .then(data => {
              alert(data.message); // Mensaje recibido del servidor
              // Después de registrar, intentar iniciar sesión
              iniciarSesion(usuario, contraseña);
            })
            .catch(error => {
              alert('Error al enviar datos al servidor');
            });
        }
      } else {
        // Nombre de usuario o correo electrónico no disponibles, deshabilita el botón de enviar datos
        document.getElementById('logIn').classList.add('disabled');
        alert(data.message); // Muestra el mensaje proporcionado por el servidor
      }
    })
    .catch(error => {
      console.error('Error al verificar disponibilidad:', error);
      alert('Error al verificar disponibilidad');
    });
}

function iniciarSesion(usuario, contraseña) {
  // Realizar la solicitud POST al servidor para iniciar sesión
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usuario, contraseña }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Inicio de sesión exitoso');
        // Puedes redirigir al usuario a otra página o realizar otras acciones después del inicio de sesión exitoso
      } else {
        alert('Inicio de sesión fallido. Verifica tus credenciales.');
      }
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión');
    });
}
