// ==========================================
// PERSISTENCIA DE TEMA (RF-02)
// ==========================================
function aplicarTemaGuardado() {
    const temaGuardado = localStorage.getItem("temaGuardado");
    if (temaGuardado === "oscuro") {
        document.body.setAttribute("data-tema", "oscuro");
    } else {
        document.body.removeAttribute("data-tema");
    }
}

function cambiarTema() {
    const temaActual = document.body.getAttribute("data-tema");
    if (temaActual === "oscuro") {
        document.body.removeAttribute("data-tema");
        localStorage.setItem("temaGuardado", "claro");
    } else {
        document.body.setAttribute("data-tema", "oscuro");
        localStorage.setItem("temaGuardado", "oscuro");
    }
}

// Ejecución inmediata
aplicarTemaGuardado();

// ==========================================
// LÓGICA DE RECUPERACIÓN (RF-04)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    aplicarTemaGuardado();

    const form = document.querySelector('form') || document.getElementById('form-recuperar');
    const inputEmail = document.getElementById('email');
    const inputNuevaPass = document.getElementById('nuevaPassword') || document.getElementById('password');
    const inputConfirmarPass = document.getElementById('confirmarPassword');
    const msgBox = document.getElementById('mensaje') || document.getElementById('mensaje-error');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailIngresado = inputEmail.value.trim();
            const nuevaPass = inputNuevaPass.value;
            const confirmarPass = inputConfirmarPass ? inputConfirmarPass.value : nuevaPass;

            if (inputConfirmarPass && nuevaPass !== confirmarPass) {
                msgBox.style.color = "var(--error-color)";
                msgBox.textContent = "Las contraseñas no coinciden.";
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];
            const index = usuarios.findIndex(u => u.email === emailIngresado);

            if (index === -1) {
                msgBox.style.color = "var(--error-color)";
                msgBox.textContent = "El correo ingresado no está registrado.";
                return;
            }

            if (usuarios[index].password === nuevaPass || usuarios[index].clave === nuevaPass) {
                msgBox.style.color = "var(--error-color)";
                msgBox.textContent = "La nueva contraseña no puede ser igual a la anterior.";
                return;
            }

            // Actualización
            usuarios[index].password = nuevaPass;
            localStorage.setItem('usuarios_sgg', JSON.stringify(usuarios));

            msgBox.style.color = "var(--success-color)";
            msgBox.textContent = "¡Contraseña actualizada con éxito! Redirigiendo al login...";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        });
    }
});
