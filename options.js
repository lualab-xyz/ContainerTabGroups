/**
 * Options page script
 */

// Default settings
const DEFAULT_SETTINGS = {
  enableAutoGrouping: true,
  groupNoContainer: false,
  language: getBrowserLanguage()
};

// Load settings
async function loadSettings() {
  try {
    const settings = await browser.storage.local.get(DEFAULT_SETTINGS);
    
    document.getElementById('enableAutoGrouping').checked = settings.enableAutoGrouping;
    document.getElementById('groupNoContainer').checked = settings.groupNoContainer;
    document.getElementById('languageSelect').value = settings.language;
    
    // Update page language
    await updatePageLanguage(settings.language);
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus(await i18n('errorSaving'), 'error');
  }
}

// Save settings
async function saveSettings() {
  try {
    const settings = {
      enableAutoGrouping: document.getElementById('enableAutoGrouping').checked,
      groupNoContainer: document.getElementById('groupNoContainer').checked,
      language: document.getElementById('languageSelect').value
    };
    
    await browser.storage.local.set(settings);
    
    // Update page language if changed
    await updatePageLanguage(settings.language);
    
    showStatus(await i18n('settingsSaved'), 'success');
    
    // Notify background script of settings change
    browser.runtime.sendMessage({ action: 'settingsChanged', settings });
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus(await i18n('errorSaving'), 'error');
  }
}

// Reset settings to defaults
async function resetSettings() {
  try {
    await browser.storage.local.set(DEFAULT_SETTINGS);
    await loadSettings();
    showStatus(await i18n('settingsReset'), 'success');
    
    // Notify background script
    browser.runtime.sendMessage({ action: 'settingsChanged', settings: DEFAULT_SETTINGS });
  } catch (error) {
    console.error('Error resetting settings:', error);
    showStatus(await i18n('errorSaving'), 'error');
  }
}

// Show status message
function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type} show`;
  
  setTimeout(() => {
    statusDiv.classList.remove('show');
  }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('saveButton').addEventListener('click', saveSettings);
document.getElementById('resetButton').addEventListener('click', resetSettings);

// Language change
document.getElementById('languageSelect').addEventListener('change', async (e) => {
  await updatePageLanguage(e.target.value);
});
