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
                exp: 20,
                intimacy: 50,
                streak: 0,
            },
            diaries: []
        };
    },

    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : this.defaultData();
        } catch {
            return this.defaultData();
        }
    },

    save(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
};
