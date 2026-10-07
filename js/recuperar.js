document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recuperar');
    const inputEmail = document.getElementById('email');
    const inputPass = document.getElementById('password');
    const inputConfirmPass = document.getElementById('confirm-password');
    const msgBox = document.getElementById('mensaje-error');

    // Requisitos visuales
    const reqMin = document.getElementById('req-min');
    const reqMayus = document.getElementById('req-mayus');
    const reqMinus = document.getElementById('req-minus');
    const reqNum = document.getElementById('req-num');
    const reqEsp = document.getElementById('req-esp');

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

    // Evaluación en tiempo real mientras escribe la nueva contraseña
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

    // Al presionar "Actualizar Contraseña"
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        msgBox.textContent = "";

        const email = inputEmail.value.trim();
        const newPass = inputPass.value;
        const confirmPass = inputConfirmPass.value;

        // 1. Validar que las dos contraseñas coincidan
        if (newPass !== confirmPass) {
            msgBox.style.color = "#c62828";
            msgBox.textContent = "Las contraseñas no coinciden. Por favor, verifícalas.";
            return;
        }

        // 2. Validar que cumpla las 5 reglas
        const cumpleMin = newPass.length >= 8;
        const cumpleMayus = /[A-Z]/.test(newPass);
        const cumpleMinus = /[a-z]/.test(newPass);
        const cumpleNum = /[0-9]/.test(newPass);
        const cumpleEsp = /[!@#$%^&*(),.?":{}|<>]/.test(newPass);

        if (!cumpleMin || !cumpleMayus || !cumpleMinus || !cumpleNum || !cumpleEsp) {
            msgBox.style.color = "#c62828";
            msgBox.textContent = "La contraseña nueva debe cumplir con todos los requisitos en verde.";
            return;
        }

        // 3. Buscar usuario en localStorage
        let usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];
        const index = usuarios.findIndex(u => u.email === email);

        if (index === -1) {
            msgBox.style.color = "#c62828";
            msgBox.textContent = "El correo electrónico no se encuentra registrado.";
            return;
        }

        // 4. Validar que la nueva contraseña no sea la contraseña actual
        if (usuarios[index].password === newPass) {
            msgBox.style.color = "#c62828";
            msgBox.textContent = "La nueva contraseña no puede ser igual a la contraseña actual.";
            return;
        }

        // 5. Actualizar la contraseña
        usuarios[index].password = newPass;
        localStorage.setItem('usuarios_sgg', JSON.stringify(usuarios));

        msgBox.style.color = "#2e7d32";
        msgBox.textContent = "¡Contraseña actualizada con éxito! Redirigiendo al Login...";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
});
