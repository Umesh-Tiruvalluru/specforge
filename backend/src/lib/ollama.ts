import { Ollama } from "ollama";
import dotenv from "dotenv";
dotenv.config();

export const ollama = new Ollama({
  host: "https://api.ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});
