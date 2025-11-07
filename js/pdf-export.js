/**
 * PDF Export Functionality
 * Exports transformations to PDF format
 */

class PDFExporter {
    constructor() {
        this.jsPDF = null;
    }

    /**
     * Initialize jsPDF
     */
    init() {
        // jsPDF is loaded globally from CDN
        this.jsPDF = window.jspdf?.jsPDF;
        return this.jsPDF !== null;
    }

    /**
     * Export a transformation to PDF
     * @param {string} genreName - Name of the genre
     * @param {string} originalText - Original memoir text
     * @param {string} transformedText - Transformed text
     * @param {Object} annotations - Annotation data
     */
    exportToPDF(genreName, originalText, transformedText, annotations) {
        if (!this.jsPDF) {
            if (!this.init()) {
                alert('PDF export is not available. Please check your internet connection.');
                return;
            }
        }

        try {
            const doc = new this.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'letter'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            let yPosition = margin;

            // Title
            doc.setFontSize(20);
            doc.setFont(undefined, 'bold');
            doc.text('The Anatomy of a Memoir', margin, yPosition);
            yPosition += 8;

            doc.setFontSize(14);
            doc.setTextColor(100);
            doc.text(`${genreName} Transformation`, margin, yPosition);
            yPosition += 15;

            // Original Text
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.setFont(undefined, 'bold');
            doc.text('Original:', margin, yPosition);
            yPosition += 7;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            const originalLines = doc.splitTextToSize(originalText, contentWidth);
            doc.text(originalLines, margin, yPosition);
            yPosition += (originalLines.length * 5) + 10;

            // Check if we need a new page
            if (yPosition > pageHeight - 50) {
                doc.addPage();
                yPosition = margin;
            }

            // Transformed Text
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`${genreName}:`, margin, yPosition);
            yPosition += 7;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            // Remove HTML tags from transformed text
            const cleanTransformedText = transformedText.replace(/<[^>]*>/g, '');
            const transformedLines = doc.splitTextToSize(cleanTransformedText, contentWidth);
            doc.text(transformedLines, margin, yPosition);
            yPosition += (transformedLines.length * 5) + 15;

            // Check if we need a new page for annotations
            if (yPosition > pageHeight - 60) {
                doc.addPage();
                yPosition = margin;
            }

            // Annotations
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Craft Annotations', margin, yPosition);
            yPosition += 10;

            const categories = [
                { key: 'voice', label: 'Voice & Tone' },
                { key: 'pacing', label: 'Pacing & Rhythm' },
                { key: 'sensory', label: 'Sensory Details' },
                { key: 'structure', label: 'Structure & Syntax' },
                { key: 'theme', label: 'Theme & Emphasis' }
            ];

            categories.forEach(category => {
                if (annotations[category.key] && annotations[category.key].length > 0) {
                    // Check if we need a new page
                    if (yPosition > pageHeight - 30) {
                        doc.addPage();
                        yPosition = margin;
                    }

                    doc.setFontSize(11);
                    doc.setFont(undefined, 'bold');
                    doc.text(category.label, margin, yPosition);
                    yPosition += 6;

                    doc.setFontSize(9);
                    doc.setFont(undefined, 'normal');

                    annotations[category.key].forEach(annotation => {
                        // Remove HTML tags
                        const cleanAnnotation = annotation.replace(/<[^>]*>/g, '');
                        const annotationLines = doc.splitTextToSize(`• ${cleanAnnotation}`, contentWidth - 5);

                        // Check if we need a new page
                        if (yPosition + (annotationLines.length * 4) > pageHeight - margin) {
                            doc.addPage();
                            yPosition = margin;
                        }

                        doc.text(annotationLines, margin + 3, yPosition);
                        yPosition += (annotationLines.length * 4) + 2;
                    });

                    yPosition += 5;
                }
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(
                    `Page ${i} of ${pageCount} • makemeamemoir`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }

            // Generate filename
            const filename = `memoir-${genreName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;

            // Save PDF
            doc.save(filename);

            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('An error occurred while generating the PDF. Please try again.');
            return false;
        }
    }
}
