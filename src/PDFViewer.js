import React, { useEffect, useState } from 'react';

function AdobePDFViewer({ 
  pdfUrl = "/mypdf.pdf", 
  clientId = "e45ea6964465450fbc12e9a8329542d4", 
  divId = 'adobe-dc-view',
  height = '600px',
  width = '100%'
}) {
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

          dcView.previewFile({
            content: { location: { url: pdfUrl } },
            metaData: { fileName: pdfUrl, id: "77c6fa5d-6d74-4104-8349-657c8411a834" }
          }, {
            enableAnnotationAPIs: true,
            enableFormFilling: true,  // Ensure form filling is enabled
            showSaveButton: true,     // Enable Save button
          });

          // Wait for the form fields to be ready
          dcView.getFormFieldManager().then((formFieldManager) => {
            // Button click listener for saving form data
            document.getElementById("customSaveButton").addEventListener("click", () => {
              try {
                setTimeout(() => {
                  formFieldManager.getFieldValues().then((formData) => {
                    console.log("Form Data:", formData);
                    // Send form data to backend or perform further processing
                  }).catch(error => {
                    console.error("Error fetching form data:", error);
                  });
                }, 5000); // Adjust timeout as needed
              } catch (error) {
                console.error("Error during form data capture:", error);
              }
            });
          }).catch(error => {
            console.error("Error accessing form field manager:", error);
          });

          setFileRef(dcView);  // Save the reference to the Adobe DC View
        }
      });
    };

    // Cleanup function to remove the script after the component is unmounted
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
        id="customSaveButton"
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
