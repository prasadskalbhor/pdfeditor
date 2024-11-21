// import React, { useEffect, useRef } from 'react';

// const PdfViewer = ({ pdfUrl }) => {
//   const adobeDivRef = useRef(null);
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = "https://documentcloud.adobe.com/view-sdk/main.js";
//     script.onload = () => {
//       console.log("AdobeDC script loaded.");
//     };
//     document.body.appendChild(script);
//   }, []);
  
//   useEffect(() => {
//     if (window.AdobeDC) {
//       const adobeDCView = new window.AdobeDC.View({
//         clientId: '0ce32ffa0d67464397ee278a912258b0', // Replace with your API key
//         divId: 'adobe-pdf-viewer',
//       });

//       adobeDCView.previewFile(
//         {
//           content: { location: { url: pdfUrl } },
//           metaData: { fileName: 'Sample.pdf' },
//         },
//         {
//           embedMode: 'IN_LINE',
//           enableFormFilling:true
//         }
//       );

//       // Optional: Add event handlers for form submissions
//       adobeDCView.registerCallback(
//         window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
//         (event) => {
//           if (event.type === 'SAVE') {
//             console.log('Form submitted:', event.data);
//             alert('Form submitted successfully!');
//           }
//         },
//         { enableFormFilling: true }
//       );


      

//     }
//   }, [pdfUrl]);

//   return <>
  
//   <div id="adobe-pdf-viewer" ref={adobeDivRef} style={{ height: '100vh' }} />;
//   </>
// };

// export default PdfViewer;
