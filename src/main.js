import './style.css'

const formulario = document.getElementById('todo-form');
const inputTarea = document.getElementById('task-intro'); 
const listaTask = document.getElementById('tasklist');
const validacion = document.getElementById('rendimiento');
const title = document.getElementById('titulo')


let misTareas = JSON.parse(localStorage.getItem('theTasks')) || [];

// Función de guardado 
const guardarEnLocal = () => {
    localStorage.setItem('theTasks', JSON.stringify(misTareas));
};


// Función para presentar la información en el ul


const renderizarTareas = () => {

    listaTask.innerHTML = '';

    if (misTareas.length > 0) {
        validacion.removeAttribute('hidden')
    }

    // Recorrimiento del array de tareas y creación de elementos para la lista mostrada

    misTareas.forEach((objTarea, index) => {

        let etiqueta = document.createElement('div')
        let tarea = document.createElement('span');
        let taskAndCheck = document.createElement('li');
        let crossClose = document.createElement('button');

        crossClose.textContent = 'X'
        crossClose.classList = 'font-bold text-red-500'

        etiqueta.className = 'bg-white w-[300px] p-3 shadow rounded flex justify-between items-center border-l-10 border-green-500';
        taskAndCheck.className = 'flex gap-6 items-center self-center justify-center';

        //El texto del objeto guardado se convierte en el texto del elemento creado para la tarea
        tarea.textContent = `${objTarea.text}`;

        etiqueta.appendChild(tarea)
        etiqueta.appendChild(crossClose)

        let checked = document.createElement('input');

        checked.type = 'checkbox';

        checked.checked = objTarea.completed;

        checked.addEventListener('change', () => {
            misTareas[index].completed = checked.checked;
            guardarEnLocal();
        });

        crossClose.addEventListener('click', () => {
        misTareas.splice(index, 1);
        guardarEnLocal();
        
        listaTask.innerHTML = ''; 
        renderizarTareas(); 
    });

    taskAndCheck.appendChild(etiqueta);
    taskAndCheck.appendChild(checked);
    listaTask.appendChild(taskAndCheck);
    });
}

// Evento de submit del formulario

formulario.addEventListener('submit', (event) => {
    
    event.preventDefault();

    let taskToDo = inputTarea.value.trim();

    if (taskToDo === ""){ 
        alert('Escribe algo!');
        return;
    }

    // Se crea el objeto para la nueva tarea
    const nuevaTareaObj = {
        text: taskToDo,
        completed: false
    };

    misTareas.push(nuevaTareaObj);


    // Se guarda y se muestra la tarea
    guardarEnLocal();
    renderizarTareas();

    inputTarea.value = '';
    inputTarea.focus();
})


// Guardar en local storage
 

validacion.addEventListener('click', (event) => {

    event.preventDefault();

    let completeTasks = [];
    const tareas = document.querySelectorAll('#tasklist > li');

    for ( let i = 0; i<tareas.length;i++){
        const divActual = tareas[i];

        const checkbox = divActual.querySelector('input[type="checkbox"]');

        if (checkbox && checkbox.checked === true) {
        completeTasks.push(divActual);
         }

    }

    if (completeTasks.length === tareas.length && completeTasks.length > 0){
        title.textContent = 'Completaste todas tus tareas'
    } else {
        title.textContent=`Llevas ${completeTasks.length} de ${tareas.length} tareas terminadas`
    }

});

renderizarTareas();



