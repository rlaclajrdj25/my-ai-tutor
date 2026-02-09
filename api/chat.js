export default async function handler(req, res) {
  // 1. POST 요청만 허용 (보안)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query } = req.body;
  
  // 2. 환경 변수에서 API 키를 가져옵니다. 
  // (GitHub Settings -> Secrets에 GEMINI_API_KEY가 등록되어 있어야 합니다)
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  // 3. 모델명을 현재 작동하는 gemini-1.5-flash로 수정함 (v1beta 버전 사용)
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `너는 군산대 영문과 교재 튜터야. 질문에 답해줘: ${query}`
          }]
        }]
      })
    });

    const data = await response.json();

    // 4. Gemini API 에러 처리
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.status(data.error.code || 500).json({ 
        error: data.error.message,
        details: "API 키가 올바른지, 혹은 분당 호출 제한에 걸렸는지 확인하세요." 
      });
    }

    // 5. 성공 응답
    res.status(200).json(data);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: '서버 연결 실패. 네트워크 상태를 확인하세요.' });
  }
}
