// CONTROL DE MODO DÍA / NOCHE (RF-02)
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

// MOSTRAR / OCULTAR CONTRASEÑA
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

// INICIO DE SESIÓN (RF-01)
const formLogin = document.getElementById('form-login') || document.getElementById('formLogin');
if (formLogin) {
    let intentosFallidos = 0;
    const loginUser = document.getElementById('usuario') || document.getElementById('loginUser');
    const loginPass = document.getElementById('password') || document.getElementById('loginPass');
    const loginMsg = document.getElementById('mensaje') || document.getElementById('loginMsg');
    const btnSubmit = document.getElementById('btn-login') || document.getElementById('btnLoginSubmit');

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        loginMsg.textContent = '';
        const userOrEmail = loginUser.value.trim().toLowerCase();
        const pass = loginPass.value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios_sgg')) || [];
        const usuarioEncontrado = usuarios.find(u => (u.email === userOrEmail || u.username === userOrEmail) && u.password === pass);

        if (usuarioEncontrado) {
            intentosFallidos = 0;
            localStorage.setItem('usuario_activo_sgg', JSON.stringify(usuarioEncontrado));
            loginMsg.className = 'msg-box success';
            loginMsg.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
            setTimeout(() => window.location.href = 'panel.html', 1000);
        } else {
            intentosFallidos++;
            loginMsg.className = 'msg-box error';
            if (intentosFallidos >= 3) {
                btnSubmit.disabled = true;
                loginMsg.textContent = 'Demasiados intentos fallidos. Botón bloqueado por 30 segundos.';
                setTimeout(() => {
                    btnSubmit.disabled = false;
                    intentosFallidos = 0;
                    loginMsg.textContent = '';
                }, 30000);
            } else {
                loginMsg.textContent = `Datos incorrectos. Intento ${intentosFallidos} de 3.`;
            }
        }
    });
}
