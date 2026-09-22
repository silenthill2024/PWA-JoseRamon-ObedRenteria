// ======================================================
// RACE 95 PWA
// JavaScript principal
// ======================================================


// ------------------------------------------------------
// ELEMENTOS DEL DOM
// ------------------------------------------------------

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const connectionStatus = document.getElementById("connectionStatus");
const installButton = document.getElementById("installButton");


// ------------------------------------------------------
// LOCALSTORAGE
// ------------------------------------------------------

let tasks = JSON.parse(
    localStorage.getItem("race95Tasks")
) || [];


function saveTasks() {

    localStorage.setItem(
        "race95Tasks",
        JSON.stringify(tasks)
    );

}


// ------------------------------------------------------
// ESTADÍSTICAS
// ------------------------------------------------------

function updateStats() {

    const completed = tasks.filter(
        task => task.completed
    ).length;

    totalTasks.textContent = tasks.length;

    completedTasks.textContent = completed;

    pendingTasks.textContent =
        tasks.length - completed;

}


// ------------------------------------------------------
// MOSTRAR ACTIVIDADES
// ------------------------------------------------------

function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.className = "task-item";


        if (task.completed) {

            li.classList.add("completed");

        }


        // Contenedor izquierdo

        const taskLeft =
            document.createElement("div");

        taskLeft.className = "task-left";


        // Botón circular

        const check =
            document.createElement("div");

        check.className = "task-check";

        check.title =
            "Marcar actividad como completada";


        // Texto

        const text =
            document.createElement("span");

        text.className = "task-text";

        text.textContent = task.text;


        // Marcar como completada

        check.addEventListener(
            "click",
            () => {

                tasks[index].completed =
                    !tasks[index].completed;

                saveTasks();

                renderTasks();

            }
        );


        // Botón eliminar

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-task";

        deleteButton.innerHTML = "✕";

        deleteButton.title =
            "Eliminar actividad";


        deleteButton.addEventListener(
            "click",
            () => {

                tasks.splice(index, 1);

                saveTasks();

                renderTasks();

            }
        );


        taskLeft.appendChild(check);

        taskLeft.appendChild(text);


        li.appendChild(taskLeft);

        li.appendChild(deleteButton);


        taskList.appendChild(li);

    });


    updateStats();

}


// ------------------------------------------------------
// AGREGAR ACTIVIDAD
// ------------------------------------------------------

function addTask() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        taskInput.focus();

        return;

    }


    const newTask = {

        text: text,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();

    renderTasks();


    taskInput.value = "";

    taskInput.focus();

}


// Botón agregar

addTaskButton.addEventListener(
    "click",
    addTask
);


// Enter

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ------------------------------------------------------
// ESTADO ONLINE / OFFLINE
// ------------------------------------------------------

function updateConnectionStatus() {

    if (navigator.onLine) {

        connectionStatus.textContent =
            "● EN LÍNEA";

        connectionStatus.style.color =
            "#54e889";

    } else {

        connectionStatus.textContent =
            "● MODO OFFLINE";

        connectionStatus.style.color =
            "#ffd43b";

    }

}


window.addEventListener(
    "online",
    updateConnectionStatus
);


window.addEventListener(
    "offline",
    updateConnectionStatus
);


updateConnectionStatus();


// ------------------------------------------------------
// INSTALACIÓN DE LA PWA
// ------------------------------------------------------

let deferredPrompt = null;


window.addEventListener(
    "beforeinstallprompt",
    event => {

        // Evita que Chrome muestre inmediatamente
        // su interfaz predeterminada.

        event.preventDefault();


        deferredPrompt = event;


        // Mostrar nuestro botón

        installButton.hidden = false;

    }
);


installButton.addEventListener(
    "click",
    async () => {

        if (!deferredPrompt) {

            return;

        }


        deferredPrompt.prompt();


        const choice =
            await deferredPrompt.userChoice;


        console.log(
            "Resultado de instalación:",
            choice.outcome
        );


        deferredPrompt = null;

        installButton.hidden = true;

    }
);


window.addEventListener(
    "appinstalled",
    () => {

        console.log(
            "Race 95 PWA instalada correctamente."
        );

        installButton.hidden = true;

    }
);


// ------------------------------------------------------
// SERVICE WORKER
// ------------------------------------------------------

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        async () => {

            try {

                const registration =
                    await navigator
                        .serviceWorker
                        .register(
                            "./service-worker.js"
                        );


                console.log(
                    "Service Worker registrado correctamente."
                );


                console.log(
                    "Scope:",
                    registration.scope
                );


            } catch (error) {

                console.error(
                    "Error al registrar el Service Worker:",
                    error
                );

            }

        }
    );

}


// ------------------------------------------------------
// INICIAR APLICACIÓN
// ------------------------------------------------------

renderTasks();