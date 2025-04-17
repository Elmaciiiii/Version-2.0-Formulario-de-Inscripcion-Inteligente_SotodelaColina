document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroTorneoForm');
  const submitButton = document.getElementById('submitButton');
  const resetButton = document.getElementById('resetButton');
  const toast = document.getElementById('toast');
  const contadorEnviosElement = document.getElementById('contadorEnvios');

  const campos = {
      nombreJugador: document.getElementById('nombreJugador'),
      edad: document.getElementById('edad'),
      juego: document.getElementById('juego'),
      equipo: document.getElementById('equipo'),
      plataforma: document.getElementById('plataforma'),
      fotoPerfil: document.getElementById('fotoPerfil'),
      aceptoReglas: document.getElementById('aceptoReglas'),
  };

  const errores = {
      nombreJugador: document.getElementById('nombreJugador-error'),
      edad: document.getElementById('edad-error'),
      juego: document.getElementById('juego-error'),
      plataforma: document.getElementById('plataforma-error'),
      fotoPerfil: document.getElementById('fotoPerfil-error'),
      aceptoReglas: document.getElementById('aceptoReglas-error'),
  };

  // Íconos de validación
  const successIcons = document.querySelectorAll('.success-icon');
  const errorIcons = document.querySelectorAll('.error-icon');

  // Validaciones individuales
  function validarNombre() {
      const valor = campos.nombreJugador.value.trim();
      const valido = valor.length > 0 && valor.length <= 50;
      mostrarEstado('nombreJugador', valido);
      return valido;
  }

  function validarEdad() {
      const edad = parseInt(campos.edad.value, 10);
      const valido = !isNaN(edad) && edad >= 10 && edad <= 99;
      mostrarEstado('edad', valido);
      return valido;
  }

  function validarJuego() {
      const valido = campos.juego.value !== '';
      mostrarEstado('juego', valido);
      return valido;
  }

  function validarPlataforma() {
      const valido = campos.plataforma.value !== '';
      mostrarEstado('plataforma', valido);
      return valido;
  }

  function validarFoto() {
      const file = campos.fotoPerfil.files[0];
      if (!file) {
          mostrarEstado('fotoPerfil', false);
          return false;
      }
      const valido = file.type.match(/image\/(jpeg|png)/) && file.size <= 2 * 1024 * 1024;
      mostrarEstado('fotoPerfil', valido);
      return valido;
  }

  function validarConsentimiento() {
      const valido = campos.aceptoReglas.checked;
      mostrarEstado('aceptoReglas', valido);
      return valido;
  }

  function mostrarEstado(campo, valido) {
      if (valido) {
          errores[campo].style.display = 'none';
          activarIcono(campo, true);
      } else {
          errores[campo].style.display = 'block';
          activarIcono(campo, false);
      }
  }

  function activarIcono(campo, valido) {
      const grupo = campos[campo].parentElement;
      const successIcon = grupo.querySelector('.success-icon');
      const errorIcon = grupo.querySelector('.error-icon');
      if (successIcon && errorIcon) {
          successIcon.style.display = valido ? 'inline' : 'none';
          errorIcon.style.display = valido ? 'none' : 'inline';
      }
  }

  function validarFormulario() {
      const validaciones = [
          validarNombre(),
          validarEdad(),
          validarJuego(),
          validarPlataforma(),
          validarFoto(),
          validarConsentimiento()
      ];
      const todoValido = validaciones.every(v => v === true);
      submitButton.disabled = !todoValido;
      return todoValido;
  }

  // Vista previa de la imagen
  campos.fotoPerfil.addEventListener('change', () => {
      const file = campos.fotoPerfil.files[0];
      const preview = document.getElementById('fotoPreview');
      if (file && file.type.match(/image\/(jpeg|png)/)) {
          const reader = new FileReader();
          reader.onload = e => preview.src = e.target.result;
          reader.readAsDataURL(file);
          preview.style.display = 'block';
      } else {
          preview.src = '';
          preview.style.display = 'none';
      }
      validarFoto();
      validarFormulario();
  });

  // Validaciones en tiempo real
  campos.nombreJugador.addEventListener('input', () => {
      validarNombre();
      validarFormulario();
  });

  campos.edad.addEventListener('input', () => {
      validarEdad();
      validarFormulario();
  });

  campos.juego.addEventListener('change', () => {
      validarJuego();
      validarFormulario();
  });

  campos.plataforma.addEventListener('change', () => {
      validarPlataforma();
      validarFormulario();
  });

  campos.aceptoReglas.addEventListener('change', () => {
      validarConsentimiento();
      validarFormulario();
  });

  // ----- CONTADOR DE ENVÍOS -----
  localStorage.removeItem('enviosTorneo'); // Eliminar el valor al cargar la página
  let envios = parseInt(localStorage.getItem('enviosTorneo')) || 0;
  contadorEnviosElement.textContent = envios;

  function incrementarContador() {
      envios++;
      localStorage.setItem('enviosTorneo', envios);
      contadorEnviosElement.textContent = envios;
  }

  // Envío del formulario
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validarFormulario()) {
          mostrarToast('¡Registro exitoso! Nos vemos en el torneo 🎮');
          form.reset();
          document.getElementById('fotoPreview').style.display = 'none';
          submitButton.disabled = true;

          // Incrementar el contador solo al enviar exitosamente
          incrementarContador();

          // Ocultar íconos y errores
          Object.keys(campos).forEach(c => {
              activarIcono(c, false);
              if (errores[c]) errores[c].style.display = 'none';
          });

          // Re-habilitar el botón después del toast
          setTimeout(() => {
              submitButton.disabled = false;
          }, 3000);
      }
  });

  // Reset del formulario
  resetButton.addEventListener('click', () => {
      document.getElementById('fotoPreview').style.display = 'none';
      submitButton.disabled = true;

      // Ocultar íconos y errores
      Object.keys(campos).forEach(c => {
          activarIcono(c, false);
          if (errores[c]) errores[c].style.display = 'none';
      });
  });

  // Toast
  function mostrarToast(mensaje) {
      toast.textContent = mensaje;
      toast.classList.add('show');
      setTimeout(() => {
          toast.classList.remove('show');
      }, 3000);
  }
});