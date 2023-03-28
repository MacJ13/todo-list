import TodoList from "./modules/todo";
import { Dom } from "./modules/domUI";

import { pubsub } from "./modules/pubsub";

////// TODO OBJECTS
const todoList = new TodoList("all");
const dom = Dom();

///////////////////////////////////////////
/////////////// SHOW FILTER TASKS
const showFilterTasks = function (category) {
  const tasks = todoList.getFilterTasks(category);
  todoList.setCategory(category);
  dom.renderFilterTasks(category, tasks);
};

pubsub.subscribe("filter-tasks", showFilterTasks);

//////////////////////////////////////////////////
//////// CREATE NEW PROJECT
const createNewProject = function ({ title }) {
  todoList.setCategory("");
  todoList.addProjectToList(title);
  const project = todoList.getCurrentProject();
  dom.renderTodoBoard(project);
  dom.renderProjectEl(project);
};

pubsub.subscribe("create-project", createNewProject);

/////////////////////////////////////////////////
///////// CREATE NEW TASK
const createNewTask = function (newTask) {
  todoList.getCurrentProject().addTask(newTask);
  const task = todoList.getCurrentProject().getCurrentTask();
  dom.addTaskElement(task);
  localStorage.setItem("create-task", JSON.stringify(task));
};

pubsub.subscribe("create-task", createNewTask);

///////////////////////////////////////////////
///////// OPEN MODAL TO CREATE TASK OR PROJECT
const openCreateModal = function (target) {
  dom.renderModal(target, "");
};

pubsub.subscribe("open-create-modal", openCreateModal);

////////////////////////////////////////////////////////
// OPEN MODAL FOR TASK WITH DELETE ELEMENTS
const openDeleteTaskModal = function ({ id, target }) {
  todoList.getCurrentProject().setCurrentTask(id);
  const currentTask = todoList.getCurrentProject().getCurrentTask();
  dom.renderModal(target, currentTask);
};

pubsub.subscribe("open-delete-task", openDeleteTaskModal);

/////////////////////////////////////////////////
//// DELETE TASK FROM PROJECT
const deleteTask = function () {
  const currentProject = todoList.getCurrentProject();
  const taskId = currentProject.getCurrentTask().getId();
  currentProject.removeTask(taskId);
  dom.removeTaskElement(taskId);
};

pubsub.subscribe("delete-task", deleteTask);

///////////////////////////////////////
////// OPEN DELETE MODAL FOR PROJECT
const openDeleteProjectModal = function ({ id, target }) {
  const currentProject = todoList.findProjectByID(id);
  todoList.setCurrentProject(currentProject);
  dom.renderModal(target, currentProject);
  dom.renderTodoBoard(todoList.getCurrentProject());
};

pubsub.subscribe("delete", openDeleteProjectModal);
