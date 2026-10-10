// CONTROL DE MODO DÍA / NOCHE (RF-02 - CP-02.1, CP-02.2)
document.addEventListener('DOMContentLoaded', () => {
    const btnTema = document.getElementById('btn-tema') || document.getElementById('btnTheme');
    if (localStorage.getItem('tema_sgg') === 'oscuro') {
        document.body.classList.add('modo-noche');
    }
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            document.body.classList.toggle('modo-noche');
            const esOscuro = document.body.classList.contains('modo-noche');
            localStorage.setItem('tema_sgg', esOscuro ? 'oscuro' : 'claro');
        });
    }
});

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

// INICIO DE SESIÓN (RF-01 - CP-01.1, CP-01.2, CP-01.3)
const formLogin = document.getElementById('form-login') || document.getElementById('formLogin');
if (formLogin) {
    let intentosFallidos = 0;

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginUser = document.getElementById('usuario') || document.getElementById('loginUser');
        const loginPass = document.getElementById('password') || document.getElementById('loginPass');
        const loginMsg = document.getElementById('mensaje') || document.getElementById('loginMsg');
        const btnSubmit = document.getElementById('btn-login') || document.getElementById('btnLoginSubmit');

        loginMsg.textContent = '';
        
        // Limpieza de espacios al principio/final del correo/usuario
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
                let segundosRestantes = 30;
                loginMsg.textContent = `Demasiados intentos fallidos. Botón bloqueado por ${segundosRestantes} segundos.`;
                
                const intervalo = setInterval(() => {
                    segundosRestantes--;
                    if (segundosRestantes > 0) {
                        loginMsg.textContent = `Demasiados intentos fallidos. Botón bloqueado por ${segundosRestantes} segundos.`;
                    } else {
                        clearInterval(intervalo);
                        btnSubmit.disabled = false;
                        intentosFallidos = 0;
                        loginMsg.textContent = '';
                    }
                }, 1000);
            } else {
                loginMsg.textContent = `Datos incorrectos. Intento ${intentosFallidos} de 3.`;
            }
        }
    });
}
