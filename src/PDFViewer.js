import React, { useEffect } from "react";

const PdfViewer = ({ pdfUrl }) => {
  useEffect(() => {
    // Load the Adobe SDK script dynamically
    const script = document.createElement("script");
    script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
    script.onload = () => {
      // Wait for the SDK to be ready
      document.addEventListener("adobe_dc_view_sdk.ready", () => {
        const adobeDCView = new window.AdobeDC.View({
          clientId: "0ce32ffa0d67464397ee278a912258b0", // Replace with your API key
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

    document.body.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, [pdfUrl]);

  return <div id="adobe-pdf-viewer" style={{ height: "100vh" }} />;
};

export default PdfViewer;
