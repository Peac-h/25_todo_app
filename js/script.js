"use strict";

// Selectors
const noTask = document.getElementById("noTask");
const btnAddTask = document.getElementById("btnAddTask");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskContainer = document.getElementById("taskContainer");
const currTime = document.getElementById("currTime");

// Data Classes
class Task {
  timeCreate = new Date().getTime();
  checked = false;

  constructor(content) {
    this.content = content;
  }
}

// Architecture
class App {
  tasks = [];

  constructor() {
    this._getLocalStorage();

    this._renderTime();
    setInterval(this._renderTime, 1000);

    btnAddTask.addEventListener("click", this._newTask.bind(this));
  }

  _newTask(e) {
    e.preventDefault();

    if (!taskInput.value) return;

    const newTask = new Task(taskInput.value);
    taskInput.value = "";

    this.tasks.push(newTask);
    this._renderTask(newTask);
    this._setLocalStorage();
  }

  _renderTask(newTask) {
    const task = `
    <div class="task" data-id="${newTask.timeCreate}">
    <div class="task-inputs">
        <label class="checkbox-wrapper">
          <input class="checkbox" type="checkbox" />
          <div class="checkmark"></div>
        </label>
        <input class="task-value" type="text" value="${newTask.content}" readonly />
    </div>
    <div class="task-buttons">
        <button class="edit">edit</button>
        <button class="delete">delete</button>
    </div>
    </div>
`;

    taskList.insertAdjacentHTML("beforeend", task);
    noTask.remove();

    this._styleTask(newTask);
    this._addTaskListeners();
  }

  _styleTask(newTask) {
    const input = document
      .querySelector(`[data-id="${newTask.timeCreate}"]`)
      .querySelector(".task-value");

    const checkbox = document
      .querySelector(`[data-id="${newTask.timeCreate}"]`)
      .querySelector(".checkbox");

    if (newTask.checked === true) {
      input.style.textDecoration = "line-through";
      checkbox.checked = true;
    } else {
      input.style.textDecoration = "none";
      checkbox.checked = false;
    }
  }

  _addTaskListeners() {
    taskList.addEventListener("click", this._taskClickHandler);
  }

  _taskClickHandler = (e) => {
    // find elements
    const button = e.target;
    const task = button.closest(".task");
    const id = +task.dataset.id;
    const index = this.tasks.findIndex((item) => item.timeCreate === id);
    const item = this.tasks.find((item) => item.timeCreate === id);
    const input = document
      .querySelector(`[data-id="${id}"]`)
      .querySelector(".task-value");

    // delete button
    if (button.classList.contains("delete")) {
      task.remove();
      this.tasks.splice(index, 1);

      this._setLocalStorage();

      if (!taskList.childElementCount) taskContainer.append(noTask);
    }

    // edit button
    if (button.classList.contains("edit")) {
      if (button.innerText === "edit") {
        button.innerText = "save";
        input.removeAttribute("readonly");
        input.focus();
      } else {
        button.innerText = "edit";
        input.setAttribute("readonly", "readonly");
      }

      item.content = input.value;

      this._setLocalStorage();
    }

    // check input
    if (button.classList.contains("checkbox")) {
      if (button.checked == 1) {
        item.checked = true;

        input.style.textDecoration = "line-through";

        this._setLocalStorage();
      } else {
        item.checked = false;

        input.style.textDecoration = "none";

        this._setLocalStorage();
      }
    }
  };

  _setLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("tasks"));
    if (!data) return;
    this.tasks = data;

    this.tasks.forEach((task) => {
      this._renderTask(task);
    });
  }

  _resetLocalStorage() {
    localStorage.removeItem("tasks");
  }

  _renderTime() {
    const time = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(new Date());
    currTime.innerHTML = `${time.padStart(8, "0")}, <span>local time</span>.`;
  }
}

const app = new App();
