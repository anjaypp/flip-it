import React, { useState } from 'react';
import axios from 'axios';

const EbookPreview = ({ bookId }) => {
  const [preview, setPreview] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [previewPages, setPreviewPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEbookPreview = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch the book data by book ID
      const bookResponse = await axios.get(`/api/books/${bookId}`);
      const { bookFile } = bookResponse.data;

      // Fetch the ebook preview from backend
      const previewResponse = await axios.post('/api/ebooks/preview', {
        ebookUrl: bookFile.url,
      });

      // Update states with preview data
      setPreview(previewResponse.data.preview);
      setTotalPages(previewResponse.data.totalPages);
      setPreviewPages(previewResponse.data.previewPages);
    } catch (err) {
      setError('Failed to load ebook preview');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (loading) return <p>Loading preview...</p>;
    if (error) return <p className="error">{error}</p>;

    if (preview) {
      return (
        <div className="ebook-preview">
          <embed
            src={`data:application/pdf;base64,${preview}`}
            type="application/pdf"
            width="100%"
            height="600px"
          />
          <div className="preview-info">
            <p>Preview: {previewPages} of {totalPages} pages</p>
            <p>Full book access requires purchase</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="ebook-preview-container">
      <button onClick={fetchEbookPreview} disabled={loading}>
        {loading ? 'Loading...' : 'View Ebook Preview'}
      </button>
      {renderPreview()}
    </div>
  );
};

export default EbookPreview;
