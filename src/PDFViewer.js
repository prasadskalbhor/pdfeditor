import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui buttons

const PDFViewer = ({ pdfUrl }) => {
  const [adobeDCView, setAdobeDCView] = useState(null);
  const [pdfBytes, setPdfBytes] = useState(null);

  useEffect(() => {
    // Load the Adobe SDK script dynamically
    const script = document.createElement("script");
    script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
    script.async = true;

    script.onload = () => {
      // Wait for the SDK to be ready
      document.addEventListener("adobe_dc_view_sdk.ready", () => {
        // Create Adobe DC View instance
        const dcView = new window.AdobeDC.View({
          clientId: "0ce32ffa0d67464397ee278a912258b0", // Replace with your actual Client ID
          divId: "adobe-pdf-viewer",
        });

        setAdobeDCView(dcView);

        // Preview the PDF file with form filling enabled
        dcView.previewFile({
          content: { location: { url: pdfUrl } },
          metaData: { fileName: "Form.pdf" }
        }, { 
          embedMode: "IN_LINE", 
          enableFormFilling: true 
        });

        // Register callbacks for form interactions
        dcView.registerCallback(
          window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
          (event) => {
            // Handle different event types
            switch(event.type) {
              case "DOCUMENT_LOADED":
                console.log("PDF Document Loaded");
                break;
              case "SAVE":
                // When save is triggered, get the updated PDF bytes
                dcView.getDocumentBytes({
                  // Optional: specify content type if needed
                  contentType: "application/pdf"
                }).then((documentBytes) => {
                  // Set the PDF bytes in state
                  setPdfBytes(documentBytes);
                  console.log("Updated PDF Bytes:", documentBytes);
                }).catch((error) => {
                  console.error("Error getting document bytes:", error);
                });
                break;
            }
          },
          { 
            enableFormFilling: true 
          }
        );
      });
    };

    // Append script to document
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, [pdfUrl]);

  // Function to handle manual save and get PDF bytes
  const handleSavePdf = () => {
    if (adobeDCView) {
      adobeDCView.getDocumentBytes({
        contentType: "application/pdf"
      }).then((documentBytes) => {
        setPdfBytes(documentBytes);
        console.log("Manually Saved PDF Bytes:", documentBytes);
        
        // Optional: You can add additional logic here
        // For example, send bytes to a backend, download, etc.
        downloadPdf(documentBytes);
      }).catch((error) => {
        console.error("Error getting document bytes:", error);
      });
    }
  };

  // Optional: Download PDF function
  const downloadPdf = (pdfBytes) => {
    if (pdfBytes) {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'updated-form.pdf';
      link.click();
    }
  };

  return (
    <div className="flex flex-col">
      {/* PDF Viewer Container */}
      <div 
        id="adobe-pdf-viewer" 
        style={{ 
          width: '100%', 
          height: '70vh', 
          border: '1px solid #ccc' 
        }} 
      />
      
      {/* Save Button */}
      <div className="mt-4">
        <button 
          onClick={handleSavePdf}
          className="w-full"
        >
          Save PDF
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;