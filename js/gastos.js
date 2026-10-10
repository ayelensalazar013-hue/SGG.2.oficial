// ==========================================================
// MÓDULO DE GESTIÓN DE GASTOS (CRUD) - SGG
// ==========================================================

let usuarioActivo = null;
let gastoIdAEliminar = null;

// 1. SEGURIDAD DE RUTAS (REGLA DE NEGOCIO 2.1)
function verificarSesion() {
    const usuarioGuardado = localStorage.getItem('usuario_activo_sgg');
    if (!usuarioGuardado) {
        // Redirección forzada inmediata a index.html si no hay sesión
        window.location.href = 'index.html';
        return;
    }
    usuarioActivo = JSON.parse(usuarioGuardado);
    
    // Mostrar email/usuario en la pantalla
    const userWelcome = document.getElementById('userWelcome');
    if (userWelcome) {
        userWelcome.textContent = `Sesión activa: ${usuarioActivo.email || usuarioActivo.username}`;
    }
}

// 2. MODO NOCHE Y PERSISTENCIA (RF-02)
window.cambiarTema = function() {
    document.body.classList.toggle('modo-noche');
    const esOscuro = document.body.classList.contains('modo-noche');
    localStorage.setItem('tema_sgg', esOscuro ? 'oscuro' : 'claro');
};

if (localStorage.getItem('tema_sgg') === 'oscuro') {
    document.body.classList.add('modo-noche');
}

// CERRAR SESIÓN
window.cerrarSesion = function() {
    localStorage.removeItem('usuario_activo_sgg');
    window.location.href = 'index.html';
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    renderizarGastosYDashboard();

    const formGasto = document.getElementById('form-gasto');
    if (formGasto) {
        formGasto.addEventListener('submit', guardarGasto);
    }
});

// 3. OBTIENE LOS GASTOS DE LOCALSTORAGE
function obtenerGastosStorage() {
    return JSON.parse(localStorage.getItem('gastos_sgg')) || [];
}

// 4. RF-06 & RF-09: RENDERIZADO DEL HISTORIAL DINÁMICO Y DASHBOARD
function renderizarGastosYDashboard() {
    const todosLosGastos = obtenerGastosStorage();
    const tbody = document.getElementById('tablaGastosBody');
    const totalElem = document.getElementById('totalGastado');

    if (!tbody || !usuarioActivo) return;

    tbody.innerHTML = '';
    let totalAcumulado = 0;

    // TRAZABILIDAD Y BAJA LÓGICA:
    // Filtrar solo los gastos que pertenecen al usuario activo Y tienen estado_activo: true
    const gastosUsuarioActivos = todosLosGastos.filter(gasto => 
        gasto.email_usuario === usuarioActivo.email && gasto.estado_activo === true
    );

    if (gastosUsuarioActivos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay gastos registrados.</td></tr>`;
    } else {
        gastosUsuarioActivos.forEach(gasto => {
            totalAcumulado += parseFloat(gasto.monto);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${gasto.fecha}</td>
                <td>${gasto.categoria}</td>
                <td>${gasto.descripcion}</td>
                <td>$${parseFloat(gasto.monto).toFixed(2)}</td>
                <td>
                    <button class="btn-tabla btn-editar" onclick="prepararEdicion('${gasto.id}')">Editar</button>
                    <button class="btn-tabla btn-eliminar" onclick="abrirModalEliminar('${gasto.id}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Actualizar Panel de Resumen (RF-09)
    if (totalElem) {
        totalElem.textContent = `$${totalAcumulado.toFixed(2)}`;
    }
}

// 5. RF-05 / RF-07: CREAR Y EDITAR GASTO
function guardarGasto(e) {
    e.preventDefault();
    const msg = document.getElementById('mensaje');
    if (msg) msg.textContent = '';

    const idInput = document.getElementById('gastoId').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const fecha = document.getElementById('fecha').value;
    const categoria = document.getElementById('categoria').value;
    const descripcion = document.getElementById('descripcion').value.trim();

    // VALIDACIÓN (RF-05): Monto mayor a 0
    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje('El monto debe ser un valor positivo mayor a cero.', 'error');
        return;
    }

    if (!fecha || !categoria || !descripcion) {
        mostrarMensaje('Por favor complete todos los campos obligatorios.', 'error');
        return;
    }

    let todosLosGastos = obtenerGastosStorage();

    if (idInput) {
        // ACTUALIZACIÓN (RF-07)
        const index = todosLosGastos.findIndex(g => g.id === idInput);
        if (index !== -1) {
            todosLosGastos[index].monto = monto;
            todosLosGastos[index].fecha = fecha;
            todosLosGastos[index].categoria = categoria;
            todosLosGastos[index].descripcion = descripcion;
            mostrarMensaje('Gasto actualizado con éxito.', 'success');
        }
    } else {
        // CREACIÓN (RF-05)
        const nuevoGasto = {
            id: 'gasto_' + Date.now(),
            email_usuario: usuarioActivo.email, // Clave foránea para trazabilidad
            monto: monto,
            fecha: fecha,
            categoria: categoria,
            descripcion: descripcion,
            estado_activo: true // Regla de negocio: Baja Lógica
        };
        todosLosGastos.push(nuevoGasto);
        mostrarMensaje('Gasto cargado correctamente.', 'success');
    }

    localStorage.setItem('gastos_sgg', JSON.stringify(todosLosGastos));
    resetearFormulario();
    renderizarGastosYDashboard();
}

// PREPARAR EDICIÓN (RF-07)
window.prepararEdicion = function(id) {
    const todosLosGastos = obtenerGastosStorage();
    const gasto = todosLosGastos.find(g => g.id === id);

    if (!gasto) return;

    document.getElementById('gastoId').value = gasto.id;
    document.getElementById('monto').value = gasto.monto;
    document.getElementById('fecha').value = gasto.fecha;
    document.getElementById('categoria').value = gasto.categoria;
    document.getElementById('descripcion').value = gasto.descripcion;

    document.getElementById('btn-guardar-gasto').textContent = 'Actualizar Gasto';
    document.getElementById('btn-cancelar-edicion').style.display = 'block';
};

window.cancelarEdicion = function() {
    resetearFormulario();
};

function resetearFormulario() {
    document.getElementById('form-gasto').reset();
    document.getElementById('gastoId').value = '';
    document.getElementById('btn-guardar-gasto').textContent = 'Guardar Gasto';
    document.getElementById('btn-cancelar-edicion').style.display = 'none';
}

// 6. RF-08: ELIMINACIÓN SEGURA (BAJA LÓGICA)
window.abrirModalEliminar = function(id) {
    gastoIdAEliminar = id;
    const modal = document.getElementById('modalConfirmar');
    if (modal) modal.style.display = 'flex';
};

window.cerrarModal = function() {
    gastoIdAEliminar = null;
    const modal = document.getElementById('modalConfirmar');
    if (modal) modal.style.display = 'none';
};

window.confirmarEliminacion = function() {
    if (!gastoIdAEliminar) return;

    let todosLosGastos = obtenerGastosStorage();
    const index = todosLosGastos.findIndex(g => g.id === gastoIdAEliminar);

    if (index !== -1) {
        // CAMBIO DE ESTADO: Se cambia la propiedad estado_activo a false (NO se usa splice)
        todosLosGastos[index].estado_activo = false;
        localStorage.setItem('gastos_sgg', JSON.stringify(todosLosGastos));
        mostrarMensaje('Gasto eliminado correctamente.', 'success');
    }

    cerrarModal();
    renderizarGastosYDashboard();
};

function mostrarMensaje(texto, tipo) {
    const msg = document.getElementById('mensaje');
    if (!msg) return;
    msg.textContent = texto;
    msg.className = `msg-box ${tipo}`;
    setTimeout(() => {
        msg.textContent = '';
        msg.className = 'msg-box';
    }, 3000);
}
