require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent("Hello world");
    console.log("EMBEDDING SUCCESS:", result.embedding.values.length);
  } catch (e) {
    console.error("EMBEDDING FAILURE:", e.message);
  }
}
test();
