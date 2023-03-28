export const infoModal = (() => {
  const render = function (task) {
    return `<div class="modal-task-detail">
                  <div class="modal-task-item">
                    <span class="item-title">title:</span>
                    <span class="item-feature">${task.getTitle()}</span>
                  </div>
                  <div class="modal-task-item">
                    <span class="item-title">description:</span>
                    <span class="item-feature">
                      ${task.getDescription()}
                    </span>
                  </div>
                  <div class="modal-task-item">
                    <span class="item-title">duedate:</span>
                    <span class="item-feature">${task.formatDate()}</span>
                  </div>
                  <div class="modal-task-item">
                    <span class="item-title">priority:</span>
                    <span class="item-feature">${task.getPriority()}</span>
                  </div>
                  <div class="modal-task-item">
                    <span class="item-title">completed:</span>
                    <span class="item-feature">${
                      task.getCompleted() ? "yes" : "no"
                    }</span>
                  </div>
                </div>`;
  };

  return { render };
})();
