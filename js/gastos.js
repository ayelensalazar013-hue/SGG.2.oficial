const usuarioActivo = JSON.parse(localStorage.getItem('usuario_activo_sgg'));

if (!usuarioActivo) {
    window.location.href = 'index.html';
}

let gastoAEliminarId = null;

document.addEventListener('DOMContentLoaded', () => {
    const userWelcome = document.getElementById('userWelcome');
    if (userWelcome && usuarioActivo) {
        userWelcome.textContent = `Sesión activa: ${usuarioActivo.email || usuarioActivo.usuario || 'Usuario'}`;
    }

    const inputFecha = document.getElementById('fecha');
    if (inputFecha) {
        inputFecha.value = new Date().toISOString().split('T')[0];
    }

    const formGasto = document.getElementById('form-gasto');
    if (formGasto) {
        formGasto.addEventListener('submit', guardarGasto);
    }

    renderizarGastos();
});

window.cambiarTema = function() {
    document.body.classList.toggle('modo-noche');
    const esOscuro = document.body.classList.contains('modo-noche');
    localStorage.setItem('tema_sgg', esOscuro ? 'oscuro' : 'claro');
};

if (localStorage.getItem('tema_sgg') === 'oscuro') {
    document.body.classList.add('modo-noche');
}

window.cerrarSesion = function() {
    localStorage.removeItem('usuario_activo_sgg');
    window.location.href = 'index.html';
};

function renderizarGastos() {
    const tablaBody = document.getElementById('tablaGastosBody');
    const totalMontoElem = document.getElementById('totalGastado');
    if (!tablaBody) return;

    tablaBody.innerHTML = '';
    const todosLosGastos = JSON.parse(localStorage.getItem('gastos_sgg')) || [];
    
    const gastosUsuario = todosLosGastos.filter(g => 
        (g.usuarioEmail === usuarioActivo.email || g.usuarioEmail === usuarioActivo.usuario) && 
        g.estado_activo !== false
    );

    let totalSumado = 0;

    gastosUsuario.forEach(gasto => {
        totalSumado += parseFloat(gasto.monto) || 0;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${gasto.fecha}</td>
            <td>${gasto.categoria}</td>
            <td>${gasto.descripcion}</td>
            <td>$${parseFloat(gasto.monto).toFixed(2)}</td>
            <td style="white-space: nowrap;">
                <div class="acciones-cell">
                    <button type="button" class="btn-tabla btn-editar" onclick="prepararEdicion('${gasto.id}')">Editar</button>
                    <button type="button" class="btn-tabla btn-eliminar" onclick="abrirModal('${gasto.id}')">Eliminar</button>
                </div>
            </td>
        `;
        tablaBody.appendChild(tr);
    });

    if (totalMontoElem) {
        totalMontoElem.textContent = `$${totalSumado.toFixed(2)}`;
    }
}

function guardarGasto(e) {
    e.preventDefault();
    const mensaje = document.getElementById('mensaje');
    const gastoId = document.getElementById('gastoId').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const fecha = document.getElementById('fecha').value;
    const categoria = document.getElementById('categoria').value;
    const descripcion = document.getElementById('descripcion').value.trim();

    if (isNaN(monto) || monto <= 0) {
        mensaje.className = 'msg-box error';
        mensaje.textContent = 'El monto debe ser mayor a 0.';
        return;
    }

    let gastos = JSON.parse(localStorage.getItem('gastos_sgg')) || [];

    if (gastoId) {
        gastos = gastos.map(g => {
            if (g.id === gastoId) {
                return { ...g, monto, fecha, categoria, descripcion };
            }
            return g;
        });
        mensaje.className = 'msg-box success';
        mensaje.textContent = 'Gasto actualizado correctamente.';
    } else {
        const nuevoGasto = {
            id: 'gasto_' + Date.now(),
            usuarioEmail: usuarioActivo.email || usuarioActivo.usuario,
            monto,
            fecha,
            categoria,
            descripcion,
            estado_activo: true
        };
        gastos.push(nuevoGasto);
        mensaje.className = 'msg-box success';
        mensaje.textContent = 'Gasto registrado con éxito.';
    }

    localStorage.setItem('gastos_sgg', JSON.stringify(gastos));
    cancelarEdicion();
    renderizarGastos();

    setTimeout(() => { if (mensaje) mensaje.textContent = ''; }, 3000);
}

window.prepararEdicion = function(id) {
    const gastos = JSON.parse(localStorage.getItem('gastos_sgg')) || [];
    const gasto = gastos.find(g => g.id === id);
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
    document.getElementById('form-gasto').reset();
    document.getElementById('gastoId').value = '';
    document.getElementById('btn-guardar-gasto').textContent = 'Guardar Gasto';
    document.getElementById('btn-cancelar-edicion').style.display = 'none';
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
};

window.abrirModal = function(id) {
    gastoAEliminarId = id;
    const modal = document.getElementById('modalConfirmar');
    if (modal) modal.style.display = 'flex';
};

window.cerrarModal = function() {
    gastoAEliminarId = null;
    const modal = document.getElementById('modalConfirmar');
    if (modal) modal.style.display = 'none';
};

window.confirmarEliminacion = function() {
    if (!gastoAEliminarId) return;

    let gastos = JSON.parse(localStorage.getItem('gastos_sgg')) || [];
    gastos = gastos.map(g => {
        if (g.id === gastoAEliminarId) {
            return { ...g, estado_activo: false };
        }
        return g;
    });

    localStorage.setItem('gastos_sgg', JSON.stringify(gastos));
    cerrarModal();
    renderizarGastos();
};
