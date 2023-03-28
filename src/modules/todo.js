import Project from "./project";

export default class TodoList {
  projects;
  currentProject;

  constructor(category) {
    this.category = category;
    this.projects = [];
    this.currentProject = null;
  }

  getCategory() {
    return this.category;
  }

  setCategory(category) {
    this.category = category;
  }

  getProjects() {
    return this.projects;
  }

  getCurrentProject() {
    return this.currentProject;
  }

  findCurrentTaskProject(id) {
    const project = this.projects.find((project) => project.findTask(id));
    this.setCurrentProject(project);
  }

  findProjectByID(id) {
    return this.projects.find((project) => id === project.getId());
  }

  setCurrentProject(project) {
    this.currentProject = project;
  }

  removeProject(id) {
    this.projects = this.projects.filter((task) => task.getId() !== id);
  }

  createProject(title) {
    const project = Project(title);

    return project;
  }

  addProjectToList(title) {
    const project = Project(title);
    this.projects.push(project);
    this.setCurrentProject(project);
  }

  getAllTasks() {
    return this.projects.flatMap((project) => project.getTasks());
  }

  getCurrentTask(id) {
    return this.getAllTasks().find((task) => id === task.getId());
  }

  filterTasks(fn) {
    return this.getAllTasks().filter(fn);
  }

  filterTodayTasks() {
    return this.filterTasks((task) => task.isTodayTask());
  }

  filterWeekTasks() {
    return this.filterTasks((task) => task.isWeekTask());
  }

  filterImportantTasks() {
    return this.filterTasks((task) => task.isImportantTask());
  }

  filterCompletedTasks() {
    return this.filterTasks((task) => task.getCompleted());
  }

  getFilterTasks(category) {
    if (category === "all") {
      return this.getAllTasks();
    } else if (category === "today") {
      return this.filterTodayTasks();
    } else if (category === "week") {
      return this.filterWeekTasks();
    } else if (category === "important") {
      return this.filterImportantTasks();
    } else if (category === "completed") {
      return this.filterCompletedTasks();
    }
  }
}
