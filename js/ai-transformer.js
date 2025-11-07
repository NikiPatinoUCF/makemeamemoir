/**
 * AI-Powered Transformation using Claude API
 * Handles API key management and Claude API calls
 */

class AITransformer {
    constructor() {
        this.apiKey = null;
        this.API_KEY_STORAGE = 'makemeamemoir_claude_api_key';
        this.CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
        this.MODEL = 'claude-3-5-sonnet-20241022';
        this.loadAPIKey();
    }

    /**
     * Load API key from localStorage
     */
    loadAPIKey() {
        try {
            this.apiKey = localStorage.getItem(this.API_KEY_STORAGE);
            return this.apiKey !== null;
        } catch (error) {
            console.error('Error loading API key:', error);
            return false;
        }
    }

    /**
     * Save API key to localStorage
     * @param {string} key - The API key
     */
    saveAPIKey(key) {
        try {
            this.apiKey = key.trim();
            localStorage.setItem(this.API_KEY_STORAGE, this.apiKey);
            return true;
        } catch (error) {
            console.error('Error saving API key:', error);
            return false;
        }
    }

    /**
     * Clear API key from localStorage
     */
    clearAPIKey() {
        try {
            this.apiKey = null;
            localStorage.removeItem(this.API_KEY_STORAGE);
            return true;
        } catch (error) {
            console.error('Error clearing API key:', error);
            return false;
        }
    }

    /**
     * Check if API key is configured
     * @returns {boolean}
     */
    hasAPIKey() {
        return this.apiKey !== null && this.apiKey.length > 0;
    }

    /**
     * Transform text using Claude API
     * @param {string} text - Original memoir text
     * @param {string} genreKey - Genre identifier
     * @param {Object} genreInfo - Genre information from teaching content
     * @returns {Promise<Object>} Transformed text and metadata
     */
    async transform(text, genreKey, genreInfo) {
        if (!this.hasAPIKey()) {
            throw new Error('API key not configured. Please add your Claude API key.');
        }

        const prompt = this.buildPrompt(text, genreKey, genreInfo);

        try {
            const response = await fetch(this.CLAUDE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    max_tokens: 2048,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
            }

            const data = await response.json();
            const transformedText = data.content[0].text;

            return {
                text: transformedText,
                changes: this.extractChanges(text, transformedText),
                annotations: this.generateAIAnnotations(genreKey, genreInfo)
            };

        } catch (error) {
            console.error('AI transformation error:', error);
            throw error;
        }
    }

    /**
     * Build the prompt for Claude
     */
    buildPrompt(text, genreKey, genreInfo) {
        const genreName = genreInfo?.name || genreKey;
        const genreDesc = genreInfo?.teachingPoint || '';

        return `You are an expert creative writing instructor specializing in genre conventions. Transform the following memoir scene to read as ${genreName}.

ORIGINAL MEMOIR SCENE:
${text}

TRANSFORMATION INSTRUCTIONS:
${genreDesc}

Transform this scene to embody ${genreName} conventions while preserving the core events and meaning. Focus on:
- Voice and tone appropriate to ${genreName}
- Pacing and rhythm (sentence structure, paragraph flow)
- Sensory details emphasized in ${genreName}
- Metaphors and imagery typical of the genre
- What gets emphasized vs. minimized

Provide ONLY the transformed text. Do not include explanations or meta-commentary. Write the scene as it would appear in a published ${genreName} work.`;
    }

    /**
     * Extract changes between original and transformed text
     */
    extractChanges(original, transformed) {
        // Simple change tracking - in a real implementation you might use diff algorithms
        const changes = [];

        // Count sentence differences
        const origSentences = original.match(/[^.!?]+[.!?]+/g) || [];
        const transSentences = transformed.match(/[^.!?]+[.!?]+/g) || [];

        if (origSentences.length !== transSentences.length) {
            changes.push({
                type: 'structure',
                change: 'sentence count changed',
                reason: 'pacing adjustment'
            });
        }

        // Count word differences
        const origWords = original.split(/\s+/).length;
        const transWords = transformed.split(/\s+/).length;
        const wordDiff = Math.abs(origWords - transWords);

        if (wordDiff > 10) {
            changes.push({
                type: 'expansion',
                change: `${wordDiff} words ${transWords > origWords ? 'added' : 'removed'}`,
                reason: 'genre conventions'
            });
        }

        return changes;
    }

    /**
     * Generate annotations for AI-transformed text
     */
    generateAIAnnotations(genreKey, genreInfo) {
        const annotations = {
            voice: [
                `AI-powered transformation applied ${genreInfo?.name || genreKey} voice conventions`,
                'Vocabulary and tone adjusted to match genre expectations'
            ],
            pacing: [
                'Sentence rhythm and paragraph structure adapted for genre pacing',
                'Narrative flow adjusted to genre-appropriate tempo'
            ],
            sensory: [
                `Sensory details emphasized according to ${genreInfo?.name || genreKey} traditions`,
                'Imagery and description aligned with genre expectations'
            ],
            structure: [
                'Syntax and sentence construction modified for genre effect',
                'Paragraph organization adjusted to genre standards'
            ],
            theme: [
                `Thematic emphasis shifted to ${genreInfo?.name || genreKey} priorities`,
                'Genre-specific elements brought to foreground'
            ]
        };

        return annotations;
    }
}
