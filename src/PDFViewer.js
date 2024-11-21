import React, { useEffect } from "react";

const PdfViewer = ({ pdfUrl }) => {
  useEffect(() => {
    // Check if the Adobe SDK is already loaded
    if (!document.querySelector('script[src="https://acrobatservices.adobe.com/view-sdk/viewer.js"]')) {
      const script = document.createElement("script");
      script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
      script.onload = () => {
        initializeAdobeDCView(pdfUrl);
      };
      script.onerror = () => {
        console.error("Failed to load the Adobe View SDK.");
      };
      document.body.appendChild(script);
    } else if (window.AdobeDC) {
      initializeAdobeDCView(pdfUrl);
    }

    // Cleanup on component unmount
    return () => {
      const sdkScript = document.querySelector('script[src="https://acrobatservices.adobe.com/view-sdk/viewer.js"]');
      if (sdkScript) {
        document.body.removeChild(sdkScript);
      }
    };
  }, [pdfUrl]);

  const initializeAdobeDCView = (pdfUrl) => {
    document.addEventListener("adobe_dc_view_sdk.ready", () => {
      const adobeDCView = new window.AdobeDC.View({
        clientId: "9a095536ffbb48098fd84853ed513b83", // Replace with your API key
        divId: "adobe-pdf-viewer",
      });

      // Preview the PDF file
      adobeDCView.previewFile(
        {
          content: { location: { url: pdfUrl } },
          metaData: { fileName: "Sample.pdf" },
        },
        { embedMode: "IN_LINE", enableFormFilling: true }
      );

      // Register a callback for form submission
      adobeDCView.registerCallback(
        window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
        (event) => {
          if (event.type === "SAVE") {
            console.log("Form data submitted:", event.data);
            alert("Form submitted successfully!");
          }
        },
        { enableFormFilling: true }
      );
    });
  };

  return <div id="adobe-pdf-viewer" style={{ height: "100vh" }} />;
};

export default PdfViewer;
