import { infoModal } from "./infoModal";
import { deleteModal } from "./deleteModal";
import { inputControlsUI } from "./InputControlsUI";
import { pubsub } from "../pubsub";

export const modalUI = (function () {
  const modalEl = document.querySelector(".modal");

  const modalHeadingEl = document.querySelector(".modal-heading");
  const modalWrapperEl = document.querySelector(".modal-wrapper");
  const modalCloseBtn = document.querySelector(".modal-close");

  const emptyTitleField = function (obj) {
    return !obj["title"];
  };

  const generateModalButton = function (modalType, fn) {
    const button = document.createElement("button");
    button.className = `modal-control-button ${!modalType ? "btn-close" : ""}`;
    button.type = "button";
    button.textContent = modalType ? modalType.split("-")[0] : "cancel";
    button.addEventListener("click", () => {
      if (modalType) {
        const obj = fn ? fn() : "";
        if (obj && emptyTitleField(obj)) {
          alert("Error! Please fill 'title' field.");
          return;
        }
        pubsub.publish(modalType, obj);
      }
      closeModalElement();
    });

    return button;
  };

  const generateButtonContainer = function () {
    const wrapper = document.createElement("div");
    wrapper.className = "modal-wrapper-btn";
    return wrapper;
  };

  const renderContentWrapperEl = function (current, { type, modal }) {
    let html = "";
    let executeBtn;
    const cancelBtn = generateModalButton();
    const wrapperBtnEl = generateButtonContainer();

    if (type === "info") {
      html = infoModal.render(current);
      modalWrapperEl.insertAdjacentHTML("beforeend", html);
      modalWrapperEl.appendChild(cancelBtn);
      return;
    }

    if (type === "edit") {
      html = inputControlsUI.render(modal, current);
      executeBtn = generateModalButton(modal, inputControlsUI.getControlValues);
    } else if (type === "create") {
      html = inputControlsUI.render(modal);

      executeBtn = generateModalButton(modal, inputControlsUI.getControlValues);
    } else if (type === "delete") {
      html = deleteModal.renderParagraph(current.getTitle());
      executeBtn = generateModalButton(modal);
    }

    modalWrapperEl.insertAdjacentHTML("beforeend", html);
    wrapperBtnEl.appendChild(executeBtn);
    wrapperBtnEl.appendChild(cancelBtn);

    modalWrapperEl.appendChild(wrapperBtnEl);
  };

  function setHeadingTitle(title) {
    modalHeadingEl.textContent = title.replace("-", " ");
  }

  function closeModalElement() {
    modalEl.classList.add("hidden");
    modalHeadingEl.textContent = "";
    modalWrapperEl.innerHTML = "";
  }

  function openModalElement() {
    modalEl.classList.remove("hidden");
  }

  function onClickCloseModal() {
    modalCloseBtn.addEventListener("click", closeModalElement);
  }

  onClickCloseModal();

  return {
    openModalElement,
    setHeadingTitle,
    renderContentWrapperEl,
  };
})();
