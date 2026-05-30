/**
 * PetDB — 前端模擬資料庫（使用 localStorage）
 * 後端對接說明：此模組所有 load() / save() 呼叫，
 * 可替換為向 Flask API 發送 GET / POST 請求，
 * 路由範例：
 *   GET  /api/diary     → 讀取所有日記與寵物數值
 *   POST /api/diary     → 新增一筆日記（廖翾端負責 F-01）
 *   GET  /api/pet       → 讀取寵物數值（林祐群、王柔閔負責 F-02）
 */
const PetDB = {
    STORAGE_KEY: 'petDiaryDB_v1',

    MOOD_ICONS: {
        '喜': '😊',
        '樂': '😆',
        '怒': '😠',
        '哀': '😢',
    },

    defaultData() {
        return {
            pet: {
                name: '小布丁',
                level: 1,
                exp: 0,
                intimacy: 0,
                streak: 0,
            },
            diaries: []
        };
    },

    calculateStreak(diaries) {
        if (!diaries || diaries.length === 0) return 0;

        // 1. 將所有日記的 timestamp 轉換成本地日期的 YYYY-MM-DD 格式，並去重
        const uniqueDates = new Set();
        diaries.forEach(d => {
            if (d.timestamp) {
                const date = new Date(d.timestamp);
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                uniqueDates.add(`${yyyy}-${mm}-${dd}`);
            }
        });

        // 2. 獲取今天和昨天的日期字串
        const today = new Date();
        const formatDate = (d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        const todayStr = formatDate(today);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = formatDate(yesterday);

        // 3. 判斷 streak 的起點
        let checkDate = new Date();
        let streak = 0;

        if (uniqueDates.has(todayStr)) {
            // 今天有寫日記，從今天開始往回計算
            streak = 1;
            checkDate.setDate(checkDate.getDate() - 1);
            while (uniqueDates.has(formatDate(checkDate))) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        } else if (uniqueDates.has(yesterdayStr)) {
            // 今天還沒寫，但昨天有寫，從昨天開始往回計算
            streak = 1;
            checkDate.setDate(checkDate.getDate() - 2);
            while (uniqueDates.has(formatDate(checkDate))) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        } else {
            // 今天跟昨天都沒寫，連續紀錄中斷
            streak = 0;
        }

        return streak;
    },

    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            const data = raw ? JSON.parse(raw) : this.defaultData();
            data.pet.streak = this.calculateStreak(data.diaries);
            return data;
        } catch {
            return this.defaultData();
        }
    },

    save(data) {
        data.pet.streak = this.calculateStreak(data.diaries);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
};
