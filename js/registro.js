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

    // EVALUACIÓN EN TIEMPO REAL MIENTRAS SE ESCRIBE LA CONTRASEÑA
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
        e.preventDefault(); // Evita recargar la página
        msgBox.textContent = "";

        // 1. VALIDACIÓN DE FECHA Y EDAD (MÍNIMO 14 AÑOS)
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

        // 2. VALIDACIÓN DE NOMBRE Y APELLIDO (SOLO LETRAS)
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexLetras.test(inputNombre.value.trim()) || !regexLetras.test(inputApellido.value.trim())) {
            msgBox.textContent = "El Nombre y Apellido solo deben contener letras.";
            return;
        }

        // 3. VALIDACIÓN ESTRICTA DE CONTRASEÑA
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

        // 4. SI TODO ESTÁ CORRECTO, GUARDAR EN LOCALSTORAGE
        const nuevoUsuario = {
            nombre: inputNombre.value.trim(),
            apellido: inputApellido.value.trim(),
            fecha: inputFecha.value,
            email: inputEmail.value.trim(),
            usuario: document.getElementById('usuario').value.trim(),
            password: pass
        };

        let usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];
        
        // Verificar si el correo ya existe
        const existe = usuarios.some(u => u.email === nuevoUsuario.email);
        if (existe) {
            msgBox.textContent = "El correo electrónico ya se encuentra registrado.";
            return;
        }

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios_sgg', JSON.stringify(usuarios));

        // Muestra éxito en el texto de abajo y redirige
        msgBox.style.color = "#2e7d32";
        msgBox.textContent = "¡Registro exitoso! Redirigiendo al Login...";
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
});
