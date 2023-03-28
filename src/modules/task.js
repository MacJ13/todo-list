import { isSameDay, format, differenceInCalendarDays } from "date-fns";

export default class Task {
  constructor(title, description, dueDate, priority, id) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.completed = false;
    this.id = id || Date.now();
  }

  changeCompleted() {
    this.completed = !this.completed;
  }

  formatDate() {
    return format(this.dueDate, "yyyy-MM-dd");
  }

  updateValues({ title, description, priority, duedate }) {
    this.setTitle(title);
    this.setDescription(description);
    this.setPriority(priority);
    this.setDueDate(duedate);
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  setTitle(title) {
    this.title = title;
  }

  getDescription() {
    return this.description;
  }

  setDescription(description) {
    this.description = description;
  }

  getdueDate() {
    return this.dueDate;
  }

  setDueDate(dueDate) {
    this.dueDate = dueDate;
  }

  getPriority() {
    return this.priority;
  }

  setPriority(priority) {
    this.priority = priority;
  }

  getCompleted() {
    return this.completed;
  }

  isTodayTask() {
    return isSameDay(new Date(), this.dueDate);
  }

  isWeekTask() {
    return (
      differenceInCalendarDays(this.dueDate, new Date()) >= 0 &&
      differenceInCalendarDays(this.dueDate, new Date()) <= 7
    );
  }

  isImportantTask() {
    return this.getPriority() === "high";
  }
}
