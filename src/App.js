import React from 'react';
import PDFViewer from './PDFViewer';

const App = () => {
  return<>
   <h1>Editable pdf</h1>
  <PDFViewer pdfUrl="/mypdf.pdf" />
  </>;
};

export default App;
