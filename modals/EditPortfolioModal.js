/* ──────────────────────────────────────────────────────────────────
   EditPortfolioModal — first modal in the system.
   Usage:
     EditPortfolioModal.open({ name, type, description, darkActivity, staticDetailChange });
     EditPortfolioModal.close();
   Renders into <div id="modal-root"> (created on first use).
   ────────────────────────────────────────────────────────────────── */
(function () {
  function ensureRoot() {
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'modal-root';
      document.body.appendChild(root);
    }
    return root;
  }

  function close() {
    const overlay = document.querySelector('#modal-root .rw-modal-overlay');
    if (!overlay) return;
    overlay.classList.add('is-closing');
    setTimeout(() => { overlay.remove(); }, 120);
  }

  function open(data = {}) {
    const root = ensureRoot();

    const name             = data.name ?? '';
    const type             = data.type ?? 'Marine';
    const description      = data.description ?? '';
    const darkActivity     = data.darkActivity ?? true;
    const staticDetailChg  = data.staticDetailChange ?? true;

    const portfolioTypes = ['Marine','Offshore / Energy','Property','Aviation'];

    root.innerHTML = `
      <div class="rw-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="rw-modal-title">
        <div class="rw-modal" style="max-width:980px;">
          <div class="rw-modal-header has-close">
            <div class="rw-modal-title" id="rw-modal-title">Edit Portfolio</div>
            <button class="rw-modal-close-btn" data-modal-close aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="rw-modal-body">
            <div class="rw-modal-row">
              <label class="rw-modal-label" for="ep-name">Name:</label>
              <input id="ep-name" type="text" class="rw-modal-input" value="${escapeHtml(name)}" />
            </div>
            <div class="rw-modal-row">
              <label class="rw-modal-label" for="ep-type">Portfolio Type:</label>
              <select id="ep-type" class="rw-modal-select is-token">
                ${portfolioTypes.map(t => `<option value="${escapeAttr(t)}" ${t===type?'selected':''}>${escapeHtml(t)}</option>`).join('')}
              </select>
            </div>
            <div class="rw-modal-row">
              <label class="rw-modal-label" for="ep-desc">Description:</label>
              <textarea id="ep-desc" class="rw-modal-textarea">${escapeHtml(description)}</textarea>
            </div>
            <div class="rw-modal-section-title">Enable events recording</div>
            <div class="rw-modal-check-row">
              <input id="ep-dark" type="checkbox" ${darkActivity ? 'checked' : ''} />
              <label for="ep-dark">Dark activity:</label>
            </div>
            <div class="rw-modal-check-row">
              <input id="ep-static" type="checkbox" ${staticDetailChg ? 'checked' : ''} />
              <label for="ep-static">Static detail change:</label>
            </div>
          </div>
          <div class="rw-modal-footer">
            <button class="rw-modal-btn rw-modal-btn-cancel" data-modal-cancel>Cancel</button>
            <button class="rw-modal-btn rw-modal-btn-primary" data-modal-save>Save</button>
          </div>
        </div>
      </div>
    `;

    const overlay = root.querySelector('.rw-modal-overlay');

    // Close interactions
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('[data-modal-cancel]').addEventListener('click', close);
    overlay.querySelector('[data-modal-close]').addEventListener('click', close);
    overlay.querySelector('[data-modal-save]').addEventListener('click', () => {
      const result = {
        name:               document.getElementById('ep-name').value,
        type:               document.getElementById('ep-type').value,
        description:        document.getElementById('ep-desc').value,
        darkActivity:       document.getElementById('ep-dark').checked,
        staticDetailChange: document.getElementById('ep-static').checked,
      };
      if (typeof data.onSave === 'function') data.onSave(result);
      close();
    });

    // Esc to close
    const escHandler = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);

    // Autofocus name
    setTimeout(() => document.getElementById('ep-name')?.focus(), 50);
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  window.EditPortfolioModal = { open, close };
})();
