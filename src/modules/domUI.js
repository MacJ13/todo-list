import { todoBoardUI } from "./ui/todoBoardUI";
import { projectUI } from "./ui/projectUI";
import { modalUI } from "./ui/modalUI";

export function Dom() {
  // UPDATE PROJECT ELEMENT
  function updateProjectElement(currentProj) {
    todoBoardUI.renderMainHeading(currentProj.getTitle());
    projectUI.modifyProjectEl(currentProj);
  }

  // REMOVE PROJECT ELEMENT FROM DOM
  function removeProjectElement(id) {
    projectUI.removeProjectEl(id);
  }

  // UPDATE TASK ELEMENT
  function updateTaskElement(id) {
    todoBoardUI.updateTaskElement(id);
  }

  // ADD TASK ELEMENT TO TASK-LIST ELENENT
  function addTaskElement(task) {
    todoBoardUI.addTaskToList(task);
  }

  // REMOVE TASK ELEMENT FROM DOM
  function removeTaskElement(id) {
    todoBoardUI.removeTaskEl(id);
  }

  // OPEN AND RENDER  MODAL ELEMENT
  function renderModal(target, current) {
    modalUI.openModalElement();
    modalUI.setHeadingTitle(target.modal);
    modalUI.renderContentWrapperEl(current, target);
  }

  // RENDER FILTERED TASKS ELEMENT BY CHOOSEN CATEGORY
  function renderFilterTasks(category, tasks) {
    todoBoardUI.renderMainHeading(category);
    todoBoardUI.renderProjectTasks(tasks);
    todoBoardUI.hideAddTaskButton();
  }

  // RENDER INFO TASK ELEMENT
  function renderTodoBoard(project) {
    todoBoardUI.renderMainHeading(project.getTitle());
    todoBoardUI.renderProjectTasks(project.getTasks());
    todoBoardUI.showAddTaskButton();
  }

  // RENDER PROJECT ELEMENT TO DOM
  function renderProjectEl(project) {
    projectUI.render(project);
  }

  return {
    renderModal,
    renderProjectEl,
    renderTodoBoard,
    renderFilterTasks,
    addTaskElement,
    updateTaskElement,
    updateProjectElement,
    removeProjectElement,
    removeTaskElement,
  };
}
