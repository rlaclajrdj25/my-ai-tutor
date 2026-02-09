import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // ✅ CORS 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const userMessage = req.body.message;

    const prompt = `
너는 'Basic English Grammar' 교재를 가르치는 AI 튜터다.
한국어 학습자를 대상으로 문법을 쉽고 친절하게 설명한다.

질문:
${userMessage}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ answer: text });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ answer: "AI 서버 오류" });
  }
}
