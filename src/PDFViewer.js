  import React, { useEffect, useState } from "react";
import { base64 } from "./base64";



const byteToBlob = () => {
  const base64str = base64 // decode base64 string, remove space for IE compatibility
  console.log("blob ")

  var binary = atob(base64str.replace(/\s/g, ''));
  var len = binary.length;
  console.log("blob 2")
  var buffer = new ArrayBuffer(len);
  console.log("blob 3")
  var view = new Uint8Array(buffer);
  console.log("blob 4")
  for (var i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }
  console.log("blob 5")

  // create the blob object with content-type "application/pdf"               
  var blob = new Blob([view], { type: "application/pdf" });
  console.log("blob 6")
  var url = URL.createObjectURL(blob);
  console.log("this is url ::: ", url)
  return blob;
}
const PDFBase64Viewer = () => {
  const urlToPDF = "/mypdf.pdf";
  const clientId = "e45ea6964465450fbc12e9a8329542d4";
  const viewerOptions = {
    embedMode: "FULL_WINDOW",
    defaultViewMode: "FIT_WIDTH",
    showDownloadPDF: false,
    showPrintPDF: false,
    showDownloadPDF: false,
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
      console.log("converting to blob:: 1")
      const pdfBlob = byteToBlob();
      console.log("converting to blob:: 2")
      // Load PDF into Viewer
      adobeDCView.previewFile(
        {
          content: {
            promise: Promise.resolve(pdfBlob), // Provide the Blob as a Promise
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
      <div id="embeddedView" style={{ flexGrow: 1, backgroundColor: 'red' }}></div>
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
  );
};

export default PDFBase64Viewer;
