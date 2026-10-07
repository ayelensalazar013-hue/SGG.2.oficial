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

// Ejecución inmediata antes de renderizar
aplicarTemaGuardado();

// ==========================================
// LÓGICA DE LOGIN (RF-01)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    aplicarTemaGuardado();

    const form = document.querySelector('form') || document.getElementById('form-login');
    const inputUsuario = document.getElementById('usuario');
    const inputPass = document.getElementById('password');
    const btnSubmit = document.getElementById('btn-login') || (form ? form.querySelector('button[type="submit"]') : null);
    const msgBox = document.getElementById('mensaje') || document.getElementById('mensaje-error');

    let intentosFallidos = 0;
    let bloqueado = false;

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (bloqueado) return;

            const userOrEmail = inputUsuario.value.trim();
            const passIngresada = inputPass.value;

            const usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];

            const usuarioValido = usuarios.find(u => 
                (u.usuario === userOrEmail || u.email === userOrEmail) && 
                (u.password === passIngresada || u.clave === passIngresada)
            );

            if (usuarioValido) {
                intentosFallidos = 0;
                msgBox.style.color = "var(--success-color)";
                msgBox.textContent = "¡Inicio de sesión exitoso! Redirigiendo...";
                localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));

                setTimeout(() => {
                    window.location.href = "principal.html";
                }, 1500);
            } else {
                intentosFallidos++;
                msgBox.style.color = "var(--error-color)";

                if (intentosFallidos >= 3) {
                    bloqueado = true;
                    if (btnSubmit) btnSubmit.disabled = true;
                    let segundos = 30;
                    msgBox.textContent = `3 intentos incorrectos. Esperá ${segundos} segundos.`;

                    const contador = setInterval(() => {
                        segundos--;
                        if (segundos > 0) {
                            msgBox.textContent = `3 intentos incorrectos. Esperá ${segundos} segundos.`;
                        } else {
                            clearInterval(contador);
                            bloqueado = false;
                            intentosFallidos = 0;
                            if (btnSubmit) btnSubmit.disabled = false;
                            msgBox.textContent = "";
                        }
                    }, 1000);
                } else {
                    msgBox.textContent = `Datos incorrectos. Intento ${intentosFallidos} de 3.`;
                }
            }
        });
    }
});
