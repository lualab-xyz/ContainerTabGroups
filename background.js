/**
 * Container Tab Groups - Background Script
 * Automatically creates and manages tab groups based on Firefox Multi-Account Containers
 */

// Map to store container ID -> group ID associations
const containerGroupMap = new Map();

// Color mapping from container colors to tab group colors
const colorMap = {
  'blue': 'blue',
  'turquoise': 'cyan',
  'green': 'green',
  'yellow': 'yellow',
  'orange': 'orange',
  'red': 'red',
  'pink': 'pink',
  'purple': 'purple'
};

// Default settings
const DEFAULT_SETTINGS = {
  enableAutoGrouping: true,
  groupNoContainer: false,
  language: 'en'
};

// Current settings
let settings = { ...DEFAULT_SETTINGS };

// Special ID for no-container group
const NO_CONTAINER_ID = 'firefox-default';
const NO_CONTAINER_GROUP_KEY = '__no_container__';

/**
 * Load settings from storage
 */
async function loadSettings() {
  try {
    const stored = await browser.storage.local.get(DEFAULT_SETTINGS);
    settings = { ...DEFAULT_SETTINGS, ...stored };
    console.log('Container Tab Groups: Settings loaded', settings);
  } catch (error) {
    console.error('Error loading settings:', error);
    settings = { ...DEFAULT_SETTINGS };
  }
}

/**
 * Get translation for "No Container" based on current language
 */
function getNoContainerName() {
  return settings.language === 'es' ? 'Sin Contenedor' : 'No Container';
}

/**
 * Initialize the extension
 */
async function initialize() {
  console.log('Container Tab Groups: Initializing...');
  
  try {
    // Load settings first
    await loadSettings();
    
    // Skip if auto-grouping is disabled
    if (!settings.enableAutoGrouping) {
      console.log('Container Tab Groups: Auto-grouping disabled');
      return;
    }
    
    // Get all containers
    const containers = await browser.contextualIdentities.query({});
    console.log(`Found ${containers.length} containers`);
    
    // Get all tabs
    const tabs = await browser.tabs.query({});
    
    // Process each container
    for (const container of containers) {
      await processContainer(container, tabs);
    }
    
    // Process "No Container" tabs if enabled
    if (settings.groupNoContainer) {
      await processNoContainerTabs(tabs);
    }
    
    console.log('Container Tab Groups: Initialization complete');
  } catch (error) {
    console.error('Container Tab Groups: Initialization error:', error);
  }
}

/**
 * Process "No Container" tabs
 */
async function processNoContainerTabs(allTabs = null) {
  try {
    // Get tabs without a container
    const tabs = allTabs 
      ? allTabs.filter(tab => !tab.cookieStoreId || tab.cookieStoreId === NO_CONTAINER_ID)
      : await browser.tabs.query({ cookieStoreId: NO_CONTAINER_ID });
    
    if (tabs.length === 0) {
      return; // No tabs without container
    }
    
    // Check if we already have a group for no-container tabs
    let groupId = containerGroupMap.get(NO_CONTAINER_GROUP_KEY);
    
    if (!groupId) {
      // Create a new tab group
      const tabIds = tabs.map(tab => tab.id);
      const group = await browser.tabs.group({ tabIds });
      
      // Configure the group
      await browser.tabGroups.update(group, {
        title: getNoContainerName(),
        color: 'grey',
        collapsed: false
      });
      
      containerGroupMap.set(NO_CONTAINER_GROUP_KEY, group);
      console.log(`Created group for no-container tabs`);
    } else {
      // Add tabs to existing group
      for (const tab of tabs) {
        if (tab.groupId !== groupId) {
          await browser.tabs.group({ 
            groupId: groupId, 
            tabIds: [tab.id] 
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error processing no-container tabs:`, error);
  }
}

/**
 * Process a container and create/update its tab group
 */
async function processContainer(container, allTabs = null) {
  try {
    // Get tabs for this container
    const tabs = allTabs 
      ? allTabs.filter(tab => tab.cookieStoreId === container.cookieStoreId)
      : await browser.tabs.query({ cookieStoreId: container.cookieStoreId });
    
    if (tabs.length === 0) {
      return; // No tabs for this container
    }
    
    // Check if we already have a group for this container
    let groupId = containerGroupMap.get(container.cookieStoreId);
    
    if (!groupId) {
      // Create a new tab group
      const tabIds = tabs.map(tab => tab.id);
      const group = await browser.tabs.group({ tabIds });
      
      // Configure the group
      await browser.tabGroups.update(group, {
        title: container.name,
        color: colorMap[container.color] || 'grey',
        collapsed: false
      });
      
      containerGroupMap.set(container.cookieStoreId, group);
      console.log(`Created group for container: ${container.name}`);
    } else {
      // Add tabs to existing group
      for (const tab of tabs) {
        if (tab.groupId !== groupId) {
          await browser.tabs.group({ 
            groupId: groupId, 
            tabIds: [tab.id] 
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error processing container ${container.name}:`, error);
  }
}

/**
 * Handle new tabs being created
 */
async function onTabCreated(tab) {
  try {
    // Skip if auto-grouping is disabled
    if (!settings.enableAutoGrouping) {
      return;
    }
    
    // Wait a bit for the tab to be fully created
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Re-fetch the tab to get updated info
    try {
      tab = await browser.tabs.get(tab.id);
    } catch (error) {
      console.log('Tab was closed before processing');
      return;
    }
    
    // Check if it's a tab without a container
    const isNoContainer = !tab.cookieStoreId || tab.cookieStoreId === NO_CONTAINER_ID;
    
    if (isNoContainer) {
      // Handle no-container tabs
      if (!settings.groupNoContainer) {
        // If grouping no-container is disabled, remove from any group
        if (tab.groupId && tab.groupId !== -1) {
          try {
            await browser.tabs.ungroup([tab.id]);
            console.log('Removed no-container tab from group (option disabled)');
          } catch (error) {
            console.error('Error ungrouping tab:', error);
          }
        }
        return;
      }
      
      // Group no-container tabs if enabled
      let groupId = containerGroupMap.get(NO_CONTAINER_GROUP_KEY);
      
      if (!groupId) {
        // Create a new group for no-container tabs
        console.log(`Creating new group for no-container tabs`);
        
        const noContainerTabs = await browser.tabs.query({ 
          cookieStoreId: NO_CONTAINER_ID 
        });
        
        if (noContainerTabs.length > 0) {
          const tabIds = noContainerTabs.map(t => t.id);
          const newGroupId = await browser.tabs.group({ tabIds });
          
          await browser.tabGroups.update(newGroupId, {
            title: getNoContainerName(),
            color: 'grey',
            collapsed: false
          });
          
          containerGroupMap.set(NO_CONTAINER_GROUP_KEY, newGroupId);
          console.log(`Created group for no-container tabs (${noContainerTabs.length} tabs)`);
          return;
        }
      }
      
      if (groupId && tab.groupId !== groupId) {
        await browser.tabs.group({ 
          groupId: groupId, 
          tabIds: [tab.id] 
        });
        console.log(`Added tab to no-container group`);
      }
      return;
    }
    
    // Get the container info
    const container = await browser.contextualIdentities.get(tab.cookieStoreId);
    if (!container) return;
    
    // Check if we have a group for this container
    let groupId = containerGroupMap.get(container.cookieStoreId);
    
    if (!groupId) {
      // Create a new group for this container
      console.log(`Creating new group for container: ${container.name}`);
      
      // Get all tabs for this container
      const containerTabs = await browser.tabs.query({ 
        cookieStoreId: container.cookieStoreId 
      });
      
      if (containerTabs.length > 0) {
        const tabIds = containerTabs.map(t => t.id);
        const newGroupId = await browser.tabs.group({ tabIds });
        
        // Configure the group
        await browser.tabGroups.update(newGroupId, {
          title: container.name,
          color: colorMap[container.color] || 'grey',
          collapsed: false
        });
        
        containerGroupMap.set(container.cookieStoreId, newGroupId);
        console.log(`Created and configured group for container: ${container.name} (${containerTabs.length} tabs)`);
        return;
      }
    }
    
    // Add the tab to the existing group
    if (groupId && tab.groupId !== groupId) {
      await browser.tabs.group({ 
        groupId: groupId, 
        tabIds: [tab.id] 
      });
      console.log(`Added tab to existing container group: ${container.name}`);
    }
  } catch (error) {
    console.error('Error handling new tab:', error);
  }
}

/**
 * Handle tabs being moved to different containers
 */
async function onTabUpdated(tabId, changeInfo, tab) {
  // Check if the cookieStoreId changed
  if (changeInfo.cookieStoreId) {
    await onTabCreated(tab);
  }
}

/**
 * Handle container creation
 */
async function onContainerCreated(changeInfo) {
  if (changeInfo.contextualIdentity) {
    console.log(`Container created: ${changeInfo.contextualIdentity.name}`);
    await processContainer(changeInfo.contextualIdentity);
  }
}

/**
 * Handle container removal
 */
async function onContainerRemoved(changeInfo) {
  if (changeInfo.contextualIdentity) {
    const cookieStoreId = changeInfo.contextualIdentity.cookieStoreId;
    containerGroupMap.delete(cookieStoreId);
    console.log(`Container removed: ${changeInfo.contextualIdentity.name}`);
  }
}

/**
 * Handle container updates (name, color changes)
 */
async function onContainerUpdated(changeInfo) {
  if (changeInfo.contextualIdentity) {
    const container = changeInfo.contextualIdentity;
    const groupId = containerGroupMap.get(container.cookieStoreId);
    
    if (groupId) {
      try {
        await browser.tabGroups.update(groupId, {
          title: container.name,
          color: colorMap[container.color] || 'grey'
        });
        console.log(`Updated group for container: ${container.name}`);
      } catch (error) {
        console.error('Error updating group:', error);
      }
    }
  }
}

/**
 * Handle messages from options page or other parts
 */
async function onMessage(message) {
  if (message.action === 'settingsChanged') {
    console.log('Settings changed, reinitializing...');
    settings = { ...DEFAULT_SETTINGS, ...message.settings };
    
    // Clear existing groups if auto-grouping is disabled
    if (!settings.enableAutoGrouping) {
      containerGroupMap.clear();
    } else {
      // Reinitialize with new settings
      await initialize();
    }
  }
}

// Event listeners
browser.tabs.onCreated.addListener(onTabCreated);
browser.tabs.onUpdated.addListener(onTabUpdated);
browser.contextualIdentities.onCreated.addListener(onContainerCreated);
browser.contextualIdentities.onRemoved.addListener(onContainerRemoved);
browser.contextualIdentities.onUpdated.addListener(onContainerUpdated);
browser.runtime.onMessage.addListener(onMessage);

// Initialize when the extension loads
initialize();
