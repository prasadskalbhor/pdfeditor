import React, { useEffect, useState } from 'react';

function AdobePDFViewer({ 
  pdfUrl="/mypdf.pdf", 
  clientId="9a095536ffbb48098fd84853ed513b83", 
  divId = 'adobe-dc-view',
  height = '600px',
  width = '100%'
}) {
  const [adobeDCView, setAdobeDCView] = useState(null);

  useEffect(() => {
    // Dynamically load Adobe View SDK
    const script = document.createElement('script');
    script.src = 'https://acrobatservices.adobe.com/view-sdk/viewer.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Wait for Adobe SDK to be ready
      document.addEventListener('adobe_dc_view_sdk.ready', () => {
        if (window.AdobeDC && window.AdobeDC.View) {
          const dcView = new window.AdobeDC.View({
            clientId: clientId,
            divId: divId
          });

          dcView.previewFile({
            content: { location: { url: pdfUrl } },
            metaData: { fileName: pdfUrl }
          }, {});

          // Store the Adobe DC View instance
          setAdobeDCView(dcView);
        }
      });
    };

    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, [pdfUrl, clientId, divId]);

  // Function to handle PDF save
  const handleSavePDF = () => {
    if (adobeDCView) {
      console.log("saving pdf now ...");
      adobeDCView.downloadPDF({
        fileName: "downloaded.pdf"
      });
    } else {
      console.error("Adobe DC View not initialized");
    }
  };

  return (
    <div>
      <div 
        id={divId}
        style={{
          width: width,
          height: height
        }}
      />
      <button 
        onClick={handleSavePDF}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Save PDF
      </button>
    </div>
  );
}

export default AdobePDFViewer;