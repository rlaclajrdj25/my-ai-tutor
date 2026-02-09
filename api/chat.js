export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { query } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  // [수정 포인트] 모델 인식 오류를 방지하기 위해 v1beta 경로를 명확히 사용합니다.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `너는 군산대 영문과 교재 전문 AI 튜터야. 교재 핵심: 영어(SVO)와 한국어(SOV) 어순 차이. 질문: ${query}`
          }]
        }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: '서버 연결 실패' });
  }
}
