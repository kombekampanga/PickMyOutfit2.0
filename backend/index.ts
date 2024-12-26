import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.get("/getExistingWardrobe", async (req, res) => {
  const directoryPath = path.join(__dirname, "uploads");

  try {
    const isFile = (fileName: fs.PathLike) => {
      return fs.lstatSync(fileName).isFile();
    };

    const files = fs.readdirSync(directoryPath).filter((file) => {
      const fullPath = path.join(directoryPath, file)
      return isFile(fullPath) // make sure only files are returned not folders
    })

    res.status(200).json(files); // Return the file names in the response
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).send('Error reading directory');
  }
});

app.get("/wardrobe/:imageName", (req, res) => {
  const { imageName } = req.params;  // Extract the imageName from the URL parameter

  const imagePath = path.join(__dirname, "uploads", imageName);

  // Check if the file exists
  if (fs.existsSync(imagePath)) {
    // If the file exists, send it as a static file
    res.sendFile(imagePath);
  } else {
    // If the file doesn't exist, send a 404 error
    res.status(404).send("Image not found");
  }
});

app.post("/upload", (req, res) => {
  const { fileNames } = req.body;

  if (!fileNames || !Array.isArray(fileNames)) {
    //return res.status(400).send("Invalid file names");
  }

  // Save the file names to a folder (simulating saving)
  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  fileNames.forEach((fileName: string) => {
    const filePath = path.join(uploadDir, fileName);
    // Create dummy files (replace with actual saving if necessary)
    fs.writeFileSync(filePath, "");
  });

  // Return the first file's path
  const firstFileName = fileNames[0];
  res.json({ firstTopPath: firstFileName });
});


app.post("/write-file", (req, res) => {
    const { filename, content } = req.body;
  
    const filePath = path.join(__dirname, filename);
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).send("Error writing file");
      }
      res.send("File written successfully");
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});