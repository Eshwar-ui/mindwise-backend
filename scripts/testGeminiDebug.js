require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("SUCCESS");
  } catch (e) {
    console.log("FAIL_MSG:", e.message);
    if (e.response) console.log("FAIL_RESP:", JSON.stringify(e.response, null, 2));
  }
}
test();
