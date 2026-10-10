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
    const newPassInput = document.getElementById('nuevaPassword') || document.getElementById('recNewPass');

    if (newPassInput) {
        newPassInput.addEventListener('input', () => {
            const val = newPassInput.value;
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

const formRecuperar = document.getElementById('form-recuperar') || document.getElementById('formRecuperar');
if (formRecuperar) {
    formRecuperar.addEventListener('submit', (e) => {
        e.preventDefault();
        const recMsg = document.getElementById('mensaje') || document.getElementById('recMensaje');
        const emailEl = document.getElementById('email') || document.getElementById('recEmail');
        const newPassEl = document.getElementById('nuevaPassword') || document.getElementById('recNewPass');
        const confirmPassEl = document.getElementById('confirmarPassword') || document.getElementById('recConfirmPass');

        const email = emailEl.value.trim().toLowerCase();
        const newPass = newPassEl.value;
        const confirmPass = confirmPassEl.value;

        if (newPass !== confirmPass) {
            if (recMsg) {
                recMsg.className = 'msg-box error';
                recMsg.textContent = 'Las contraseñas no coinciden.';
            }
            return;
        }

        const cumpleClave = newPass.length >= 8 && /[A-Z]/.test(newPass) && /[a-z]/.test(newPass) && /[0-9]/.test(newPass) && /[!@#$%^&*]/.test(newPass);
        if (!cumpleClave) {
            if (recMsg) {
                recMsg.className = 'msg-box error';
                recMsg.textContent = 'La nueva contraseña debe cumplir las 5 reglas de seguridad.';
            }
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];
        const idx = usuarios.findIndex(u => u.email === email);

        if (idx === -1) {
            if (recMsg) {
                recMsg.className = 'msg-box error';
                recMsg.textContent = 'El correo no existe en el sistema.';
            }
            return;
        }

        if (usuarios[idx].password === newPass) {
            if (recMsg) {
                recMsg.className = 'msg-box error';
                recMsg.textContent = 'La nueva contraseña no puede ser igual a la anterior.';
            }
            return;
        }

        usuarios[idx].password = newPass;
        localStorage.setItem('usuarios_sgg', JSON.stringify(usuarios));

        if (recMsg) {
            recMsg.className = 'msg-box success';
            recMsg.textContent = '¡Contraseña actualizada con éxito! Redirigiendo al Login...';
        }
        setTimeout(() => window.location.href = 'index.html', 1500);
    });
}
