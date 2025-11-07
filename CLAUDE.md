# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Anatomy of a Memoir: Genre as Lens** is an educational web application that teaches how genre conventions shape storytelling. Users upload memoir scenes (50-300 words) and transform them through 8 different genre lenses (Noir, Thriller, Romance, Literary Fiction, Horror, Sci-Fi, Mystery, Magical Realism) with detailed craft annotations.

**Tech Stack**: Vanilla HTML/CSS/JavaScript, P5.js for animations, jsPDF for exports, localStorage for persistence. No build process required—pure static site suitable for GitHub Pages.

## Development Commands

### Local Development
```bash
# Serve locally with Python
python -m http.server 8000

# Or with Node.js
npx serve

# Or with PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### Testing
- Open `index.html` in browser
- Test all 8 genre transformations
- Verify PDF export works
- Check localStorage save/load
- Test responsive design on mobile

### Deployment
- Push to GitHub
- Enable GitHub Pages in repository settings
- Set source to main branch
- Site deploys automatically

## Architecture

### High-Level Structure

The application follows a modular JavaScript architecture with clear separation of concerns:

1. **app.js** - Main orchestrator, manages app state and coordinates all components
2. **genre-transformer.js** - Core transformation engine using hybrid rule-based system
3. **annotations.js** - Manages expandable annotation UI and highlighting
4. **storage.js** - localStorage wrapper for saving/loading scenes
5. **pdf-export.js** - Generates PDF exports using jsPDF

### Data Flow

```
User Input → Validation → Transform Engine → Display Results
                              ↓
                        Genre Rules (JSON)
                              ↓
                    Annotations + Highlights
```

### Key Design Patterns

**Rule-Based Transformation System**: Each genre has defined rules in `data/genres.json`:
- Vocabulary replacements (word substitutions)
- Adjective additions (atmosphere)
- Sentence patterns (pacing changes)
- Tone adjustments (voice markers)
- Emphasis shifts (thematic focus)

**Component-Based UI**: Each section is self-contained:
- Teaching Section (collapsible educational content)
- Demo Section (sample transformations)
- Input Section (text validation, word counting)
- Genre Gallery (8 genre cards)
- Transformation Display (side-by-side comparison)
- Annotations (expandable craft explanations)

**P5.js Integration**: Background canvas with gem-like particles that don't interfere with DOM interactions. Canvas is positioned fixed behind main content.

### State Management

Global `AppState` object tracks:
- `currentText` - User's memoir scene
- `currentGenre` - Selected genre key
- `currentTransformation` - Result object with text, changes, and annotations
- `sampleScene` - Demo scene text
- `teachingContent` - Educational content
- `isDemoMode` - Whether viewing demo or user's text

### localStorage Schema

```javascript
// Current working scene (auto-saved)
'makemeamemoir_current': string

// Saved scenes array
'makemeamemoir_scenes': [
  {
    id: timestamp,
    name: string,
    text: string,
    timestamp: ISO string,
    wordCount: number
  }
]
```

### Styling System

**Gem-Tone Palette** defined in CSS variables:
- Emerald (#2d5a4a) - Primary/Literary
- Sapphire (#1a4b7c) - Sci-Fi
- Ruby (#8b2635) - Thriller
- Amethyst (#6b4c7a) - Mystery/Annotations
- Topaz (#b8860b) - Teaching/Magical Realism
- Pearl (#f8f8f0) - Background
- Onyx (#1a1a1a) - Text/Noir

Each genre has custom colors in `genres.css` that apply to:
- Genre cards (border, background on hover/active)
- Transformation section border
- Text highlights

## File Organization

### Critical Files
- `index.html` - Single-page application structure
- `css/style.css` - Main styles with gem-tone palette, responsive design
- `css/genres.css` - Genre-specific color themes
- `js/app.js` - Application orchestration, event handling, UI updates
- `js/genre-transformer.js` - Transformation logic, rule application
- `js/annotations.js` - Annotation display, expand/collapse, highlighting
- `js/storage.js` - localStorage CRUD operations
- `js/pdf-export.js` - PDF generation with jsPDF

### Data Files (JSON)
- `data/genres.json` - Transformation rules for each genre
- `data/teaching-content.json` - Educational content and genre explanations
- `data/sample-scene.json` - Universal demo scene

## Common Development Tasks

### Adding a New Genre
1. Add entry to `data/genres.json` with transformation rules
2. Add teaching content to `data/teaching-content.json`
3. Add color scheme to `css/genres.css`
4. Add genre card to HTML `index.html` in genre gallery

### Modifying Transformation Logic
Edit `js/genre-transformer.js`:
- `applyVocabularyChanges()` - Word replacements
- `applySentenceStructure()` - Pacing changes
- `applyToneAdjustments()` - Voice markers
- `applyAdjectiveEnhancements()` - Atmospheric details

### Updating Styles
- Global styles: `css/style.css`
- Genre-specific colors: `css/genres.css`
- Use CSS variables from `:root` for consistency
- Maintain responsive breakpoints at 768px and 480px

### Testing Transformations
1. Open browser console
2. Check for errors during transformation
3. Verify annotations populate correctly
4. Test PDF export includes all content
5. Validate localStorage save/load

## External Dependencies

**CDN Libraries** (loaded in HTML):
- P5.js 1.7.0 (animations)
- jsPDF 2.5.1 (PDF export)

**Internet Required**: CDN libraries need internet connection. For offline version, download libraries and update script src paths.

## Notes

- No build process or bundling required
- All code is vanilla JavaScript (ES6+)
- Works on modern browsers with JavaScript enabled
- localStorage required for save functionality
- Responsive design optimized for mobile and tablet
