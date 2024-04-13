import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import jspdf from "jspdf";
import "jspdf-autotable";
import companyLogo from "../../assets/sidebar-logo.png";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";

const AnalysisRep = (props) => {
  const { newseries } = props;

  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [dataList, setDataList] = useState([]);

  const headers = newseries.map((item) => item.label);

  function generatePDF(tickets) {
    const doc = new jspdf();
    let tableRows = [];

    const convertSeriesToRows = (series) => {
      const maxDataLength = Math.max(...series.map((item) => item.data.length));
      const rows = [];

      for (let i = 0; i < maxDataLength; i++) {
        const rowData = series.map((item) => item.data[i] || 0);
        rows.push(rowData);
      }

      return rows;
    };

    tableRows = convertSeriesToRows(newseries);

    // newseries.forEach((data, index) => {
    //   const ticketData = [
    //     index + 1,
    //     data[index]
    //   ];
    //   tableRows.push(ticketData);
    // });

    const date = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const margin = 14;
    const logoWidth = 30;
    const logoHeight = 20;
    const maxWidth = 290;
    const textLines = doc.splitTextToSize(
      `This registry encapsulates crucial data such as individual identification tags, health status, reproductive history, and other pertinent details essential for effective farm management. With meticulous documentation and organization, this registry ensures optimal care and monitoring of the animals, facilitating informed decision-making processes and promoting the overall welfare and productivity of the livestock population.`,
      maxWidth
    );
    const textParagraph = textLines.join("\n");

    doc.addImage(
      companyLogo,
      "PNG",
      doc.internal.pageSize.width - margin - logoWidth,
      margin,
      logoWidth,
      logoHeight
    );

    doc
      .setFontSize(10)
      .setFont("helvetica")
      .text("Nevil Nutri Feeds Pvt.Ltd", margin, margin + 10);
    doc.text("No:241, Rdawana", margin, margin + 15);
    doc.text("Henagama Rd", margin, margin + 20);
    doc.text("Gampaha", margin, margin + 25);
    doc.text("Sri Lanka", margin, margin + 30);

    doc.setFontSize(10).text(`Date: ${date}`, margin, margin + 35);

    doc
      .setFontSize(20)
      .setTextColor(56, 119, 91)
      .setFont("helvetica", "bold")
      .text("Animal Registry Report", margin, 70);

    doc
      .setFontSize(10)
      .setFont("helvetica", "normal")
      .setTextColor(0, 0, 0)
      .text(textParagraph, margin, 80, { maxWidth: maxWidth });

    doc.autoTable(headers, tableRows, {
      styles: { fontSize: 10 },
      startY: 100,
      headerStyles: { fillColor: [31, 41, 55] },
    });

    doc
      .setFontSize(10)
      .setTextColor(200, 200, 200)
      .text(
        `Report generated by Veterinary Management System`,
        margin,
        doc.internal.pageSize.height - 10
      );

    doc.save("Animal-Registry-Report.pdf");
  }

  return (
    <div>
      <IconButton
        onClick={() => {
          generatePDF(dataList);
        }}
        className="bg-gray-800 text-center hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer lg:mt-0 mt-3"
      >
        <DownloadIcon />
      </IconButton>
    </div>
  );
};

export default AnalysisRep;
