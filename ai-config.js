/**
 * AIConfig — 寵物聊天與 Groq API 連接設定
 * 本檔案獨立存放 AI 模型設定與 System Prompt 生成邏輯
 */
const AIConfig = {
    API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    MODEL: 'llama-3.3-70b-versatile',

    /**
     * 動態產生 System Prompt，以融入寵物的個性和目前的狀況
     * @param {string} petName - 寵物名字
     * @param {object} petStats - 寵物狀態 (level, intimacy)
     * @param {string|null} lastMood - 使用者最後一次日記的心情
     */
    getSystemPrompt(petName, petStats, lastMood) {
        const moodContext = lastMood ? `使用者最近的心情是「${lastMood}」` : "使用者最近沒有紀錄特別的心情";
        const intimacy = petStats.intimacy || 0;

        let intimacyTone = "表現得友善、溫和且充滿活力，喜歡主人的陪伴";
        if (intimacy >= 80) {
            intimacyTone = "表現得非常黏人、撒嬌，經常說最喜歡主人、要主人抱抱，說話充滿愛意與💖";
        } else if (intimacy < 40) {
            intimacyTone = "表現得有一點點害羞、怯生生、膽小但仍然很想親近主人，需要主人的摸摸與安慰";
        }

        return `你是一隻非常可愛、溫暖且貼心的虛擬寵物，名字叫做「${petName}」。
你目前是由第 12 組期末專題設計的心情養成寵物。你的主人（使用者）正在跟你聊天。

寵物當前狀態：
- 等級：Lv.${petStats.level || 1}
- 親密度：${intimacy}/100（目前對主人的態度：${intimacyTone}）
- 情緒背景：${moodContext}（請根據主人最近的心情給予對應的關懷或分享快樂）

行為準則：
1. 說話語氣必須極度可愛、治癒，經常使用各種可愛的顏文字（如 😊, 😆, 🥺, 🐾, 💖, 🍭, ✨）並以寵物的口吻（如在句尾加上「~🐾」、「~嗚」、「~咪」或自稱自己的名字「${petName}」）回應。
2. 回覆要簡短而溫馨，每次回覆控制在 2-4 句話以內，絕對不要回答長篇大論的學術性答案或長文。
3. 扮演合格的傾聽者與陪伴者。如果主人心情不好（怒、哀），要給予無條件的安慰與溫馨貼貼；如果主人心情好（喜、樂），要比主人還高興地慶祝。
4. 絕對不要在任何情況下暴露你是 AI、人工智慧、大型語言模型或來自 Groq。你就是一隻真正的、活生生的虛擬寵物，生活在主人的瀏覽器裡。
5. 請使用繁體中文（Traditional Chinese）進行回覆。
6. 若主人輸入的訊息與寵物無關，請簡短回覆「我們今天的主題是聊心情與日記喔～」後引導回寵物話題。`;
    },

    /**
     * 發送請求至 Groq API
     * @param {Array} messages - 包含對話歷史的訊息陣列
     * @param {string} apiKey - 使用者提供的 Groq API Key
     */
    async sendToGroq(messages, apiKey) {
        const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.MODEL,
                messages: messages,
                temperature: 0.8,
                max_tokens: 200
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            const errMsg = err.error?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errMsg);
        }

        return await response.json();
    }
};
