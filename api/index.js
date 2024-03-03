const express = require("express");
const { spawn } = require("child_process");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

const port = 3000;
// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, "/client/dist")));

// Route to handle compilation and execution of Python code
app.post("/api/run-python", (req, res) => {
  const { code } = req.body;

  let dataToSend = "";

  // Spawn a child process to execute the Python code
  const python = spawn("python", ["-c", code]);

  // Collect data from the script
  python.stdout.on("data", (data) => {
    console.log("Pipe data from Python script...");
    dataToSend += data.toString();
  });

  // Handle errors
  python.on("error", (error) => {
    console.error("Failed to execute Python code:", error);
    res.status(500).json({ error: "Failed to execute Python code" });
  });

  // When the Python process exits
  python.on("close", (code) => {
    console.log(`Child process closed with code ${code}`);
    // Send the output data to the client
    res.json({ output: dataToSend });
  });
});

// Route to serve index.html for any other requests
// Route to serve index.html for any other requests
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, 'client','dist','index.html'))
  })
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
