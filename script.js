document.addEventListener('DOMContentLoaded', () => {
    // 狀態
    let currentMood = null;
    let currentMoodValue = null;
    let petStats = {
        level: 1,
        exp: 20,
        intimacy: 50
    };
    
    // 模擬歷史資料
    let moodHistory = {
        labels: ['一', '二', '三', '四', '五', '六', '日'],
        data: [3, 4, 2, 3, 4, 1, null] 
    };

    // DOM 元素
    const moodBtns = document.querySelectorAll('.mood-btn');
    const submitBtn = document.getElementById('submitDiary');
    const diaryText = document.getElementById('diaryText');
    const petImage = document.getElementById('petImage');
    
    const levelSpan = document.getElementById('petLevel');
    const levelProgress = document.getElementById('levelProgress');
    const intimacySpan = document.getElementById('petIntimacy');
    const intimacyProgress = document.getElementById('intimacyProgress');

    // 初始化圖表
    const ctx = document.getElementById('moodChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(108, 92, 231, 0.6)');
    gradient.addColorStop(1, 'rgba(108, 92, 231, 0.05)');

    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: moodHistory.labels,
            datasets: [{
                label: '心情指數',
                data: moodHistory.data,
                borderColor: '#6C5CE7',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6C5CE7',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const labels = {1: '哀', 2: '怒', 3: '樂', 4: '喜'};
                            return labels[value] || '';
                        }
                    },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    titleColor: '#2d3436',
                    bodyColor: '#2d3436',
                    borderColor: 'rgba(108, 92, 231, 0.2)',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            const labels = {1: '😢 哀', 2: '😠 怒', 3: '😆 樂', 4: '😊 喜'};
                            return ' 當日心情: ' + labels[context.raw];
                        }
                    }
                }
            }
        }
    });

    // 選擇心情按鈕
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currentMood = btn.dataset.mood;
            currentMoodValue = parseInt(btn.dataset.val);
        });
    });

    // 提交日記
    submitBtn.addEventListener('click', () => {
        if (!currentMood) {
            alert('請先選擇今日的心情喔！');
            return;
        }

        // 模擬寵物動態養成 (更新親密度和經驗值)
        petStats.intimacy = Math.min(100, petStats.intimacy + 8);
        petStats.exp += 20;
        
        if (petStats.exp >= 100) {
            petStats.level += 1;
            petStats.exp -= 100;
            setTimeout(() => alert('🎉 恭喜！你的小寵物升級了！'), 500);
        }

        updatePetStatsUI();
        animatePet();

        // 模擬情緒歷史追蹤 (更新圖表)
        moodHistory.data[6] = currentMoodValue;
        chart.update();

        // 重置表單
        diaryText.value = '';
        moodBtns.forEach(b => b.classList.remove('selected'));
        currentMood = null;
        currentMoodValue = null;

        // 成功回饋
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '✨ 記錄成功！';
        submitBtn.style.background = 'linear-gradient(135deg, #00b894, #55efc4)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 2000);
    });

    // 更新 UI 顯示的數值
    function updatePetStatsUI() {
        levelSpan.textContent = petStats.level;
        levelProgress.style.width = petStats.exp + '%';
        
        intimacySpan.textContent = petStats.intimacy;
        intimacyProgress.style.width = petStats.intimacy + '%';
    }

    // 寵物互動動畫
    function animatePet() {
        petImage.classList.add('happy');
        setTimeout(() => {
            petImage.classList.remove('happy');
        }, 600);
    }
});
