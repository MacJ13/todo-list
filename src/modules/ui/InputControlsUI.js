export const inputControlsUI = (function () {
  const renderPriorities = function (currentPriority) {
    return ["low", "medium", "high"]
      .map(
        (priority) =>
          `<option class="color-${priority}" ${
            currentPriority === priority ? "selected" : ""
          } value=${priority}>${
            priority[0].toUpperCase() + priority.slice(1)
          }</option>`
      )
      .join("");
  };

  const rendertaskInput = function (current) {
    return `
            <div class="modal-control-task">
            <textarea
        class="modal-control-input"
        name="description"
        id="description"
        placeholder="Description"
      >${current ? current.getDescription() : ""}</textarea>
      <select
        class="modal-control-input"
        name="priority"
        id="priority"
      >
        <option ${
          current ? "" : "selected"
        } disabled value="low">Priority (Low, Medium, High)</option>
        ${renderPriorities(current ? current.getPriority() : "")}
      </select>
      <input
        class="modal-control-input"
        type="date"
        name="duedate"
        id="duedate"
        value="${
          current
            ? current.formatDate()
            : new Date().toISOString().substring(0, 10)
        }"
      />
      </div>
      `;
  };

  const render = function (modal, current) {
    return `
        <input
        class="modal-control-input"
        type="text"
        name="title"
        id="title"
        placeholder="Title (required)"
        value="${current ? current.getTitle() : ""}"
      />
        ${
          modal === "edit-task" || modal === "create-task"
            ? rendertaskInput(current)
            : ""
        }
      `;
  };

  const getControlValues = function () {
    const obj = {};
    const defaultDate = new Date().toISOString().substring(0, 10);
    // return () => {
    const inputModalWrapperElements = document.querySelectorAll(
      ".modal-control-input"
    );

    inputModalWrapperElements.forEach((controlEl) => {
      if (controlEl.id === "duedate") {
        obj[controlEl.name] = controlEl.value
          ? new Date(controlEl.value)
          : new Date(defaultDate);
        return;
      }
      obj[controlEl.name] = controlEl.value;
    });
    return obj;
    // };
  };

  return { render, getControlValues };
})();
