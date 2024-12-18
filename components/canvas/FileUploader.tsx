"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; 
import { GoogleGenerativeAI } from '@google/generative-ai'

type FileUploadProps = {}

const FileUpload: React.FC<FileUploadProps> = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.type !== "text/plain") {
        alert("Only .txt files are allowed!");
        return;
      }

      setFileName(file.name);
      setFileContent(null); 
    }
  };




//   const handleFileUpload = async () => {
//     const inputElement = document.getElementById("file-upload") as HTMLInputElement;
//     const file = inputElement?.files?.[0];

//     if (file) {
//       const reader = new FileReader();

//       reader.onload = () => {
//         setFileContent(reader.result as string); 
//       };

//       reader.onerror = () => {
//         alert("Error reading file");
//       };

//       reader.readAsText(file);
//     }
//   };
  




const handleFileUpload = async () => {
    const inputElement = document.getElementById("file-upload") as HTMLInputElement;
    const file = inputElement?.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        const content = reader.result as string;
        setFileContent(content); 

        const fileBase64 = btoa(content);
        const mimeType = "text/plain";

        try {
          const generationConfig = {
            
            inlineData: {
              data: fileBase64,
              mimeType,
            },
          };
         
          const response = await model.generateContent([generationConfig]);
          console.log("Gemini Response:", response);

          setAnalysisResults(response);
        } catch (error) {
          console.error("Error with Gemini API:", error);
          alert("Failed to analyze the file using Gemini API.");
        }
      };

      reader.onerror = () => {
        alert("Error reading file");
      };

      reader.readAsText(file); 
    }
  };



  return (
    <>
    <div className="flex flex-col">

    <div className="flex flex-col w-96 items-center justify-center gap-4 p-6 border border-gray-300 rounded-md shadow-sm">
      <label
        htmlFor="file-upload"
        className={cn(
          "flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        )}
      >
        <input
          id="file-upload"
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleFileChange}
        />
        {fileName ? "Change File" : "Choose File"}
      </label>
      {fileName && (
        <p className="text-sm text-gray-600">Selected File: {fileName}</p>
      )}
       <Button
        variant="outline"
        disabled={!fileName}
        onClick={handleFileUpload}
      >
        Send File
      </Button>
    </div>

    <div>
         {fileContent && (
        <div className="w-full p-4 mt-4 bg-gray-100 border border-gray-300 rounded-md">
          <h3 className="mb-2 text-sm font-bold text-gray-700">
            File Contents:
          </h3>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap">
            {fileContent}
          </pre>
        </div>
      )}
    </div>

    <div>
    {analysisResults && (
        <div className="w-full p-4 mt-4 bg-gray-200 border border-gray-400 rounded-md">
          <h3 className="mb-2 text-sm font-bold text-gray-800">Analysis Results:</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(analysisResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
            
    </div>
    </>
  );
};

export default FileUpload;
