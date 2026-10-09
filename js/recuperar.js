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
    // BOTÓN MOSTRAR / OCULTAR EN RECUPERAR
    const btnMostrar = document.querySelector('.btn-mostrar') || document.getElementById('btnToggleRecPass');
    const newPassInput = document.getElementById('recNewPass') || document.getElementById('nuevaPassword') || document.getElementById('password');

    if (btnMostrar && newPassInput) {
        btnMostrar.addEventListener('click', (e) => {
            e.preventDefault();
            if (newPassInput.type === 'password') {
                newPassInput.type = 'text';
                btnMostrar.textContent = 'Ocultar';
            } else {
                newPassInput.type = 'password';
                btnMostrar.textContent = 'Mostrar';
            }
        });
    }
});

// RECUPERAR CONTRASEÑA
const formRecuperar = document.getElementById('formRecuperar') || document.getElementById('form-recuperar');
if (formRecuperar) {
    formRecuperar.addEventListener('submit', (e) => {
        e.preventDefault();
        const recMsg = document.getElementById('recMsg') || document.getElementById('recMensaje') || document.getElementById('mensaje');
        const emailEl = document.getElementById('recEmail') || document.getElementById('email');
        const newPassEl = document.getElementById('recNewPass') || document.getElementById('nuevaPassword') || document.getElementById('password');
        const confirmPassEl = document.getElementById('recConfirmPass') || document.getElementById('confirmarPassword');

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

        // VALIDACIÓN DE LAS 5 REGLAS EN RECUPERAR
        const cumpleClave = newPass.length >= 8 && /[A-Z]/.test(newPass) && /[a-z]/.test(newPass) && /[0-9]/.test(newPass) && /[!@#$%^&*]/.test(newPass);
        if (!cumpleClave) {
            if (recMsg) {
                recMsg.className = 'msg-box error';
                recMsg.textContent = 'La nueva contraseña debe cumplir las 5 reglas (8 caracteres, mayúscula, minúscula, número y símbolo).';
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

        // Evitar que sea igual a la actual
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
            recMsg.textContent = '¡Contraseña actualizada con éxito! Redirigiendo...';
        }
        setTimeout(() => window.location.href = 'índice.html', 1500);
    });
}
