// CONTROL DE MODO DÍA / NOCHE
const btnTema = document.getElementById('btn-tema') || document.getElementById('btnTheme');
if (btnTema) {
    if (localStorage.getItem('tema_sgg') === 'oscuro') {
        document.body.classList.add('modo-noche');
    }
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('modo-noche');
        const esOscuro = document.body.classList.contains('modo-noche');
        localStorage.setItem('tema_sgg', esOscuro ? 'oscuro' : 'claro');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // BOTÓN MOSTRAR / OCULTAR EN REGISTRO
    const btnMostrar = document.querySelector('.btn-mostrar') || document.getElementById('btnToggleRegPass');
    const regPassInput = document.getElementById('regPass') || document.getElementById('regPassword') || document.getElementById('password');

    if (btnMostrar && regPassInput) {
        btnMostrar.addEventListener('click', (e) => {
            e.preventDefault();
            if (regPassInput.type === 'password') {
                regPassInput.type = 'text';
                btnMostrar.textContent = 'Ocultar';
            } else {
                regPassInput.type = 'password';
                btnMostrar.textContent = 'Mostrar';
            }
        });
    }

    // VALIDACIÓN DE LAS 5 REGLAS EN VIVO (TILDES Y CRUCES)
    if (regPassInput) {
        regPassInput.addEventListener('input', () => {
            const val = regPassInput.value;
            actualizarRegla('ruleLen', val.length >= 8, 'Mínimo 8 caracteres');
            actualizarRegla('ruleMayus', /[A-Z]/.test(val), 'Al menos una mayúscula');
            actualizarRegla('ruleMinus', /[a-z]/.test(val), 'Al menos una minúscula');
            actualizarRegla('ruleNum', /[0-9]/.test(val), 'Al menos un número');
            actualizarRegla('ruleSim', /[!@#$%^&*]/.test(val), 'Al menos un símbolo (!@#$%^&*)');
        });
    }

    function actualizarRegla(id, cumple, texto) {
        const el = document.getElementById(id);
        if (el) {
            if (cumple) {
                el.style.color = '#2e7d32';
                el.textContent = `✔ ${texto}`;
            } else {
                el.style.color = '#c62828';
                el.textContent = `✖ ${texto}`;
            }
        }
    }
});

// SUBMIT REGISTRO
const formRegister = document.getElementById('formRegister') || document.getElementById('form-registro');
if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const regNombre = document.getElementById('regNombre') || document.getElementById('nombre');
        const regApellido = document.getElementById('regApellido') || document.getElementById('apellido');
        const regFecha = document.getElementById('regFecha') || document.getElementById('fechaNacimiento');
        const regEmail = document.getElementById('regEmail') || document.getElementById('email');
        const regUsername = document.getElementById('regUsername') || document.getElementById('username');
        const regPass = document.getElementById('regPass') || document.getElementById('regPassword') || document.getElementById('password');
        const regMsg = document.getElementById('regMsg') || document.getElementById('regMensaje') || document.getElementById('mensaje');

        if (regMsg) regMsg.textContent = '';

        // Limpieza y validación de Nombre/Apellido
        const nombre = regNombre.value.trim();
        const apellido = regApellido.value.trim();
        if (/[0-9!@#$\%^&*]/.test(nombre) \vert{}\vert{} /[0-9!@#$%^&*]/.test(apellido)) {
            if (regMsg) {
                regMsg.className = 'msg-box error';
                regMsg.textContent = 'Nombre y Apellido no pueden contener números ni símbolos.';
            }
            return;
        }

        // Validación edad >= 14
        const fechaNac = new Date(regFecha.value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const m = hoy.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;

        if (edad < 14) {
            if (regMsg) {
                regMsg.className = 'msg-box error';
                regMsg.textContent = 'Debes tener al menos 14 años para registrarte.';
            }
            return;
        }

        // Validación email
        const email = regEmail.value.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (regMsg) {
                regMsg.className = 'msg-box error';
                regMsg.textContent = 'El formato del correo no es válido.';
            }
            return;
        }

        // Validación estricta de 5 reglas
        const valPass = regPass.value;
        const cumpleClave = valPass.length >= 8 && /[A-Z]/.test(valPass) && /[a-z]/.test(valPass) && /[0-9]/.test(valPass) && /[!@#$%^&*]/.test(valPass);
        if (!cumpleClave) {
            if (regMsg) {
                regMsg.className = 'msg-box error';
                regMsg.textContent = 'La contraseña debe cumplir las 5 reglas de seguridad.';
            }
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];
        if (usuarios.some(u => u.email === email)) {
            if (regMsg) {
                regMsg.className = 'msg-box error';
                regMsg.textContent = 'Este correo ya está registrado.';
            }
            return;
        }

        usuarios.push({
            nombre, apellido, fechaNac: regFecha.value, email,
            username: regUsername.value.trim(), password: valPass
        });
        localStorage.setItem('usuarios_sgg', JSON.stringify(usuarios));

        if (regMsg) {
            regMsg.className = 'msg-box success';
            regMsg.textContent = '¡Registro exitoso! Redirigiendo...';
        }
        setTimeout(() => window.location.href = 'índice.html', 1500);
    });
}
