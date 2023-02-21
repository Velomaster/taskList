//Define UI vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection-tasks');
const completedList = document.querySelector('.collection-completed');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

//Load all event listeners
loadEventListeners();

function loadEventListeners() {
  //Add New Task
  form.addEventListener('submit', addTask);
  //Remove Task
  taskList.addEventListener('click', removeTask);
  completedList.addEventListener('click', removeTask);
  //Clear All Tasks
  clearBtn.addEventListener('click', clearTasks);
  //DOM Content Loader 
  document.addEventListener('DOMContentLoaded', loadAllTasks);
  //Filter tasks 
  filter.addEventListener('keyup', filterTasks);
  //Click favorite task
  taskList.addEventListener('click', favoriteTask);
  //Click Complete/Incomplete task
  taskList.addEventListener('click', completeTask);
  completedList.addEventListener('click', completeTask);
};

//Add task
function addTask(e) {
  if(taskInput.value === '') {
    alert('Please, enter a new task!');
  } else {
    //save to local storage
    const storedTasksStr = localStorage.getItem('tasks');
    const storedTasks = storedTasksStr ? JSON.parse(storedTasksStr) : [];
    const task = {
      taskName: taskInput.value,
      isFavorite: false,
      isComplete: false
    };
    storedTasks.push(task);
    localStorage.setItem('tasks',JSON.stringify(storedTasks));

    loadAllTasks();

    taskInput.value = '';
    e.preventDefault();
  };
};

//Load all tasks from Local Storage
function loadAllTasks() {
  const storedTasksStr = localStorage.getItem('tasks');
  const storedTasks = storedTasksStr ? JSON.parse(storedTasksStr) : [];

  //Remove all li elements
  while(taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  };
  while(completedList.firstChild) {
    completedList.removeChild(completedList.firstChild);
  };
  //Create li elements
  storedTasks.forEach(function(task, index) {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.appendChild(document.createTextNode(task.taskName));
    const deleteLink = document.createElement('a');
    deleteLink.className = 'delete-item secondary-content';
    deleteLink.innerHTML = '<i class=" fa fa-trash"></i>';
    const checkLink = document.createElement('a');
    checkLink.className = 'check-item secondary-content'
    if (task.isComplete === false) {
      checkLink.innerHTML = '<i class=" far fa-square"></i>';
    } else {
      checkLink.innerHTML = '<i class=" fas fa-check-square"></i>';
      };
    const favoriteLink = document.createElement('a');
    favoriteLink.className = 'star-item secondary-content';
    if (task.isFavorite === false) {
      favoriteLink.innerHTML = '<i class="far fa-star"></i>';
    } else {
      favoriteLink.innerHTML = '<i class="fa fa-star"></i>';
    }
    li.dataset.index = index;
    li.appendChild(deleteLink);
    li.appendChild(checkLink);
    li.appendChild(favoriteLink);

    if (task.isComplete) {
      li.classList.add('completedTask');
      completedList.appendChild(li);
    } else {
      taskList.appendChild(li);
    }
  });
};

//Remove Task
function removeTask(e) {
  if(e.target.parentElement.classList.contains('delete-item')) {
    //Remove from Local Storage
    const taskIndex = e.target.parentElement.parentElement.dataset.index;
    const storedTasks = localStorage.getItem('tasks');
    const updatedTasks = JSON.parse(storedTasks);
    updatedTasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    loadAllTasks();
  };
};

//Toggle favorite tasks
function favoriteTask (e) {
  toggleFavorite(e)
};

function toggleFavorite(e) {
  if(!e.target.parentElement.classList.contains('star-item')) {
    return
  }
    // Get tasks
    const tasks = getTasksFromStorage();
    // Get clicked taks id
    const taskIndex = e.target.parentElement.parentElement.dataset.index;
    // Update
    const newTask = {...tasks[taskIndex], isFavorite: !tasks[taskIndex].isFavorite};
    tasks.splice(taskIndex, 1)
    // Filter tasks
    if (newTask.isFavorite) {
      tasks.unshift(newTask);
    } else {
      tasks.push(newTask);
    }
    // Save to local storage
    saveTasksToStorage(tasks)
    // Load tasks
    loadAllTasks();
}

function getTasksFromStorage() {
  const storedTasksStr = localStorage.getItem('tasks');
  const storedTasks = storedTasksStr ? JSON.parse(storedTasksStr) : [];
  return storedTasks;
}

function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Complete tasks
function completeTask (e) {
  if(!e.target.parentElement.classList.contains('check-item')) {
    return;
  }
    // Get tasks
    const tasks = getTasksFromStorage();
    // Get clicked taks id
    const taskIndex = e.target.parentElement.parentElement.dataset.index;
    
    // Update
    const newTask = {...tasks[taskIndex], isComplete: !tasks[taskIndex].isComplete};
    tasks.splice(taskIndex, 1, newTask);
    
    // Save to local storage
    saveTasksToStorage(tasks);
    // Load tasks
    loadAllTasks();
};

//Clear all tasks
function clearTasks() {
  while(taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  };
  while(completedList.firstChild) {
    completedList.removeChild(completedList.firstChild);
  };
  //Clear local storage
  localStorage.removeItem('tasks');
};

//Filter Tasks
function filterTasks (e) {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll('.collection-item').forEach(function (task) {
    const item = task.firstChild.textContent;
    if(item.toLowerCase().indexOf(text) !== -1) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    };
  });
};