# chatpatternx Project Setup

#### Here's the deployed project - https://chatpatternx.vercel.app


This is a Next.js project that integrates Gemini AI API to analyze and generate insights from text files. The project allows users to upload `.txt` files, which are then analyzed and the results are displayed for the user.

## Features
- File upload and analysis functionality.
- Integration with Gemini AI API to analyze file content.
- Dynamic display of analysis results with pattern display, topic groups, and frequency analysis.

## Prerequisites

Before setting up the project, ensure that you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## Getting Started

Follow these steps to get your local development environment up and running.

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/pranav-gandesree/ai-generatepatterns.git
```

### 2. Install dependencies

Install all the necessary dependencies

```bash
npm install
```
### 3. Set Up Environment Variables

Create a .env file in the root of the project to securely store your API key and other environment variables:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```
### $. Run the development server

Create a .env file in the root of the project to securely store your API key and other environment variables:

```bash
npm run dev
```


