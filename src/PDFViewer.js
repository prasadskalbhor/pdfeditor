

import React, { useEffect, useState } from 'react';

function AdobePDFViewer({ 
  pdfUrl="/mypdf.pdf", 
  clientId="e45ea6964465450fbc12e9a8329542d4", 
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
          console.log({ dcView });
          
          
        
          dcView.registerCallback(
            window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
           async function (event) {
              try {
                console.log("event triggered ");
                // Retrieve the updated PDF as a Blob
                // const pdfBlob = await event.download();
                // console.log("PDF Blob:", pdfBlob);

                // // Example: Trigger a download
                // const url = URL.createObjectURL(pdfBlob);
                // const a = document.createElement("a");
                // a.href = url;
                // a.download = "edited_document.pdf";
                // document.body.appendChild(a);
                // a.click();
                // URL.revokeObjectURL(url);
                // document.body.removeChild(a);
              } catch (error) {
                console.error("Error fetching updated PDF:", error);
              }
            },
            {
              enablePDFAnalytics: true, // Enables events like PAGE_ZOOM
            }
          );
          const fileReference = dcView.previewFile({
            content: { location: { url: pdfUrl } },
            metaData: { fileName: pdfUrl, 
              /* file ID */
             id: "77c6fa5d-6d74-4104-8349-657c8411a834" }
          }, {
            // embedMode: "SIZED_CONTAINER", // Options: FULL_WINDOW, SIZED_CONTAINER, IN_LINE
            enableAnnotationAPIs: true,  // Enable annotation and save functionality
            // showDownloadPDF: false,      // Hide default download button
            // showPrintPDF: false ,
            // Additional configuration options can be added here
            // showAnnotationTools: false,
            // dockPageControls: false,
            
            // embedMode: "FULL_WINDOW",
            // defaultViewMode: "FIT_PAGE",
            // enableLinearization: true,
            // showDownloadPDF: true,
            // showPrintPDF: true,
            // showLeftHandPanel: false,
            // showAnnotationTools: false,
            enableFormFilling: true, // Ensure form filling is enabled
            showSaveButton: true, // Enable Save button
            // enableAnnotationAPIs: true,
            // includePDFAnnotations: true,
            // showPageControls: false,
            // showZoomControl: true,
            // showRotateControl: false,
            // disableTextSelection: true,
            // annotationManagerEditMode: "READ",
            // showBookmarks:false,
            // showThumbnails:false,
          });
          document.getElementById("customSaveButton").addEventListener("click", () => {
            dcView.getAnnotationManager().then((annotationManager) => {
              console.log("Annotation Manager is ready:", annotationManager);
              annotationManager
                .save()
                .then((blob) => {
                  console.log("PDF Blob received from custom save:", blob);

                  // Perform further actions with the blob
                  // uploadPDFToServer(blob);
                })
                .catch((error) => {
                  console.error("Error during custom Save:", error);
                });
            });
          });
          // Store the Adobe DC View and file reference
          // setAdobeDCView(dcView);
          setFileRef(fileReference);
        }
      });
    };

    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, [pdfUrl, clientId, divId]);


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
      id='customSaveButton'
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