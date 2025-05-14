const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Firebase 초기화
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// 키워드 데이터
const keywords = [
    { keyword: "아이폰", searchCount: 69000000 },
    { keyword: "챗GPT", searchCount: 35400000 },
    { keyword: "인공지능", searchCount: 23800000 },
    { keyword: "마인크래프트", searchCount: 33100000 },
    { keyword: "발로란트", searchCount: 2000000 },
    { keyword: "리그 오브 레전드", searchCount: 1800000 },
    { keyword: "월드컵", searchCount: 27200000 },
    { keyword: "골프", searchCount: 3100000 },
    { keyword: "야구", searchCount: 2900000 },
    { keyword: "축구", searchCount: 2800000 },
    { keyword: "배드민턴", searchCount: 2500000 },
    { keyword: "힙합", searchCount: 800000 },
    { keyword: "크러쉬", searchCount: 2400000 },
    { keyword: "블랙핑크", searchCount: 2000000 },
    { keyword: "BTS(방탄소년단)", searchCount: 1900000 },
    { keyword: "넷플릭스", searchCount: 5700000 },
    { keyword: "서울의 봄", searchCount: 7800000 },
    { keyword: "오징어 게임", searchCount: 7400000 },
    { keyword: "범죄도시", searchCount: 6800000 },
    { keyword: "콘크리트 유토피아", searchCount: 6100000 },
    { keyword: "탑건", searchCount: 2100000 },
    { keyword: "김태리", searchCount: 12200000 },
    { keyword: "김수현", searchCount: 15800000 },
    { keyword: "김고은", searchCount: 13900000 },
    { keyword: "박서준", searchCount: 11800000 },
    { keyword: "에스파", searchCount: 10300000 },
    { keyword: "지수(블랙핑크)", searchCount: 9700000 },
    { keyword: "박보검", searchCount: 8900000 },
    { keyword: "아이유", searchCount: 8600000 },
    { keyword: "롯데월드", searchCount: 5300000 },
    { keyword: "현대자동차", searchCount: 4800000 },
    { keyword: "삼성전자", searchCount: 4200000 },
    { keyword: "LG전자", searchCount: 3900000 },
    { keyword: "무신사", searchCount: 3400000 },
    { keyword: "스타벅스", searchCount: 1700000 },
    { keyword: "맥도날드", searchCount: 1600000 },
    { keyword: "쿠팡", searchCount: 1500000 },
    { keyword: "네이버", searchCount: 1400000 },
    { keyword: "카카오톡", searchCount: 1300000 },
    { keyword: "토스", searchCount: 1200000 },
    { keyword: "가전제품", searchCount: 1000000 },
    { keyword: "V라이브", searchCount: 900000 },
    { keyword: "서울", searchCount: 700000 },
    { keyword: "강남", searchCount: 600000 },
    { keyword: "제주도", searchCount: 500000 }
];

// 키워드 가져오기
app.get('/api/keywords', (req, res) => {
    res.json(keywords);
});

// 점수 저장
app.post('/api/scores', async (req, res) => {
    try {
        const { playerName, score } = req.body;
        await db.collection('scores').add({
            playerName,
            score,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(201).json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// 상위 점수 가져오기
app.get('/api/scores/top', async (req, res) => {
    try {
        const scoresSnapshot = await db.collection('scores')
            .orderBy('score', 'desc')
            .limit(10)
            .get();
        
        const scores = [];
        scoresSnapshot.forEach(doc => {
            scores.push(doc.data());
        });
        
        res.json(scores);
    } catch (error) {
        console.error('Error getting top scores:', error);
        res.status(500).json({ error: 'Failed to get top scores' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
