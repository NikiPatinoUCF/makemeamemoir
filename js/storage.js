/**
 * localStorage Management
 * Handles saving and loading memoir scenes
 */

const StorageManager = {
    STORAGE_KEY: 'makemeamemoir_scenes',
    CURRENT_SCENE_KEY: 'makemeamemoir_current',

    /**
     * Save a memoir scene to localStorage
     * @param {string} text - The memoir text to save
     * @param {string} name - Optional name for the scene
     * @returns {boolean} Success status
     */
    saveScene(text, name = null) {
        try {
            const scenes = this.getAllScenes();
            const timestamp = new Date().toISOString();
            const sceneName = name || `Scene ${timestamp.split('T')[0]}`;

            const scene = {
                id: Date.now(),
                name: sceneName,
                text: text,
                timestamp: timestamp,
                wordCount: this.countWords(text)
            };

            scenes.push(scene);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scenes));

            // Also save as current scene
            this.saveCurrentScene(text);

            return true;
        } catch (error) {
            console.error('Error saving scene:', error);
            return false;
        }
    },

    /**
     * Save the current working scene (auto-save)
     * @param {string} text - The memoir text
     */
    saveCurrentScene(text) {
        try {
            localStorage.setItem(this.CURRENT_SCENE_KEY, text);
        } catch (error) {
            console.error('Error auto-saving scene:', error);
        }
    },

    /**
     * Load the current working scene
     * @returns {string|null} The saved scene text or null
     */
    loadCurrentScene() {
        try {
            return localStorage.getItem(this.CURRENT_SCENE_KEY);
        } catch (error) {
            console.error('Error loading current scene:', error);
            return null;
        }
    },

    /**
     * Get all saved scenes
     * @returns {Array} Array of saved scenes
     */
    getAllScenes() {
        try {
            const scenes = localStorage.getItem(this.STORAGE_KEY);
            return scenes ? JSON.parse(scenes) : [];
        } catch (error) {
            console.error('Error loading scenes:', error);
            return [];
        }
    },

    /**
     * Get a specific scene by ID
     * @param {number} id - Scene ID
     * @returns {Object|null} Scene object or null
     */
    getSceneById(id) {
        const scenes = this.getAllScenes();
        return scenes.find(scene => scene.id === id) || null;
    },

    /**
     * Delete a scene by ID
     * @param {number} id - Scene ID
     * @returns {boolean} Success status
     */
    deleteScene(id) {
        try {
            const scenes = this.getAllScenes();
            const filtered = scenes.filter(scene => scene.id !== id);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting scene:', error);
            return false;
        }
    },

    /**
     * Clear all saved scenes
     * @returns {boolean} Success status
     */
    clearAllScenes() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing scenes:', error);
            return false;
        }
    },

    /**
     * Count words in text
     * @param {string} text - Text to count
     * @returns {number} Word count
     */
    countWords(text) {
        if (!text || text.trim().length === 0) return 0;
        return text.trim().split(/\s+/).length;
    },

    /**
     * Check if localStorage is available
     * @returns {boolean} Availability status
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
};
