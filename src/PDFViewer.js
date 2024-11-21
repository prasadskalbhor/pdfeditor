

import React, { useEffect, useState } from 'react';

function AdobePDFViewer({ 
  pdfUrl="/mypdf.pdf", 
  clientId="9a095536ffbb48098fd84853ed513b83", 
  divId = 'adobe-dc-view',
  height = '600px',
  width = '100%'
}) {
  const [adobeDCView, setAdobeDCView] = useState(null);
  const [fileRef, setFileRef] = useState(null);

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
          dcView.registerCallback(
            window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
            (event) => {
              console.log('Form submitted:');

              if (event.type === 'SAVE') {
                alert('Form submitted successfully!');
              }
            },
            { enableFormFilling: true }
          );
          const fileReference = dcView.previewFile({
            content: { location: { url: pdfUrl } },
            metaData: { fileName: pdfUrl }
          }, {
            // Additional configuration options can be added here
            showAnnotationTools: false,
            dockPageControls: false,
            
            embedMode: "FULL_WINDOW",
            defaultViewMode: "FIT_PAGE",
            // enableLinearization: true,
            showDownloadPDF: true,
            // showPrintPDF: true,
            showLeftHandPanel: false,
            // showAnnotationTools: false,
            // enableFormFilling: true,
            // enableAnnotationAPIs: true,
            // includePDFAnnotations: true,
            showPageControls: false,
            // showZoomControl: true,
            // showRotateControl: false,
            // disableTextSelection: true,
            // annotationManagerEditMode: "READ",
            // showBookmarks:false,
            // showThumbnails:false,
          });
        
          // Store the Adobe DC View and file reference
          setAdobeDCView(dcView);
          setFileRef(fileReference);
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
    if (adobeDCView && fileRef) {
      try {
        adobeDCView.saveAs({
          url: pdfUrl,
          fileName: 'downloaded.pdf'
        });
      } catch (error) {
        console.error("Error saving PDF:", error);
        alert("Unable to save PDF. Please try again.");
      }
    } else {
      console.error("Adobe DC View or File Reference not initialized");
      alert("PDF viewer is not ready. Please wait and try again.");
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