const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('input');
const todoCollection = document.querySelector('.todo-collection');
let token = '';

todoForm.addEventListener('submit', addTodo);

// map data

function listTodo(data, id) {
  // create elements
  const li = document.createElement('li');
  const todoTitle = document.createElement('span');
  const editableInput = document.createElement('input');
  const editButton = document.createElement('button');
  const saveButton = document.createElement('button');
  const deleteButton = document.createElement('button');
  const editIcon = document.createElement('i');

  const saveIcon = document.createElement('i');

  const deleteIcon = document.createElement('i');

  li.classList.add('todo-collection__item');

  todoTitle.classList.add('todo-collection__item__title');
  todoTitle.innerText = data;
  todoTitle.id = id;

  editableInput.classList.add('input');
  editableInput.classList.add('input--todo');
  editableInput.classList.add('hidden');
  editableInput.type = 'text';
  editableInput.value = data;

  editButton.classList.add('button');
  editButton.classList.add('button--todo');
  editButton.classList.add('button--edit');
  // editButton.innerText = 'Edit';
  editIcon.classList.add('fas');
  editIcon.classList.add('fa-edit');
  editButton.appendChild(editIcon);

  saveButton.classList.add('button');
  saveButton.classList.add('button--todo');
  saveButton.classList.add('button--save');
  saveButton.classList.add('hidden');
  // saveButton.innerText = 'Save';
  saveIcon.classList.add('fas');
  saveIcon.classList.add('fa-save');
  saveButton.appendChild(saveIcon);

  deleteButton.classList.add('button');
  deleteButton.classList.add('button--todo');
  deleteButton.classList.add('button--delete');
  // deleteButton.innerText = 'Delete';
  deleteIcon.classList.add('fas');
  deleteIcon.classList.add('fa-trash-alt');
  deleteButton.appendChild(deleteIcon);

  // add elements to todo list
  li.appendChild(todoTitle);
  li.appendChild(editableInput);
  li.appendChild(editButton);
  li.appendChild(saveButton);
  li.appendChild(deleteButton);
  todoCollection.appendChild(li);

  function toggleTodoEditForm() {
    todoTitle.classList.toggle('hidden');
    editableInput.classList.toggle('hidden');
    editButton.classList.toggle('hidden');
    saveButton.classList.toggle('hidden');
  }

  // button event listeners
  editButton.addEventListener('click', () => {
    toggleTodoEditForm();
    editableInput.focus();
  });

  saveButton.addEventListener('click', () => {
    todoTitle.innerText = editableInput.value;
    todoTitle.id = todoTitle.id;
    toggleTodoEditForm();
    saveTodoToLS(editableInput.value, todoTitle.id);
  });

  deleteButton.addEventListener('click', () => {
    setTimeout(() => {
      deleteTodoFromLS(todoTitle.id);
      todoCollection.removeChild(li);
    }, 100);
  });
}

function login() {
  data = {
    email: 'ccntsll123@gmail.com',
    password: '123456789',
  };
  fetch('https://api-nodejs-todolist.herokuapp.com/user/login', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      console.log('data', res);
      token = res.token;
      geToDoList();
    });
}
login(); // to called the function

function geToDoList() {
  console.log(token);

  fetch('https://api-nodejs-todolist.herokuapp.com/task', {
    headers: { Authorization: 'Bearer ' + token },
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      console.log('data', res.data);
      res.data.map((item) => {
        listTodo(item.description, item._id);
      });
    });
}

function addTodo(e) {
  e.preventDefault();
  data = {
    description: todoInput.value,
  };
  fetch('https://api-nodejs-todolist.herokuapp.com/task', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      console.log('Added data', res);
      todoInput.value = '';
      //   geToDoList();
      listTodo(res.data.description, res.data._id);
    });
}

function saveTodoToLS(data, id) {
  console.log('data event', data);
  console.log('id event', id);
  let updatdata = {
    description: data,
  };
  fetch(`https://api-nodejs-todolist.herokuapp.com/task/${id}`, {
    method: 'put',
    body: JSON.stringify(updatdata),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      console.log('Update data', res);
    });
}

function deleteTodoFromLS(id) {
  console.log('id event', id);

  fetch(`https://api-nodejs-todolist.herokuapp.com/task/${id}`, {
    method: 'delete',
    body: null,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      console.log('delete data', res);
    });
}
