export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  // [중요] 호출 주소에서 모델 이름을 'gemini-1.5-flash'로 정확히 고정합니다.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `너는 군산대 영문과 교재 전문 AI 튜터야. 아래 데이터를 기반으로 답변해줘.
            교재지식: 영어는 SVO 어순, 한국어는 SOV 어순 및 조사/어미 발달.
            질문: ${query}`
          }]
        }]
      })
    });

    const data = await response.json();

    // 서버 응답에 에러가 섞여 있는지 확인
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // 정상 응답 반환
    res.status(200).json(data);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: '서버 통신 중 알 수 없는 오류가 발생했습니다.' });
  }
}
