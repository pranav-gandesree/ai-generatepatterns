"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; 
import { GoogleGenerativeAI } from '@google/generative-ai'
import PatternDisplayAccordion from "./PatternDisplayAccordion";
import TopicGroupsCard from "./TopicGroupsCard";
import BarChart from "./BarChart";

type FileUploadProps = {}

const FileUpload: React.FC<FileUploadProps> = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [loading, setLoading] =  useState<boolean>(false); 

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
Analyze the following content from a text file. Your task is to perform the following analysis and provide the output in **structured markdown format**:

1. **Pattern Display**:
   - Identify recurring patterns or key ideas that appear multiple times in the text.
   - Display them clearly.
   - (Optionally: Include a **Pie Chart** to represent the distribution of these patterns visually.)

2. **Relationships Between Parsed Content**:
   - Identify connections or relationships between different parts of the content.
   - Show how concepts, ideas, or entities are linked together.
   - (Optionally: Include a **Flowchart** or **Network Graph** to represent these relationships visually.)

3. **Group Similar Topics/Themes**:
   - Group the content based on similar topics or themes.
   - Provide a brief description for each group.
   - (Optionally: Include a **Bar Graph** to show the frequency of each group or theme visually.)

4. **Basic Frequency Analysis**:
   - Provide a list of the most frequent terms or concepts in the content.
   - Show their frequency and importance.
   - (Optionally: Include a **Bar Chart** to represent the frequency of terms visually.)

**Content**:

${fileContent}


**Output Format** (Use this structure strictly, give output as an object):


{
  "patternDisplay": [
    { "pattern": "Pattern 1", "details": "[Details]" },
    { "pattern": "Pattern 2", "details": "[Details]" }
  ],
  "relationships": {
    "description": "[Describe relationships clearly]",
    "flowchart": "[Optional: Link or Data for Flowchart]"
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
          console.log("Gemini Response:", response);
  
          const candidates = response?.response?.candidates;
          if (!candidates || candidates.length === 0) {
            console.warn("No candidates found in the response.");
            setLoading(false);
            return;
          }
  
          const rawText = candidates[0]?.content?.parts
            ?.map((part: any) => part.text)
            .join(" ")
            .trim();
  
          // regex to match the JSON and extract it
          const jsonMatch = rawText?.match(/```json\n([\s\S]*?)```/);
  
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

    {/* <div>
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
    </div> */}

<div>
          {loading ? (
            <div className="w-full p-4 mt-4 bg-gray-200 border border-gray-400 rounded-md">
              <p className="text-center text-lg text-gray-700">Generating response...</p>
            </div>
          ) : (
            analysisResults && (
              <div className="w-2/3 p-4 mt-4  rounded-md text-gray-100 flex flex-col justify-center items-center gap-4">
                <h3 className="mb-2 text-sm font-bold text-gray-100">Analysis Results:</h3>
                <div className="text-sm  whitespace-pre-wrap">

                <div className=" border border-gray-400 p-8">
                    <h4 className="font-bold">Pattern Display</h4>
                    {/* {renderPatternDisplay(analysisResults?.patternDisplay)} */}
                    <PatternDisplayAccordion patterns={analysisResults?.patternDisplay} />
                </div>

                    <div className="mt-4">
                        <h4 className="font-bold mt-4">Topic Groups</h4>
                        {/* {renderTopicGroups(analysisResults?.topicGroups)} */}
                        <TopicGroupsCard groups={analysisResults?.topicGroups} />
                    </div>

                  <h4 className="font-bold mt-4">Frequency Analysis</h4>
                  {/* {renderFrequencyAnalysis(analysisResults?.frequencyAnalysis)} */}
                  <BarChart data={analysisResults?.frequencyAnalysis} />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default FileUpload;