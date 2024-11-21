import React, { useEffect, useRef, useState } from "react";

const PdfViewer = ({ pdfUrl }) => {
  const viewerRef = useRef(null);
  const [adobeView, setAdobeView] = useState(null);

  useEffect(() => {
    // Dynamically load Adobe DC View SDK
    const script = document.createElement("script");
    script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
    script.async = true;
    script.onload = initializeAdobeViewer;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [pdfUrl]);

  const initializeAdobeViewer = () => {
    // Wait for Adobe SDK to be ready
    document.addEventListener("adobe_dc_view_sdk.ready", () => {
      // Create Adobe DC View instance
      const config = {
        clientId: "0ce32ffa0d67464397ee278a912258b0", // Replace with your actual Client ID
        divId: "adobe-dc-view"
      };

      const view = new window.AdobeDC.View(config);

      // Render PDF with form filling enabled
      view.previewFile({
        content: { location: { url: pdfUrl } },
        metaData: { fileName: "document.pdf" }
      }, {
        embedMode: "IN_LINE",
        showDownloadPDF: false,
        showPrintPDF: false,
        enableFormFilling: true  // Critical for form interaction
      });

      // Store the view instance
      setAdobeView(view);
    });
  };

  const handleSavePdf = () => {
    if (!window.AdobeDC || !adobeView) {
      console.error("Adobe DC View is not initialized");
      return;
    }

    try {
      // Use the correct method to trigger save
      adobeView.save({
        autoClose: false,
        askForOverwrite: true
      }).then((res) => {
        console.log("PDF Saved:", res);
        // If you want to get the updated PDF bytes
        if (res.pdf) {
          console.log("Updated PDF Bytes:", res.pdf);
          // You can further process res.pdf here
        }
      }).catch((error) => {
        console.error("Save Error:", error);
      });
    } catch (error) {
      console.error("Save Attempt Error:", error);
    }
  };

  return (
    <div>
      {/* PDF Viewer Container */}
      <div 
        id="adobe-dc-view" 
        ref={viewerRef}
        style={{ 
          width: '100%', 
          height: '70vh', 
          border: '1px solid #ccc' 
        }} 
      />

      {/* Save Button */}
      <button 
        onClick={handleSavePdf}
        style={{ 
          marginTop: '10px', 
          padding: '10px 20px', 
          width: '100%' 
        }}
      >
        Save PDF
      </button>
    </div>
  );
};

export default PdfViewer;