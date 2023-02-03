//Define UI vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
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
  //Clear All Tasks
  clearBtn.addEventListener('click', clearTasks);
  //DOM Content Loader 
  document.addEventListener('DOMContentLoaded', loadAllTasks);
  //Filter tasks 
  filter.addEventListener('keyup', filterTasks);
};

//Add task
function addTask(e) {
  if(taskInput.value === '') {
    alert('Please, enter a new task!');
  } else {
    //save to local storage
    const storedTasksStr = localStorage.getItem('tasks');
    const storedTasks = storedTasksStr ? JSON.parse(storedTasksStr) : [];
    storedTasks.push(taskInput.value);
    localStorage.setItem('tasks',JSON.stringify(storedTasks));

    loadAllTasks();

    taskInput.value = '';
    e.preventDefault();
  };
};

//Load all tasks from Local Storage
function loadAllTasks () {
  const storedTasksStr = localStorage.getItem('tasks');
  const storedTasks = storedTasksStr ? JSON.parse(storedTasksStr) : [];
  //Remove all li elements
  while(taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  };

  //Create li elements
  storedTasks.forEach(function(task, index) {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.appendChild(document.createTextNode(task));
    const link = document.createElement('a');
    link.className = 'delete-item secondary-content';
    link.innerHTML = '<i class=" fa fa-trash"></i>';
    li.dataset.index = index;
    li.appendChild(link);
    taskList.appendChild(li);
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

//Clear all tasks
function clearTasks() {
  while(taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
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