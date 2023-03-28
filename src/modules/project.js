import Task from "./task";

export default function Project(projectTitle, projectId) {
  let id = projectId || Date.now() + "proj";
  let title = projectTitle;
  let tasks = [];
  let currentTask;

  function getTasks() {
    return tasks;
  }

  function findTask(id) {
    return tasks.find((task) => task.getId() === id);
  }

  function getCurrentTask() {
    return currentTask;
  }

  function setCurrentTask(id) {
    currentTask = tasks.find((task) => id === task.getId());
  }

  function getId() {
    return id;
  }

  function getTitle() {
    return title;
  }

  function setTitle(newTitle) {
    title = newTitle;
  }

  function addTask({ title, description, priority, duedate }) {
    const task = new Task(title, description, duedate, priority);
    tasks.push(task);
    currentTask = task;
  }

  function removeTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
  }

  return {
    getTasks,
    getId,
    getTitle,
    setTitle,
    addTask,
    removeTask,
    getCurrentTask,
    setCurrentTask,
    findTask,
  };
}
