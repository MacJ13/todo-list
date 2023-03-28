import { isFuture, isToday } from "date-fns";
import { pubsub } from "../pubsub";

export const todoBoardUI = (function () {
  const headingEl = document.querySelector(".todo-heading");
  const listEl = document.querySelector(".todo-tasks");
  const mainHeadingEl = document.querySelector(".todo-main");
  const addTaskBtn = document.getElementById("create-task");

  const icons = {
    all: "calendar",
    today: "calendar-day",
    week: "calendar-week",
    important: "calendar-plus",
    completed: "calendar-check",
  };

  const clearTaskList = function () {
    listEl.innerHTML = "";
  };

  const renderMainHeading = function (str) {
    mainHeadingEl.innerHTML = "";

    const html = `<i class="fa-solid fa-${
      icons[str] ? icons[str] : "calendar"
    } icon-todo-main"></i>
    <h2 class="todo-heading">${str}</h2>`;

    mainHeadingEl.insertAdjacentHTML("beforeend", html);

    // if (!addTaskBtn.classList.contains("hidden")) {
    //   toggleAddTaskButton();
    // }
  };

  const hideAddTaskButton = function () {
    addTaskBtn.classList.add("hidden");
  };

  const showAddTaskButton = function () {
    addTaskBtn.classList.remove("hidden");
  };

  const setTodoHeading = function (str) {
    headingEl.textContent = str;
  };

  const generateTaskElement = function (task) {
    const li = document.createElement("li");
    li.className = "todo-task";
    li.id = task.getId();
    li.insertAdjacentHTML("beforeend", renderTaskDetail(task));

    return li;
  };

  const updateTaskElement = function (currentTask) {
    const currentTaskEl = listEl.querySelector(
      `li[id="${currentTask.getId()}"]`
    );
    currentTaskEl.innerHTML = "";
    currentTaskEl.insertAdjacentHTML(
      "beforeend",
      renderTaskDetail(currentTask)
    );
  };

  const modifyTaskTitle = function (target) {
    console.log(target);
    const titleEl = target.querySelector(".todo-task-title");
    console.log(titleEl);

    titleEl.classList.toggle("score-through");
  };

  const addTaskToList = function (task) {
    const taskEl = generateTaskElement(task);
    listEl.appendChild(taskEl);
  };

  const renderProjectTasks = function (tasks) {
    clearTaskList();
    tasks.forEach((task) => {
      addTaskToList(task);
    });
  };

  const renderTaskDetail = function (task) {
    return `
    <div class="todo-task-col">
    <div class="todo-task-checked">
    
      <!-- <i class="fa-solid fa-circle-check"></i> -->
      <i data-type="check" class="fa-solid fa-circle${
        task.getCompleted() ? "-check" : ""
      } color-${task.getPriority()}"></i>
    </div>
    <div data-type="check" class="todo-task-title ${
      task.getCompleted() ? "score-through" : ""
    }">
      ${task.getTitle()}
    </div>
  </div>
  <div class="todo-task-col">
    <div class="todo-task-duedate ${
      isFuture(task.getdueDate()) || isToday(task.getdueDate())
        ? ""
        : "duedate-color"
    }">${task.formatDate()}</div>

    <div class="todo-task-control">
      <div class="todo-task-info" data-modal="info-task">
        <i class="fa-solid fa-circle-info" data-type="info" data-modal="task-info"> </i>
      </div>
      <div class="todo-task-update" data-modal="edit-task">
        <i class="fa-solid fa-pen-to-square" data-type="edit" data-modal="edit-task"></i>
      </div>
      <div class="todo-task-del" data-modal="delete-task">
        <i class="fa-solid fa-trash" data-type="delete" data-modal="delete-task"></i>
      </div>
    </div>
  </div>
    `;
  };

  const modifyCompletedIcon = function (target) {
    const icon = target.querySelector(`i[data-type="check"]`);
    icon.classList.toggle("fa-circle");
    icon.classList.toggle("fa-circle-check");
  };

  const removeTaskEl = function (id) {
    const taskEl = listEl.querySelector(`li[id="${id}"]`);
    taskEl.remove();
  };

  const onClickTodoTask = function () {
    listEl.addEventListener("click", (e) => {
      const target = e.target;
      const { type, modal } = target.dataset;
      const taskEl = e.target.closest(".todo-task");
      pubsub.publish("set-current-project", +taskEl.id);
      if (target.dataset.type === "check") {
        modifyTaskTitle(taskEl);
        modifyCompletedIcon(taskEl);
        pubsub.publish("complete-task", +taskEl.id);
      } else if (target.dataset.type === "info") {
        pubsub.publish("info", { id: +taskEl.id, target: { type, modal } });
      } else if (target.dataset.type === "edit") {
        pubsub.publish("open-edit-task", {
          id: +taskEl.id,
          target: { type, modal },
        });
      } else if (target.dataset.type === "delete") {
        pubsub.publish("open-delete-task", {
          id: +taskEl.id,
          target: { type, modal },
        });
      }
    });
  };

  const onClickCreateTask = function () {
    addTaskBtn.addEventListener("click", (e) => {
      pubsub.publish("open-create-modal", e.target.dataset);
    });
  };

  onClickTodoTask();
  onClickCreateTask();

  return {
    setTodoHeading,
    addTaskToList,
    renderProjectTasks,
    clearTaskList,
    updateTaskElement,
    removeTaskEl,
    renderMainHeading,
    hideAddTaskButton,
    showAddTaskButton,
  };
})();
