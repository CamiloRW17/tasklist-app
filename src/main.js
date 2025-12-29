import './style.css'

// --- SELECCIÓN DE ELEMENTOS DEL DOM ---
const formulario = document.getElementById('todo-form');
const inputTarea = document.getElementById('task-intro'); 
const listaTask = document.getElementById('tasklist');
const validacion = document.getElementById('rendimiento'); // Botón para verificar progreso
const title = document.getElementById('titulo');

// --- ESTADO (STATE) ---
// Recuperamos las tareas guardadas. Si es la primera visita (null), inicializamos un array vacío.
// El '|| []' es un patrón "Short-circuit evaluation" para evitar errores de null.
let misTareas = JSON.parse(localStorage.getItem('theTasks')) || [];

// --- PERSISTENCIA DE DATOS ---
// Función reutilizable para sincronizar el estado actual con el navegador.
// Usamos JSON.stringify porque localStorage solo acepta strings.
const guardarEnLocal = () => {
    localStorage.setItem('theTasks', JSON.stringify(misTareas));
};

// --- LÓGICA DE RENDERIZADO (VIEW) ---
const renderizarTareas = () => {
    // 1. Limpiamos el contenedor antes de repintar para evitar duplicar tareas visualmente.
    listaTask.innerHTML = '';

    // UX: Solo mostramos el botón de "ver rendimiento" si hay tareas que evaluar.
    if (misTareas.length > 0) {
        validacion.removeAttribute('hidden');
    }

    // 2. Generación dinámica del DOM basada en el estado (misTareas)
    misTareas.forEach((objTarea, index) => {
        // Creamos elementos "en memoria" (más seguro y performante que usar innerHTML directo)
        let etiqueta = document.createElement('div');
        let tarea = document.createElement('span');
        let taskAndCheck = document.createElement('li');
        let crossClose = document.createElement('button');

        // Configuración de estilos y contenido
        crossClose.textContent = 'X';
        crossClose.classList = 'font-bold text-red-500 cursor-pointer'; // Agregué cursor-pointer para UX

        etiqueta.className = 'bg-white w-[300px] p-3 shadow rounded flex justify-between items-center border-l-10 border-green-500';
        taskAndCheck.className = 'flex gap-6 items-center self-center justify-center mb-2'; // Agregué mb-2 para espaciado

        tarea.textContent = `${objTarea.text}`;

        // Armamos la estructura de la tarjeta
        etiqueta.appendChild(tarea);
        etiqueta.appendChild(crossClose);

        let checked = document.createElement('input');
        checked.type = 'checkbox';
        // Sincronizamos el checkbox visual con el estado real de la tarea
        checked.checked = objTarea.completed;

        // EVENTO: Marcar como completada
        checked.addEventListener('change', () => {
            misTareas[index].completed = checked.checked; // Actualizamos estado
            guardarEnLocal(); // Persistimos el cambio
        });

        // EVENTO: Eliminar tarea
        crossClose.addEventListener('click', () => {
            misTareas.splice(index, 1); // Eliminamos del array usando el índice
            guardarEnLocal(); // Actualizamos localStorage
            
            // Recursividad: Volvemos a renderizar para que la UI refleje la eliminación
            listaTask.innerHTML = ''; 
            renderizarTareas(); 
        });

        // Inserción final en el DOM
        taskAndCheck.appendChild(etiqueta);
        taskAndCheck.appendChild(checked);
        listaTask.appendChild(taskAndCheck);
    });
}

// --- MANEJO DEL FORMULARIO ---
formulario.addEventListener('submit', (event) => {
    // Evitamos que el form recargue la página (comportamiento SPA)
    event.preventDefault();

    // trim() elimina espacios vacíos al inicio y final para mantener los datos limpios
    let taskToDo = inputTarea.value.trim();

    // Validación básica: Evitar tareas vacías
    if (taskToDo === ""){ 
        alert('Necesitas ingresar texto');
        return;
    }

    // Creación del objeto de tarea
    const nuevaTareaObj = {
        text: taskToDo,
        completed: false // Por defecto, una tarea nueva no está completada
    };

    // Actualizamos Estado -> Guardamos -> Pintamos
    misTareas.push(nuevaTareaObj);
    guardarEnLocal();
    renderizarTareas();

    // UX: Limpiamos el input y devolvemos el foco para escribir rápido otra tarea
    inputTarea.value = '';
    inputTarea.focus();
})

// --- LÓGICA DE NEGOCIO (Cálculo de Progreso) ---
validacion.addEventListener('click', (event) => {
    event.preventDefault();

    let completeTasks = [];
    // Leemos directamente del DOM actual
    const tareas = document.querySelectorAll('#tasklist > li');

    // Recorremos los elementos visuales para contar los checkboxes marcados
    for (let i = 0; i < tareas.length; i++){
        const divActual = tareas[i];
        const checkbox = divActual.querySelector('input[type="checkbox"]');

        if (checkbox && checkbox.checked === true) {
            completeTasks.push(divActual);
        }
    }

    // Feedback al usuario según su progreso
    if (completeTasks.length === tareas.length && completeTasks.length > 0){
        title.textContent = '¡Completaste todas tus tareas! 🎉';
    } else {
        title.textContent = `Llevas ${completeTasks.length} de ${tareas.length} tareas terminadas`;
    }
});

// Inicialización de la app al cargar el script
renderizarTareas();



