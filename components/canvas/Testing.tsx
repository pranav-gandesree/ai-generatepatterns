'use client'

import React, { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const Testing = () => {
    const [value, setValue] = useState('')

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Explain how AI works";

const handleResponse = async() =>{
      const result = await model.generateContent(prompt);
      setValue(result.response.text());
    console.log(result.response.text());

}


  return (
    <div>
      <button onClick={handleResponse} className='text-white'>generate responsee</button>
      <div className='text-blue-700'>{value}</div>
    </div>
  )
}

export default Testing
