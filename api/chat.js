export default async function handler(req, res) {
  // POST 요청이 아닌 경우 차단
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY; // Vercel 환경 변수에서 가져옴

  // 교재 지식 주입 (Preface.pdf 내용 기반)
  const myTextbookData = `
    - 교재: Basic English Grammar (Foundations of English Syntax)
    - 핵심: 영어는 SVO 어순, 한국어는 SOV 어순 및 조사/어미가 발달함.
    - 품사 분류: 의미(Semantic), 형태(Morphological), 위치(Syntactic) 기준.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `너는 군산대 영문과 교재 전문 AI 튜터야. 아래 데이터를 기반으로 답변해줘.\n데이터: ${myTextbookData}\n질문: ${query}`
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // 결과를 프론트엔드(index.html)로 전달
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: '서버 통신 중 오류가 발생했습니다.' });
  }
}
