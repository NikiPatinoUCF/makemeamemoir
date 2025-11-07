/**
 * Main Application
 * Orchestrates all components of the memoir transformation tool
 */

// Global state
const AppState = {
    currentText: '',
    currentGenre: null,
    currentTransformation: null,
    sampleScene: null,
    teachingContent: null,
    isDemoMode: false
};

// Initialize components
const transformer = new GenreTransformer();
const annotationManager = new AnnotationManager();
const pdfExporter = new PDFExporter();

// P5.js sketch for background animation
let p5Sketch = function(p) {
    let particles = [];

    p.setup = function() {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('p5-canvas-container');

        // Create gem-like particles
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                size: p.random(2, 6),
                speedX: p.random(-0.3, 0.3),
                speedY: p.random(-0.3, 0.3),
                color: p.random(['#2d5a4a', '#1a4b7c', '#8b2635', '#6b4c7a', '#b8860b'])
            });
        }
    };

    p.draw = function() {
        p.clear();

        // Draw and update particles
        particles.forEach(particle => {
            p.fill(particle.color);
            p.noStroke();
            p.ellipse(particle.x, particle.y, particle.size);

            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = p.width;
            if (particle.x > p.width) particle.x = 0;
            if (particle.y < 0) particle.y = p.height;
            if (particle.y > p.height) particle.y = 0;
        });
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};

// Initialize P5.js
new p5(p5Sketch);

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
});

/**
 * Initialize the application
 */
async function initializeApp() {
    // Load data
    await loadSampleScene();
    await loadTeachingContent();
    await transformer.loadGenreRules();

    // Initialize components
    annotationManager.init();
    pdfExporter.init();

    // Set up event listeners
    setupEventListeners();

    // Load saved scene if exists
    loadSavedScene();

    // Show initial instructions
    showSection('teaching-section', false);
}

/**
 * Load sample scene from JSON
 */
async function loadSampleScene() {
    try {
        const response = await fetch('data/sample-scene.json');
        const data = await response.json();
        AppState.sampleScene = data.text;
    } catch (error) {
        console.error('Error loading sample scene:', error);
        AppState.sampleScene = 'Sample scene could not be loaded.';
    }
}

/**
 * Load teaching content from JSON
 */
async function loadTeachingContent() {
    try {
        const response = await fetch('data/teaching-content.json');
        AppState.teachingContent = await response.json();
        displayTeachingOverview();
    } catch (error) {
        console.error('Error loading teaching content:', error);
    }
}

/**
 * Display teaching overview
 */
function displayTeachingOverview() {
    const content = document.querySelector('#teaching-content .teaching-overview');
    if (content && AppState.teachingContent) {
        content.innerHTML = AppState.teachingContent.overview.content;
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Teaching section toggle
    const teachingToggle = document.getElementById('teaching-toggle');
    teachingToggle?.addEventListener('click', () => {
        toggleCollapsible('teaching-content', teachingToggle);
    });

    // Demo button
    const demoButton = document.getElementById('demo-button');
    demoButton?.addEventListener('click', showDemo);

    // Text input
    const memoirInput = document.getElementById('memoir-input');
    memoirInput?.addEventListener('input', handleTextInput);

    // Transform button
    const transformButton = document.getElementById('transform-button');
    transformButton?.addEventListener('click', handleTransformClick);

    // Genre cards
    const genreCards = document.querySelectorAll('.genre-card');
    genreCards.forEach(card => {
        card.addEventListener('click', () => {
            handleGenreSelection(card.dataset.genre);
        });
    });

    // Control buttons
    document.getElementById('copy-button')?.addEventListener('click', copyToClipboard);
    document.getElementById('save-button')?.addEventListener('click', saveCurrentScene);
    document.getElementById('pdf-button')?.addEventListener('click', exportToPDF);
    document.getElementById('clear-button')?.addEventListener('click', clearInput);
    document.getElementById('load-saved-button')?.addEventListener('click', loadSavedScene);
}

/**
 * Toggle collapsible sections
 */
function toggleCollapsible(contentId, toggleButton) {
    const content = document.getElementById(contentId);
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
        toggleButton.setAttribute('aria-expanded', 'false');
        content.classList.remove('expanded');
    } else {
        toggleButton.setAttribute('aria-expanded', 'true');
        content.classList.add('expanded');
    }
}

/**
 * Show demo with sample scene
 */
function showDemo() {
    AppState.isDemoMode = true;
    const demoDisplay = document.getElementById('demo-display');
    const sampleText = document.getElementById('sample-text');

    sampleText.textContent = AppState.sampleScene;
    demoDisplay.classList.remove('hidden');
    demoDisplay.classList.add('fade-in');

    // Set sample as current text and enable transformation
    AppState.currentText = AppState.sampleScene;
    showSection('genre-section', true);
}

/**
 * Handle text input
 */
function handleTextInput(e) {
    const text = e.target.value;
    const wordCount = StorageManager.countWords(text);
    const charCounter = document.getElementById('char-counter');
    const transformButton = document.getElementById('transform-button');

    // Update counter
    charCounter.textContent = `${wordCount} / 300 words`;

    // Validate word count
    if (wordCount < 50 || wordCount > 300) {
        charCounter.classList.add('warning');
        transformButton.disabled = true;
    } else {
        charCounter.classList.remove('warning');
        transformButton.disabled = false;
    }

    // Auto-save to localStorage
    if (wordCount > 0) {
        StorageManager.saveCurrentScene(text);
    }
}

/**
 * Handle transform button click
 */
function handleTransformClick() {
    const memoirInput = document.getElementById('memoir-input');
    const text = memoirInput.value.trim();

    if (text.length === 0) return;

    AppState.isDemoMode = false;
    AppState.currentText = text;
    showSection('genre-section', true);

    // Scroll to genre section
    document.getElementById('genre-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Handle genre selection
 */
function handleGenreSelection(genreKey) {
    AppState.currentGenre = genreKey;

    // Update active state
    document.querySelectorAll('.genre-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`.genre-card[data-genre="${genreKey}"]`)?.classList.add('active');

    // Perform transformation
    performTransformation(genreKey);
}

/**
 * Perform the transformation
 */
function performTransformation(genreKey) {
    const result = transformer.transform(AppState.currentText, genreKey);
    AppState.currentTransformation = result;

    // Update transformation section
    displayTransformation(genreKey, result);

    // Show transformation section
    showSection('transformation-section', true);

    // Scroll to transformation
    document.getElementById('transformation-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Display transformation results
 */
function displayTransformation(genreKey, result) {
    const transformationSection = document.getElementById('transformation-section');
    const genreName = AppState.teachingContent?.genres[genreKey]?.name || genreKey;

    // Update genre name
    document.getElementById('current-genre-name').textContent = genreName;
    document.getElementById('genre-label').textContent = genreName;

    // Set genre-specific border color
    transformationSection.setAttribute('data-current-genre', genreKey);

    // Display contextual teaching
    displayContextualTeaching(genreKey);

    // Display texts
    document.getElementById('original-text').textContent = AppState.currentText;

    // Display transformed text with highlights
    const highlightedText = annotationManager.highlightChanges(result.text, result.changes);
    document.getElementById('transformed-text').innerHTML = highlightedText;

    // Display annotations
    annotationManager.displayAnnotations(result.annotations);
}

/**
 * Display contextual teaching for genre
 */
function displayContextualTeaching(genreKey) {
    const contextualTeaching = document.getElementById('contextual-teaching');
    const genreData = AppState.teachingContent?.genres[genreKey];

    if (contextualTeaching && genreData) {
        contextualTeaching.innerHTML = genreData.teachingPoint;
    }
}

/**
 * Copy transformed text to clipboard
 */
async function copyToClipboard() {
    if (!AppState.currentTransformation) return;

    try {
        // Remove HTML tags
        const cleanText = AppState.currentTransformation.text.replace(/<[^>]*>/g, '');
        await navigator.clipboard.writeText(cleanText);
        alert('Transformed text copied to clipboard!');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Could not copy to clipboard. Please try selecting and copying manually.');
    }
}

/**
 * Save current scene to localStorage
 */
function saveCurrentScene() {
    if (!AppState.currentText) return;

    const success = StorageManager.saveScene(AppState.currentText);
    if (success) {
        alert('Scene saved successfully!');
    } else {
        alert('Error saving scene. Please try again.');
    }
}

/**
 * Load saved scene from localStorage
 */
function loadSavedScene() {
    const savedText = StorageManager.loadCurrentScene();

    if (savedText) {
        const memoirInput = document.getElementById('memoir-input');
        memoirInput.value = savedText;

        // Trigger input event to update counter
        memoirInput.dispatchEvent(new Event('input'));

        alert('Loaded your previously saved scene!');
    } else {
        alert('No saved scene found.');
    }
}

/**
 * Export to PDF
 */
function exportToPDF() {
    if (!AppState.currentTransformation || !AppState.currentGenre) {
        alert('Please select a genre transformation first.');
        return;
    }

    const genreName = AppState.teachingContent?.genres[AppState.currentGenre]?.name || AppState.currentGenre;

    pdfExporter.exportToPDF(
        genreName,
        AppState.currentText,
        AppState.currentTransformation.text,
        AppState.currentTransformation.annotations
    );
}

/**
 * Clear input
 */
function clearInput() {
    const memoirInput = document.getElementById('memoir-input');
    memoirInput.value = '';
    memoirInput.dispatchEvent(new Event('input'));

    // Hide sections
    showSection('genre-section', false);
    showSection('transformation-section', false);

    // Reset state
    AppState.currentText = '';
    AppState.currentGenre = null;
    AppState.currentTransformation = null;
}

/**
 * Show or hide a section
 */
function showSection(sectionId, show) {
    const section = document.getElementById(sectionId);
    if (section) {
        if (show) {
            section.classList.remove('hidden');
            section.classList.add('fade-in');
        } else {
            section.classList.add('hidden');
            section.classList.remove('fade-in');
        }
    }
}
