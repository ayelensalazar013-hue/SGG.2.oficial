document.addEventListener('DOMContentLoaded', () => {
    // 1. Bloquear automáticamente las fechas futuras en el calendario de la interfaz
    const inputFecha = document.getElementById('fecha');
    const hoy = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual (YYYY-MM-DD)

    if (inputFecha) {
        inputFecha.setAttribute('max', hoy); // Establece la fecha de hoy como el límite máximo seleccionable
    }

    // Cargar historial de gastos al iniciar
    cargarGastos();
});

// 2. Función de validación de fecha
function esFechaFutura(fechaIngresada) {
    const hoy = new Date().toISOString().split('T')[0];
    return fechaIngresada > hoy;
}

// 3. Captura y procesamiento del formulario de Gastos (Carga y Edición)
const formGasto = document.getElementById('formGasto');

if (formGasto) {
    formGasto.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const monto = parseFloat(document.getElementById('monto').value);
        const fecha = document.getElementById('fecha').value;
        const categoria = document.getElementById('categoria').value;
        const descripcion = document.getElementById('descripcion').value;

        // Validar que el monto sea un número positivo
        if (isNaN(monto) || monto <= 0) {
            alert("El monto debe ser un valor positivo mayor a cero.");
            return;
        }

        // VALIDACIÓN DE FECHA FUTURA
        if (esFechaFutura(fecha)) {
            alert("Error: No puedes registrar ni editar un gasto con una fecha futura.");
            return; // Frena el proceso y no guarda nada
        }

        // Si pasa las validaciones, guardamos en LocalStorage
        guardarGasto({ monto, fecha, categoria, descripcion });
    });
}

// 4. Función para guardar o actualizar en LocalStorage
function guardarGasto(gastoNuevo) {
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    const usuarioActivo = localStorage.getItem('usuarioActivo'); // Gmail/ID del usuario en sesión

    const gasto = {
        id: Date.now(),
        usuarioEmail: usuarioActivo,
        monto: gastoNuevo.monto,
        fecha: gastoNuevo.fecha,
        categoria: gastoNuevo.categoria,
        descripcion: gastoNuevo.descripcion,
        estado_activo: true // Baja lógica
    };

    gastos.push(gasto);
    localStorage.setItem('gastos', JSON.stringify(gastos));

    alert("Gasto registrado correctamente.");
    formGasto.reset();
    
    // Volvemos a colocar el atributo max al limpiar el formulario
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').setAttribute('max', hoy);

    cargarGastos();
}

// 5. Función para mostrar la lista de gastos en pantalla
function cargarGastos() {
    const tablaGastos = document.getElementById('tablaGastos');
    const totalGastadoElem = document.getElementById('totalGastado');
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    
    if (!tablaGastos) return;

    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    
    // Filtrar solo los gastos del usuario activo y que estén activos (estado_activo === true)
    let gastosUsuario = gastos.filter(g => g.usuarioEmail === usuarioActivo && g.estado_activo === true);

    tablaGastos.innerHTML = '';
    let total = 0;

    gastosUsuario.forEach(g => {
        total += g.monto;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${g.fecha}</td>
            <td>${g.categoria}</td>
            <td>${g.descripcion}</td>
            <td>$${g.monto.toFixed(2)}</td>
            <td>
                <button onclick="eliminarGasto(${g.id})">Eliminar</button>
            </td>
        `;
        tablaGastos.appendChild(fila);
    });

    if (totalGastadoElem) {
        totalGastadoElem.textContent = `$${total.toFixed(2)}`;
    }
}

// 6. Eliminación lógica (RF-08)
function eliminarGasto(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este gasto?")) {
        let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
        
        // Cambiamos el estado_activo a false sin borrar el objeto
        gastos = gastos.map(g => {
            if (g.id === id) {
                g.estado_activo = false;
            }
            return g;
        });

        localStorage.setItem('gastos', JSON.stringify(gastos));
        cargarGastos();
    }
}
