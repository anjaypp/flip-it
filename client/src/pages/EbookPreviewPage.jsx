import React from 'react';
import EbookPreview from '../components/EbookPreview';
import { useParams } from 'react-router-dom';

const EbookPreviewPage = () => {
  const { bookId } = useParams(); // Fetch dynamic book ID from route params

  return (
    <div className="ebook-preview-page">
      <h1>Ebook Preview</h1>
      <EbookPreview bookId={bookId} />
    </div>
  );
};

export default EbookPreviewPage;
