/*import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config()
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
async function  run() {
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Explain how AI works";
    
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}*/
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import readline from "readline";
//const readline = require("readline");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
/*
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Explain about gobal warmining in 50 words";

  const result = await model.generateContent(prompt);
  console.log(await result.response.text()); // Fix: Added await
}

run();
*/
const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

userInterface.prompt();

userInterface.on("line", async (input) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContentStream([input]);
  for await (const chunk of result.stream) {
    const chunkText =  await chunk.text();
    console.log(chunkText);
  }
});
