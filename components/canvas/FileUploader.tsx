"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GoogleGenerativeAI } from '@google/generative-ai'
import PatternDisplayAccordion from "./PatternDisplayAccordion";
import TopicGroupsCard from "./TopicGroupsCard";
import BarChart from "./BarChart";
import { Upload, FileText, Send, RefreshCw, File } from 'lucide-react';

type FileUploadProps =  object;

interface Candidate {
  content?: {
    parts: { text: string }[];
  };
}



const FileUpload: React.FC<FileUploadProps> = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const generatePrompt = (fileContent: string): string => `
Analyze the following content from a text file. Your task is to perform the following analysis and provide the output in **structured json format**:

1. **Pattern Display**:
   - Identify recurring patterns or key ideas that appear multiple times in the text.
   - Display them clearly.

2. **Relationships Between Parsed Content**:
   - Identify connections or relationships between different parts of the content.
   - Show how concepts, ideas, or entities are linked together.

3. **Group Similar Topics/Themes**:
   - Group the content based on similar topics or themes.
   - Provide a brief description for each group.

4. **Basic Frequency Analysis**:
   - Provide a list of the most frequent terms or concepts in the content.
   - Show their frequency and importance.

**Content**:

${fileContent}


**Output Format** (Use this structure strictly, give output in json format):

{
  "patternDisplay": [
    { "pattern": "Pattern 1", "details": "[Details]" },
    { "pattern": "Pattern 2", "details": "[Details]" }
  ],
  "relationships": {
    "description": "[Describe relationships clearly]",
  },
  "topicGroups": [
    {
      "group": "Group 1",
      "topic": "[Topic/Theme]",
      "description": "[Description]"
    },
    {
      "group": "Group 2",
      "topic": "[Topic/Theme]",
      "description": "[Description]"
    }
  ],
  "frequencyAnalysis": [
    { "term": "Term 1", "frequency": "[Frequency]" },
    { "term": "Term 2", "frequency": "[Frequency]" }
  ]
}

`;

const handleRefresh = () => {
    setFileName(null);
    setFileContent(null);
    setAnalysisResults(null);
    setLoading(false);
  };


  const handleFileUpload = async () => {
    const inputElement = document.getElementById("file-upload") as HTMLInputElement;
    const file = inputElement?.files?.[0];


    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        const content = reader.result as string;
        setFileContent(content);
        setLoading(true);

        const prompt = generatePrompt(content);

        try {
          const response = await model.generateContent([prompt]);
          // console.log("Gemini Response:", response);

          const candidates = response?.response?.candidates as Candidate[];
          if (!candidates || candidates.length === 0) {
            console.warn("No candidates found in the response.");
            setLoading(false);
            return;
          }

          // const rawText = candidates[0]?.content?.parts
          //   ?.map((part: any) => part.text)
          //   .join(" ")
          //   .trim();

          let rawText;
          if (candidates?.length > 0) {
             rawText = candidates[0].content?.parts.map((part) => part.text).join(" ");
          }

          // regex to match the JSON and extract it
          const jsonMatch = rawText?.match(/\`\`\`json\n([\s\S]*?)\`\`\`/);

          if (jsonMatch) {
            const jsonText = jsonMatch[1];
            try {
              const parsedJson = JSON.parse(jsonText);
              setAnalysisResults(parsedJson);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              setAnalysisResults("Invalid JSON format");
            }
          } else {
            setAnalysisResults(rawText);
          }
        } catch (error) {
          console.error("Error with Gemini API:", error);
          alert("Failed to analyze the file using Gemini API.");
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        alert("Error reading file");
      };

      reader.readAsText(file);
    }
  };



  const handleSampleFile = () => {
    const fileUrl = "/sample-file.txt"; 

    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = "sample-file.txt"; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-transparent shadow-md rounded-lg p-6 mb-8 border border-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">File Upload and Analysis</h2>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="file-upload"
              className={cn(
                "flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm cursor-pointer hover:bg-blue-700 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
            >
              <Upload className="w-5 h-5 mr-2" />
              <input
                id="file-upload"
                type="file"
                accept=".txt"
                className="hidden "
                onChange={handleFileChange}
              />
              {fileName ? "Change File" : "Choose File"}
            </label>

            <Button variant="outline" onClick={handleSampleFile} className="flex items-center">
              <File className="w-5 h-5 mr-2" />
              Sample File
            </Button>

            <Button
              variant="outline"
              disabled={!fileName}
              onClick={handleFileUpload}
              className="flex items-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Analyze File
            </Button>
            <Button
              variant="outline"
             
              onClick={handleRefresh}
              className="flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
             Refresh
            </Button>
          </div>
          {fileName && (
            <p className="mt-2 text-sm text-gray-200 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Selected File: {fileName}
            </p>
          )}
        </div>

        {loading ? (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Generating analysis...</p>
          </div>
        ) : (
          analysisResults && (
            <div className="bg-transparent shadow-md rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-gray-200">Analysis Results</h3>
              <div className="space-y-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-4 text-gray-300">Pattern Display</h4>
                  <PatternDisplayAccordion patterns={analysisResults?.patternDisplay} />
                </div>

                <div>
                    <h4 className="font-bold text-xl mb-4 text-gray-200">Relationships between parsed content</h4>
                    <p className="text-gray-300">{analysisResults?.relationships?.description}</p>
  
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 text-gray-300">Topic Groups</h4>
                  <TopicGroupsCard groups={analysisResults?.topicGroups} />
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 text-gray-300">Frequency Analysis</h4>
                  <BarChart data={analysisResults?.frequencyAnalysis} />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FileUpload;

