# Project Plan: "The Anatomy of a Memoir: Genre as Lens"

## Overview
A static educational website for GitHub Pages that transforms memoir scenes through 8 genre lenses with craft annotations and PDF export.

## File Structure
```
makemeamemoir/
├── index.html
├── css/
│   ├── style.css (main styles, gem-tone palette)
│   └── genres.css (genre-specific visual themes)
├── js/
│   ├── app.js (main application orchestration)
│   ├── genre-transformer.js (transformation engine)
│   ├── annotations.js (annotation system)
│   ├── storage.js (localStorage management)
│   └── pdf-export.js (PDF generation)
├── lib/
│   ├── p5.min.js
│   └── jspdf.umd.min.js
├── data/
│   ├── genres.json (genre rules & templates)
│   ├── teaching-content.json (educational content)
│   └── sample-scene.json (universal demo scene)
├── assets/
│   └── (any icons or images needed)
├── README.md
└── CLAUDE.md
```

## Core Features

### 1. Teaching Integration
- Collapsible "How Genre Works" overview section
- Contextual teaching tips with each genre transformation
- Explains: voice, pacing, sensory details, metaphor usage, sentence structure

### 2. Demo Section
- One universal sample memoir scene (150 words)
- "Try the Demo" functionality
- Shows all 8 genres with sample

### 3. Text Input Interface
- Textarea for paste/type (50-300 word validation)
- Character counter
- Clear instructions
- Load previously saved scenes from localStorage

### 4. Genre Filter Gallery
- 8 genre buttons: Noir, Thriller, Romance, Literary Fiction, Horror, Sci-Fi, Mystery, Magical Realism
- Visual, gem-toned design
- Active state indication

### 5. Transformation Display
- Side-by-side comparison (Original | Transformed)
- P5.js animated transitions
- Highlighted differences

### 6. Annotation System
- Expandable sections below transformation
- Categories: Voice, Pacing, Sensory Details, Structure, Theme/Emphasis
- Color-coded highlights
- "Show All" / "Hide All" controls

### 7. Export & Save
- Auto-save to localStorage
- Download current transformation as PDF
- Copy to clipboard
- Clear/Reset function

## Transformation Engine (Hybrid Approach)

### Pattern-Based Rules for Each Genre:

**Noir**
- Short, clipped sentences
- Cynical metaphors
- Shadow/light imagery
- Fatalistic tone
- Detective-style observations

**Thriller**
- Urgent pacing
- Active verbs
- Time pressure
- Fragmented thoughts
- Suspenseful details

**Romance**
- Emotional interiority
- Sensory warmth
- Longer flowing sentences
- Connection/longing themes
- Heightened emotions

**Literary Fiction**
- Lyrical language
- Deep introspection
- Complex metaphors
- Philosophical undertones
- Nuanced observations

**Horror**
- Visceral details
- Mounting dread
- Isolation themes
- Unsettling imagery
- Body/fear focus

**Sci-Fi**
- Clinical precision
- Technology metaphors
- Speculative elements
- Future/alternate perspective
- Scientific language

**Mystery**
- Clues/details emphasized
- Questioning tone
- Observational distance
- Puzzle-like structure
- Investigative focus

**Magical Realism**
- Mundane + extraordinary blend
- Matter-of-fact supernatural
- Cultural/folkloric elements
- Dreamlike quality
- Dual reality acceptance

## Visual Design (Gem-Tone Palette)

### Color Scheme
- Deep Emerald (#2d5a4a)
- Sapphire Blue (#1a4b7c)
- Ruby Red (#8b2635)
- Amethyst Purple (#6b4c7a)
- Topaz Gold (#b8860b)
- Pearl White (#f8f8f0)
- Onyx Black (#1a1a1a)

### Design Principles
- Clean, minimalist layout
- Excellent readability (serif for text, sans-serif for UI)
- Generous whitespace
- Smooth P5.js transitions
- Responsive design

## P5.js Animation Features
- Genre switch: crossfade transitions
- Text highlighting: pulse/glow effects
- Annotation expansion: smooth slide animations
- Loading states: subtle effects
- Background: subtle gem-like shimmer

## Implementation Phases

### Phase 1: Foundation
- Set up project structure
- Create HTML skeleton
- Implement gem-tone CSS framework
- Set up P5.js canvas integration

### Phase 2: Data & Content
- Write universal sample scene
- Create genre transformation rules
- Write teaching content
- Build annotation templates

### Phase 3: Core Functionality
- Build text input interface
- Implement localStorage system
- Create transformation engine
- Develop side-by-side comparison view

### Phase 4: Interactivity
- Add P5.js animations
- Implement expandable annotations
- Create genre selector interface
- Add highlighting system

### Phase 5: Export & Polish
- Implement PDF export
- Add copy-to-clipboard
- Refine responsive design
- Test all transformations

### Phase 6: Deployment
- Configure for GitHub Pages
- Update README
- Update CLAUDE.md
- Final testing

## Technical Specifications

### Transformation Complexity
~20-25 changes per genre including:
- Vocabulary substitutions
- Sentence restructuring
- Pacing adjustments
- Detail emphasis shifts
- Tone modifications

### PDF Export
- Includes currently selected transformation
- Formatted with original + transformed text
- Includes annotations
- Clean, readable layout

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- localStorage required
