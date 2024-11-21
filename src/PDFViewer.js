import React, { useEffect } from "react";

const PdfViewer = ({ pdfUrl }) => {
  useEffect(() => {
    // Dynamically load Adobe SDK
    const script = document.createElement("script");
    script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
    script.onload = () => {
      // Initialize Adobe Viewer after the script is loaded
      document.addEventListener("adobe_dc_view_sdk.ready", () => {
        const adobeDCView = new window.AdobeDC.View({
          clientId: "0ce32ffa0d67464397ee278a912258b0", // Replace with your Adobe API key
          divId: "adobe-pdf-viewer",
        });

        // Preview the PDF
        adobeDCView.previewFile(
          {
            content: { location: { url: pdfUrl } },
            metaData: { fileName: "Sample.pdf" },
          },
          {
            embedMode: "IN_LINE", // Options: 'IN_LINE', 'LIGHT_BOX', 'FULL_WINDOW'
          }
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
