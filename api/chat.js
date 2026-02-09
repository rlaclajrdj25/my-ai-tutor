export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { query } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  // [수정 완료] 선생님 계정에 있는 'Gemini 2.5 Flash' 모델을 호출합니다.
  // 최신 모델이므로 v1beta 버전을 사용합니다.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

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

    // 만약 모델 이름이 틀렸다고 나오면 에러 메시지를 확인해야 합니다.
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: '서버 연결 실패' });
  }
}
