document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-login') || document.querySelector('form');
    const inputUsuario = document.getElementById('usuario');
    const inputPass = document.getElementById('password');
    const btnSubmit = document.getElementById('btn-login') || form.querySelector('button[type="submit"]');
    const msgBox = document.getElementById('mensaje') || document.getElementById('mensaje-error');

    let intentosFallidos = 0;
    let bloqueado = false;

    // Cargar usuarios por defecto si el localStorage está vacío
    (function inicializarUsuariosDemo() {
        let usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];
        if (usuarios.length === 0) {
            usuarios.push(
                { nombre: "Alumno", apellido: "Prueba", fecha: "2000-01-01", email: "alumno@sgg.com", usuario: "alumno", password: "1234Password!" },
                { nombre: "Profesor", apellido: "Prueba", fecha: "1990-01-01", email: "profesor@sgg.com", usuario: "profesor", password: "5678Password!" }
            );
            localStorage.setItem('usuarios_sgg', JSON.stringify(usuarios));
        }
    })();

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (bloqueado) return;

            msgBox.textContent = "";

            const userOrEmail = inputUsuario.value.trim();
            const passIngresada = inputPass.value;

            // Leer array unificado de usuarios
            const usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];

            // Validar credenciales
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
                    btnSubmit.disabled = true;

                    let segundos = 30;
                    msgBox.textContent = `3 intentos incorrectos. Espera ${segundos} segundos.`;

                    const contador = setInterval(() => {
                        segundos--;
                        if (segundos > 0) {
                            msgBox.textContent = `3 intentos incorrectos. Espera ${segundos} segundos.`;
                        } else {
                            clearInterval(contador);
                            bloqueado = false;
                            intentosFallidos = 0;
                            btnSubmit.disabled = false;
                            msgBox.textContent = "Puedes volver a intentarlo.";
                        }
                    }, 1000);

                } else {
                    msgBox.textContent = `Datos incorrectos. Intento ${intentosFallidos} de 3.`;
                }
            }
        });
    }
});
