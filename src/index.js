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
