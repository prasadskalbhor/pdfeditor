import React, { useEffect, useState } from "react";

const PDFBase64Viewer = () => {
  const urlToPDF = "/mypdf.pdf";
  const clientId = "e45ea6964465450fbc12e9a8329542d4";
  const viewerOptions = {
    embedMode: "FULL_WINDOW",
    defaultViewMode: "FIT_WIDTH",
    showDownloadPDF: false,
    showPrintPDF: false,
    showLeftHandPanel: false,
    showAnnotationTools: false,
    showThumbnails: false,
    dockPageControls: false,
  };
  const saveOptions = {
    autoSaveFrequency: 1,
    enableFocusPolling: true,
    showSaveButton: false,
  };

  const [savedPDFContent, setSavedPDFContent] = useState(null);
  const [adobeDCView, setAdobeDCView] = useState(null);

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Handle Submit Button Click
  const handleSubmitClick = () => {
    if (savedPDFContent) {
      const base64PDF = arrayBufferToBase64(savedPDFContent);
      const fileURL = `data:application/pdf;base64,${base64PDF}`;
      window.open(fileURL, "_blank");
    } else {
      alert("No PDF content saved. Please try again.");
    }
  };

  // Handle Signature Placement
  const handleAddSignature = () => {
    if (adobeDCView) {
      const annotationConfig = {
        type: "SIGNATURE", // Annotation type
        rect: { x: 200, y: 300, width: 150, height: 50 }, // Coordinates for placement
        pageNumber: 1, // Page number to place the signature
      };

      adobeDCView.getAnnotationManager().then((manager) => {
        manager.addAnnotation(annotationConfig).then(() => {
          alert("Signature added successfully.");
        }).catch((error) => {
          console.error("Error adding signature:", error);
          alert("Failed to add signature.");
        });
      });
    } else {
      alert("Adobe Viewer not initialized.");
    }
  };

  useEffect(() => {
    const initializeAdobeViewer = () => {
      const adobeDC = new window.AdobeDC.View({
        clientId,
        divId: "embeddedView",
      });

      setAdobeDCView(adobeDC); // Save the AdobeDC instance for further use

      // Register Save Callback
      adobeDC.registerCallback(
        window.AdobeDC.View.Enum.CallbackType.SAVE_API,
        (metaData, content, options) => {
          setSavedPDFContent(content); // Store PDF content for download
          return new Promise((resolve) => {
            resolve({
              code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
              data: {
                metaData: { fileName: "Check_Request_Full.pdf" },
              },
            });
          });
        },
        saveOptions
      );

      // Load PDF into Viewer
      adobeDC.previewFile(
        {
          content: {
            location: { url: urlToPDF },
          },
          metaData: { fileName: "Check_Request_Full.pdf" },
        },
        viewerOptions
      );
    };

    // Wait for Adobe SDK to load
    if (window.AdobeDC) {
      initializeAdobeViewer();
    } else {
      document.addEventListener("adobe_dc_view_sdk.ready", initializeAdobeViewer);
    }

    return () => {
      document.removeEventListener("adobe_dc_view_sdk.ready", initializeAdobeViewer);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div id="embeddedView" style={{ flexGrow: 1, backgroundColor: "red" }}></div>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
        <button
          onClick={handleSubmitClick}
          style={{
            backgroundColor: "darkred",
            height: "50px",
            padding: "0 20px",
            borderRadius: "5px",
            color: "white",
            fontWeight: "bold",
            border: "1px solid white",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
        <button
          onClick={handleAddSignature}
          style={{
            backgroundColor: "darkblue",
            height: "50px",
            padding: "0 20px",
            borderRadius: "5px",
            color: "white",
            fontWeight: "bold",
            border: "1px solid white",
            cursor: "pointer",
          }}
        >
          Add Signature
        </button>
      </div>
    </div>
  );
};

export default PDFBase64Viewer;
