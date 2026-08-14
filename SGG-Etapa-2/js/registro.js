// ==========================================
// 1. CAMBIAR TEMA
// ==========================================

function cambiarTema() {

    const temaActual =
        document.body.getAttribute("data-tema");

    if (temaActual === "oscuro") {

        document.body.removeAttribute("data-tema");

        localStorage.setItem(
            "temaGuardado",
            "claro"
        );

    } else {

        document.body.setAttribute(
            "data-tema",
            "oscuro"
        );

        localStorage.setItem(
            "temaGuardado",
            "oscuro"
        );
    }
}


// ==========================================
// 2. CARGAR TEMA
// ==========================================

function cargarTema() {

    const temaGuardado =
        localStorage.getItem("temaGuardado");

    if (temaGuardado === "oscuro") {

        document.body.setAttribute(
            "data-tema",
            "oscuro"
        );
    }
}


// ==========================================
// 3. MOSTRAR / OCULTAR CONTRASEÑA
// ==========================================

function mostrarOcultarPassword(idCampo, boton) {

    const campo =
        document.getElementById(idCampo);

    if (campo.type === "password") {

        campo.type = "text";
        boton.innerText = "Ocultar";

    } else {

        campo.type = "password";
        boton.innerText = "Mostrar";
    }
}


// ==========================================
// 4. VALIDAR LOS 5 REQUISITOS
// ==========================================

function validarPassword(password) {

    const minimo8 =
        password.length >= 8;

    const mayuscula =
        /[A-Z]/.test(password);

    const minuscula =
        /[a-z]/.test(password);

    const numero =
        /[0-9]/.test(password);

    const especial =
        /[^A-Za-z0-9]/.test(password);


    document.getElementById("req-longitud").className =
        minimo8 ? "requisito-si" : "requisito-no";

    document.getElementById("req-mayuscula").className =
        mayuscula ? "requisito-si" : "requisito-no";

    document.getElementById("req-minuscula").className =
        minuscula ? "requisito-si" : "requisito-no";

    document.getElementById("req-numero").className =
        numero ? "requisito-si" : "requisito-no";

    document.getElementById("req-especial").className =
        especial ? "requisito-si" : "requisito-no";


    document.getElementById("req-longitud").innerText =
        (minimo8 ? "✓ " : "✗ ") +
        "Mínimo 8 caracteres";

    document.getElementById("req-mayuscula").innerText =
        (mayuscula ? "✓ " : "✗ ") +
        "Al menos 1 letra mayúscula";

    document.getElementById("req-minuscula").innerText =
        (minuscula ? "✓ " : "✗ ") +
        "Al menos 1 letra minúscula";

    document.getElementById("req-numero").innerText =
        (numero ? "✓ " : "✗ ") +
        "Al menos 1 número";

    document.getElementById("req-especial").innerText =
        (especial ? "✓ " : "✗ ") +
        "Al menos 1 carácter especial";


    return (
        minimo8 &&
        mayuscula &&
        minuscula &&
        numero &&
        especial
    );
}


// ==========================================
// 5. VALIDAR NOMBRE Y APELLIDO
// ==========================================

function nombreValido(texto) {

    const regex =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;

    return regex.test(texto.trim());
}


// ==========================================
// 6. VALIDAR EMAIL
// ==========================================

function emailValido(email) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/;

    return regex.test(email);
}


// ==========================================
// 7. CALCULAR EDAD
// ==========================================

function calcularEdad(fechaNacimiento) {

    const nacimiento =
        new Date(fechaNacimiento);

    const hoy =
        new Date();

    let edad =
        hoy.getFullYear() -
        nacimiento.getFullYear();

    const mes =
        hoy.getMonth() -
        nacimiento.getMonth();

    if (
        mes < 0 ||
        (mes === 0 &&
            hoy.getDate() < nacimiento.getDate())
    ) {
        edad--;
    }

    return edad;
}


// ==========================================
// 8. REGISTRAR USUARIO
// ==========================================

function registrarUsuario(event) {

    event.preventDefault();


    const nombre =
        document.getElementById("nombre").value.trim();

    const apellido =
        document.getElementById("apellido").value.trim();

    const fechaNacimiento =
        document.getElementById("fechaNacimiento").value;

    const email =
        document.getElementById("email").value.trim();

    const usuario =
        document.getElementById("usuario").value.trim();

    const password =
        document.getElementById("password").value;

    const repetirPassword =
        document.getElementById("repetirPassword").value;

    const mensaje =
        document.getElementById("mensaje");

    const boton =
        document.getElementById("btn-registrar");


    // Validar nombre
    if (!nombreValido(nombre)) {

        mensaje.style.color = "red";
        mensaje.innerText =
            "El nombre solo puede contener letras.";

        return;
    }


    // Validar apellido
    if (!nombreValido(apellido)) {

        mensaje.style.color = "red";
        mensaje.innerText =
            "El apellido solo puede contener letras.";

        return;
    }


    // Validar fecha
    if (!fechaNacimiento) {

        mensaje.style.color = "red";
        mensaje.innerText =
            "Ingresá tu fecha de nacimiento.";

        return;
    }


    // Validar edad
    const edad =
        calcularEdad(fechaNacimiento);

    if (edad < 14) {

        mensaje.style.color = "red";
        mensaje.innerText =
            "No se puede registrar una persona menor de 14 años.";

        return;
    }


    // Validar email
    if (!emailValido(email)) {

        mensaje.style.color = "red";
        mensaje.innerText =
            "Ingresá un correo electrónico válido.";

        return;
    }


    // Validar usuario
    if (usuario === "") {

        mensaje.style.color = "red";
        mensaje.innerText =
            "Ingresá un nombre de usuario.";

        return;
    }


    // Validar contraseña
    if (!validarPassword(password)) {

        mensaje.style.color = "red";
        mensaje.innerText =
            "La contraseña no cumple todos los requisitos.";

        return;
    }


    // Validar repetición
    if (password !== repetirPassword) {

        mensaje.style.color = "red";
        mensaje.innerText =
            "Las contraseñas no coinciden.";

        return;
    }


    // Obtener usuarios
    let usuarios =
        JSON.parse(localStorage.getItem("usuarios_sgg")) || [];


    // Evitar email duplicado
    const emailExiste =
        usuarios.some(
            u => u.email.toLowerCase() === email.toLowerCase()
        );

    if (emailExiste) {

        mensaje.style.color = "red";
        mensaje.innerText =
            "Ese correo electrónico ya está registrado.";

        return;
    }


    // Evitar usuario duplicado
    const usuarioExiste =
        usuarios.some(
            u => u.usuario.toLowerCase() === usuario.toLowerCase()
        );

    if (usuarioExiste) {

        mensaje.style.color = "red";
        mensaje.innerText =
            "Ese nombre de usuario ya está registrado.";

        return;
    }


    // Crear nuevo usuario
    const nuevoUsuario = {

        nombre: nombre,
        apellido: apellido,
        fechaNacimiento: fechaNacimiento,
        email: email,
        usuario: usuario,
        clave: password
    };


    usuarios.push(nuevoUsuario);


    // Guardar en localStorage
    localStorage.setItem(
        "usuarios_sgg",
        JSON.stringify(usuarios)
    );


    mensaje.style.color = "green";
    mensaje.innerText =
        "Usuario registrado correctamente.";

    boton.disabled = true;
}


// ==========================================
// 9. ACTIVAR VALIDACIÓN EN TIEMPO REAL
// ==========================================

function configurarValidacionPassword() {

    const password =
        document.getElementById("password");

    const repetir =
        document.getElementById("repetirPassword");

    const boton =
        document.getElementById("btn-registrar");


    function actualizar() {

        const passwordValida =
            validarPassword(password.value);

        const contraseñasIguales =
            password.value === repetir.value &&
            repetir.value !== "";


        boton.disabled =
            !(passwordValida && contraseñasIguales);
    }


    password.addEventListener(
        "input",
        actualizar
    );

    repetir.addEventListener(
        "input",
        actualizar
    );
}


// ==========================================
// 10. AL CARGAR
// ==========================================

window.onload = function () {

    cargarTema();

    configurarValidacionPassword();

};
