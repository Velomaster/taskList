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
  //Click favorite task
  taskList.addEventListener('click', favoriteTask);
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
      isFavorite: false
    };
    storedTasks.push(task);
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
    li.appendChild(document.createTextNode(task.taskName));
    const deleteLink = document.createElement('a');
    deleteLink.className = 'delete-item secondary-content';
    deleteLink.innerHTML = '<i class=" fa fa-trash"></i>';
    const favoriteLink = document.createElement('a');
    favoriteLink.className = 'star-item secondary-content';
    if (task.isFavorite === false) {
      favoriteLink.innerHTML = '<i class="far fa-star"></i>';
    } else {
      favoriteLink.innerHTML = '<i class="fa fa-star"></i>';
    };

    li.dataset.index = index;
    li.appendChild(deleteLink);
    li.appendChild(favoriteLink);
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

//Toggle favorite tasks
function favoriteTask (e) {
  if(e.target.parentElement.classList.contains('star-item')) {
    if(e.target.className === 'fa fa-star') {
      e.target.className = 'far fa-star'
    } else {
      e.target.className = 'fa fa-star'
    };
  };
  moveFavorites(e);
};

//Move favorite tasks
function moveFavorites (e) {
  if(e.target.parentElement.classList.contains('star-item')) {
    const allTasks = e.target.parentElement.parentElement.parentElement;
    const clickedTask = e.target.parentElement.parentElement;
    
    if(clickedTask.children[1].firstChild.classList.contains('fa')) {
      allTasks.insertBefore(clickedTask, allTasks.children[0]);

    } else {
      allTasks.insertBefore(clickedTask, allTasks.children[allTasks.children.length]);
    };

    //Save updated tasks to local storage
    const tasksToStore = Array.from(allTasks.children);
    const updatedTasks = [];

    tasksToStore.forEach(function(task) {
      const storedName = task.textContent;
      let storedStatus;

      if (task.children[1].firstChild.className === 'fa fa-star') {
        storedStatus = true;
      } else {
        storedStatus = false;
      };
      const tasks = {
        taskName: storedName,
        isFavorite: storedStatus
      };
      updatedTasks.push(tasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    });
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