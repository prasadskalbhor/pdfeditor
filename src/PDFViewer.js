import React, { useEffect } from 'react';

function AdobePDFViewer({ 
  pdfUrl="/mypdf.pdf", 
  clientId="9a095536ffbb48098fd84853ed513b83", 
  divId = 'adobe-dc-view',
  height = '600px',
  width = '100%'
}) {
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
          const adobeDCView = new window.AdobeDC.View({
            clientId: clientId,
            divId: divId
          });

          adobeDCView.previewFile({
            content: { location: { url: pdfUrl } },
            metaData: { fileName: pdfUrl }
          }, {});
        }
      });
    };

    // Cleanup function
    return () => {
      document.body.removeChild(script);
      // Remove any lingering event listeners if needed
    };
  }, [pdfUrl, clientId, divId]);

  return React.createElement('div', {
    id: divId,
    style: {
      width: width,
      height: height
    }
  });
}

export default AdobePDFViewer;