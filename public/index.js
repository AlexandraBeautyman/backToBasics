const getTasks = () => {
    try {
        return fetch('/tasks')
    }
    catch (err) {
        console.log(err)
        return err
    }
}

let numberOfTasks = 0
let todos = document.getElementById('to-dos')

const updateTaskCompletion = (task) => {
    let taskId = task.id
    let taskToUpdate = {
        taskName: task.taskName,
        assignee: task.assignee,
        completed: !task.completed
    }
    try {
        return fetch('/tasks/' + taskId, {
            method: 'PUT',
            body: JSON.stringify(taskToUpdate),
            headers: {
                'Content-type': 'application/json'
            }
        })
    }
    catch (err) {
        console.log(err)
        return err
    }
}

const hookUpButton = (button, taskDiv, task) => {
    button.innerText = 'Mark this task as complete.'
    button.addEventListener('click', () => {
        updateTaskCompletion(task)
            .then(response => response.json())
            .then(json => JSON.parse(JSON.stringify(json)))
            .then(task => {
                taskDiv.classList.toggle('completed')
                if (button.innerText === 'Mark this task as complete.') {
                    button.innerText = 'Mark this task as incomplete.'
                }
                else {
                    button.innerText = 'Mark this task as complete.'
                }
            })
    })
}

const addTask = (taskObject, taskNumber) => {
    let taskDiv = document.createElement('div')
    let taskNameDiv = document.createElement('div')
    taskNameDiv.innerText = 'Task ' + taskNumber + ': ' + taskObject.taskName
    let assigneeDiv = document.createElement('div')
    assigneeDiv.innerText = 'Assignee ' + taskNumber + ': ' + taskObject.assignee
    if (taskObject.completed === true) {
        taskDiv.classList.add('completed')
    }
    let completeTaskButton = document.createElement('button')
    hookUpButton(completeTaskButton, taskDiv, taskObject)
    taskDiv.appendChild(taskNameDiv)
    taskDiv.appendChild(assigneeDiv)
    taskDiv.appendChild(completeTaskButton)
    todos.appendChild(taskDiv)
    numberOfTasks = taskNumber + 1
}

function populateTodos () {
    getTasks()
        .then(response => response.json())
        .then(json => JSON.parse(JSON.stringify(json)))
        .then(taskArray => {
            taskArray.forEach((task, index) => {
                addTask(task, index)
            })
        })
}

populateTodos()

const postTask = (taskToBeAdded) => {
    try {
        return fetch('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskToBeAdded),
            headers: {
                'Content-type': 'application/json'
            }
        })
    }
    catch (err) {
        console.log(err)
        return err
    }
}

let form = document.getElementById('form')
form.addEventListener('submit', (event) => {
    event.preventDefault()
    let taskToBeAdded = {
        taskName: event.target.taskName.value,
        assignee: event.target.assignee.value,
        completed: false
    }
    form.reset()
    postTask(taskToBeAdded)
        .then(response => response.json())
        .then(json => JSON.parse(JSON.stringify(json)))
        .then(newTask => {
            addTask(newTask, numberOfTasks)
        })
})
