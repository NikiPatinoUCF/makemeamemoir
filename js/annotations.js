/**
 * Annotation System
 * Manages expandable craft annotations
 */

class AnnotationManager {
    constructor() {
        this.annotations = null;
        this.expandedCategories = new Set();
    }

    /**
     * Initialize annotation toggles
     */
    init() {
        // Set up individual category toggles
        const toggleButtons = document.querySelectorAll('.annotation-toggle');
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = button.dataset.category;
                this.toggleCategory(category);
            });
        });

        // Set up "Toggle All" button
        const toggleAllButton = document.getElementById('toggle-all-annotations');
        if (toggleAllButton) {
            toggleAllButton.addEventListener('click', () => {
                this.toggleAll();
            });
        }
    }

    /**
     * Display annotations for a transformation
     * @param {Object} annotations - Annotation data by category
     */
    displayAnnotations(annotations) {
        this.annotations = annotations;

        // Populate each category
        Object.keys(annotations).forEach(category => {
            const content = document.querySelector(`.annotation-content[data-category="${category}"]`);
            if (content && annotations[category].length > 0) {
                content.innerHTML = this.renderAnnotationItems(annotations[category]);
            } else if (content) {
                content.innerHTML = '<p class="no-annotations">No significant changes in this category.</p>';
            }
        });

        // Reset all to collapsed state
        this.collapseAll();
    }

    /**
     * Render annotation items as HTML
     * @param {Array} items - Array of annotation strings
     * @returns {string} HTML string
     */
    renderAnnotationItems(items) {
        return items.map(item =>
            `<div class="annotation-item">${item}</div>`
        ).join('');
    }

    /**
     * Toggle a specific annotation category
     * @param {string} category - Category name
     */
    toggleCategory(category) {
        const button = document.querySelector(`.annotation-toggle[data-category="${category}"]`);
        const content = document.querySelector(`.annotation-content[data-category="${category}"]`);

        if (!button || !content) return;

        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            button.setAttribute('aria-expanded', 'false');
            content.classList.remove('expanded');
            this.expandedCategories.delete(category);
        } else {
            button.setAttribute('aria-expanded', 'true');
            content.classList.add('expanded');
            this.expandedCategories.add(category);
        }
    }

    /**
     * Toggle all categories
     */
    toggleAll() {
        const toggleAllButton = document.getElementById('toggle-all-annotations');
        const allExpanded = this.expandedCategories.size === 5; // 5 categories

        if (allExpanded) {
            this.collapseAll();
            if (toggleAllButton) {
                toggleAllButton.textContent = 'Show All';
            }
        } else {
            this.expandAll();
            if (toggleAllButton) {
                toggleAllButton.textContent = 'Hide All';
            }
        }
    }

    /**
     * Expand all annotation categories
     */
    expandAll() {
        const categories = ['voice', 'pacing', 'sensory', 'structure', 'theme'];
        categories.forEach(category => {
            const button = document.querySelector(`.annotation-toggle[data-category="${category}"]`);
            const content = document.querySelector(`.annotation-content[data-category="${category}"]`);

            if (button && content) {
                button.setAttribute('aria-expanded', 'true');
                content.classList.add('expanded');
                this.expandedCategories.add(category);
            }
        });
    }

    /**
     * Collapse all annotation categories
     */
    collapseAll() {
        const categories = ['voice', 'pacing', 'sensory', 'structure', 'theme'];
        categories.forEach(category => {
            const button = document.querySelector(`.annotation-toggle[data-category="${category}"]`);
            const content = document.querySelector(`.annotation-content[data-category="${category}"]`);

            if (button && content) {
                button.setAttribute('aria-expanded', 'false');
                content.classList.remove('expanded');
                this.expandedCategories.delete(category);
            }
        });

        const toggleAllButton = document.getElementById('toggle-all-annotations');
        if (toggleAllButton) {
            toggleAllButton.textContent = 'Show All';
        }
    }

    /**
     * Highlight changed text in the transformation display
     * @param {string} text - Transformed text
     * @param {Array} changes - Array of change objects
     * @returns {string} HTML with highlighted changes
     */
    highlightChanges(text, changes) {
        if (!changes || changes.length === 0) return text;

        let highlightedText = text;

        // Highlight vocabulary changes
        changes.forEach(change => {
            if (change.type === 'vocabulary' && change.replacement) {
                const regex = new RegExp(`\\b${change.replacement}\\b`, 'gi');
                highlightedText = highlightedText.replace(
                    regex,
                    `<span class="highlight" title="Changed from '${change.original}'">${change.replacement}</span>`
                );
            }

            if (change.type === 'sensory' && change.addition) {
                const regex = new RegExp(`\\b${change.addition}\\b`, 'gi');
                highlightedText = highlightedText.replace(
                    regex,
                    `<span class="highlight" title="Added for atmosphere">${change.addition}</span>`
                );
            }
        });

        return highlightedText;
    }

    /**
     * Clear all annotations
     */
    clear() {
        const categories = ['voice', 'pacing', 'sensory', 'structure', 'theme'];
        categories.forEach(category => {
            const content = document.querySelector(`.annotation-content[data-category="${category}"]`);
            if (content) {
                content.innerHTML = '';
            }
        });
        this.collapseAll();
        this.annotations = null;
    }
}
