window.cambiarTema = function() {
    document.body.classList.toggle('modo-noche');
    const esOscuro = document.body.classList.contains('modo-noche');
    localStorage.setItem('tema_sgg', esOscuro ? 'oscuro' : 'claro');
};

if (localStorage.getItem('tema_sgg') === 'oscuro') {
    document.body.classList.add('modo-noche');
}

window.mostrarOcultarPassword = function(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (btn) btn.textContent = 'Ocultar';
    } else {
        input.type = 'password';
        if (btn) btn.textContent = 'Mostrar';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const regPassInput = document.getElementById('password') || document.getElementById('regPass');

    if (regPassInput) {
        regPassInput.addEventListener('input', () => {
            const val = regPassInput.value;
            validarRegla('ruleLen', val.length >= 8, 'Mínimo 8 caracteres');
            validarRegla('ruleMayus', /[A-Z]/.test(val), 'Al menos una mayúscula');
            validarRegla('ruleMinus', /[a-z]/.test(val), 'Al menos una minúscula');
            validarRegla('ruleNum', /[0-9]/.test(val), 'Al menos un número');
            validarRegla('ruleSim', /[!@#$%^&*]/.test(val), 'Al menos un símbolo (!@#$%^&*)');
        });
    }

    function validarRegla(id, condicion, texto) {
        const el = document.getElementById(id);
        if (!el) return;
        if (condicion) {
            el.classList.add('valid');
            el.textContent = `✔ ${texto}`;
        } else {
            el.classList.remove('valid');
            el.textContent = `✖ ${texto}`;
        }
    }
});

const formRegister = document.getElementById('form-registro') || document.getElementById('formRegister');
if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const regNombre = document.getElementById('nombre') || document.getElementById('regNombre');
        const regApellido = document.getElementById('apellido') || document.getElementById('regApellido');
        const regFecha = document.getElementById('fechaNacimiento') || document.getElementById('regFecha');
        const regEmail = document.getElementById('email') || document.getElementById('regEmail');
        const regUsername = document.getElementById('usuario') || document.getElementById('regUsername');
        const regPass = document.getElementById('password') || document.getElementById('regPass');
        const regMsg = document.getElementById('mensaje') || document.getElementById('regMensaje');

        if (regMsg) regMsg.textContent = '';

        const nombre = regNombre.value.trim();
        const apellido = regApellido.value.trim();
        if (/[0-9!@#$\%^&*]/.test(nombre) \vert{}\vert{} /[0-9!@#$%^&*]/.test(apellido)) {
            if (regMsg) {
                regMsg.className = 'msg-box error';
                regMsg.textContent = 'Nombre y Apellido no pueden contener números ni símbolos.';
            }
            return;
        }

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

        const email = regEmail.value.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (regMsg) {
                regMsg.className = 'msg-box error';
                regMsg.textContent = 'El formato del correo no es válido.';
            }
            return;
        }

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
            regMsg.textContent = '¡Registro exitoso! Redirigiendo al Login...';
        }
        setTimeout(() => window.location.href = 'index.html', 1500);
    });
}
