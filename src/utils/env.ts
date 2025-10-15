// Environment configuration interface
export interface EnvironmentConfig {
  youtubeApiKey?: string;
  youtubePlaylistUrl?: string;
  // Add any other app-wide settings here
}

// Global variable to hold the current app configuration
let currentConfig: EnvironmentConfig | null = null;

// Storage key for environment configuration
const STORAGE_KEY = 'contest-tracker-config';

/**
 * Initialize the environment configuration from localStorage
 * This should be called when the app initializes
 */
export function initializeEnvironment(): EnvironmentConfig {
  try {
    const storedConfig = localStorage.getItem(STORAGE_KEY);
    
    if (storedConfig) {
      currentConfig = JSON.parse(storedConfig);
    } else {
      // Default configuration if nothing is stored - use hardcoded API key
      currentConfig = {
        youtubeApiKey: 'AIzaSyA-3CQXlWkyDvvqB0YLFoTXMfBm_XFeIoM',
        youtubePlaylistUrl: '',
      };
      
      // Save default config to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
    }
    
    return { ...currentConfig };
  } catch (error) {
    console.error('Error initializing environment configuration:', error);
    
    // Fallback to config with hardcoded API key if there's an error
    currentConfig = {
        youtubeApiKey: 'AIzaSyA-3CQXlWkyDvvqB0YLFoTXMfBm_XFeIoM',
        youtubePlaylistUrl: '',
    };
    
    return { ...currentConfig };
  }
}

/**
 * Get the current environment configuration
 * Will initialize if not already initialized
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  if (!currentConfig) {
    return initializeEnvironment();
  }
  return { ...currentConfig };
}

/**
 * Update the environment configuration
 * Partially updates the config with the provided values
 */
export function setEnvironmentConfig(config: Partial<EnvironmentConfig>): EnvironmentConfig {
  try {
    // Get current config or initialize
    const existingConfig = getEnvironmentConfig();
    
    // Update with new values
    const updatedConfig = {
      ...existingConfig,
      ...config,
    };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
    
    // Update in-memory config
    currentConfig = updatedConfig;
    
    return { ...updatedConfig };
  } catch (error) {
    console.error('Error updating environment configuration:', error);
    throw error;
  }
}

/**
 * Helper to get a specific config value
 * Provides better type safety and default value support
 */
export function getConfigValue<K extends keyof EnvironmentConfig>(
  key: K, 
  defaultValue?: EnvironmentConfig[K]
): EnvironmentConfig[K] {
  const config = getEnvironmentConfig();
  return config[key] !== undefined ? config[key] : defaultValue as EnvironmentConfig[K];
}

// For backwards compatibility
export function getYoutubeApiKey(): string {
  return getConfigValue('youtubeApiKey', 'AIzaSyA-3CQXlWkyDvvqB0YLFoTXMfBm_XFeIoM') || 'AIzaSyA-3CQXlWkyDvvqB0YLFoTXMfBm_XFeIoM';
}

export function getYoutubePlaylistUrl(): string {
  return getConfigValue('youtubePlaylistUrl', 'https://www.youtube.com/playlist?list=PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB') || 'https://www.youtube.com/playlist?list=PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB';
}

// Initialize the environment on import
initializeEnvironment(); 