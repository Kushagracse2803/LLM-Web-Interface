document.addEventListener('DOMContentLoaded', function () {
  // ==== DOM elements (UI only; logic untouched) ====
  const settingsIcon = document.getElementById('settingsIcon');
  const settingsPanel = document.getElementById('settingsPanel');

  const providerSelect = document.getElementById('providerSelect');
  const openaiModels = document.querySelector('.openai-models');
  const anthropicModels = document.querySelector('.anthropic-models');
  const geminiModelGroup = document.getElementById('geminiModelGroup');

  const openaiModelSelect = document.getElementById('openaiModelSelect');
  const anthropicModelSelect = document.getElementById('anthropicModelSelect');
  const geminiModelSelect = document.getElementById('geminiModelSelect');

  const temperatureSlider = document.getElementById('temperatureSlider');
  const temperatureValue = document.getElementById('temperatureValue');
  const maxTokensInput = document.getElementById('maxTokensInput');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');

  const promptInput = document.getElementById('promptInput');
  const charCounter = document.getElementById('charCounter');
  const sendButton = document.getElementById('sendButton');
  const clearButton = document.getElementById('clearButton');
  const saveButton = document.getElementById('saveButton');
  const stopButton = document.getElementById('stopButton');

  const conversation = document.getElementById('conversation');
  const loadingIndicator = document.getElementById('loadingIndicator');

  // ==== Tiny UI interactions ====

  // Slide-open settings
  settingsIcon?.addEventListener('click', () => {
    settingsPanel.classList.toggle('open');
  });

  // Provider -> show relevant models (OpenAI / Anthropic / Gemini)
  function applyProviderUI(p = providerSelect.value) {
    openaiModels.style.display = (p === 'openai') ? '' : 'none';
    anthropicModels.style.display = (p === 'anthropic') ? '' : 'none';
    geminiModelGroup.style.display = (p === 'google_gemini') ? '' : 'none';
  }
  providerSelect?.addEventListener('change', () => applyProviderUI());
  applyProviderUI();

  // Temperature live value
  temperatureSlider?.addEventListener('input', () => {
    temperatureValue.textContent = Number(temperatureSlider.value).toFixed(1);
  });

  // Character counter
  function updateCharCounter() {
    const len = (promptInput.value || '').length;
    charCounter.textContent = `${len} chars`;
  }
  promptInput?.addEventListener('input', updateCharCounter);
  updateCharCounter();

  // Save settings (persist only; no API logic changed)
  function getSelectedModel() {
    const p = providerSelect.value;
    if (p === 'openai') return openaiModelSelect.value;
    if (p === 'anthropic') return anthropicModelSelect.value;
    // default Gemini
    return geminiModelSelect.value;
  }

  saveSettingsBtn?.addEventListener('click', () => {
    const settings = {
      provider: providerSelect.value,
      model: getSelectedModel(),
      temperature: parseFloat(temperatureSlider.value),
      max_tokens: parseInt(maxTokensInput.value, 10)
    };
    try {
      localStorage.setItem('modelSettings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not persist settings', e);
    }

    // Small visual feedback
    saveSettingsBtn.disabled = true;
    const prev = saveSettingsBtn.textContent;
    saveSettingsBtn.textContent = 'Saved ✓';
    setTimeout(() => {
      saveSettingsBtn.disabled = false;
      saveSettingsBtn.textContent = prev;
    }, 900);
  });

  // Restore settings on load (gentle, UI only)
  (function restoreSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem('modelSettings') || '{}');
      if (!saved) return;
      if (saved.provider) providerSelect.value = saved.provider;
      applyProviderUI();

      if (saved.model) {
        if (saved.provider === 'openai') openaiModelSelect.value = saved.model;
        else if (saved.provider === 'anthropic') anthropicModelSelect.value = saved.model;
        else geminiModelSelect.value = saved.model;
      }
      if (typeof saved.temperature === 'number') {
        temperatureSlider.value = saved.temperature;
        temperatureValue.textContent = saved.temperature.toFixed(1);
      }
      if (typeof saved.max_tokens === 'number') {
        maxTokensInput.value = saved.max_tokens;
      }
    } catch (_) {}
  })();

  // ===== Optional tiny UX helpers (do not change your core logic) =====

  // Show/hide loading indicator
  function showLoading(show) {
    loadingIndicator.style.display = show ? 'flex' : 'none';
  }

  // Create a bubble in the conversation (UI only)
  function addMessageBubble(text, who = 'ai') {
    const bubble = document.createElement('div');
    bubble.className = `message ${who === 'user' ? 'user-message' : 'ai-message'}`;
    bubble.innerText = text;
    conversation.appendChild(bubble);
    conversation.scrollTop = conversation.scrollHeight;
    return bubble;
  }

  // A minimal typing indicator class toggle for AI (you can hook it into your stream)
  function setTyping(bubble, isTyping) {
    if (!bubble) return;
    if (isTyping) bubble.classList.add('typing');
    else bubble.classList.remove('typing');
  }

  // Wire basic buttons (pure UI scaffolding — keep/replace with your existing handlers)
  sendButton?.addEventListener('click', () => {
    const text = (promptInput.value || '').trim();
    if (!text) return;
    addMessageBubble(text, 'user');
    promptInput.value = '';
    updateCharCounter();

    // If you already have send logic, call it here.
    // UI feedback only:
    showLoading(true);
    stopButton.style.display = '';
  });

  stopButton?.addEventListener('click', () => {
    // Hook this to your abort controller if you have one
    stopButton.style.display = 'none';
    showLoading(false);
  });

  clearButton?.addEventListener('click', () => {
    conversation.innerHTML = `
      <div class="welcome-message">
        <h2>Welcome to the SALLM Interaction Interface!</h2>
        <h3 style="color: blue;">Project Developed by Kushagra Tiwari!</h3>
        <p>Enter your prompt below to start a conversation with an AI language model.</p>
      </div>`;
  });

  saveButton?.addEventListener('click', () => {
    // Placeholder: attach your actual save/export logic.
    const prev = saveButton.textContent;
    saveButton.textContent = 'Saved ✓';
    saveButton.disabled = true;
    setTimeout(() => {
      saveButton.textContent = prev;
      saveButton.disabled = false;
    }, 900);
  });

  // Expose tiny helpers in case you want to use them from your existing logic:
  window.UIHelpers = {
    addMessageBubble,
    setTyping,
    showLoading,
    getSelectedModel
  };
});
