import { isFuture, isToday } from "date-fns";
import { pubsub } from "../pubsub";

export const todoBoardUI = (function () {
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

  // CLEAR LIST OF TASKS
  const clearTaskList = function () {
    listEl.innerHTML = "";
  };

  // RENDER PROJECT OR CATEGORY TITLE WITH ICON
  const renderMainHeading = function (str) {
    mainHeadingEl.innerHTML = "";

    const html = `<i class="fa-solid fa-${
      icons[str] ? icons[str] : "calendar"
    } icon-todo-main"></i>
    <h2 class="todo-heading">${str}</h2>`;

    mainHeadingEl.insertAdjacentHTML("beforeend", html);
  };

  // HIDE ADD NEW TASK BUTTON
  const hideAddTaskButton = function () {
    addTaskBtn.classList.add("hidden");
  };

  // SHOW ADD NEW TASK BUTTON
  const showAddTaskButton = function () {
    addTaskBtn.classList.remove("hidden");
  };

  // CREATE 'LI' ELEMENT WITH TASK DATA
  const generateTaskElement = function (task) {
    const li = document.createElement("li");
    li.className = "todo-task";
    li.id = task.getId();
    li.insertAdjacentHTML("beforeend", renderTaskDetail(task));

    return li;
  };

  // UPDATE 'ELEMENT' WITH NEW TASK DATA
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

  // ADD CREATED ELEMENT TASK TO LIST-TASK ELEMENT
  const addTaskToList = function (task) {
    const taskEl = generateTaskElement(task);
    listEl.appendChild(taskEl);
  };

  // REMOVE TASK ELEMENT FROM TASK-LIST
  const removeTaskEl = function (id) {
    const taskEl = listEl.querySelector(`li[id="${id}"]`);
    taskEl.remove();
  };

  // RENDER ALL ELEMENTS WITH PROJECT TASKS IN LIST-TASK ELEMENT
  const renderProjectTasks = function (tasks) {
    clearTaskList();
    tasks.forEach((task) => {
      addTaskToList(task);
    });
  };

  // RETURN HTML STRING TASK-ELEMENT WITH TASK DATA
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

  // TRANSFORM STYLE TEXT (LINE-THROUGH) OF TASK TITLE
  const styleTaskTitle = function (target) {
    target.querySelector(".todo-task-title").classList.toggle("score-through");
  };

  // SWITCH CHECKED ICONS
  const modifyCompletedIcon = function (target) {
    const icon = target.querySelector(`i[data-type="check"]`);
    icon.classList.toggle("fa-circle");
    icon.classList.toggle("fa-circle-check");
  };

  // EVENT WHEN CLICKING ON LIST ELEMENT
  const onClickTodoTask = function () {
    listEl.addEventListener("click", (e) => {
      const target = e.target;
      const { type, modal } = target.dataset;
      const taskEl = e.target.closest(".todo-task");
      pubsub.publish("set-current-project", +taskEl.id);
      if (target.dataset.type === "check") {
        styleTaskTitle(taskEl);
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

  // EVENT WHEN CLICKING ON ADD-TASK BUTTON ELEMENT
  const onClickCreateTask = function () {
    addTaskBtn.addEventListener("click", (e) => {
      pubsub.publish("open-create-modal", e.target.dataset);
    });
  };

  // CALL EVENTS
  onClickTodoTask();
  onClickCreateTask();

  return {
    hideAddTaskButton,
    showAddTaskButton,
    addTaskToList,
    renderProjectTasks,
    renderMainHeading,
    clearTaskList,
    updateTaskElement,
    removeTaskEl,
  };
})();
