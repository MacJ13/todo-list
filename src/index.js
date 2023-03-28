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

///////////////////////////////////////
///////// DELETE TARGET PROJECT FROM TODOLIST
const deleteProject = function () {
  const id = todoList.getCurrentProject().getId();
  todoList.removeProject(id);
  dom.removeProjectElement(id);
  const tasks = todoList.getFilterTasks("all");
  dom.renderFilterTasks("all", tasks);
};

pubsub.subscribe("delete-project", deleteProject);

////////////////////////////////////////////////
/////////////// OPEN MODAL FOR PROJECT WITH EDIT FEATURES
const openEditProjectModal = function ({ id, target }) {
  const currentProject = todoList.findProjectByID(id);
  todoList.setCurrentProject(currentProject);
  dom.renderTodoBoard(currentProject);
  dom.renderModal(target, currentProject);
};

pubsub.subscribe("edit", openEditProjectModal);

//////////////////////////////////////////////////////
////// UPDATE PROJECT VALUES
const updateProjectTitle = function ({ title }) {
  todoList.getCurrentProject().setTitle(title);
  dom.updateProjectElement(todoList.getCurrentProject());
};

pubsub.subscribe("edit-project", updateProjectTitle);

/////////////////////////////////////////////////////
/// OPEN EDIT MODAL FOR TARGET TASK
const openEditTaskModal = function ({ id, target }) {
  todoList.getCurrentProject().setCurrentTask(id);
  const currentTask = todoList.getCurrentProject().getCurrentTask();
  dom.renderModal(target, currentTask);
};

pubsub.subscribe("open-edit-task", openEditTaskModal);

///////////////////////////////////////////////////
///////// EDIT VALUES IN TARGET TASK
const editTaskValues = function (obj) {
  const currentTask = todoList.getCurrentProject().getCurrentTask();
  currentTask.updateValues(obj);

  if (!todoList.getCategory() || todoList.getCategory() === "all") {
    dom.updateTaskElement(currentTask);
  } else {
    const category = todoList.getCategory();
    const tasks = todoList.getFilterTasks(category);
    dom.renderFilterTasks(category, tasks);
  }
};

pubsub.subscribe("edit-task", editTaskValues);

//////////////////////////////
// OPEN TASKS PROJECT ON TODO-BOARD WHEN WE CLICK ON PROJECT ELEMENT
const openTargetProject = function (id) {
  if (todoList.getCategory()) todoList.setCategory("");

  const currentProject = todoList.findProjectByID(id);
  todoList.setCurrentProject(currentProject);
  dom.renderTodoBoard(currentProject);
};

pubsub.subscribe("open-project", openTargetProject);

///////////////// ////////
// OPEN INFO MODEL FOR TASK
const openInfoModal = function ({ id, target }) {
  dom.renderModal(target, todoList.getCurrentTask(id));
  console.log(localStorage.getItem("current-project"));
};

pubsub.subscribe("info", openInfoModal);

/////////////////////////
// CHANGE COMPLETE VALUE IN CURRENT TASK
const completeTask = function (id) {
  todoList.getCurrentTask(id).changeCompleted();
};
pubsub.subscribe("complete-task", completeTask);

// SET TARGET PROJECT TO FIND CURRENT TASK
const setTargetProject = function (id) {
  todoList.findCurrentTaskProject(id);
};
pubsub.subscribe("set-current-project", setTargetProject);

// RE-RENDER CATEGORY TASK WHEN WE CHANGE IT VALUE;
const updateCompleteCategory = function () {
  if (!todoList.getCategory()) return;
  const category = todoList.getCategory();
  const tasks = todoList.getFilterTasks(category);
  dom.renderFilterTasks(category, tasks);
};

pubsub.subscribe("complete-task", updateCompleteCategory);

pubsub.publish("filter-tasks", todoList.getCategory());
