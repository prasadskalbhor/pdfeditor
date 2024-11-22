import React, { useEffect, useState } from "react";

function AdobePDFViewer({
  pdfUrl = "/mypdf.pdf",
  clientId = "e45ea6964465450fbc12e9a8329542d4",
  divId = "adobe-dc-view",
  height = "600px",
  width = "100%",
}) {
  const [adobeDCView, setAdobeDCView] = useState(null);

  useEffect(() => {
    // Dynamically load Adobe View SDK
    const script = document.createElement("script");
    script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Wait for Adobe SDK to be ready
      document.addEventListener("adobe_dc_view_sdk.ready", () => {
        if (window.AdobeDC && window.AdobeDC.View) {
          const dcView = new window.AdobeDC.View({
            clientId: clientId,
            divId: divId,
          });

          // Preview the file
          dcView.previewFile(
            {
              content: { location: { url: pdfUrl } },
              metaData: {
                fileName: pdfUrl,
                id: "77c6fa5d-6d74-4104-8349-657c8411a834", // Unique file ID
              },
            },
            {
              enableAnnotationAPIs: true, // Enable annotation and save functionality
              enableFormFilling: true, // Ensure form filling is enabled
              showSaveButton: true, // Enable Save button
            }
          );

          // Register Save Event Callback
          dcView.registerCallback(
            window.AdobeDC.View.Enum.Events.DOCUMENT_SAVE,
            async (event) => {
              console.log("Save event triggered!");
              try {
                // Retrieve the updated PDF as a Blob
                const pdfBlob = await event.download();
                console.log("PDF Blob:", pdfBlob);

                // Example: Trigger a download
                const url = URL.createObjectURL(pdfBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "edited_document.pdf";
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
              } catch (error) {
                console.error("Error fetching updated PDF:", error);
              }
            }
          );

          setAdobeDCView(dcView);
        }
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [pdfUrl, clientId, divId]);

  return (
    <div>
      {/* Adobe PDF Viewer */}
      <div
        id={divId}
        style={{
          width: width,
          height: height,
        }}
      />
    </div>
  );
}

export default AdobePDFViewer;
