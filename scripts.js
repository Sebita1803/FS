document.addEventListener('DOMContentLoaded', function() {
    // Aquí se pueden agregar las funciones interactivas y animaciones
    if (window.location.pathname.endsWith('historial_pacientes.html')) {
        cargarPacientes();
    }

    if (window.location.pathname.endsWith('nueva_sesion.html')) {
        cargarDatosPaciente();
        document.getElementById('guardarSesion').addEventListener('click', guardarSesion);
        document.getElementById('cancelarSesion').addEventListener('click', cancelarSesion);
        document.getElementById('limpiarSesion').addEventListener('click', limpiarSesion);
    }

    if (window.location.pathname.endsWith('historial_sesiones.html')) {
        cargarSesiones();
    }

    if (window.location.pathname.endsWith('pagos.html')) {
        cargarPagos();
        document.getElementById('nuevoPagoBtn').addEventListener('click', mostrarFormularioPago);
        document.getElementById('cancelarPagoBtn').addEventListener('click', cancelarPago);
        document.getElementById('guardarPagoBtn').addEventListener('click', guardarPago);
        document.getElementById('buscarOrdenPago').addEventListener('input', buscarPago);
    }

    if (window.location.pathname.endsWith('estadisticas.html')) {
        generarGraficos();
    }

    if (window.location.pathname.endsWith('index.html')) {
        generarGraficoResumen();
    }

    if (window.location.pathname.endsWith('manual.html')) {
        document.getElementById('descargarManualBtn').addEventListener('click', descargarManual);
    }
});

document.getElementById('nuevoPacienteForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const rut = document.getElementById('rut').value;
    const edad = document.getElementById('edad').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const genero = document.getElementById('genero').value;
    const nacionalidad = document.getElementById('nacionalidad').value;
    const estadoCivil = document.getElementById('estadoCivil').value;
    const contacto = document.getElementById('contacto').value;
    const correo = document.getElementById('correo').value;
    const diagnostico = document.getElementById('diagnostico').value;
    const observacion = document.getElementById('observacion').value;
    
    // Crear un objeto paciente
    const paciente = {
        nombre,
        rut,
        edad,
        fechaNacimiento,
        genero,
        nacionalidad,
        estadoCivil,
        contacto,
        correo,
        diagnostico,
        observacion,
        categoria: '' // Inicialmente sin categoría
    };
    
    // Obtener los pacientes existentes de localStorage
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    
    // Agregar el nuevo paciente a la lista
    pacientes.push(paciente);
    
    // Guardar la lista actualizada en localStorage
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    
    // Mostrar la alerta de registro exitoso
    const alerta = document.getElementById('alerta');
    alerta.classList.add('show');
    
    // Ocultar la alerta después de 3 segundos
    setTimeout(function() {
        alerta.classList.remove('show');
    }, 3000);
    
    // Redirigir a la página de historial de pacientes
    window.location.href = 'historial_pacientes.html';
});

// Función para cargar los pacientes en la tabla de historial de pacientes
function cargarPacientes() {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const pacientesContainer = document.getElementById('pacientesContainer');
    
    pacientes.forEach((paciente, index) => {
        const pacienteDiv = document.createElement('div');
        pacienteDiv.className = 'paciente';
        pacienteDiv.style.backgroundColor = paciente.categoria;
        
        pacienteDiv.innerHTML = `
            <p><strong>Nombre Completo:</strong> ${paciente.nombre}</p>
            <p><strong>Rut:</strong> ${paciente.rut}</p>
            <p><strong>Edad:</strong> ${paciente.edad}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${paciente.fechaNacimiento}</p>
            <p><strong>Género:</strong> ${paciente.genero}</p>
            <p><strong>Nacionalidad:</strong> ${paciente.nacionalidad}</p>
            <p><strong>Estado Civil:</strong> ${paciente.estadoCivil}</p>
            <p><strong>Número de Contacto:</strong> ${paciente.contacto}</p>
            <p><strong>Correo Electrónico:</strong> ${paciente.correo}</p>
            <p><strong>Diagnóstico de Ingreso:</strong> ${paciente.diagnostico}</p>
            <p><strong>Observación Inicial:</strong> ${paciente.observacion}</p>
            <button class="eliminar" onclick="eliminarPaciente(${index})">Eliminar</button>
            <button class="categorizar" onclick="mostrarOpcionesCategoria(${index})">Categorizar</button>
            <button class="sesion" onclick="redirigirNuevaSesion(${index})">Nueva Sesión</button>
            <div id="opcionesCategoria${index}" class="opciones-categoria" style="display: none;">
                <button class="leve" onclick="categorizarPaciente(${index}, 'leve')">Leve</button>
                <button class="intermedio" onclick="categorizarPaciente(${index}, 'intermedio')">Intermedio</button>
                <button class="severo" onclick="categorizarPaciente(${index}, 'severo')">Severo</button>
            </div>
        `;
        
        pacientesContainer.appendChild(pacienteDiv);
    });
}

// Función para eliminar un paciente
function eliminarPaciente(index) {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes.splice(index, 1);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    alert('Eliminado con éxito');
    location.reload();
}

// Función para mostrar las opciones de categoría
function mostrarOpcionesCategoria(index) {
    document.getElementById(`opcionesCategoria${index}`).style.display = 'flex';
}

// Función para categorizar un paciente
function categorizarPaciente(index, categoria) {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    let color;
    switch (categoria) {
        case 'leve':
            color = '#b3e6b3'; // Verde pastel
            break;
        case 'intermedio':
            color = '#ffffb3'; // Amarillo pastel
            break;
        case 'severo':
            color = '#ffb3b3'; // Rojo pastel
            break;
    }
    pacientes[index].categoria = color;
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    location.reload();
}

// Función para redirigir a la página de nueva sesión
function redirigirNuevaSesion(index) {
    localStorage.setItem('pacienteSeleccionado', index);
    window.location.href = 'nueva_sesion.html';
}

// Función para cargar los datos del paciente seleccionado en la página de nueva sesión
function cargarDatosPaciente() {
    const index = localStorage.getItem('pacienteSeleccionado');
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes[index];
    
    const datosPacienteDiv = document.getElementById('datosPaciente');
    datosPacienteDiv.innerHTML = `
        <p><strong>Nombre Completo:</strong> ${paciente.nombre}</p>
        <p><strong>Rut:</strong> ${paciente.rut}</p>
        <p><strong>Edad:</strong> ${paciente.edad}</p>
        <p><strong>Fecha de Nacimiento:</strong> ${paciente.fechaNacimiento}</p>
        <p><strong>Género:</strong> ${paciente.genero}</p>
        <p><strong>Nacionalidad:</strong> ${paciente.nacionalidad}</p>
        <p><strong>Estado Civil:</strong> ${paciente.estadoCivil}</p>
        <p><strong>Número de Contacto:</strong> ${paciente.contacto}</p>
        <p><strong>Correo Electrónico:</strong> ${paciente.correo}</p>
        <p><strong>Diagnóstico de Ingreso:</strong> ${paciente.diagnostico}</p>
        <p><strong>Observación Inicial:</strong> ${paciente.observacion}</p>
    `;
}

// Función para guardar la sesión
function guardarSesion() {
    const index = localStorage.getItem('pacienteSeleccionado');
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes[index];
    const anotaciones = document.getElementById('anotaciones').value;
    
    const sesion = {
        paciente,
        anotaciones,
        fecha: new Date().toLocaleString()
    };
    
    let sesiones = JSON.parse(localStorage.getItem('sesiones')) || [];
    sesiones.push(sesion);
    localStorage.setItem('sesiones', JSON.stringify(sesiones));
    
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = 'Sesión guardada con éxito';
    notificacion.classList.add('show');
    notificacion.style.backgroundColor = '#4CAF50';
    
    setTimeout(function() {
        notificacion.classList.remove('show');
        window.location.href = 'historial_sesiones.html';
    }, 3000);
}

// Función para cancelar la sesión
function cancelarSesion() {
    window.location.href = 'historial_pacientes.html';
}

// Función para limpiar el cuadro de texto
function limpiarSesion() {
    document.getElementById('anotaciones').value = '';
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = 'Cuadro limpio';
    notificacion.classList.add('show');
    notificacion.style.backgroundColor = '#ffcc00';
    
    setTimeout(function() {
        notificacion.classList.remove('show');
    }, 3000);
}

// Función para cargar las sesiones en la página de historial de sesiones
function cargarSesiones() {
    const sesiones = JSON.parse(localStorage.getItem('sesiones')) || [];
    const sesionesContainer = document.getElementById('sesionesContainer');
    
    sesiones.forEach((sesion, index) => {
        const sesionDiv = document.createElement('div');
        sesionDiv.className = 'sesion';
        
        sesionDiv.innerHTML = `
            <p><strong>Nombre Completo:</strong> ${sesion.paciente.nombre}</p>
            <p><strong>Rut:</strong> ${sesion.paciente.rut}</p>
            <p><strong>Edad:</strong> ${sesion.paciente.edad}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${sesion.paciente.fechaNacimiento}</p>
            <p><strong>Género:</strong> ${sesion.paciente.genero}</p>
            <p><strong>Nacionalidad:</strong> ${sesion.paciente.nacionalidad}</p>
            <p><strong>Estado Civil:</strong> ${sesion.paciente.estadoCivil}</p>
            <p><strong>Número de Contacto:</strong> ${sesion.paciente.contacto}</p>
            <p><strong>Correo Electrónico:</strong> ${sesion.paciente.correo}</p>
            <p><strong>Diagnóstico de Ingreso:</strong> ${sesion.paciente.diagnostico}</p>
            <p><strong>Observación Inicial:</strong> ${sesion.paciente.observacion}</p>
            <p><strong>Fecha de Sesión:</strong> ${sesion.fecha}</p>
            <button class="ver" onclick="verSesion(${index})">Ver</button>
            <button class="eliminar" onclick="eliminarSesion(${index})">Eliminar</button>
            <button class="descargar" onclick="descargarSesion(${index})">Descargar</button>
            <div id="anotaciones${index}" class="anotaciones" style="display: none;">
                <p>${sesion.anotaciones}</p>
            </div>
        `;
        
        sesionesContainer.appendChild(sesionDiv);
    });
}

// Función para ver/ocultar la previsualización de la sesión
function verSesion(index) {
    const anotacionesDiv = document.getElementById(`anotaciones${index}`);
    anotacionesDiv.style.display = anotacionesDiv.style.display === 'none' ? 'block' : 'none';
}

// Función para eliminar una sesión
function eliminarSesion(index) {
    let sesiones = JSON.parse(localStorage.getItem('sesiones')) || [];
    sesiones.splice(index, 1);
    localStorage.setItem('sesiones', JSON.stringify(sesiones));
    alert('Registro eliminado');
    location.reload();
}

// Función para descargar una sesión como PDF
function descargarSesion(index) {
    const { jsPDF } = window.jspdf;
    const sesiones = JSON.parse(localStorage.getItem('sesiones')) || [];
    const sesion = sesiones[index];
    const fechaActual = new Date().toLocaleString();

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Nombre Completo: ${sesion.paciente.nombre}`, 10, 10);
    doc.text(`Rut: ${sesion.paciente.rut}`, 10, 20);
    doc.text(`Edad: ${sesion.paciente.edad}`, 10, 30);
    doc.text(`Fecha de Nacimiento: ${sesion.paciente.fechaNacimiento}`, 10, 40);
    doc.text(`Género: ${sesion.paciente.genero}`, 10, 50);
    doc.text(`Nacionalidad: ${sesion.paciente.nacionalidad}`, 10, 60);
    doc.text(`Estado Civil: ${sesion.paciente.estadoCivil}`, 10, 70);
    doc.text(`Número de Contacto: ${sesion.paciente.contacto}`, 10, 80);
    doc.text(`Correo Electrónico: ${sesion.paciente.correo}`, 10, 90);
    doc.text(`Diagnóstico de Ingreso: ${sesion.paciente.diagnostico}`, 10, 100);
    doc.text(`Observación Inicial: ${sesion.paciente.observacion}`, 10, 110);
    doc.text(`Fecha de Sesión: ${sesion.fecha}`, 10, 120);
    doc.text(`Anotaciones:`, 10, 130);
    doc.text(sesion.anotaciones, 10, 140, { maxWidth: 180 });
    doc.text(`Fecha de Generación del PDF: ${fechaActual}`, 10, 150);

    doc.save(`Sesion_${sesion.paciente.nombre}.pdf`);
}

// Generar un número de orden de pago aleatorio de 6 dígitos
function generarOrdenPago() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mostrar el formulario de nuevo pago
function mostrarFormularioPago() {
    document.getElementById('nuevoPagoForm').style.display = 'block';
    document.getElementById('ordenPago').value = generarOrdenPago();
}

// Cancelar el nuevo pago
function cancelarPago() {
    document.getElementById('nuevoPagoForm').style.display = 'none';
}

// Guardar el nuevo pago
function guardarPago() {
    const nombre = document.getElementById('nombrePago').value;
    const rut = document.getElementById('rutPago').value;
    const ordenPago = document.getElementById('ordenPago').value;
    const monto = document.getElementById('montoPago').value;
    const metodoPago = document.getElementById('metodoPago').value;
    
    const pago = {
        nombre,
        rut,
        ordenPago,
        monto,
        metodoPago,
        fecha: new Date().toLocaleString()
    };
    
    let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    pagos.push(pago);
    localStorage.setItem('pagos', JSON.stringify(pagos));
    
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = 'Pago guardado con éxito';
    notificacion.classList.add('show');
    notificacion.style.backgroundColor = '#4CAF50';
    
    // Actualizar la lista de pagos inmediatamente
    cargarPagos();
    
    setTimeout(function() {
        notificacion.classList.remove('show');
        document.getElementById('nuevoPagoForm').style.display = 'none';
    }, 3000);
}

// Función para cargar los pagos en la página de pagos
function cargarPagos() {
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    const registrosPagoContainer = document.getElementById('registrosPagoContainer');
    registrosPagoContainer.innerHTML = '';
    
    pagos.forEach((pago, index) => {
        const pagoDiv = document.createElement('div');
        pagoDiv.className = 'pago';
        
        pagoDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${pago.nombre}</p>
            <p><strong>Rut:</strong> ${pago.rut}</p>
            <p><strong>Orden de pago:</strong> ${pago.ordenPago}</p>
            <p><strong>Monto:</strong> ${pago.monto}</p>
            <p><strong>Método de pago:</strong> ${pago.metodoPago}</p>
            <p><strong>Fecha:</strong> ${pago.fecha}</p>
            <button class="descargar" onclick="descargarComprobante(${index})">Descargar comprobante</button>
            <button class="eliminar" onclick="eliminarPago(${index})">Eliminar</button>
        `;
        
        registrosPagoContainer.appendChild(pagoDiv);
    });
}

// Función para eliminar un pago
function eliminarPago(index) {
    let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    pagos.splice(index, 1);
    localStorage.setItem('pagos', JSON.stringify(pagos));
    
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = 'Pago eliminado';
    notificacion.classList.add('show');
    notificacion.style.backgroundColor = '#ff4d4d';
    
    // Actualizar la lista de pagos inmediatamente
    cargarPagos();
    
    setTimeout(function() {
        notificacion.classList.remove('show');
    }, 3000);
}

// Función para descargar un comprobante de pago como PDF
function descargarComprobante(index) {
    const { jsPDF } = window.jspdf;
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    const pago = pagos[index];
    const fechaActual = new Date().toLocaleString();

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Nombre: ${pago.nombre}`, 10, 10);
    doc.text(`Rut: ${pago.rut}`, 10, 20);
    doc.text(`Orden de pago: ${pago.ordenPago}`, 10, 30);
    doc.text(`Monto: ${pago.monto}`, 10, 40);
    doc.text(`Método de pago: ${pago.metodoPago}`, 10, 50);
    doc.text(`Fecha de pago: ${pago.fecha}`, 10, 60);
    doc.text(`Fecha de generación del PDF: ${fechaActual}`, 10, 70);

    doc.save(`Comprobante_Pago_${pago.ordenPago}.pdf`);
}

// Función para buscar un pago por orden de pago
function buscarPago() {
    const input = document.getElementById('buscarOrdenPago').value.toLowerCase();
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    const registrosPagoContainer = document.getElementById('registrosPagoContainer');
    registrosPagoContainer.innerHTML = '';

    pagos.forEach((pago, index) => {
        if (pago.ordenPago.toLowerCase().includes(input)) {
            const pagoDiv = document.createElement('div');
            pagoDiv.className = 'pago';

            pagoDiv.innerHTML = `
                <p><strong>Nombre:</strong> ${pago.nombre}</p>
                <p><strong>Rut:</strong> ${pago.rut}</p>
                <p><strong>Orden de pago:</strong> ${pago.ordenPago}</p>
                <p><strong>Monto:</strong> ${pago.monto}</p>
                <p><strong>Método de pago:</strong> ${pago.metodoPago}</p>
                <p><strong>Fecha:</strong> ${pago.fecha}</p>
                <button class="descargar" onclick="descargarComprobante(${index})">Descargar comprobante</button>
                <button class="eliminar" onclick="eliminarPago(${index})">Eliminar</button>
            `;

            registrosPagoContainer.appendChild(pagoDiv);
        }
    });
}

// Función para generar los gráficos en la página de estadísticas
function generarGraficos() {
    // Gráfico 1: Cantidad de pacientes y categorías
    const ctxPacientes = document.getElementById('graficoPacientes').getContext('2d');
    const pacientesData = JSON.parse(localStorage.getItem('pacientes')) || [];
    const categorias = { leve: 0, intermedio: 0, severo: 0 };

    pacientesData.forEach(paciente => {
        if (paciente.categoria === '#b3e6b3') categorias.leve++;
        if (paciente.categoria === '#ffffb3') categorias.intermedio++;
        if (paciente.categoria === '#ffb3b3') categorias.severo++;
    });

    new Chart(ctxPacientes, {
        type: 'bar',
        data: {
            labels: ['Total Pacientes', 'Leve', 'Intermedio', 'Severo'],
            datasets: [{
                label: 'Cantidad',
                data: [pacientesData.length, categorias.leve, categorias.intermedio, categorias.severo],
                backgroundColor: ['#b3e6b3', '#ffffb3', '#ffb3b3', '#cce5ff'],
                borderColor: ['#8BC34A', '#FFEB3B', '#F44336', '#1E88E5'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        color: '#333'
                    }
                }
            }
        }
    });

    // Gráfico 2: Cantidad de sesiones por paciente
    const ctxSesiones = document.getElementById('graficoSesiones').getContext('2d');
    const sesionesData = JSON.parse(localStorage.getItem('sesiones')) || [];
    const sesionesPorPaciente = {};

    sesionesData.forEach(sesion => {
        const nombre = sesion.paciente.nombre;
        if (!sesionesPorPaciente[nombre]) {
            sesionesPorPaciente[nombre] = 0;
        }
        sesionesPorPaciente[nombre]++;
    });

    new Chart(ctxSesiones, {
        type: 'bar',
        data: {
            labels: Object.keys(sesionesPorPaciente),
            datasets: [{
                label: 'Sesiones',
                data: Object.values(sesionesPorPaciente),
                backgroundColor: '#cce5ff',
                borderColor: '#1E88E5',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        color: '#333'
                    }
                }
            }
        }
    });

    // Gráfico 3: Estadísticas contables
    const ctxContabilidad = document.getElementById('graficoContabilidad').getContext('2d');
    const pagosData = JSON.parse(localStorage.getItem('pagos')) || [];
    const montos = pagosData.map(pago => pago.monto);
    const totalPagos = montos.length;
    const montoTotal = montos.reduce((acc, monto) => acc + monto, 0);
    const montoPromedio = montoTotal / totalPagos;
    const montoMaximo = Math.max(...montos);
    const montoMinimo = Math.min(...montos);

    new Chart(ctxContabilidad, {
        type: 'line',
        data: {
            labels: ['Total Pagos', 'Monto Total', 'Monto Promedio', 'Monto Máximo', 'Monto Mínimo'],
            datasets: [{
                label: 'Estadísticas Contables',
                data: [totalPagos, montoTotal, montoPromedio, montoMaximo, montoMinimo],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        color: '#333'
                    }
                }
            }
        }
    });
}

// Función para generar el gráfico de resumen en la página de inicio
function generarGraficoResumen() {
    const ctxResumen = document.getElementById('graficoResumen').getContext('2d');
    const pacientesData = JSON.parse(localStorage.getItem('pacientes')) || [];
    const sesionesData = JSON.parse(localStorage.getItem('sesiones')) || [];
    const pagosData = JSON.parse(localStorage.getItem('pagos')) || [];

    const categorias = { leve: 0, intermedio: 0, severo: 0 };
    pacientesData.forEach(paciente => {
        if (paciente.categoria === '#b3e6b3') categorias.leve++;
        if (paciente.categoria === '#ffffb3') categorias.intermedio++;
        if (paciente.categoria === '#ffb3b3') categorias.severo++;
    });

    const totalPacientes = pacientesData.length;
    const totalSesiones = sesionesData.length;
    const totalPagos = pagosData.length;

    new Chart(ctxResumen, {
        type: 'pie',
        data: {
            labels: ['Total Pacientes', 'Leve', 'Intermedio', 'Severo', 'Total Sesiones', 'Total Pagos'],
            datasets: [{
                label: 'Resumen',
                data: [totalPacientes, categorias.leve, categorias.intermedio, categorias.severo, totalSesiones, totalPagos],
                backgroundColor: ['#b3e6b3', '#ffffb3', '#ffb3b3', '#cce5ff', '#ffccff', '#ffebcc'],
                borderColor: ['#8BC34A', '#FFEB3B', '#F44336', '#1E88E5', '#E91E63', '#FF9800'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1
                }
            }
        }
    });
}

// Función para descargar el manual en PDF
function descargarManual() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Manual de Uso de FloreceSanandoApp', 10, 10);
    doc.text('Introducción 🌸', 10, 20);
    doc.text('Bienvenido al manual de uso de FloreceSanandoApp. Aquí encontrarás toda la información necesaria para utilizar la plataforma de manera eficiente.', 10, 30, { maxWidth: 180 });
    doc.text('Registro de Pacientes 📝', 10, 50);
    doc.text('Para registrar un nuevo paciente, sigue estos pasos:', 10, 60);
    doc.text('1. Haz clic en "Pacientes" en el menú principal.', 10, 70);
    doc.text('2. Selecciona "Nuevo Paciente".', 10, 80);
    doc.text('3. Rellena el formulario con la información del paciente.', 10, 90);
    doc.text('4. Haz clic en "Registrar".', 10, 100);
    doc.text('El formulario de registro incluye los siguientes campos:', 10, 110);
    doc.text('- Nombre Completo: El nombre completo del paciente.', 10, 120);
    doc.text('- Rut: El RUT del paciente.', 10, 130);
    doc.text('- Edad: La edad del paciente.', 10, 140);
    doc.text('- Fecha de Nacimiento: La fecha de nacimiento del paciente.', 10, 150);
    doc.text('- Género: El género del paciente (masculino, femenino, prefiero no mencionar).', 10, 160);
    doc.text('- Nacionalidad: La nacionalidad del paciente.', 10, 170);
    doc.text('- Estado Civil: El estado civil del paciente (soltero, casado, viudo).', 10, 180);
    doc.text('- Número de Contacto: El número de contacto del paciente.', 10, 190);
    doc.text('- Correo Electrónico: El correo electrónico del paciente.', 10, 200);
    doc.text('- Diagnóstico de Ingreso: El diagnóstico inicial del paciente (opcional).', 10, 210);
    doc.text('- Observación Inicial: Cualquier observación inicial sobre el paciente (opcional).', 10, 220);
    doc.text('Gestión de Pacientes 👥', 10, 230);
    doc.text('Para gestionar los pacientes registrados, sigue estos pasos:', 10, 240);
    doc.text('1. Haz clic en "Pacientes" en el menú principal.', 10, 250);
    doc.text('2. Selecciona "Historial de pacientes".', 10, 260);
    doc.text('En la lista de pacientes, puedes realizar las siguientes acciones:', 10, 270);
    doc.text('- Eliminar: Haz clic en el botón "Eliminar" para eliminar un paciente.', 10, 280);
    doc.text('- Categorizar: Haz clic en el botón "Categorizar" para asignar una categoría al paciente (leve, intermedio, severo).', 10, 290);
    doc.text('- Nueva Sesión: Haz clic en el botón "Nueva Sesión" para registrar una nueva sesión para el paciente.', 10, 300);
    doc.text('Gestión de Sesiones 🗓️', 10, 310);
    doc.text('Para gestionar las sesiones, sigue estos pasos:', 10, 320);
    doc.text('1. Haz clic en "Sesiones" en el menú principal.', 10, 330);
    doc.text('2. Selecciona "Nueva Sesión" para registrar una nueva sesión.', 10, 340);
    doc.text('3. Rellena el formulario con la información de la sesión.', 10, 350);
    doc.text('4. Haz clic en "Guardar Sesión".', 10, 360);
    doc.text('El formulario de registro de sesiones incluye los siguientes campos:', 10, 370);
    doc.text('- Nombre Completo: El nombre completo del paciente.', 10, 380);
    doc.text('- Rut: El RUT del paciente.', 10, 390);
    doc.text('- Edad: La edad del paciente.', 10, 400);
    doc.text('- Fecha de Nacimiento: La fecha de nacimiento del paciente.', 10, 410);
    doc.text('- Género: El género del paciente.', 10, 420);
    doc.text('- Nacionalidad: La nacionalidad del paciente.', 10, 430);
    doc.text('- Estado Civil: El estado civil del paciente.', 10, 440);
    doc.text('- Número de Contacto: El número de contacto del paciente.', 10, 450);
    doc.text('- Correo Electrónico: El correo electrónico del paciente.', 10, 460);
    doc.text('- Diagnóstico de Ingreso: El diagnóstico inicial del paciente.', 10, 470);
    doc.text('- Observación Inicial: Cualquier observación inicial sobre el paciente.', 10, 480);
    doc.text('- Anotaciones: Las anotaciones de la sesión.', 10, 490);
    doc.text('Para ver el historial de sesiones, sigue estos pasos:', 10, 500);
    doc.text('1. Haz clic en "Sesiones" en el menú principal.', 10, 510);
    doc.text('2. Selecciona "Historial de sesiones".', 10, 520);
    doc.text('En la lista de sesiones, puedes realizar las siguientes acciones:', 10, 530);
    doc.text('- Ver: Haz clic en el botón "Ver" para ver los detalles de la sesión.', 10, 540);
    doc.text('- Eliminar: Haz clic en el botón "Eliminar" para eliminar una sesión.', 10, 550);
    doc.text('- Descargar: Haz clic en el botón "Descargar" para descargar un resumen de la sesión en PDF.', 10, 560);
    doc.text('Gestión de Pagos 💳', 10, 570);
    doc.text('Para gestionar los pagos, sigue estos pasos:', 10, 580);
    doc.text('1. Haz clic en "Pagos" en el menú principal.', 10, 590);
    doc.text('2. Selecciona "Nuevo Pago" para registrar un nuevo pago.', 10, 600);
    doc.text('3. Rellena el formulario con la información del pago.', 10, 610);
    doc.text('4. Haz clic en "Guardar Pago".', 10, 620);
    doc.text('El formulario de registro de pagos incluye los siguientes campos:', 10, 630);
    doc.text('- Nombre: El nombre del paciente.', 10, 640);
    doc.text('- Rut: El RUT del paciente.', 10, 650);
    doc.text('- Orden de pago: El número de orden de pago (generado automáticamente).', 10, 660);
    doc.text('- Monto: El monto del pago.', 10, 670);
    doc.text('- Método de pago: El método de pago utilizado.', 10, 680);
    doc.text('Para ver el historial de pagos, sigue estos pasos:', 10, 690);
    doc.text('1. Haz clic en "Pagos" en el menú principal.', 10, 700);
    doc.text('2. Selecciona "Historial de pagos".', 10, 710);
    doc.text('En la lista de pagos, puedes realizar las siguientes acciones:', 10, 720);
    doc.text('- Descargar: Haz clic en el botón "Descargar" para descargar un comprobante de pago en PDF.', 10, 730);
    doc.text('- Eliminar: Haz clic en el botón "Eliminar" para eliminar un pago.', 10, 740);
    doc.text('Estadísticas 📊', 10, 750);
    doc.text('Para ver las estadísticas, sigue estos pasos:', 10, 760);
    doc.text('1. Haz clic en "Estadísticas" en el menú principal.', 10, 770);
    doc.text('2. Revisa los gráficos interactivos para obtener información detallada.', 10, 780);
    doc.text('Los gráficos incluyen:', 10, 790);
    doc.text('- Gráfico de Pacientes: Muestra la cantidad total de pacientes y su distribución por categorías (leve, intermedio, severo).', 10, 800);
    doc.text('- Gráfico de Sesiones: Muestra la cantidad de sesiones por paciente.', 10, 810);
    doc.text('- Gráfico de Contabilidad: Muestra estadísticas contables como el total de pagos, monto total, monto promedio, monto máximo y monto mínimo.', 10, 820);
    doc.save('Manual_de_Uso_FloreceSanandoApp.pdf');
}
