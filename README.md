# The Anatomy of a Memoir: Genre as Lens

An interactive educational website that teaches how genre conventions shape storytelling by transforming memoir scenes through different genre lenses.

## About

This tool helps writers understand genre as a craft element by showing how the same memoir scene transforms when told through different genre conventions. Upload a short memoir scene (50-300 words) and see it transformed into Noir, Thriller, Romance, Literary Fiction, Horror, Science Fiction, Mystery, or Magical Realism—each with detailed annotations explaining the craft choices.

## Features

- **Interactive Genre Transformations**: Apply 8 different genre lenses to your memoir scenes
- **Craft Annotations**: Expandable sections explaining changes to voice, pacing, sensory details, structure, and theme
- **Teaching Integration**: Contextual educational content explaining how each genre works
- **Demo Mode**: Try the tool with a sample scene before using your own writing
- **PDF Export**: Download transformations with annotations
- **Auto-Save**: Work is automatically saved to browser localStorage
- **Animated Interface**: Subtle P5.js animations with gem-tone palette

## Genre Lenses

1. **Noir** - Shadowy and cynical
2. **Thriller** - Urgent and suspenseful
3. **Romance** - Emotional and sensory
4. **Literary Fiction** - Lyrical and introspective
5. **Horror** - Visceral and unsettling
6. **Science Fiction** - Speculative and precise
7. **Mystery** - Observant and questioning
8. **Magical Realism** - Mundane meets extraordinary

## Technology Stack

- **HTML/CSS/JavaScript** - Static site, no build process required
- **P5.js** - Animated background and transitions
- **jsPDF** - PDF export functionality
- **localStorage** - Client-side data persistence

## Usage

1. Visit the website
2. (Optional) Click "Try the Demo" to see how transformations work
3. Paste or type your memoir scene (50-300 words)
4. Click "Transform My Scene"
5. Select a genre lens to apply
6. Explore the transformation and annotations
7. Download as PDF or save to browser

## Local Development

No build process required. Simply open `index.html` in a web browser or serve with any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## File Structure

```
makemeamemoir/
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main styles with gem-tone palette
│   └── genres.css         # Genre-specific themes
├── js/
│   ├── app.js             # Main application orchestration
│   ├── genre-transformer.js    # Transformation engine
│   ├── annotations.js     # Annotation system
│   ├── storage.js         # localStorage management
│   └── pdf-export.js      # PDF generation
├── data/
│   ├── genres.json        # Genre transformation rules
│   ├── teaching-content.json   # Educational content
│   └── sample-scene.json  # Demo scene
└── assets/                # (Reserved for future assets)
```

## GitHub Pages Deployment

This site is configured for GitHub Pages deployment:

1. Push to GitHub repository
2. Go to repository Settings > Pages
3. Set Source to "Deploy from a branch"
4. Select branch (usually `main` or `gh-pages`)
5. Save and wait for deployment

The site will be available at: `https://[username].github.io/makemeamemoir/`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Requires localStorage for save functionality
- Internet connection needed for CDN libraries (P5.js, jsPDF)

## Educational Use

This tool is designed for:
- Creative writing courses
- Memoir writing workshops
- Self-directed learning about genre conventions
- Understanding craft elements in creative nonfiction

## License

MIT License - Feel free to use, modify, and distribute.

## Credits

Designed and developed as an educational tool for exploring genre as craft.
