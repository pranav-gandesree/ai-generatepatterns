'use client'

import React from "react";
import FileUpload from "@/components/canvas/FileUploader";
import Testing from "@/components/canvas/Testing";

 const UploadPage = () => {

  return (
    <div className="flex items-center justify-center min-h-screen">
      <FileUpload/>
      {/* <Testing/> */}
    </div>
  );
};

export default UploadPage;
