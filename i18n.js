/**
 * Internationalization (i18n) support
 * Bilingual: English and Spanish
 */

const translations = {
  en: {
    optionsTitle: "Container Tab Groups - Options",
    generalSettings: "General Settings",
    enableAutoGrouping: "Enable automatic tab grouping",
    enableAutoGroupingDesc: "Automatically organize tabs into groups based on their containers",
    groupNoContainer: 'Create group for "No Container" tabs',
    groupNoContainerDesc: "If enabled, tabs without a container will be grouped together. If disabled, they will remain ungrouped.",
    language: "Language",
    selectLanguage: "Select language:",
    saveButton: "Save Settings",
    resetButton: "Reset to Defaults",
    settingsSaved: "Settings saved successfully!",
    settingsReset: "Settings reset to defaults",
    errorSaving: "Error saving settings",
    noContainerGroupName: "No Container"
  },
  es: {
    optionsTitle: "Container Tab Groups - Opciones",
    generalSettings: "Configuración General",
    enableAutoGrouping: "Habilitar agrupación automática de pestañas",
    enableAutoGroupingDesc: "Organizar automáticamente las pestañas en grupos según sus contenedores",
    groupNoContainer: 'Crear grupo para pestañas "Sin Contenedor"',
    groupNoContainerDesc: "Si se habilita, las pestañas sin contenedor se agruparán juntas. Si se deshabilita, permanecerán sin agrupar.",
    language: "Idioma",
    selectLanguage: "Seleccionar idioma:",
    saveButton: "Guardar Configuración",
    resetButton: "Restaurar Valores Predeterminados",
    settingsSaved: "¡Configuración guardada correctamente!",
    settingsReset: "Configuración restaurada a valores predeterminados",
    errorSaving: "Error al guardar la configuración",
    noContainerGroupName: "Sin Contenedor"
  }
};

// Get current language from storage or browser
async function getCurrentLanguage() {
  try {
    const result = await browser.storage.local.get('language');
    return result.language || getBrowserLanguage();
  } catch (error) {
    return getBrowserLanguage();
  }
}

// Get browser language (en or es)
function getBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.startsWith('es') ? 'es' : 'en';
}

// Get translation for a key
function i18n(key, lang = null) {
  if (!lang) {
    // If no language specified, return a promise
    return getCurrentLanguage().then(currentLang => {
      return translations[currentLang]?.[key] || translations['en'][key] || key;
    });
  }
  return translations[lang]?.[key] || translations['en'][key] || key;
}

// Update all elements with data-i18n attribute
async function updatePageLanguage(lang = null) {
  if (!lang) {
    lang = await getCurrentLanguage();
  }
  
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = i18n(key, lang);
    
    if (element.tagName === 'INPUT' && element.type === 'text') {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { i18n, getCurrentLanguage, updatePageLanguage, translations };
}
