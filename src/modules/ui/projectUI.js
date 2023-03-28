import { pubsub } from "../pubsub";

export const projectUI = (function () {
  const projectListEl = document.querySelector(".projects");
  const addProjectBtn = document.getElementById("create-project");
  const menuEl = document.querySelector(".nav-menu");

  const removeActiveItem = function () {
    const items = document.querySelectorAll(".nav-item");
    items.forEach((item) => item.classList.remove("nav-item-active"));
  };

  const addActiveItem = function (e) {
    removeActiveItem();
    const targetItem = e.target.closest(".nav-item");
    targetItem.classList.add("nav-item-active");
  };

  const render = function (project) {
    removeActiveItem();

    projectListEl.innerHTML += `<li data-id="${project.getId()}" class="project nav-item nav-item-active">
        <div class="project-title">
                    <i class="fa-solid fa-folder-open"></i>
                    <span class="title">${project.getTitle()}</span>
                  </div>
        <div class="project-controls">
                    <i
                      class="fa-solid fa-pen-to-square"
                      data-type="edit"
                      data-modal="edit-project"
                    ></i>
                    <i
                      class="fa-solid fa-trash"
                      data-type="delete"
                      data-modal="delete-project"
                    ></i>
                  </div>
        </li>`;
  };

  const removeProjectEl = function (id) {
    const targetEl = projectListEl.querySelector(`li[data-id="${id}"]`);
    targetEl.remove();

    menuEl
      .querySelector(`[data-category="all"]`)
      .classList.add("nav-item-active");
  };

  const modifyProjectEl = function ({ getId, getTitle }) {
    const targetEl = projectListEl.querySelector(`li[data-id="${getId()}"]`);
    targetEl.querySelector(".title").textContent = getTitle();
  };

  const onClickProjectList = function () {
    projectListEl.addEventListener("click", (e) => {
      const target = e.target;
      if (target.nodeName === "UL") return;
      const { id } = target.closest(".project").dataset;
      console.log({ id });
      switch (true) {
        case e.target.dataset.type === "edit":
          pubsub.publish("edit", { id, target: target.dataset });
          break;
        case target.dataset.type === "delete":
          pubsub.publish("delete", { id, target: target.dataset });
          break;
        default:
          pubsub.publish("open-project", id);
      }
      addActiveItem(e);
    });
  };

  const onClickCreateProject = function () {
    addProjectBtn.addEventListener("click", (e) => {
      pubsub.publish("open-create-modal", e.target.dataset);
    });
  };

  const onClickCategoryMenu = function () {
    menuEl.addEventListener("click", (e) => {
      console.log("log");
      const { category } = e.target.dataset;
      if (!category) return;
      pubsub.publish("filter-tasks", category);
      addActiveItem(e);
    });
  };

  onClickProjectList();
  onClickCreateProject();
  onClickCategoryMenu();

  return {
    render,
    removeProjectEl,
    modifyProjectEl,
  };
})();
