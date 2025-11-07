/**
 * Genre Transformer
 * Transforms memoir text through different genre lenses
 */

class GenreTransformer {
    constructor() {
        this.genreRules = null;
        this.originalText = '';
        this.changes = [];
    }

    /**
     * Load genre rules from JSON
     */
    async loadGenreRules() {
        try {
            const response = await fetch('data/genres.json');
            this.genreRules = await response.json();
            return true;
        } catch (error) {
            console.error('Error loading genre rules:', error);
            return false;
        }
    }

    /**
     * Transform text through a genre lens
     * @param {string} text - Original memoir text
     * @param {string} genreKey - Genre identifier
     * @returns {Object} Transformed text and metadata
     */
    transform(text, genreKey) {
        if (!this.genreRules || !this.genreRules[genreKey]) {
            console.error('Genre rules not loaded or invalid genre key');
            return { text: text, changes: [], annotations: {} };
        }

        this.originalText = text;
        this.changes = [];
        const rules = this.genreRules[genreKey];

        // Split into sentences
        let sentences = this.splitIntoSentences(text);

        // Apply transformations
        sentences = this.applyVocabularyChanges(sentences, rules);
        sentences = this.applySentenceStructure(sentences, rules);
        sentences = this.applyToneAdjustments(sentences, rules);
        sentences = this.applyAdjectiveEnhancements(sentences, rules);

        const transformedText = sentences.join(' ');

        return {
            text: transformedText,
            changes: this.changes,
            annotations: this.generateAnnotations(rules, genreKey)
        };
    }

    /**
     * Split text into sentences
     */
    splitIntoSentences(text) {
        return text.match(/[^.!?]+[.!?]+/g) || [text];
    }

    /**
     * Apply vocabulary replacements
     */
    applyVocabularyChanges(sentences, rules) {
        if (!rules.vocabularyReplacements) return sentences;

        return sentences.map(sentence => {
            let modified = sentence;
            const originalSentence = sentence;

            for (const [original, replacement] of Object.entries(rules.vocabularyReplacements)) {
                const regex = new RegExp(`\\b${original}\\b`, 'gi');
                if (regex.test(modified)) {
                    modified = modified.replace(regex, replacement);
                    this.changes.push({
                        type: 'vocabulary',
                        original: original,
                        replacement: replacement,
                        sentence: originalSentence.trim()
                    });
                }
            }

            return modified;
        });
    }

    /**
     * Apply sentence structure changes based on genre
     */
    applySentenceStructure(sentences, rules) {
        if (!rules.sentencePatterns) return sentences;

        const style = rules.sentencePatterns.style;

        return sentences.map(sentence => {
            let modified = sentence.trim();

            switch (style) {
                case 'short':
                    // Break long sentences into shorter ones
                    if (modified.split(' ').length > 12) {
                        modified = this.shortenSentence(modified);
                        this.changes.push({
                            type: 'structure',
                            change: 'sentence shortened',
                            reason: 'noir pacing'
                        });
                    }
                    break;

                case 'fragmented':
                    // Create urgency with fragments
                    if (Math.random() > 0.6 && modified.includes(',')) {
                        modified = modified.replace(/,\s+/, '. ');
                        this.changes.push({
                            type: 'structure',
                            change: 'sentence fragmented',
                            reason: 'thriller urgency'
                        });
                    }
                    break;

                case 'flowing':
                    // Connect sentences with conjunctions
                    if (Math.random() > 0.5) {
                        modified = modified.replace(/\.\s*$/, ', and ');
                        this.changes.push({
                            type: 'structure',
                            change: 'sentences connected',
                            reason: 'romance flow'
                        });
                    }
                    break;

                case 'complex':
                    // Add complexity with clauses
                    if (Math.random() > 0.6) {
                        modified = this.addComplexity(modified);
                        this.changes.push({
                            type: 'structure',
                            change: 'complexity added',
                            reason: 'literary depth'
                        });
                    }
                    break;
            }

            return modified;
        });
    }

    /**
     * Apply tone adjustments
     */
    applyToneAdjustments(sentences, rules) {
        if (!rules.toneWords || rules.toneWords.length === 0) return sentences;

        // Add genre-specific tone markers to some sentences
        return sentences.map((sentence, index) => {
            if (index % 3 === 0 && Math.random() > 0.5) {
                const toneWord = rules.toneWords[Math.floor(Math.random() * rules.toneWords.length)];
                const modified = `${toneWord} ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
                this.changes.push({
                    type: 'tone',
                    addition: toneWord,
                    reason: 'genre voice'
                });
                return modified;
            }
            return sentence;
        });
    }

    /**
     * Apply adjective enhancements
     */
    applyAdjectiveEnhancements(sentences, rules) {
        if (!rules.adjectiveAdditions || rules.adjectiveAdditions.length === 0) return sentences;

        return sentences.map(sentence => {
            let modified = sentence;

            // Add adjectives before nouns (simple pattern matching)
            const nouns = ['kitchen', 'sugar', 'pot', 'sun', 'window', 'spoon', 'table',
                          'shoulders', 'clock', 'wall', 'counter', 'smile', 'eyes',
                          'smell', 'way', 'circles', 'fly', 'air', 'something'];

            nouns.forEach(noun => {
                const regex = new RegExp(`\\bthe ${noun}\\b`, 'gi');
                if (regex.test(modified) && Math.random() > 0.6) {
                    const adjective = rules.adjectiveAdditions[
                        Math.floor(Math.random() * rules.adjectiveAdditions.length)
                    ];
                    modified = modified.replace(regex, `the ${adjective} ${noun}`);
                    this.changes.push({
                        type: 'sensory',
                        addition: adjective,
                        noun: noun,
                        reason: 'genre atmosphere'
                    });
                }
            });

            return modified;
        });
    }

    /**
     * Helper: Shorten a sentence
     */
    shortenSentence(sentence) {
        const parts = sentence.split(',');
        if (parts.length > 1) {
            return parts[0] + '.';
        }
        const words = sentence.split(' ');
        if (words.length > 12) {
            return words.slice(0, 12).join(' ') + '.';
        }
        return sentence;
    }

    /**
     * Helper: Add complexity to a sentence
     */
    addComplexity(sentence) {
        const complexifiers = [
            ', perhaps,',
            ', in a way,',
            ', it seemed,',
            '—as if to say something—'
        ];
        const parts = sentence.split(' ');
        if (parts.length > 5) {
            const insertPoint = Math.floor(parts.length / 2);
            const complexifier = complexifiers[Math.floor(Math.random() * complexifiers.length)];
            parts.splice(insertPoint, 0, complexifier);
            return parts.join(' ');
        }
        return sentence;
    }

    /**
     * Generate annotations explaining the transformation
     */
    generateAnnotations(rules, genreKey) {
        const annotations = {
            voice: [],
            pacing: [],
            sensory: [],
            structure: [],
            theme: []
        };

        // Categorize changes
        this.changes.forEach(change => {
            switch (change.type) {
                case 'vocabulary':
                    annotations.voice.push(
                        `Changed "<strong>${change.original}</strong>" to "<strong>${change.replacement}</strong>" to match ${rules.name} voice`
                    );
                    break;

                case 'structure':
                    annotations.pacing.push(
                        `${change.change.charAt(0).toUpperCase() + change.change.slice(1)} for ${change.reason}`
                    );
                    break;

                case 'tone':
                    annotations.voice.push(
                        `Added "<strong>${change.addition}</strong>" to establish ${change.reason}`
                    );
                    break;

                case 'sensory':
                    annotations.sensory.push(
                        `Enhanced "<strong>${change.noun}</strong>" with "<strong>${change.addition}</strong>" for ${change.reason}`
                    );
                    break;
            }
        });

        // Add genre-specific structural notes
        annotations.structure.push(
            `Adjusted sentence structure to match ${rules.name} conventions: ${rules.sentencePatterns?.style || 'standard'} pacing`
        );

        // Add thematic emphasis
        annotations.theme.push(
            `Shifted emphasis to: ${rules.emphasisShift}`
        );

        return annotations;
    }

    /**
     * Get list of available genres
     */
    getAvailableGenres() {
        if (!this.genreRules) return [];
        return Object.keys(this.genreRules);
    }
}
