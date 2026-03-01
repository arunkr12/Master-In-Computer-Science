class ConflictResolver {
  ensureConflictModal() {
    let modalEl = document.getElementById("conflict-modal");
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "conflict-modal";
    modalEl.className = "modal fade";
    modalEl.tabIndex = -1;
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Conflict Detected</h5>
          </div>
          <div class="modal-body">
            <p id="conflict-modal-message" class="mb-0"></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
            <button type="button" class="btn btn-danger" data-action="override">Override & Save</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);
    return modalEl;
  }

  showConflictDialog(message) {
    return new Promise((resolve) => {
      const modalEl = this.ensureConflictModal();
      const messageEl = modalEl.querySelector("#conflict-modal-message");
      const cancelBtn = modalEl.querySelector('[data-action="cancel"]');
      const overrideBtn = modalEl.querySelector('[data-action="override"]');

      if (messageEl) {
        messageEl.textContent =
          message ||
          "Another user has modified this task. Do you want to override their changes?";
      }

      const BootstrapModal = /** @type {any} */ (window).bootstrap?.Modal;
      if (!BootstrapModal) {
        resolve(false);
        return;
      }

      const modal = BootstrapModal.getOrCreateInstance(modalEl, {
        backdrop: "static",
        keyboard: false,
      });

      const cleanup = () => {
        modalEl.removeEventListener("hidden.bs.modal", onHidden);
        cancelBtn?.removeEventListener("click", onCancel);
        overrideBtn?.removeEventListener("click", onOverride);
      };

      const onCancel = () => {
        cleanup();
        modal.hide();
        resolve(false);
      };

      const onOverride = () => {
        cleanup();
        modal.hide();
        resolve(true);
      };

      const onHidden = () => {
        cleanup();
        resolve(false);
      };

      cancelBtn?.addEventListener("click", onCancel, { once: true });
      overrideBtn?.addEventListener("click", onOverride, { once: true });
      modalEl.addEventListener("hidden.bs.modal", onHidden, { once: true });

      modal.show();
    });
  }
}

export default ConflictResolver;
