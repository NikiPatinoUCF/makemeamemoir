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
    famousScenes: null,
    isDemoMode: false,
    isFamousSceneMode: false
};

// Initialize components
const transformer = new GenreTransformer();
const aiTransformer = new AITransformer();
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
    await loadFamousScenes();
    await transformer.loadGenreRules();

    // Initialize components
    annotationManager.init();
    pdfExporter.init();

    // Set up event listeners
    setupEventListeners();

    // Load saved scene if exists (don't show alert)
    const savedText = StorageManager.loadCurrentScene();
    if (savedText) {
        const memoirInput = document.getElementById('memoir-input');
        memoirInput.value = savedText;
        memoirInput.dispatchEvent(new Event('input'));
    }

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
 * Load famous scenes from JSON
 */
async function loadFamousScenes() {
    try {
        const response = await fetch('data/famous-scenes.json');
        AppState.famousScenes = await response.json();
    } catch (error) {
        console.error('Error loading famous scenes:', error);
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

    // Famous scenes genre selector
    const famousGenreSelect = document.getElementById('famous-genre-select');
    famousGenreSelect?.addEventListener('change', handleFamousGenreSelect);

    // Random scene picker
    const randomSceneButton = document.getElementById('random-scene-button');
    randomSceneButton?.addEventListener('click', pickRandomScene);

    // Transformation mode toggle
    const modeRadios = document.querySelectorAll('input[name="transform-mode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', handleModeChange);
    });

    // API key management
    document.getElementById('save-api-key')?.addEventListener('click', saveAPIKey);
    document.getElementById('clear-api-key')?.addEventListener('click', clearAPIKey);

    // Initialize API key section visibility
    updateAPIKeySection();
    loadSavedAPIKey();

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
    document.getElementById('load-saved-button')?.addEventListener('click', loadSavedSceneWithAlert);
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
    AppState.isFamousSceneMode = false;
    const demoDisplay = document.getElementById('demo-display');
    const sampleText = document.getElementById('sample-text');

    sampleText.textContent = AppState.sampleScene;
    demoDisplay.classList.remove('hidden');
    demoDisplay.classList.add('fade-in');

    // Set sample as current text and enable transformation
    AppState.currentText = AppState.sampleScene;
    showSection('genre-section', true);

    // Scroll to genre section with slight delay for better UX
    setTimeout(() => {
        document.getElementById('genre-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
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
async function performTransformation(genreKey) {
    // Check which mode is selected
    const mode = document.querySelector('input[name="transform-mode"]:checked')?.value || 'rules';

    // Show loading state
    const transformationSection = document.getElementById('transformation-section');
    transformationSection.classList.add('loading');

    try {
        let result;

        if (mode === 'ai') {
            // Use AI transformation
            if (!aiTransformer.hasAPIKey()) {
                alert('Please add your Claude API key to use AI-powered transformations.');
                transformationSection.classList.remove('loading');
                return;
            }

            const genreInfo = AppState.teachingContent?.genres[genreKey];
            result = await aiTransformer.transform(AppState.currentText, genreKey, genreInfo);
        } else {
            // Use rule-based transformation
            result = transformer.transform(AppState.currentText, genreKey);
        }

        AppState.currentTransformation = result;

        // Update transformation section
        displayTransformation(genreKey, result);

        // Show transformation section
        showSection('transformation-section', true);

        // Scroll to transformation
        setTimeout(() => {
            document.getElementById('transformation-section').scrollIntoView({ behavior: 'smooth' });
        }, 100);

    } catch (error) {
        console.error('Transformation error:', error);
        alert(`Transformation failed: ${error.message}`);
    } finally {
        transformationSection.classList.remove('loading');
    }
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
 * Handle famous genre selection
 */
function handleFamousGenreSelect(e) {
    const genreKey = e.target.value;
    if (!genreKey || !AppState.famousScenes) return;

    const scenes = AppState.famousScenes[genreKey];
    if (!scenes) return;

    displayFamousScenes(scenes, genreKey);
}

/**
 * Display famous scenes for a genre
 */
function displayFamousScenes(scenes, genreKey) {
    const scenesList = document.getElementById('famous-scenes-list');
    scenesList.innerHTML = '';

    scenes.forEach((scene, index) => {
        const card = document.createElement('div');
        card.className = 'scene-card';
        card.dataset.sceneIndex = index;
        card.dataset.genreKey = genreKey;

        card.innerHTML = `
            <div class="scene-card-header">
                <div>
                    <div class="scene-title">${scene.title}</div>
                    <div class="scene-meta">
                        <span class="scene-author">${scene.author}</span>
                        <span class="scene-type">${scene.type}</span>
                    </div>
                </div>
            </div>
            <div class="scene-excerpt">${scene.scene}</div>
            <button class="scene-select-button">Use This Scene</button>
        `;

        // Add click handler for the select button
        const selectButton = card.querySelector('.scene-select-button');
        selectButton.addEventListener('click', (e) => {
            e.stopPropagation();
            selectFamousScene(scene, card);
        });

        // Add click handler for the card
        card.addEventListener('click', () => {
            toggleSceneCardExpansion(card);
        });

        scenesList.appendChild(card);
    });

    scenesList.classList.remove('hidden');
    scenesList.classList.add('fade-in');
}

/**
 * Toggle scene card expansion
 */
function toggleSceneCardExpansion(card) {
    const wasSelected = card.classList.contains('selected');

    // Remove selected class from all cards
    document.querySelectorAll('.scene-card').forEach(c => {
        c.classList.remove('selected');
    });

    // Toggle this card
    if (!wasSelected) {
        card.classList.add('selected');
    }
}

/**
 * Select a famous scene for transformation
 */
function selectFamousScene(scene, card) {
    AppState.isFamousSceneMode = true;
    AppState.isDemoMode = false;
    AppState.currentText = scene.scene;

    // Highlight the selected card
    document.querySelectorAll('.scene-card').forEach(c => {
        c.classList.remove('selected');
    });
    card.classList.add('selected');

    // Show genre selection
    showSection('genre-section', true);

    // Scroll to genre section
    document.getElementById('genre-section').scrollIntoView({ behavior: 'smooth' });

    // Optional: Clear user's input field to avoid confusion
    document.getElementById('memoir-input').value = '';
    document.getElementById('char-counter').textContent = '0 / 300 words';
    document.getElementById('transform-button').disabled = true;
}

/**
 * Pick a random famous scene from all genres
 */
function pickRandomScene() {
    if (!AppState.famousScenes) return;

    // Get all genres
    const genres = Object.keys(AppState.famousScenes);
    if (genres.length === 0) return;

    // Pick random genre
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    const scenes = AppState.famousScenes[randomGenre];

    // Pick random scene from that genre
    const randomScene = scenes[Math.floor(Math.random() * scenes.length)];

    // Set it as current
    AppState.isFamousSceneMode = true;
    AppState.isDemoMode = false;
    AppState.currentText = randomScene.scene;

    // Update the selector to show which genre was selected
    const famousGenreSelect = document.getElementById('famous-genre-select');
    if (famousGenreSelect) {
        famousGenreSelect.value = randomGenre;
    }

    // Display the scenes for that genre
    displayFamousScenes(scenes, randomGenre);

    // Highlight the selected scene
    setTimeout(() => {
        const cards = document.querySelectorAll('.scene-card');
        const selectedIndex = scenes.indexOf(randomScene);
        if (cards[selectedIndex]) {
            cards[selectedIndex].classList.add('selected');
            cards[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);

    // Show genre selection
    showSection('genre-section', true);

    // Scroll to genre section
    setTimeout(() => {
        document.getElementById('genre-section').scrollIntoView({ behavior: 'smooth' });
    }, 500);

    // Clear user's input field
    document.getElementById('memoir-input').value = '';
    document.getElementById('char-counter').textContent = '0 / 300 words';
    document.getElementById('transform-button').disabled = true;
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
 * Load saved scene from localStorage (with alert)
 */
function loadSavedSceneWithAlert() {
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

/**
 * Handle transformation mode change
 */
function handleModeChange(e) {
    updateAPIKeySection();
}

/**
 * Update API key section visibility based on selected mode
 */
function updateAPIKeySection() {
    const mode = document.querySelector('input[name="transform-mode"]:checked')?.value;
    const apiKeySection = document.getElementById('api-key-section');

    if (mode === 'ai') {
        apiKeySection.classList.remove('hidden');
    } else {
        apiKeySection.classList.add('hidden');
    }
}

/**
 * Load saved API key into input field
 */
function loadSavedAPIKey() {
    if (aiTransformer.hasAPIKey()) {
        const apiKeyInput = document.getElementById('api-key-input');
        if (apiKeyInput) {
            apiKeyInput.value = aiTransformer.apiKey;
        }
    }
}

/**
 * Save API key
 */
function saveAPIKey() {
    const apiKeyInput = document.getElementById('api-key-input');
    const key = apiKeyInput?.value.trim();

    if (!key) {
        alert('Please enter an API key.');
        return;
    }

    if (!key.startsWith('sk-ant-')) {
        alert('Invalid API key format. Claude API keys start with "sk-ant-"');
        return;
    }

    if (aiTransformer.saveAPIKey(key)) {
        alert('API key saved successfully!');
    } else {
        alert('Error saving API key. Please try again.');
    }
}

/**
 * Clear API key
 */
function clearAPIKey() {
    if (confirm('Are you sure you want to clear your API key?')) {
        if (aiTransformer.clearAPIKey()) {
            const apiKeyInput = document.getElementById('api-key-input');
            if (apiKeyInput) {
                apiKeyInput.value = '';
            }
            alert('API key cleared.');
        } else {
            alert('Error clearing API key.');
        }
    }
}
