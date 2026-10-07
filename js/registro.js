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
// LÓGICA DE REGISTRO (RF-03)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    aplicarTemaGuardado();

    const form = document.querySelector('form') || document.getElementById('form-registro');
    const inputNombre = document.getElementById('nombre');
    const inputApellido = document.getElementById('apellido');
    const inputFecha = document.getElementById('fechaNacimiento') || document.getElementById('fecha');
    const inputEmail = document.getElementById('email');
    const inputUsuario = document.getElementById('usuario');
    const inputPass = document.getElementById('password');
    const msgBox = document.getElementById('mensaje') || document.getElementById('mensaje-error');

    // Sanitización de Nombre y Apellido (Bloquea números/símbolos)
    [inputNombre, inputApellido].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^a-zA-Za-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            });
        }
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validación de Edad (>= 14)
            const fechaNac = new Date(inputFecha.value);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const m = hoy.getMonth() - fechaNac.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }

            if (edad < 14) {
                msgBox.style.color = "var(--error-color)";
                msgBox.textContent = `Debes tener al menos 14 años para registrarte. Edad actual: ${edad} años.`;
                return;
            }

            // Lectura y guardado en usuarios_sgg
            let usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];

            const emailExiste = usuarios.some(u => u.email === inputEmail.value.trim());
            if (emailExiste) {
                msgBox.style.color = "var(--error-color)";
                msgBox.textContent = "El correo electrónico ya se encuentra registrado.";
                return;
            }

            const nuevoUsuario = {
                nombre: inputNombre.value.trim(),
                apellido: inputApellido.value.trim(),
                fecha: inputFecha.value,
                email: inputEmail.value.trim(),
                usuario: inputUsuario.value.trim(),
                password: inputPass.value
            };

            usuarios.push(nuevoUsuario);
            localStorage.setItem('usuarios_sgg', JSON.stringify(usuarios));

            msgBox.style.color = "var(--success-color)";
            msgBox.textContent = "¡Registro exitoso! Redirigiendo al login...";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        });
    }
});
