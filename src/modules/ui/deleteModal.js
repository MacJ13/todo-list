export const deleteModal = (function () {
  const renderParagraph = function (title) {
    return `<p class="modal-paragraph">
    Are you sure, you want to delete "${title}"
    </p>`;
  };

  return { renderParagraph };
})();
