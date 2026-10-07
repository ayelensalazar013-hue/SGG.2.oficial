document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-registro');
    const inputPass = document.getElementById('password');
    const inputFecha = document.getElementById('fecha');
    const inputNombre = document.getElementById('nombre');
    const inputApellido = document.getElementById('apellido');
    const inputEmail = document.getElementById('email');

    // Identificar los 5 ítems de la lista de contraseña
    const listaItems = document.querySelectorAll('.container ul li');

    if (inputPass && listaItems.length >= 5) {
        inputPass.addEventListener('input', () => {
            const pass = inputPass.value;

            // Reglas de validación
            const tieneMin8 = pass.length >= 8;
            const tieneMayus = /[A-Z]/.test(pass);
            const tieneMinus = /[a-z]/.test(pass);
            const tieneNum = /[0-9]/.test(pass);
            const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

            // Actualizar Visualización
            actualizarRequisito(listaItems[0], tieneMin8, "Mínimo 8 caracteres");
            actualizarRequisito(listaItems[1], tieneMayus, "Al menos 1 letra mayúscula");
            actualizarRequisito(listaItems[2], tieneMinus, "Al menos 1 letra minúscula");
            actualizarRequisito(listaItems[3], tieneNum, "Al menos 1 número");
            actualizarRequisito(listaItems[4], tieneEspecial, "Al menos 1 carácter especial");
        });
    }

    function actualizarRequisito(elemento, seCumple, texto) {
        if (seCumple) {
            elemento.textContent = `✔ ${texto}`;
            elemento.style.color = "green";
            elemento.style.fontWeight = "bold";
        } else {
            elemento.textContent = `✘ ${texto}`;
            element.style.color = "red";
            elemento.style.fontWeight = "normal";
        }
    }

    // Evento al enviar el formulario (Registrarse)
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // EVITA QUE SE BORRE TODO Y SE RECARGUE LA PÁGINA

        // 1. Validar Nombre y Apellido (sin números ni símbolos)
        const regexLetras = /^[a-zA-AáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexLetras.test(inputNombre.value.trim()) || !regexLetras.test(inputApellido.value.trim())) {
            alert("El Nombre y Apellido solo deben contener letras.");
            return;
        }

        // 2. Validar Edad Mayor o Igual a 14 años
        const fechaNac = new Date(inputFecha.value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        if (edad < 14) {
            alert("Debes ser mayor de 14 años para registrarte en el sistema.");
            return;
        }

        // 3. Validar Contraseña Completa
        const pass = inputPass.value;
        const passValida = pass.length >= 8 && 
                           /[A-Z]/.test(pass) && 
                           /[a-z]/.test(pass) && 
                           /[0-9]/.test(pass) && 
                           /[!@#$%^&*(),.?":{}|<>]/.test(pass);

        if (!passValida) {
            alert("La contraseña debe cumplir con TODOS los requisitos indicados en rojo.");
            return;
        }

        // Si todo pasa con éxito:
        alert("¡Registro exitoso! Redirigiendo al Login...");
        window.location.href = "index.html";
    });
});
