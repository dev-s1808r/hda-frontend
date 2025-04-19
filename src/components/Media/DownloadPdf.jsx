import React, { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import sanitizeHtml from "sanitize-html";
import { Button } from "@mui/material";

const MarkdownRenderer = ({ formData }) => {
  const pdfRef = useRef();

  const generatePDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("markdown-content.pdf");
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div ref={pdfRef}>
        {formData?.timeStamp?.map((time, index) => {
          const cleanMarkdown = sanitizeHtml(time.content, {
            allowedTags: [], // Remove all HTML tags
            allowedAttributes: {}, // Remove all attributes
          });

          return (
            <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
              {cleanMarkdown}
            </ReactMarkdown>
          );
        })}
      </div>
      <Button
        onClick={generatePDF}
        style={{ marginTop: "10px" }}
        variant="outlined"
        disabled={formData?.timeStamp?.length === 0}
      >
        Download transcription as PDF
      </Button>
    </div>
  );
};

export default MarkdownRenderer;
