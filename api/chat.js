export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { query } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  // [수정 완료] v1beta -> v1으로 변경하여 모델 인식 오류 해결
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `너는 군산대 영문과 교재 전문 AI 튜터야. 
            교재 핵심: 영어는 SVO(주어-동사-목적어), 한국어는 SOV(주어-목적어-동사).
            질문: ${query}`
          }]
        }]
      })
    });

    const data = await response.json();

    // 구글 서버 에러가 있는지 확인
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // 정상 응답
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: '서버 연결 실패' });
  }
}
