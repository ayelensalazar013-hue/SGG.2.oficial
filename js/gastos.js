// Seguridad de rutas: Verificar usuario activo (a)
const usuarioActivo = JSON.parse(localStorage.getItem('usuario_activo_sgg'));
if (!usuarioActivo || !usuarioActivo.email) {
    window.location.href = 'index.html';
}

// Elementos del DOM
document.getElementById('userEmail').textContent = usuarioActivo.email;
const btnTheme = document.getElementById('btnTheme');
const btnLogout = document.getElementById('btnLogout');
const totalGastadoEl = document.getElementById('totalGastado');

const formGasto = document.getElementById('formGasto');
const formTitle = document.getElementById('formTitle');
const gastoIdInput = document.getElementById('gastoId');
const montoInput = document.getElementById('monto');
const fechaInput = document.getElementById('fecha');
const categoriaInput = document.getElementById('categoria');
const descripcionInput = document.getElementById('descripcion');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const msgError = document.getElementById('msgError');

const tablaGastosBody = document.getElementById('tablaGastosBody');
const modalConfirm = document.getElementById('modalConfirm');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');

let idGastoAEliminar = null;

// Control del Tema Modo Día / Noche (RF-02)
const temaGuardado = localStorage.getItem('tema_sgg') || 'claro';
if (temaGuardado === 'oscuro') {
    document.body.classList.add('modo-noche');
}

btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('modo-noche');
    const esOscuro = document.body.classList.contains('modo-noche');
    localStorage.setItem('tema_sgg', esOscuro ? 'oscuro' : 'claro');
});

// Cerrar sesión
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('usuario_activo_sgg');
    window.location.href = 'index.html';
});

// Funciones de LocalStorage (b)
function obtenerGastos() {
    return JSON.parse(localStorage.getItem('gastos_sgg')) || [];
}

function guardarGastos(gastos) {
    localStorage.setItem('gastos_sgg', JSON.stringify(gastos));
}

// Renderizado de tabla y total (RF-06 y RF-09)
function renderizar() {
    const todos = obtenerGastos();
    // Trazabilidad por email y filtro de estado_activo (b y c)
    const misGastos = todos.filter(g => g.email_usuario === usuarioActivo.email && g.estado_activo === true);

    tablaGastosBody.innerHTML = '';

    if (misGastos.length === 0) {
        tablaGastosBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay gastos cargados.</td></tr>';
    } else {
        misGastos.forEach(gasto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${gasto.fecha}</td>
                <td>${gasto.categoria}</td>
                <td>${gasto.descripcion}</td>
                <td>$${parseFloat(gasto.monto).toFixed(2)}</td>
                <td>
                    <button class="btn-marrón-secundario" onclick="prepararEdicion(${gasto.id})">Editar</button>
                    <button class="btn-marrón" onclick="abrirModal(${gasto.id})">Eliminar</button>
                </td>
            `;
            tablaGastosBody.appendChild(tr);
        });
    }

    // Panel de Resumen (RF-09)
    const total = misGastos.reduce((sum, g) => sum + parseFloat(g.monto), 0);
    totalGastadoEl.textContent = `$${total.toFixed(2)}`;
}

// Carga y Edición de Gastos (RF-05, RF-07 y d)
formGasto.addEventListener('submit', (e) => {
    e.preventDefault();
    msgError.textContent = '';

    const montoVal = parseFloat(montoInput.value);
    const fechaVal = fechaInput.value;
    const categoriaVal = categoriaInput.value;
    const descripcionVal = descripcionInput.value.trim();
    const idVal = gastoIdInput.value;

    // Validaciones (d)
    if (isNaN(montoVal) || montoVal <= 0) {
        msgError.textContent = 'El monto debe ser mayor a cero.';
        return;
    }

    let todos = obtenerGastos();

    if (idVal) {
        // Update (RF-07)
        todos = todos.map(g => g.id === parseInt(idVal) ? { ...g, monto: montoVal, fecha: fechaVal, categoria: categoriaVal, descripcion: descripcionVal } : g);
    } else {
        // Create (RF-05)
        todos.push({
            id: Date.now(),
            email_usuario: usuarioActivo.email,
            monto: montoVal,
            fecha: fechaVal,
            categoria: categoriaVal,
            descripcion: descripcionVal,
            estado_activo: true
        });
    }

    guardarGastos(todos);
    limpiarForm();
    renderizar();
});

window.prepararEdicion = function(id) {
    const gasto = obtenerGastos().find(g => g.id === id);
    if (gasto) {
        gastoIdInput.value = gasto.id;
        montoInput.value = gasto.monto;
        fechaInput.value = gasto.fecha;
        categoriaInput.value = gasto.categoria;
        descripcionInput.value = gasto.descripcion;

        formTitle.textContent = 'Editar Gasto';
        btnGuardar.textContent = 'Actualizar Gasto';
        btnCancelar.style.display = 'inline-block';
    }
};

btnCancelar.addEventListener('click', limpiarForm);

function limpiarForm() {
    gastoIdInput.value = '';
    formGasto.reset();
    formTitle.textContent = 'Cargar Nuevo Gasto';
    btnGuardar.textContent = 'Guardar Gasto';
    btnCancelar.style.display = 'none';
    msgError.textContent = '';
}

// Baja Lógica (RF-08 y c)
window.abrirModal = function(id) {
    idGastoAEliminar = id;
    modalConfirm.style.display = 'flex';
};

btnCancelarEliminar.addEventListener('click', () => {
    idGastoAEliminar = null;
    modalConfirm.style.display = 'none';
});

btnConfirmarEliminar.addEventListener('click', () => {
    if (idGastoAEliminar) {
        let todos = obtenerGastos();
        // Cambia estado_activo a false (soft delete)
        todos = todos.map(g => g.id === idGastoAEliminar ? { ...g, estado_activo: false } : g);
        guardarGastos(todos);
        renderizar();
    }
    idGastoAEliminar = null;
    modalConfirm.style.display = 'none';
});

renderizar();
