document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-registro');
    const inputPass = document.getElementById('password');
    const inputFecha = document.getElementById('fecha');
    const inputNombre = document.getElementById('nombre');
    const inputApellido = document.getElementById('apellido');
    const inputEmail = document.getElementById('email');
    const msgBox = document.getElementById('mensaje-error');

    // Elementos de la lista de requisitos
    const reqMin = document.getElementById('req-min');
    const reqMayus = document.getElementById('req-mayus');
    const reqMinus = document.getElementById('req-minus');
    const reqNum = document.getElementById('req-num');
    const reqEsp = document.getElementById('req-esp');

    // 1. RESTRICCIÓN EN TIEMPO REAL: Bloquear números y caracteres especiales al tipear
    const bloquearCaracteresInvalidos = (input) => {
        // Permite solo letras (incluye ñ, Ñ y acentos) y espacios
        input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    };

    if (inputNombre) {
        inputNombre.addEventListener('input', () => bloquearCaracteresInvalidos(inputNombre));
    }
    if (inputApellido) {
        inputApellido.addEventListener('input', () => bloquearCaracteresInvalidos(inputApellido));
    }

    // Función para actualizar visualmente cada ítem de la contraseña
    function actualizarEstado(elemento, condicion, texto) {
        if (condicion) {
            elemento.textContent = `✓ ${texto}`;
            elemento.style.color = "#2e7d32"; // Verde
            elemento.style.fontWeight = "bold";
        } else {
            elemento.textContent = `✘ ${texto}`;
            elemento.style.color = "#c62828"; // Rojo
            elemento.style.fontWeight = "normal";
        }
    }

    // EVALUACIÓN EN TIEMPO REAL DE LA CONTRASEÑA
    if (inputPass) {
        inputPass.addEventListener('input', () => {
            const pass = inputPass.value;

            actualizarEstado(reqMin, pass.length >= 8, "Mínimo 8 caracteres");
            actualizarEstado(reqMayus, /[A-Z]/.test(pass), "Al menos 1 letra mayúscula");
            actualizarEstado(reqMinus, /[a-z]/.test(pass), "Al menos 1 letra minúscula");
            actualizarEstado(reqNum, /[0-9]/.test(pass), "Al menos 1 número");
            actualizarEstado(reqEsp, /[!@#$%^&*(),.?":{}|<>]/.test(pass), "Al menos 1 carácter especial");
        });
    }

    // CONTROL AL PRESIONAR "REGISTRARSE"
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        msgBox.textContent = "";

        // A. VALIDACIÓN DE NOMBRE Y APELLIDO
        const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const nombreVal = inputNombre.value.trim();
        const apellidoVal = inputApellido.value.trim();

        if (!nombreVal || !regexSoloLetras.test(nombreVal)) {
            msgBox.textContent = "El nombre solo puede contener letras y espacios.";
            return;
        }

        if (!apellidoVal || !regexSoloLetras.test(apellidoVal)) {
            msgBox.textContent = "El apellido solo puede contener letras y espacios.";
            return;
        }

        // B. VALIDACIÓN DE FECHA Y EDAD (MÍNIMO 14 AÑOS)
        if (!inputFecha.value) {
            msgBox.textContent = "Por favor, ingresa tu fecha de nacimiento.";
            return;
        }

        const fechaNac = new Date(inputFecha.value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        if (edad < 14) {
            msgBox.textContent = `No puedes registrarte: tienes ${edad} años y la edad mínima es 14.`;
            return;
        }

        // C. VALIDACIÓN ESTRICTA DE CONTRASEÑA
        const pass = inputPass.value;
        const cumpleMin = pass.length >= 8;
        const cumpleMayus = /[A-Z]/.test(pass);
        const cumpleMinus = /[a-z]/.test(pass);
        const cumpleNum = /[0-9]/.test(pass);
        const cumpleEsp = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

        if (!cumpleMin || !cumpleMayus || !cumpleMinus || !cumpleNum || !cumpleEsp) {
            msgBox.textContent = "La contraseña no cumple con todos los requisitos necesarios.";
            return;
        }

        // D. GUARDAR EN LOCALSTORAGE
        const nuevoUsuario = {
            nombre: nombreVal,
            apellido: apellidoVal,
            fecha: inputFecha.value,
            email: inputEmail.value.trim(),
            usuario: document.getElementById('usuario').value.trim(),
            password: pass
        };

        let usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];
        
        const existe = usuarios.some(u => u.email === nuevoUsuario.email);
        if (existe) {
            msgBox.textContent = "El correo electrónico ya se encuentra registrado.";
            return;
        }

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios_sgg', JSON.stringify(usuarios));

        msgBox.style.color = "#2e7d32";
        msgBox.textContent = "¡Registro exitoso! Redirigiendo al Login...";
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
});
