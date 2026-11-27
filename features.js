/* =========================================================================
   IQ Math extras:
   daily challenge, number of the day, achievements, mistake journal,
   difficulty tiers, boss battle, visual playgrounds, offline install.
   Loaded after script.js so it can reuse its helpers.
   ========================================================================= */

/* ---------------- small shared helpers ---------------- */

function todayKey(date) {
    const d = date || new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function shiftDayKey(key, delta) {
    const parts = key.split('-').map(Number);
    return todayKey(new Date(parts[0], parts[1] - 1, parts[2] + delta));
}

function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function formatSeconds(total) {
    const s = Math.max(0, Math.floor(total || 0));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/* ---------------- 7. topic difficulty tiers ---------------- */

const TIERS = {
    explorer: {
        name: 'Explorer', factorial: [2, 6], sqrt: [1, 12], cbrt: [1, 4],
        powerBase: [2, 7], powerExp: [2, 3], hard: false
    },
    challenge: {
        name: 'Challenge', factorial: [2, 9], sqrt: [1, 22], cbrt: [1, 7],
        powerBase: [2, 9], powerExp: [2, 4], hard: false
    },
    master: {
        name: 'Master', factorial: [7, 12], sqrt: [12, 30], cbrt: [5, 12],
        powerBase: [3, 12], powerExp: [3, 5], hard: true
    }
};

function getTestTier() {
    const tier = readProgress('testTier', 'challenge');
    return TIERS[tier] ? tier : 'challenge';
}

function buildTieredGenerators(tier) {
    const cfg = TIERS[tier] || TIERS.challenge;
    const hard = !!cfg.hard;

    return [
        () => {
            const n = randInt(cfg.factorial[0], cfg.factorial[1]);
            let answer = 1;
            for (let i = 2; i <= n; i++) answer *= i;
            return { topic: 'Factorials', question: `Calculate ${n}!`, answer: answer };
        },
        () => {
            const root = randInt(cfg.sqrt[0], cfg.sqrt[1]);
            return { topic: 'Square Roots', question: `What is √${root * root}?`, answer: root };
        },
        () => {
            const root = randInt(cfg.cbrt[0], cfg.cbrt[1]);
            return { topic: 'Cube Roots', question: `What is ∛${root * root * root}?`, answer: root };
        },
        () => {
            const base = randInt(cfg.powerBase[0], cfg.powerBase[1]);
            const exp = randInt(cfg.powerExp[0], cfg.powerExp[1]);
            return { topic: 'Powers', question: `Calculate ${base}<sup>${exp}</sup>`, answer: Math.pow(base, exp) };
        },
        () => {
            const options = hard ? [
                { question: 'Calculate <sup>4</sup>2 (2 tetrated to height 4)', answer: 65536 },
                { question: 'Calculate <sup>3</sup>3 (3 tetrated to height 3)', answer: 7625597484987 },
                { question: 'Calculate <sup>3</sup>2 (2 tetrated to height 3)', answer: 16 }
            ] : [
                { question: 'Calculate <sup>2</sup>2 (2 tetrated to height 2)', answer: 4 },
                { question: 'Calculate <sup>3</sup>2 (2 tetrated to height 3)', answer: 16 },
                { question: 'Calculate <sup>2</sup>3 (3 tetrated to height 2)', answer: 27 }
            ];
            return Object.assign({ topic: 'Tetration' }, randChoice(options));
        },
        () => {
            const options = hard ? [
                { question: 'What is 2 ↑↑↑ 3?', answer: 65536 },
                { question: 'What is 2 ↑↑↑ 2?', answer: 4 },
                { question: 'How many up-arrows does pentation use?', answer: 3 }
            ] : [
                { question: 'What is 2 ↑↑↑ 2?', answer: 4 },
                { question: 'What is 2 ↑↑↑ 3?', answer: 65536 },
                { question: 'How many up-arrows does pentation use?', answer: 3 }
            ];
            return Object.assign({ topic: 'Pentation' }, randChoice(options));
        },
        () => {
            const options = hard ? [
                { question: 'How many up-arrows does hexation use?', answer: 4 },
                { question: 'What is 2 ↑↑↑↑ 2?', answer: 4 },
                { question: 'How many up-arrows does tetration use?', answer: 2 }
            ] : [
                { question: 'What is 2 ↑↑↑↑ 2?', answer: 4 },
                { question: 'How many up-arrows does hexation use?', answer: 4 },
                { question: 'What is 2 ↑↑↑↑ 1?', answer: 2 }
            ];
            return Object.assign({ topic: 'Hexation' }, randChoice(options));
        },
        () => {
            const options = hard ? [
                { question: 'What is log(5000) rounded to 2 decimal places?', answer: 3.7, tolerance: 0.01 },
                { question: 'What is log(2) rounded to 2 decimal places?', answer: 0.3, tolerance: 0.01 },
                { question: 'What is log(7) rounded to 2 decimal places?', answer: 0.85, tolerance: 0.01 },
                { question: 'What is log(1000000)?', answer: 6 }
            ] : [
                { question: 'What is log(80) rounded to 1 decimal place?', answer: 1.9, tolerance: 0.05 },
                { question: 'What is log(10)?', answer: 1 },
                { question: 'What is log(100)?', answer: 2 },
                { question: 'What is log(1000)?', answer: 3 }
            ];
            return Object.assign({ topic: 'Logarithms' }, randChoice(options));
        },
        () => {
            const options = hard ? [
                { question: 'In E = mc², what is the exponent on c?', answer: 2 },
                { question: 'For m = 10 kg, E ≈ 90 × 10¹⁶ J. What is the coefficient?', answer: 90 },
                { question: 'For m = 0.5 kg, E ≈ 4.5 × 10¹⁶ J. What is the coefficient?', answer: 4.5 },
                { question: 'E = what?', answer: 'mc²', choices: shuffleQuestions(['mc²', 'm²c', '2mc', 'm + c²']) }
            ] : [
                { question: 'In E = mc², what is the exponent on c?', answer: 2 },
                { question: 'For m = 2 kg, E ≈ 18 × 10¹⁶ J. What is the coefficient?', answer: 18 },
                { question: 'For m = 5 kg, E ≈ 45 × 10¹⁶ J. What is the coefficient?', answer: 45 },
                { question: 'E = what?', answer: 'mc²', choices: shuffleQuestions(['mc²', 'cm²', 'c² + m', 'm ÷ c²']) }
            ];
            return Object.assign({ topic: 'E=mc²' }, randChoice(options));
        },
        () => {
            const facts = [
                { question: 'How many vertices does a tesseract have?', answer: 16 },
                { question: 'How many edges does a tesseract have?', answer: 32 },
                { question: 'How many square faces does a tesseract have?', answer: 24 },
                { question: 'How many cubic cells does a tesseract have?', answer: 8 }
            ];
            if (hard) facts.push({ question: 'How many cubic cells meet at each vertex?', answer: 4 });
            return Object.assign({ topic: 'Tesseract' }, randChoice(facts));
        },
        () => {
            const options = hard ? [
                { question: 'If 3x = 21, what is x?', answer: 7 },
                { question: 'If x + 17 = 42, what is x?', answer: 25 },
                { question: 'If x² = 144, what is the positive value of x?', answer: 12 },
                { question: 'If x³ = 125, what is x?', answer: 5 },
                { question: 'If 2x + 3 = 11, what is x?', answer: 4 }
            ] : [
                { question: 'If x + 5 = 7, what is x?', answer: 2 },
                { question: 'If x − 3 = 4, what is x?', answer: 7 },
                { question: 'If x + 9 = 15, what is x?', answer: 6 },
                { question: 'If x² = 36, what is the positive value of x?', answer: 6 },
                { question: 'If x³ = 27, what is x?', answer: 3 }
            ];
            return Object.assign({ topic: 'Finding Numbers' }, randChoice(options));
        },
        () => {
            const options = hard ? [
                { question: 'What is pi rounded to 3 decimal places?', answer: 3.142, tolerance: 0.0005 },
                { question: 'Using π ≈ 3.14, what is the circumference of a circle with radius 5, rounded to the nearest whole number?', answer: 31 },
                { question: 'How many digits after the decimal are in 3.14159?', answer: 5 }
            ] : [
                { question: 'What is pi rounded to 2 decimal places?', answer: 3.14, tolerance: 0.005 },
                { question: 'Using π ≈ 3.14, what is the circumference of a circle with radius 2, rounded to the nearest whole number?', answer: 13 },
                { question: 'How many digits after the decimal are in 3.14?', answer: 2 }
            ];
            return Object.assign({ topic: 'Pi & Circles' }, randChoice(options));
        }
    ];
}

function buildTieredTestQuestions(tier) {
    const generators = buildTieredGenerators(tier);
    const questions = generators.map(generator => generator());
    for (let i = 0; i < 4; i++) questions.push(randChoice(generators)());
    return shuffleQuestions(questions);
}

function buildBossQuestions() {
    const questions = buildTieredGenerators('master').map(generator => generator());
    return shuffleQuestions(questions);
}

function initTierSelector() {
    const selector = document.getElementById('tier-selector');
    if (!selector) return;

    const current = getTestTier();
    selector.querySelectorAll('[data-tier]').forEach(button => {
        const active = button.dataset.tier === current;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
        button.addEventListener('click', () => {
            if (button.dataset.tier === current) return;
            writeProgress('testTier', button.dataset.tier);
            // Drop any in-progress draft so the new difficulty starts fresh.
            clearProgress('mixedTestActive');
            // Reload so the mixed test starts cleanly at the new difficulty.
            window.location.reload();
        });
    });

    const label = document.querySelector('.tier-current');
    if (label) label.textContent = `${TIERS[current].name} difficulty`;
}

/* ---------------- 4. achievement cabinet ---------------- */

const BADGES = [
    { id: 'first_test', icon: '🎯', name: 'First Steps', desc: 'Complete your first mixed test.', test: s => (s.totalTests || 0) >= 1 },
    { id: 'sharp', icon: '🎯', name: 'Sharp Shooter', desc: 'Score at least 80% on a mixed test.', test: s => (s.bestPercent || 0) >= 80 },
    { id: 'perfect', icon: '💯', name: 'Flawless', desc: 'Get every question right in one test.', test: s => (s.perfectTests || 0) >= 1 },
    { id: 'ten_tests', icon: '📚', name: 'Regular', desc: 'Complete 10 mixed tests.', test: s => (s.totalTests || 0) >= 10 },
    { id: 'streak3', icon: '🔥', name: 'On a Roll', desc: 'Reach a 3-day daily streak.', test: s => (s.bestDailyStreak || 0) >= 3 },
    { id: 'streak7', icon: '🌟', name: 'Week Warrior', desc: 'Reach a 7-day daily streak.', test: s => (s.bestDailyStreak || 0) >= 7 },
    { id: 'boss', icon: '👑', name: 'Boss Slayer', desc: 'Beat a boss battle with 80% or more.', test: s => (s.bossWins || 0) >= 1 },
    { id: 'boss_fast', icon: '⚡', name: 'Lightning', desc: 'Finish a boss battle in 90 seconds or less.', test: s => (s.minBossTime || 0) > 0 && (s.minBossTime || 0) <= 90 },
    { id: 'journal', icon: '📓', name: 'Learner', desc: 'Mark 3 missed questions as reviewed.', test: s => (s.journalReviewed || 0) >= 3 }
];

function readAchievements() {
    const saved = readProgress('achievements', {});
    return {
        stats: saved && saved.stats ? saved.stats : {},
        unlocked: saved && saved.unlocked ? saved.unlocked : {}
    };
}

function updateStats(changes) {
    const state = readAchievements();
    Object.keys(changes || {}).forEach(key => {
        const value = changes[key];
        if (typeof value !== 'number' || !isFinite(value)) return;
        if (key.indexOf('min') === 0) {
            state.stats[key] = state.stats[key] === undefined ? value : Math.min(state.stats[key], value);
        } else if (key.indexOf('best') === 0) {
            state.stats[key] = Math.max(state.stats[key] || 0, value);
        } else {
            state.stats[key] = (state.stats[key] || 0) + value;
        }
    });

    const newlyUnlocked = [];
    BADGES.forEach(badge => {
        if (!state.unlocked[badge.id] && badge.test(state.stats)) {
            state.unlocked[badge.id] = todayKey();
            newlyUnlocked.push(badge);
        }
    });

    writeProgress('achievements', state);
    if (newlyUnlocked.length) {
        showBadgeToast(newlyUnlocked);
        renderAchievements();
    }
    return newlyUnlocked;
}

function showBadgeToast(badges) {
    const toast = document.createElement('div');
    toast.className = 'badge-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<strong>🏅 New badge${badges.length > 1 ? 's' : ''} unlocked!</strong><br>${badges.map(b => `${b.icon} ${b.name}`).join('<br>')}`;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 4500);
}

function initAchievements() {
    renderAchievements();
}

function renderAchievements() {
    const grid = document.querySelector('.achievement-grid');
    if (!grid) return;

    const state = readAchievements();
    grid.innerHTML = '';
    BADGES.forEach(badge => {
        const unlocked = !!state.unlocked[badge.id];
        const card = document.createElement('div');
        card.className = 'badge-card' + (unlocked ? ' unlocked' : '');
        card.innerHTML = `
            <span class="badge-icon">${unlocked ? badge.icon : '🔒'}</span>
            <strong>${badge.name}</strong>
            <span class="badge-desc">${badge.desc}</span>
            <span class="badge-status">${unlocked ? `Unlocked ${state.unlocked[badge.id]}` : 'Locked'}</span>`;
        grid.appendChild(card);
    });

    const countEl = document.querySelector('.achievement-count');
    if (countEl) countEl.textContent = `${Object.keys(state.unlocked).length} / ${BADGES.length} unlocked`;
}

/* ---------------- 1. daily challenge ---------------- */

const DAILY_GENERATOR_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11];

function dailyQuestionFor(key) {
    const generators = buildTieredGenerators('challenge');
    const seed = hashString('iq-daily-' + key);
    return generators[DAILY_GENERATOR_INDEXES[seed % DAILY_GENERATOR_INDEXES.length]]();
}

function readDaily() {
    const saved = readProgress('dailyChallenge', {});
    return {
        lastDate: saved.lastDate || '',
        streak: saved.streak || 0,
        bestStreak: saved.bestStreak || 0,
        completed: saved.completed || {},
        attempts: saved.attempts || {}
    };
}

function writeDaily(daily) {
    writeProgress('dailyChallenge', daily);
}

function initDailyChallenge() {
    const card = document.getElementById('daily-challenge-card');
    if (!card) return;

    const key = todayKey();
    const question = dailyQuestionFor(key);
    const daily = readDaily();

    const dateEl = card.querySelector('.daily-date');
    const streakEl = card.querySelector('.daily-streak');
    const questionEl = card.querySelector('.daily-question');
    const inputEl = card.querySelector('.daily-input');
    const submitBtn = card.querySelector('.daily-submit');
    const feedbackEl = card.querySelector('.daily-feedback');
    const weekEl = card.querySelector('.daily-week');

    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    }
    if (questionEl) questionEl.innerHTML = question.question;

    function renderStreak() {
        if (streakEl) streakEl.textContent = `🔥 ${daily.streak} day streak`;
    }

    function renderWeek() {
        if (!weekEl) return;
        weekEl.innerHTML = '';
        for (let i = 6; i >= 0; i--) {
            const dayKey = shiftDayKey(key, -i);
            const date = new Date(dayKey + 'T12:00:00');
            const dot = document.createElement('span');
            dot.className = 'daily-day' + (daily.completed[dayKey] ? ' done' : '') + (i === 0 ? ' today' : '');
            dot.title = dayKey;
            dot.innerHTML = `<small>${date.toLocaleDateString(undefined, { weekday: 'narrow' })}</small><b>${daily.completed[dayKey] ? '✓' : '·'}</b>`;
            weekEl.appendChild(dot);
        }
    }

    function lockForToday(message) {
        inputEl.disabled = true;
        submitBtn.disabled = true;
        feedbackEl.textContent = message;
        feedbackEl.className = 'daily-feedback correct';
    }

    renderStreak();
    renderWeek();
    if (daily.completed[key]) {
        lockForToday('✅ Done for today — come back tomorrow!');
    }

    submitBtn.addEventListener('click', () => {
        const value = parseFloat(inputEl.value);
        if (isNaN(value)) {
            feedbackEl.textContent = 'Enter a number to answer.';
            feedbackEl.className = 'daily-feedback wrong';
            return;
        }

        daily.attempts[key] = (daily.attempts[key] || 0) + 1;
        const tolerance = question.tolerance || 0;
        if (Math.abs(value - question.answer) <= tolerance) {
            if (daily.lastDate !== key) {
                daily.streak = daily.lastDate === shiftDayKey(key, -1) ? (daily.streak || 0) + 1 : 1;
                daily.lastDate = key;
            }
            daily.completed[key] = true;
            daily.bestStreak = Math.max(daily.bestStreak || 0, daily.streak);
            writeDaily(daily);
            updateStats({ bestDailyStreak: daily.bestStreak });
            renderStreak();
            renderWeek();
            lockForToday('✅ Correct! Streak saved.');
        } else {
            writeDaily(daily);
            feedbackEl.textContent = '❌ Not quite — try again.';
            feedbackEl.className = 'daily-feedback wrong';
        }
    });

    inputEl.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !submitBtn.disabled) submitBtn.click();
    });
}

/* ---------------- 10. number of the day ---------------- */

const NUMBER_FACTS = [
    { number: '1729', title: 'The taxi-cab number', fact: 'The smallest number that can be written as a sum of two cubes in two different ways: 1³ + 12³ = 9³ + 10³.' },
    { number: '5040', title: 'A factorial giant', fact: '7! = 5040. It was once considered a perfect number of days in a week-inspired calendar.' },
    { number: '6174', title: 'Kaprekar’s constant', fact: 'Take any 4-digit number, sort its digits high and low, subtract, and repeat. You always land on 6174.' },
    { number: '142857', title: 'The cycling number', fact: 'Multiply it by 2, 3, 4, 5 or 6 and you get the same digits, just rotated.' },
    { number: '65536', title: 'A power tower', fact: '2↑↑4 = 2^(2^(2^2)) = 65536. One more level already has over 19,000 digits.' },
    { number: '0!', title: 'The surprising factorial', fact: 'Zero factorial equals 1, not 0. It is the empty product — the neutral starting point for counting arrangements.' },
    { number: '3.14159', title: 'Pi’s opening act', fact: 'Pi never ends and never repeats as far as we know. Five decimals are already enough to build most circles.' },
    { number: '16', title: 'Tesseract corners', fact: 'A 4D hypercube has 16 vertices, 32 edges, 24 square faces and 8 cubic cells.' },
    { number: '1089', title: 'The magic reversal', fact: 'Pick a 3-digit number, reverse it, subtract the smaller from the larger, then add the reverse. You get 1089.' },
    { number: '42', title: 'The answer (allegedly)', fact: 'In math it is also the smallest number expressible as a sum of three cubes in more than one way.' },
    { number: '81', title: 'Nine squared', fact: '9² = 81, and 8 + 1 = 9. Multiply 12345679 by 81 and you get 999999999.' },
    { number: '4096', title: 'Pentation’s cousin', fact: '4⁶ = 4096, while 2↑↑↑3 is already 65536. Hyper-growth makes ordinary powers look tiny.' }
];

function initNumberOfDay() {
    const card = document.getElementById('number-day-card');
    if (!card) return;
    const fact = NUMBER_FACTS[hashString('iq-number-' + todayKey()) % NUMBER_FACTS.length];
    const numberEl = card.querySelector('.number-value');
    const titleEl = card.querySelector('.number-title');
    const factEl = card.querySelector('.number-fact');
    if (numberEl) numberEl.textContent = fact.number;
    if (titleEl) titleEl.textContent = fact.title;
    if (factEl) factEl.textContent = fact.fact;
}

/* ---------------- 3. mistake journal (opt-in) ---------------- */

const MISTAKE_KEY = 'iqMathMistakes';
let pendingMistakes = [];

function readMistakes() {
    try {
        const raw = localStorage.getItem(MISTAKE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function writeMistakes(list) {
    try {
        localStorage.setItem(MISTAKE_KEY, JSON.stringify(list.slice(0, 30)));
    } catch (error) {
        // Best effort only.
    }
}

window.onIQAnswer = function onIQAnswer(question, correct) {
    if (correct || !question) return;
    pendingMistakes.push({
        question: question.question,
        answer: String(question.answer),
        topic: question.topic || 'Mixed',
        date: new Date().toISOString()
    });
};

window.onIQTestFinish = function onIQTestFinish(score, total, percent) {
    updateStats({
        totalTests: 1,
        totalCorrect: score,
        bestPercent: percent,
        perfectTests: percent === 100 ? 1 : 0
    });
    const reviewBtn = document.querySelector('.test-review');
    if (reviewBtn) reviewBtn.style.display = pendingMistakes.length ? 'inline-block' : 'none';
    renderMistakeJournal();
};

function renderMistakeJournal() {
    const section = document.getElementById('mistake-journal');
    if (!section) return;
    const listEl = section.querySelector('.mistake-list');
    const emptyEl = section.querySelector('.mistake-empty');
    const mistakes = readMistakes();
    listEl.innerHTML = '';

    if (!mistakes.length) {
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }
    if (emptyEl) emptyEl.style.display = 'none';

    mistakes.forEach((entry, index) => {
        const item = document.createElement('li');
        item.className = 'mistake-item';
        item.innerHTML = `
            <span class="mistake-topic">${entry.topic}</span>
            <span class="mistake-question">${entry.question}</span>
            <span class="mistake-answer">Answer: ${entry.answer}</span>`;
        const done = document.createElement('button');
        done.type = 'button';
        done.className = 'mistake-done';
        done.textContent = '✓ Reviewed';
        done.addEventListener('click', () => {
            const remaining = readMistakes();
            remaining.splice(index, 1);
            writeMistakes(remaining);
            updateStats({ journalReviewed: 1 });
            renderMistakeJournal();
        });
        item.appendChild(done);
        listEl.appendChild(item);
    });
}

function initMistakeJournal() {
    const section = document.getElementById('mistake-journal');
    if (!section || section.dataset.bound) return;
    section.dataset.bound = '1';

    const reviewBtn = document.querySelector('.test-review');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
            if (pendingMistakes.length) {
                writeMistakes(pendingMistakes.concat(readMistakes()));
                pendingMistakes = [];
            }
            reviewBtn.style.display = 'none';
            renderMistakeJournal();
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
    renderMistakeJournal();
}

/* ---------------- 2. boss battle ---------------- */

const BOSS_SAVE_SCOPE = 'bossBattleActive';

function initBossBattle() {
    const container = document.getElementById('boss-battle');
    if (!container) return;

    const activeArea = container.querySelector('.boss-active');
    const resultEl = container.querySelector('.boss-result');
    const questionEl = container.querySelector('.boss-question');
    const inputEl = container.querySelector('.boss-input');
    const submitBtn = container.querySelector('.boss-submit');
    const nextBtn = container.querySelector('.boss-next');
    const choicesEl = container.querySelector('.boss-choices');
    const feedbackEl = container.querySelector('.boss-feedback');
    const progressEl = container.querySelector('.boss-progress');
    const scoreEl = container.querySelector('.boss-score');
    const timerEl = container.querySelector('.boss-timer');
    const finalEl = container.querySelector('.boss-final');
    const percentEl = container.querySelector('.boss-percent');
    const timeEl = container.querySelector('.boss-time');
    const bestEl = container.querySelector('.boss-best');
    const restartBtn = container.querySelector('.boss-restart');

    let questions = [];
    let index = 0;
    let score = 0;
    let startedAt = Date.now();
    let ticker = null;

    function saveDraft() {
        writeProgress(BOSS_SAVE_SCOPE, { v: 1, questions: questions, index: index, score: score, startedAt: startedAt });
    }

    function restoreDraft() {
        const saved = readProgress(BOSS_SAVE_SCOPE, null);
        if (!saved || saved.v !== 1 || !Array.isArray(saved.questions) || !saved.questions.length) return false;
        if (typeof saved.index !== 'number' || saved.index < 0 || saved.index >= saved.questions.length) return false;
        questions = saved.questions;
        index = saved.index;
        score = typeof saved.score === 'number' ? saved.score : 0;
        startedAt = typeof saved.startedAt === 'number' ? saved.startedAt : Date.now();
        return true;
    }

    function updateTimer() {
        if (timerEl) timerEl.textContent = formatSeconds((Date.now() - startedAt) / 1000);
    }

    function showQuestion() {
        const current = questions[index];
        questionEl.innerHTML = current.question;
        progressEl.textContent = `Battle question ${index + 1} / ${questions.length}`;
        scoreEl.textContent = `Hits: ${score}`;
        feedbackEl.textContent = '';
        feedbackEl.className = 'boss-feedback';
        nextBtn.style.display = 'none';

        if (current.choices && choicesEl) {
            inputEl.style.display = 'none';
            submitBtn.style.display = 'none';
            choicesEl.innerHTML = '';
            current.choices.forEach(choice => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'test-choice';
                button.textContent = choice;
                button.addEventListener('click', () => {
                    if (button.disabled) return;
                    choicesEl.querySelectorAll('button').forEach(b => b.disabled = true);
                    finish(button.textContent === current.answer);
                });
                choicesEl.appendChild(button);
            });
            choicesEl.style.display = 'grid';
        } else {
            if (choicesEl) choicesEl.style.display = 'none';
            inputEl.style.display = '';
            submitBtn.style.display = '';
            inputEl.value = '';
            inputEl.disabled = false;
            submitBtn.disabled = false;
            inputEl.focus();
        }
    }

    function finish(wasCorrect) {
        if (wasCorrect) {
            score++;
            feedbackEl.textContent = '✅ Critical hit!';
            feedbackEl.className = 'boss-feedback correct';
        } else {
            feedbackEl.textContent = '❌ Missed.';
            feedbackEl.className = 'boss-feedback wrong';
        }
        scoreEl.textContent = `Hits: ${score}`;
        inputEl.disabled = true;
        submitBtn.disabled = true;

        if (index === questions.length - 1) {
            clearProgress(BOSS_SAVE_SCOPE);
            const percent = Math.round((score / questions.length) * 100);
            const elapsed = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
            finalEl.textContent = `${score} out of ${questions.length} hits`;
            percentEl.textContent = `${percent}%`;
            timeEl.textContent = formatSeconds(elapsed);

            const currentBest = readProgress('bossBattle', {});
            const best = {
                attempts: (currentBest.attempts || 0) + 1,
                wins: (currentBest.wins || 0) + (percent >= 80 ? 1 : 0),
                bestPercent: Math.max(currentBest.bestPercent || 0, percent),
                minTime: currentBest.minTime ? Math.min(currentBest.minTime, elapsed) : elapsed
            };
            writeProgress('bossBattle', best);
            updateStats({
                bossAttempts: 1,
                bossWins: percent >= 80 ? 1 : 0,
                bestBossPercent: percent,
                minBossTime: elapsed
            });
            bestEl.textContent = `Best: ${best.bestPercent}% in ${formatSeconds(best.minTime)}`;

            activeArea.style.display = 'none';
            resultEl.style.display = 'block';
            if (ticker) { window.clearInterval(ticker); ticker = null; }
        } else {
            saveDraft();
            nextBtn.style.display = 'inline-block';
        }
    }

    function startBattle() {
        questions = buildBossQuestions();
        index = 0;
        score = 0;
        startedAt = Date.now();
        resultEl.style.display = 'none';
        activeArea.style.display = 'block';
        saveDraft();
        updateTimer();
        showQuestion();
        if (!ticker) ticker = window.setInterval(updateTimer, 1000);
    }

    submitBtn.addEventListener('click', () => {
        const value = parseFloat(inputEl.value);
        if (isNaN(value)) {
            feedbackEl.textContent = 'Enter a number to attack.';
            feedbackEl.className = 'boss-feedback wrong';
            return;
        }
        const current = questions[index];
        finish(Math.abs(value - current.answer) <= (current.tolerance || 0));
    });
    inputEl.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !submitBtn.disabled) submitBtn.click();
    });
    nextBtn.addEventListener('click', () => {
        index++;
        saveDraft();
        showQuestion();
    });
    restartBtn.addEventListener('click', startBattle);

    const best = readProgress('bossBattle', {});
    if (best.bestPercent) bestEl.textContent = `Best: ${best.bestPercent}% in ${formatSeconds(best.minTime || 0)}`;

    if (restoreDraft()) {
        activeArea.style.display = 'block';
        resultEl.style.display = 'none';
        updateTimer();
        showQuestion();
        ticker = window.setInterval(updateTimer, 1000);
    } else {
        startBattle();
    }
}

/* ---------------- 6. visual playgrounds ---------------- */

function towerBigInt(base, height) {
    let value = BigInt(base);
    for (let level = 1; level < height; level++) {
        const exponent = Number(value);
        if (!isFinite(exponent) || exponent > 2000) return null;
        value = BigInt(base) ** BigInt(exponent);
        if (String(value).length > 3000) return null;
    }
    return value;
}

function towerDigitEstimate(base, height) {
    let value = Number(base);
    for (let level = 1; level < height; level++) {
        if (!isFinite(value)) return null;
        value = Math.pow(base, value);
    }
    if (!isFinite(value)) return null;
    return Math.floor(value * Math.log10(base)) + 1;
}

function initTetrationPlayground() {
    const box = document.getElementById('tetration-playground');
    if (!box) return;

    const baseInput = box.querySelector('.tg-base');
    const heightInput = box.querySelector('.tg-height');
    const stepsEl = box.querySelector('.tg-steps');
    const resultEl = box.querySelector('.tg-result');

    function render() {
        const base = Number(baseInput.value);
        const height = Number(heightInput.value);
        const steps = [];
        let previous = String(base);

        for (let level = 1; level <= height; level++) {
            if (level === 1) {
                previous = String(base);
            } else {
                const value = towerBigInt(base, level);
                previous = value === null
                    ? `${base}^(${steps[level - 2]})`
                    : value.toLocaleString();
            }
            steps.push(previous);
        }

        stepsEl.innerHTML = '';
        steps.forEach((step, i) => {
            const chip = document.createElement('div');
            chip.className = 'tower-step';
            chip.innerHTML = `<small>height ${i + 1}</small><span>${step}</span>`;
            stepsEl.appendChild(chip);
        });

        const exact = towerBigInt(base, height);
        if (exact !== null) {
            resultEl.textContent = `Exact value: ${exact.toLocaleString()}`;
        } else {
            const digits = towerDigitEstimate(base, height);
            resultEl.textContent = digits === null
                ? 'So large that even its number of digits is too big to write down.'
                : `About ${digits.toLocaleString()} digits — far too many to write out.`;
        }
    }

    baseInput.addEventListener('input', render);
    heightInput.addEventListener('input', render);
    render();
}

function rotatePoint(point, plane, angle) {
    const p = point.slice();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const [a, b] = plane;
    const va = p[a];
    const vb = p[b];
    p[a] = va * cos - vb * sin;
    p[b] = va * sin + vb * cos;
    return p;
}

function initTesseractPlayground() {
    const box = document.getElementById('tesseract-playground');
    if (!box) return;

    const canvas = box.querySelector('#tesseract-canvas');
    const ctx = canvas.getContext('2d');
    const inputs = {
        xy: box.querySelector('.rot-xy'),
        xz: box.querySelector('.rot-xz'),
        xw: box.querySelector('.rot-xw'),
        yw: box.querySelector('.rot-yw'),
        zw: box.querySelector('.rot-zw')
    };
    const spinBtn = box.querySelector('.tesseract-spin');
    let spinning = false;
    let spinAngle = 0;

    const vertices = [];
    for (let i = 0; i < 16; i++) {
        vertices.push([
            (i & 1) ? 1 : -1,
            (i & 2) ? 1 : -1,
            (i & 4) ? 1 : -1,
            (i & 8) ? 1 : -1
        ]);
    }
    const edges = [];
    for (let i = 0; i < 16; i++) {
        for (let bit = 0; bit < 4; bit++) {
            const j = i ^ (1 << bit);
            if (j > i) edges.push([i, j]);
        }
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const angles = {
            xy: Number(inputs.xy.value) * Math.PI / 180,
            xz: Number(inputs.xz.value) * Math.PI / 180,
            xw: Number(inputs.xw.value) * Math.PI / 180,
            yw: Number(inputs.yw.value) * Math.PI / 180,
            zw: (Number(inputs.zw.value) + (spinning ? spinAngle : 0)) * Math.PI / 180
        };

        const projected = vertices.map(original => {
            let p = original.slice();
            p = rotatePoint(p, [0, 1], angles.xy);
            p = rotatePoint(p, [0, 2], angles.xz);
            p = rotatePoint(p, [0, 3], angles.xw);
            p = rotatePoint(p, [1, 3], angles.yw);
            p = rotatePoint(p, [2, 3], angles.zw);

            const perspective = 2.6 / (3.2 - p[3]);
            const x = w / 2 + p[0] * perspective * 105;
            const y = h / 2 + p[1] * perspective * 105;
            return { x, y, depth: p[3], size: 3 + perspective * 2 };
        });

        edges.forEach(([i, j]) => {
            const a = projected[i];
            const b = projected[j];
            const depth = (a.depth + b.depth) / 2;
            ctx.strokeStyle = depth > 0 ? 'rgba(124, 58, 237, 0.85)' : 'rgba(37, 99, 235, 0.55)';
            ctx.lineWidth = depth > 0 ? 2.4 : 1.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        });

        projected.forEach(point => {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    Object.keys(inputs).forEach(key => inputs[key].addEventListener('input', draw));
    spinBtn.addEventListener('click', () => {
        spinning = !spinning;
        spinBtn.textContent = spinning ? '⏸ Stop spin' : '▶ Auto-spin';
        if (spinning) {
            const step = () => {
                if (!spinning) return;
                spinAngle = (spinAngle + 0.7) % 360;
                draw();
                window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        }
    });

    draw();
}

/* ---------------- 9. offline install ---------------- */

let deferredInstallPrompt = null;

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    const secure = location.protocol === 'https:' || ['localhost', '127.0.0.1'].indexOf(location.hostname) !== -1;
    if (!secure) return;
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

function initInstallPrompt() {
    const buttons = document.querySelectorAll('.install-button');
    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        deferredInstallPrompt = event;
        buttons.forEach(button => { button.hidden = false; });
    });
    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            if (!deferredInstallPrompt) return;
            deferredInstallPrompt.prompt();
            await deferredInstallPrompt.userChoice;
            deferredInstallPrompt = null;
            button.hidden = true;
        });
    });
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        buttons.forEach(button => { button.hidden = true; });
    }
}

/* ---------------- boot ---------------- */

document.addEventListener('DOMContentLoaded', () => {
    initTierSelector();
    initAchievements();
    initDailyChallenge();
    initNumberOfDay();
    initMistakeJournal();
    initBossBattle();
    initTetrationPlayground();
    initTesseractPlayground();
    initInstallPrompt();
    registerServiceWorker();
});
