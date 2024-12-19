const PDFDocument = require('pdf-lib').PDFDocument;
const EPub = require('epub-parse');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class EbookPreviewHandler {
  static async generatePreview(ebookUrl, fileType) {
    try {
      // Fetch the ebook file
      const response = await axios({
        method: 'get',
        url: ebookUrl,
        responseType: 'arraybuffer'
      });

      // Determine preview generation based on file type
      switch(fileType.toLowerCase()) {
        case 'pdf':
          return await this.generatePDFPreview(response.data);
        case 'epub':
          return await this.generateEPUBPreview(response.data);
        default:
          throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('Ebook preview generation error:', error);
      throw error;
    }
  }

  static async generatePDFPreview(pdfBuffer) {
    // PDF Preview Logic
    const originalPdf = await PDFDocument.load(pdfBuffer);
    const previewPdf = await PDFDocument.create();

    // Copy only the first 15 pages (or total pages if less than 15)
    const pageCount = Math.min(originalPdf.getPageCount(), 15);
    
    for (let i = 0; i < pageCount; i++) {
      const [copiedPage] = await previewPdf.copyPages(originalPdf, [i]);
      previewPdf.addPage(copiedPage);
    }

    // Serialize the preview PDF
    const pdfBytes = await previewPdf.save();

    return {
      preview: Buffer.from(pdfBytes).toString('base64'),
      totalPages: originalPdf.getPageCount(),
      previewPages: pageCount
    };
  }

  static async generateEPUBPreview(epubBuffer) {
    // Create a temporary file to parse the EPUB
    const tempFilePath = path.join(__dirname, `temp-${Date.now()}.epub`);
    
    try {
      // Write buffer to temporary file
      fs.writeFileSync(tempFilePath, epubBuffer);

      // Parse EPUB
      const epub = await EPub.parseEpub(tempFilePath);

      // Extract first 15 sections/chapters
      const previewSections = epub.sections.slice(0, 15);
      
      // Create a new EPUB with preview sections
      const previewEpub = {
        metadata: epub.metadata,
        sections: previewSections
      };

      // Convert preview to base64
      const previewBuffer = Buffer.from(JSON.stringify(previewEpub));

      return {
        preview: previewBuffer.toString('base64'),
        totalChapters: epub.sections.length,
        previewChapters: previewSections.length
      };
    } finally {
      // Clean up temporary file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }
}

module.exports = EbookPreviewHandler;