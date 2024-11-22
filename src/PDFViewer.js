 import React, { useEffect, useState } from "react";

const PDFBase64Viewer = () => {
  const urlToPDF = "/mypdf.pdf";
  const clientId = "e45ea6964465450fbc12e9a8329542d4";
  const viewerOptions = {
    embedMode: "FULL_WINDOW",
    defaultViewMode: "FIT_PAGE",
    showDownloadPDF: false,
    showPrintPDF: true,
    showLeftHandPanel: false,
    showAnnotationTools: false,
  };
  const saveOptions = {
    autoSaveFrequency: 1,
    enableFocusPolling: true,
    showSaveButton: false,
  };

  const [savedPDFContent, setSavedPDFContent] = useState(null);

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

  useEffect(() => {
    const initializeAdobeViewer = () => {
      const adobeDCView = new window.AdobeDC.View({
        clientId,
        divId: "embeddedView",
      });

      // Register Save Callback
      adobeDCView.registerCallback(
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
      adobeDCView.previewFile(
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
      <div
        style={{
          minHeight: "46px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "5px",
          backgroundColor: "crimson",
        }}
      >
        <p style={{ fontSize: "9pt", paddingRight: "10px", margin: "5px", color: "white" }}>
          Clicking Submit will convert the ArrayBuffer of the PDF file content into a base64 string and then use that in
          a data URL to download the file. In practice, you would replace this function with one that submits the
          base64 content to another process where it can be converted back to a binary PDF.
        </p>
        <button
          onClick={handleSubmitClick}
          style={{
            backgroundColor: "darkred",
            height: "100%",
            padding: "0 20px",
            borderRadius: "5px",
            color: "white",
            fontWeight: "bold",
            marginRight: "6px",
            border: "1px solid white",
            maxHeight: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
      <div id="embeddedView" style={{ flexGrow: 1 }}></div>
    </div>
  );
};

export default PDFBase64Viewer;
