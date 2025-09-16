import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import mime from "mime-types";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Google AI setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Convert image to base64 format
function fileToGenerativePart(buffer, originalname) {
  const mimeType = mime.lookup(originalname) || "application/octet-stream";
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

// API Endpoint: Process image & prompt
app.post("/generate", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image is required!" });
  }

  const imagePart = fileToGenerativePart(
    req.file.buffer,
    req.file.originalname
  );
  const prompt = req.body.prompt || "Describe the image in detail.";

  try {
    const result = await model.generateContentStream([prompt, imagePart]);
    let responseText = "";

    for await (const chunk of result.stream) {
      responseText += chunk.text() + " ";
    }

    res.json({ response: responseText.trim() });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
