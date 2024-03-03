import React, { useState } from "react";
import "../src/App.css";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

export default function App() {
  const [pythonCode, setPythonCode] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const executePythonCode = async () => {
    setIsLoading(true);
    try {
      // Make a fetch request to execute the Python code
      const response = await fetch("/api/run-python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: pythonCode }),
      });
      if (!response.ok) {
        throw new Error("Failed to execute Python code: Server error");
      }
      const data = await response.json();
      if (!data || !data.output) {
        throw new Error("Failed to execute Python code: Empty response");
      }
      setOutput(data.output);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompile = () => {
    executePythonCode();
  };

  return (
    <div className="board">
      <div className="container">
        <h1 >Write Your Python code</h1>
        <Editor
          value={pythonCode}
          onValueChange={code => setPythonCode(code)}
          highlight={code => highlight(code, languages.js)}
          placeholder="Enter Your Python Code here"
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            height: "200px", // Adjust the height as needed
            border:'2px solid black',
            borderRadius:'10px'
          }}
        />
        <button onClick={handleCompile} disabled={isLoading} className="button">
          {isLoading ? "Running..." : "Run Python Script"}
        </button>
      <div>
        <h2>Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
      </div>
  );
}
