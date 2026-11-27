/* =========================================================================
   IQ Math extras pack 2:
   mastery tree, streak shields, flashcards, speed runs, detective cases,
   story quests, base explorer, easter eggs, cosmetics, audio, progress report.
   Loaded after features.js so it can reuse its helpers and hooks.
   ========================================================================= */

/* ---------------- shared helpers ---------------- */

function extraText(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.textContent || '';
}

const TOPIC_NAMES = [
    'Factorials', 'Square Roots', 'Cube Roots', 'Powers',
    'Tetration', 'Pentation', 'Hexation', 'Logarithms',
    'E=mc²', 'Tesseract', 'Finding Numbers', 'Pi & Circles'
];

const TOPIC_SHORT = [
    'Factorials', 'Roots ²', 'Roots ³', 'Powers',
    'Tetration', 'Pentation', 'Hexation', 'Logs',
    'E=mc²', 'Tesseract', 'Find x', 'Pi'
];

const TOPIC_PAGES = {
    'Factorials': 'factorial.html',
    'Square Roots': 'sqrt.html',
    'Cube Roots': 'cbrt.html',
    'Powers': 'powers.html',
    'Tetration': 'tetration.html',
    'Pentation': 'pentation.html',
    'Hexation': 'hexation.html',
    'Logarithms': 'log.html',
    'E=mc²': 'emc2.html',
    'Tesseract': 'tesseract.html',
    'Finding Numbers': 'finding_numbers.html',
    'Pi & Circles': 'pi.html'
};

function generatorForTopic(topic, tier) {
    const generators = buildTieredGenerators(tier || 'challenge');
    const index = TOPIC_NAMES.indexOf(topic);
    return generators[index === -1 ? 0 : index];
}

function questionForTopic(topic, tier) {
    return generatorForTopic(topic, tier)();
}

function extraShowToast(message) {
    const toast = document.createElement('div');
    toast.className = 'badge-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 4000);
}

/* ---------------- new badges ---------------- */

BADGES.push(
    { id: 'mastery3', icon: '🧠', name: 'Skill Builder', desc: 'Master 3 topics (3 right in a row).', test: s => (s.bestMasteredTopics || 0) >= 3 },
    { id: 'speed', icon: '⏱️', name: 'Speed Demon', desc: 'Score 8 or more in a 60-second speed run.', test: s => (s.bestSpeedScore || 0) >= 8 },
    { id: 'detective', icon: '🕵️', name: 'Sleuth', desc: 'Solve 2 Math Detective cases.', test: s => (s.bestCasesSolved || 0) >= 2 },
    { id: 'quest', icon: '🗺️', name: 'Quest Complete', desc: 'Finish a story quest.', test: s => (s.questsCompleted || 0) >= 1 },
    { id: 'eggs', icon: '🥚', name: 'Secret Keeper', desc: 'Find all 10 hidden digits.', test: s => (s.eggsFound || 0) >= 10 },
    { id: 'collector', icon: '🎨', name: 'Decorator', desc: 'Unlock 3 cosmetics.', test: s => (s.cosmeticsUnlocked || 0) >= 3 }
);

/* ---------------- 11. audio mode ---------------- */

let audioEnabled = readProgress('audioMode', false) === true;
let audioContext = null;

function speakText(text) {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    const clean = extraText(text);
    if (!clean) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
}

function playTone(correct) {
    if (!audioEnabled) return;
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        if (!audioContext) audioContext = new Ctx();
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = correct ? 660 : 180;
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + 0.12);
    } catch (error) {
        // Sound is optional.
    }
}

function initAudioToggle() {
    document.querySelectorAll('.audio-toggle').forEach(button => {
        const label = () => { button.textContent = audioEnabled ? '🔊 Audio: On' : '🔇 Audio: Off'; };
        label();
        button.addEventListener('click', () => {
            audioEnabled = !audioEnabled;
            writeProgress('audioMode', audioEnabled);
            label();
            if (!audioEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
        });
    });
}

window.onIQQuestion = function onIQQuestion(question) {
    if (question) speakText(question.question);
};

/* ---------------- 1. mastery skill tree ---------------- */

function readMastery() {
    return readProgress('mastery', {});
}

function updateMastery(question, correct) {
    if (!question || !question.topic) return;
    const mastery = readMastery();
    const topic = question.topic;
    const entry = mastery[topic] || { attempts: 0, correct: 0, streak: 0, bestStreak: 0 };
    entry.attempts = (entry.attempts || 0) + 1;
    if (correct) {
        entry.correct = (entry.correct || 0) + 1;
        entry.streak = (entry.streak || 0) + 1;
        entry.bestStreak = Math.max(entry.bestStreak || 0, entry.streak);
    } else {
        entry.streak = 0;
    }
    mastery[topic] = entry;
    writeProgress('mastery', mastery);

    const mastered = TOPIC_NAMES.filter(name => mastery[name] && (mastery[name].bestStreak || 0) >= 3).length;
    updateStats({ bestMasteredTopics: mastered });
}

function masteryState(topic, index) {
    const mastery = readMastery();
    const entry = mastery[topic] || {};
    if ((entry.bestStreak || 0) >= 3) return 'mastered';
    const previous = TOPIC_NAMES[index - 1];
    const unlocked = index === 0 || index === 1 ||
        (previous && mastery[previous] && (mastery[previous].bestStreak || 0) >= 2) ||
        (entry.attempts || 0) > 0;
    return unlocked ? 'ready' : 'locked';
}

function svgEl(name, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs || {}).forEach(key => el.setAttribute(key, attrs[key]));
    return el;
}

function initSkillTree() {
    const wrap = document.getElementById('skill-tree');
    if (!wrap) return;

    const points = TOPIC_NAMES.map((topic, i) => ({
        x: 95 + (i % 4) * 185,
        y: 85 + Math.floor(i / 4) * 150
    }));

    const svg = svgEl('svg', { viewBox: '0 0 760 430', class: 'skill-svg', role: 'img', 'aria-label': 'Topic mastery map' });

    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        svg.appendChild(svgEl('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'skill-line' }));
    }

    TOPIC_NAMES.forEach((topic, i) => {
        const point = points[i];
        const state = masteryState(topic, i);
        const link = svgEl('a', { href: TOPIC_PAGES[topic] });
        const group = svgEl('g', { class: 'skill-node ' + state });

        const title = svgEl('title');
        title.textContent = `${topic} — ${state === 'mastered' ? 'mastered' : state === 'ready' ? 'ready to learn' : 'locked'}`;
        group.appendChild(title);

        group.appendChild(svgEl('circle', { cx: point.x, cy: point.y, r: 34 }));
        const emoji = svgEl('text', { x: point.x, y: point.y + 7, class: 'skill-emoji' });
        emoji.textContent = state === 'mastered' ? '★' : state === 'locked' ? '🔒' : (TOPIC_SHORT[i] || '•').slice(0, 1);
        group.appendChild(emoji);

        const label = svgEl('text', { x: point.x, y: point.y + 56, class: 'skill-label' });
        label.textContent = TOPIC_SHORT[i];
        group.appendChild(label);

        link.appendChild(group);
        svg.appendChild(link);
    });

    wrap.innerHTML = '';
    wrap.appendChild(svg);

    const counter = document.querySelector('.skill-mastered');
    if (counter) {
        const count = TOPIC_NAMES.filter((topic, i) => masteryState(topic, i) === 'mastered').length;
        counter.textContent = `${count} / ${TOPIC_NAMES.length} topics mastered`;
    }
}

/* Hook the mixed test's answer/finish events (features.js owns the base hook). */
const baseOnAnswer = window.onIQAnswer;
window.onIQAnswer = function onIQAnswerPlus(question, correct, index, total) {
    if (typeof baseOnAnswer === 'function') {
        try { baseOnAnswer(question, correct, index, total); } catch (error) { /* no-op */ }
    }
    if (correct) playTone(true); else playTone(false);
    updateMastery(question, correct);
};

const baseOnFinish = window.onIQTestFinish;
window.onIQTestFinish = function onIQTestFinishPlus(score, total, percent) {
    if (typeof baseOnFinish === 'function') {
        try { baseOnFinish(score, total, percent); } catch (error) { /* no-op */ }
    }
    if (typeof window.renderSkillTree === 'function') window.renderSkillTree();
};
window.renderSkillTree = initSkillTree;

/* ---------------- 4. flashcard lab ---------------- */

const CARD_INTERVALS = [1, 2, 4, 7, 14];

function ensureFlashcardDeck() {
    let deck = readProgress('flashcards', null);
    if (deck && Array.isArray(deck.cards) && deck.cards.length) return deck;

    const cards = TOPIC_NAMES.map(topic => {
        const question = questionForTopic(topic, 'challenge');
        return {
            id: hashString('fc-' + question.question),
            front: question.question,
            back: String(question.answer),
            topic: topic,
            box: 0,
            due: todayKey()
        };
    });

    readMistakes().forEach(mistake => {
        const id = hashString('fc-mistake-' + mistake.question);
        if (cards.some(card => card.id === id)) return;
        cards.push({
            id: id,
            front: mistake.question,
            back: String(mistake.answer),
            topic: mistake.topic || 'Mixed',
            box: 0,
            due: todayKey()
        });
    });

    deck = { cards: cards };
    writeProgress('flashcards', deck);
    return deck;
}

function initFlashcards() {
    const box = document.getElementById('flashcard-lab');
    if (!box) return;

    const frontEl = box.querySelector('.flash-front');
    const backEl = box.querySelector('.flash-back');
    const topicEl = box.querySelector('.flash-topic');
    const statusEl = box.querySelector('.flash-status');
    const revealBtn = box.querySelector('.flash-reveal');
    const gotBtn = box.querySelector('.flash-got');
    const missedBtn = box.querySelector('.flash-missed');
    const resetBtn = box.querySelector('.flash-reset');

    let due = [];
    let current = 0;
    let revealed = false;

    function load() {
        const deck = ensureFlashcardDeck();
        due = deck.cards.filter(card => card.due <= todayKey());
        current = 0;
        render();
    }

    function render() {
        if (!due.length) {
            topicEl.textContent = 'All caught up';
            frontEl.textContent = 'No cards are due today. Nice work!';
            backEl.textContent = '';
            statusEl.textContent = 'Come back tomorrow, or reset the deck to review everything now.';
            revealBtn.disabled = true;
            gotBtn.disabled = true;
            missedBtn.disabled = true;
            return;
        }

        const card = due[Math.min(current, due.length - 1)];
        topicEl.textContent = card.topic;
        frontEl.innerHTML = card.front;
        backEl.textContent = revealed ? card.back : '';
        backEl.style.visibility = revealed ? 'visible' : 'hidden';
        statusEl.textContent = `Card ${current + 1} of ${due.length} · box ${card.box + 1}`;
        revealBtn.disabled = revealed;
        gotBtn.disabled = !revealed;
        missedBtn.disabled = !revealed;
        if (revealed) speakText('Answer: ' + card.back);
    }

    function grade(wasCorrect) {
        const card = due[Math.min(current, due.length - 1)];
        const deck = ensureFlashcardDeck();
        const stored = deck.cards.find(item => item.id === card.id);
        if (stored) {
            stored.box = wasCorrect ? Math.min((stored.box || 0) + 1, CARD_INTERVALS.length - 1) : 0;
            stored.due = shiftDayKey(todayKey(), CARD_INTERVALS[stored.box]);
        }
        writeProgress('flashcards', deck);
        playTone(wasCorrect);
        due.splice(current, 1);
        if (current >= due.length) current = 0;
        revealed = false;
        render();
    }

    revealBtn.addEventListener('click', () => { revealed = true; render(); });
    gotBtn.addEventListener('click', () => grade(true));
    missedBtn.addEventListener('click', () => grade(false));
    resetBtn.addEventListener('click', () => {
        const deck = ensureFlashcardDeck();
        deck.cards.forEach(card => { card.due = todayKey(); });
        writeProgress('flashcards', deck);
        load();
    });

    load();
}

/* ---------------- 5. speed run arena ---------------- */

function initSpeedRun() {
    const box = document.getElementById('speed-run');
    if (!box) return;

    const topicSelect = box.querySelector('.speed-topic');
    const startBtn = box.querySelector('.speed-start');
    const questionEl = box.querySelector('.speed-question');
    const inputEl = box.querySelector('.speed-input');
    const submitBtn = box.querySelector('.speed-submit');
    const choicesEl = box.querySelector('.speed-choices');
    const feedbackEl = box.querySelector('.speed-feedback');
    const statusEl = box.querySelector('.speed-status');
    const bestEl = box.querySelector('.speed-best');
    const resultEl = box.querySelector('.speed-result');
    const finalEl = box.querySelector('.speed-final');
    const clockEl = box.querySelector('.speed-clock');

    let questions = [];
    let index = 0;
    let score = 0;
    let deadline = 0;
    let timer = null;
    let active = false;

    function bestKey() {
        return topicSelect.value;
    }

    function renderBest() {
        const all = readProgress('speedRuns', {});
        const entry = all[bestKey()];
        bestEl.textContent = entry && entry.bestScore !== undefined
            ? `Best: ${entry.bestScore}/10 in ${formatSeconds((entry.bestTimeMs || 0) / 1000)}`
            : 'Best: not set yet';
    }

    function stopTimer() {
        if (timer) { window.clearInterval(timer); timer = null; }
        active = false;
    }

    function finish() {
        if (!active) return;
        stopTimer();
        inputEl.disabled = true;
        submitBtn.disabled = true;
        questionEl.textContent = 'Time!';
        finalEl.textContent = `${score} out of ${questions.length} correct`;
        const all = readProgress('speedRuns', {});
        const key = bestKey();
        const old = all[key] || {};
        const elapsed = 60000 - Math.max(0, deadline - Date.now());
        const bestScore = Math.max(old.bestScore || 0, score);
        const bestTime = bestScore === score ? Math.min(old.bestTimeMs || Infinity, elapsed) : (old.bestTimeMs || elapsed);
        all[key] = { bestScore: bestScore, bestTimeMs: isFinite(bestTime) ? bestTime : elapsed, lastScore: score };
        writeProgress('speedRuns', all);
        updateStats({ bestSpeedScore: bestScore });
        bestEl.textContent = `Best: ${bestScore}/10 in ${formatSeconds(all[key].bestTimeMs / 1000)}`;
        resultEl.style.display = 'block';
        playTone(score >= 8);
    }

    function showQuestion() {
        const current = questions[index];
        statusEl.textContent = `Question ${index + 1} / ${questions.length}`;
        feedbackEl.textContent = '';
        questionEl.innerHTML = current.question;
        speakText(current.question);
        choicesEl.innerHTML = '';
        if (current.choices) {
            inputEl.style.display = 'none';
            submitBtn.style.display = 'none';
            choicesEl.style.display = 'grid';
            current.choices.forEach(choice => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'test-choice';
                button.textContent = choice;
                button.addEventListener('click', () => answer(choice === current.answer));
                choicesEl.appendChild(button);
            });
        } else {
            choicesEl.style.display = 'none';
            inputEl.style.display = '';
            submitBtn.style.display = '';
            inputEl.value = '';
            inputEl.disabled = false;
            submitBtn.disabled = false;
            inputEl.focus();
        }
    }

    function next() {
        index++;
        if (index >= questions.length) { finish(); return; }
        showQuestion();
    }

    function answer(correct) {
        if (!active) return;
        if (correct) { score++; playTone(true); } else { playTone(false); }
        feedbackEl.textContent = correct ? '✅ Correct' : '❌ Incorrect';
        feedbackEl.className = 'speed-feedback ' + (correct ? 'correct' : 'wrong');
        next();
    }

    startBtn.addEventListener('click', () => {
        stopTimer();
        const topic = bestKey();
        for (let i = 0; i < 10; i++) {
            questions.push(topic === 'All Topics'
                ? questionForTopic(TOPIC_NAMES[Math.floor(Math.random() * TOPIC_NAMES.length)], 'challenge')
                : questionForTopic(topic, 'challenge'));
        }
        index = 0;
        score = 0;
        deadline = Date.now() + 60000;
        active = true;
        resultEl.style.display = 'none';
        startBtn.textContent = 'Restart Run';
        timer = window.setInterval(() => {
            const left = Math.max(0, deadline - Date.now());
            clockEl.textContent = formatSeconds(left / 1000);
            if (left <= 0) finish();
        }, 250);
        clockEl.textContent = '01:00';
        showQuestion();
    });

    submitBtn.addEventListener('click', () => {
        const value = parseFloat(inputEl.value);
        if (isNaN(value)) {
            feedbackEl.textContent = 'Enter a number to answer.';
            feedbackEl.className = 'speed-feedback wrong';
            return;
        }
        const current = questions[index];
        answer(Math.abs(value - current.answer) <= (current.tolerance || 0));
    });
    inputEl.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !submitBtn.disabled) submitBtn.click();
    });

    topicSelect.addEventListener('change', renderBest);
    renderBest();
}

/* ---------------- 6. math detective ---------------- */

const DETECTIVE_CASES = [
    {
        id: 'case1', title: 'The Vanishing Cube',
        story: 'A cube-shaped vault is missing its key. Each correct answer reveals the next clue.',
        clues: [
            { text: 'Clue 1: The key is hidden under a cube root. Find it.', topic: 'Cube Roots' },
            { text: 'Clue 2: The guard asks for a factorial. Give him the answer.', topic: 'Factorials' },
            { text: 'Clue 3: One last power unlocks the vault.', topic: 'Powers' }
        ]
    },
    {
        id: 'case2', title: 'The Log Cabin Cipher',
        story: 'A coded note is written in logarithms. Crack each line to move deeper into the woods.',
        clues: [
            { text: 'Clue 1: The first digit hides in a logarithm.', topic: 'Logarithms' },
            { text: 'Clue 2: A square root opens the cabin door.', topic: 'Square Roots' },
            { text: 'Clue 3: Solve for x to read the final message.', topic: 'Finding Numbers' }
        ]
    },
    {
        id: 'case3', title: 'The Tesseract Trail',
        story: 'A 4D footprint leads through a garden of giant numbers.',
        clues: [
            { text: 'Clue 1: Count the corners of the footprint.', topic: 'Tesseract' },
            { text: 'Clue 2: Measure a tower of powers.', topic: 'Tetration' },
            { text: 'Clue 3: A circle holds the last coordinate.', topic: 'Pi & Circles' }
        ]
    },
    {
        id: 'case4', title: 'The Midnight Equation',
        story: 'The city clock is frozen. Repair it before the sun comes up.',
        clues: [
            { text: 'Clue 1: Recharge the battery with E = mc².', topic: 'E=mc²' },
            { text: 'Clue 2: Align the pentation gears.', topic: 'Pentation' },
            { text: 'Clue 3: Set the final hexation dial.', topic: 'Hexation' }
        ]
    }
];

function initDetective() {
    const box = document.getElementById('detective');
    if (!box) return;

    const caseListEl = box.querySelector('.detective-cases');
    const storyEl = box.querySelector('.detective-story');
    const questionEl = box.querySelector('.detective-question');
    const inputEl = box.querySelector('.detective-input');
    const submitBtn = box.querySelector('.detective-submit');
    const feedbackEl = box.querySelector('.detective-feedback');
    const progressEl = box.querySelector('.detective-progress');

    let state = readProgress('detective', {});
    let activeId = null;
    let question = null;

    function solvedCount() {
        return DETECTIVE_CASES.filter(item => state[item.id] && state[item.id].completed).length;
    }

    function renderCases() {
        caseListEl.innerHTML = '';
        DETECTIVE_CASES.forEach(item => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'detective-case';
            const done = state[item.id] && state[item.id].completed;
            button.textContent = `${done ? '✅' : '🕵️'} ${item.title}`;
            button.addEventListener('click', () => openCase(item.id));
            caseListEl.appendChild(button);
        });
        const countEl = box.querySelector('.detective-count');
        if (countEl) countEl.textContent = `${solvedCount()} / ${DETECTIVE_CASES.length} cases solved`;
    }

    function openCase(id) {
        const item = DETECTIVE_CASES.find(c => c.id === id);
        if (!item) return;
        activeId = id;
        const progress = (state[id] && state[id].step) || 0;
        if (progress >= item.clues.length) {
            storyEl.textContent = item.story + ' Case closed!';
            questionEl.textContent = 'You already solved this case.';
            inputEl.disabled = true;
            submitBtn.disabled = true;
            progressEl.textContent = 'Case complete';
            feedbackEl.textContent = '';
            return;
        }
        const clue = item.clues[progress];
        storyEl.textContent = item.story;
        question = questionForTopic(clue.topic, 'challenge');
        questionEl.innerHTML = clue.text + ' ' + question.question;
        progressEl.textContent = `Clue ${progress + 1} / ${item.clues.length}`;
        inputEl.value = '';
        inputEl.disabled = false;
        submitBtn.disabled = false;
        feedbackEl.textContent = '';
        speakText(questionEl.textContent);
        inputEl.focus();
    }

    submitBtn.addEventListener('click', () => {
        if (!activeId || !question) return;
        const value = parseFloat(inputEl.value);
        if (isNaN(value)) {
            feedbackEl.textContent = 'Enter a number to continue.';
            feedbackEl.className = 'detective-feedback wrong';
            return;
        }
        if (Math.abs(value - question.answer) <= (question.tolerance || 0)) {
            playTone(true);
            const item = DETECTIVE_CASES.find(c => c.id === activeId);
            const entry = state[activeId] || { step: 0, completed: false };
            entry.step++;
            if (entry.step >= item.clues.length) {
                entry.completed = true;
                extraShowToast(`🕵️ Case closed: ${item.title}`);
            }
            state[activeId] = entry;
            writeProgress('detective', state);
            if (entry.completed) updateStats({ bestCasesSolved: solvedCount() });
            renderCases();
            openCase(activeId);
        } else {
            playTone(false);
            feedbackEl.textContent = 'That clue does not fit — try again.';
            feedbackEl.className = 'detective-feedback wrong';
        }
    });
    inputEl.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !submitBtn.disabled) submitBtn.click();
    });

    renderCases();
    if (solvedCount() === DETECTIVE_CASES.length) {
        openCase(DETECTIVE_CASES[0].id);
    } else {
        const nextCase = DETECTIVE_CASES.find(item => !state[item.id] || !state[item.id].completed) || DETECTIVE_CASES[0];
        openCase(nextCase.id);
    }
}

/* ---------------- 7. story quests ---------------- */

const QUESTS = [
    {
        id: 'quest1', title: 'Repair the Tesseract',
        story: 'The 4D engine is broken. Restore each layer, then face its guardian.',
        stages: [
            { text: 'Layer 1: Count the cubic cells.', topic: 'Tesseract' },
            { text: 'Layer 2: Stabilise the power core.', topic: 'Powers' },
            { text: 'Layer 3: Raise the growth shield.', topic: 'Tetration' }
        ],
        bossTopic: 'Hexation'
    },
    {
        id: 'quest2', title: 'The Factorial Foundry',
        story: 'The foundry machines have stopped. Restart them in the right order.',
        stages: [
            { text: 'Machine 1: A factorial gear.', topic: 'Factorials' },
            { text: 'Machine 2: A square-root belt.', topic: 'Square Roots' },
            { text: 'Machine 3: A cube-root piston.', topic: 'Cube Roots' }
        ],
        bossTopic: 'Factorials'
    },
    {
        id: 'quest3', title: 'Return of the Log Keeper',
        story: 'The keeper lost the coordinates. Recover them and open the gate.',
        stages: [
            { text: 'Coordinate 1: Read the log scroll.', topic: 'Logarithms' },
            { text: 'Coordinate 2: Solve for x.', topic: 'Finding Numbers' },
            { text: 'Coordinate 3: Measure the circle.', topic: 'Pi & Circles' }
        ],
        bossTopic: 'Logarithms'
    }
];

function initQuests() {
    const box = document.getElementById('quests');
    if (!box) return;

    const listEl = box.querySelector('.quest-list');
    const storyEl = box.querySelector('.quest-story');
    const questionEl = box.querySelector('.quest-question');
    const inputEl = box.querySelector('.quest-input');
    const submitBtn = box.querySelector('.quest-submit');
    const feedbackEl = box.querySelector('.quest-feedback');
    const statusEl = box.querySelector('.quest-status');

    let state = readProgress('quests', {});
    let activeId = null;
    let question = null;
    let isBoss = false;

    function completedCount() {
        return QUESTS.filter(q => state[q.id] && state[q.id].completed).length;
    }

    function renderList() {
        listEl.innerHTML = '';
        QUESTS.forEach(quest => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'quest-item';
            button.textContent = `${state[quest.id] && state[quest.id].completed ? '✅' : '🗺️'} ${quest.title}`;
            button.addEventListener('click', () => openQuest(quest.id));
            listEl.appendChild(button);
        });
        const countEl = box.querySelector('.quest-count');
        if (countEl) countEl.textContent = `${completedCount()} / ${QUESTS.length} quests complete`;
    }

    function openQuest(id) {
        const quest = QUESTS.find(q => q.id === id);
        if (!quest) return;
        activeId = id;
        const entry = state[id] || { step: 0, completed: false };
        storyEl.textContent = quest.story;
        if (entry.completed) {
            questionEl.textContent = 'Quest complete — the realm is safe!';
            inputEl.disabled = true;
            submitBtn.disabled = true;
            statusEl.textContent = 'Completed';
            feedbackEl.textContent = '';
            return;
        }
        isBoss = entry.step >= quest.stages.length;
        const stage = isBoss ? { text: 'Final guardian: ' + quest.bossTopic, topic: quest.bossTopic } : quest.stages[entry.step];
        question = questionForTopic(stage.topic, isBoss ? 'master' : 'challenge');
        questionEl.innerHTML = stage.text + ' ' + question.question;
        statusEl.textContent = isBoss ? 'Mini-boss' : `Stage ${entry.step + 1} / ${quest.stages.length}`;
        inputEl.value = '';
        inputEl.disabled = false;
        submitBtn.disabled = false;
        feedbackEl.textContent = '';
        speakText(questionEl.textContent);
        inputEl.focus();
    }

    submitBtn.addEventListener('click', () => {
        if (!activeId || !question) return;
        const value = parseFloat(inputEl.value);
        if (isNaN(value)) {
            feedbackEl.textContent = 'Enter a number to continue.';
            feedbackEl.className = 'quest-feedback wrong';
            return;
        }
        if (Math.abs(value - question.answer) <= (question.tolerance || 0)) {
            playTone(true);
            const quest = QUESTS.find(q => q.id === activeId);
            const entry = state[activeId] || { step: 0, completed: false };
            entry.step++;
            if (isBoss) {
                entry.completed = true;
                extraShowToast(`🗺️ Quest complete: ${quest.title}`);
                updateStats({ questsCompleted: 1 });
            }
            state[activeId] = entry;
            writeProgress('quests', state);
            renderList();
            openQuest(activeId);
        } else {
            playTone(false);
            feedbackEl.textContent = 'The guardian is not convinced — try again.';
            feedbackEl.className = 'quest-feedback wrong';
        }
    });
    inputEl.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !submitBtn.disabled) submitBtn.click();
    });

    renderList();
    const nextQuest = QUESTS.find(q => !state[q.id] || !state[q.id].completed) || QUESTS[0];
    openQuest(nextQuest.id);
}

/* ---------------- 8. base explorer ---------------- */

function initBaseExplorer() {
    const box = document.getElementById('base-explorer');
    if (!box) return;

    const inputEl = box.querySelector('.base-input');
    const binaryEl = box.querySelector('.base-binary');
    const octalEl = box.querySelector('.base-octal');
    const hexEl = box.querySelector('.base-hex');
    const bitsEl = box.querySelector('.base-bits');
    const decimalEl = box.querySelector('.base-decimal');

    function render() {
        const value = Math.max(0, Math.min(255, Math.floor(Number(inputEl.value) || 0)));
        inputEl.value = value;
        decimalEl.textContent = value;
        binaryEl.textContent = value.toString(2).padStart(8, '0');
        octalEl.textContent = value.toString(8);
        hexEl.textContent = value.toString(16).toUpperCase();

        bitsEl.innerHTML = '';
        for (let bit = 7; bit >= 0; bit--) {
            const on = !!(value & (1 << bit));
            const tile = document.createElement('button');
            tile.type = 'button';
            tile.className = 'bit-tile' + (on ? ' on' : '');
            tile.textContent = on ? '1' : '0';
            tile.title = `2^${bit} = ${1 << bit}`;
            tile.addEventListener('click', () => {
                inputEl.value = String(value ^ (1 << bit));
                render();
            });
            bitsEl.appendChild(tile);
        }
    }

    inputEl.addEventListener('input', render);
    render();
}

/* ---------------- 9. easter egg hunt ---------------- */

const EGG_PAGES = [
    'factorial.html', 'sqrt.html', 'cbrt.html', 'powers.html', 'tetration.html',
    'pentation.html', 'hexation.html', 'log.html', 'emc2.html', 'pi.html'
];
const EGG_DIGITS = ['1', '7', '2', '9', '4', '5', '6', '3', '8', '0'];

function initEasterEggs() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const index = EGG_PAGES.indexOf(page);
    const countEl = document.querySelector('.egg-count');
    const state = readProgress('eggs', {});
    const found = Array.isArray(state.found) ? state.found : [];
    if (countEl) countEl.textContent = `${found.length} / ${EGG_DIGITS.length} digits found`;

    if (index === -1) return;
    const container = document.querySelector('main.topic-page .container');
    if (!container || container.dataset.eggBound) return;
    container.dataset.eggBound = '1';

    const digit = EGG_DIGITS[index];
    const egg = document.createElement('button');
    egg.type = 'button';
    egg.className = 'math-egg' + (found.indexOf(digit) !== -1 ? ' found' : '');
    egg.textContent = found.indexOf(digit) !== -1 ? digit : '✦';
    egg.title = 'A hidden digit...';
    egg.addEventListener('click', () => {
        if (egg.classList.contains('found')) return;
        const current = readProgress('eggs', {});
        const list = Array.isArray(current.found) ? current.found : [];
        if (list.indexOf(digit) === -1) list.push(digit);
        current.found = list;
        writeProgress('eggs', current);
        egg.textContent = digit;
        egg.classList.add('found');
        updateStats({ eggsFound: list.length });
        if (countEl) countEl.textContent = `${list.length} / ${EGG_DIGITS.length} digits found`;
        extraShowToast(`🥚 Hidden digit found: ${digit} (${list.length}/${EGG_DIGITS.length})`);
        playTone(true);
    });
    container.appendChild(egg);
}

/* ---------------- 10. cosmetics shop ---------------- */

const COSMETICS = [
    { id: 'midnight', name: 'Midnight', icon: '🌙', cost: 20, type: 'theme', value: 'midnight', desc: 'A calm dark theme.' },
    { id: 'forest', name: 'Forest', icon: '🌲', cost: 25, type: 'theme', value: 'forest', desc: 'Cool green tones.' },
    { id: 'sunset', name: 'Sunset', icon: '🌅', cost: 30, type: 'theme', value: 'sunset', desc: 'Warm orange glow.' },
    { id: 'candy', name: 'Candy', icon: '🍬', cost: 35, type: 'theme', value: 'candy', desc: 'Bright pink accents.' },
    { id: 'gold', name: 'Gold Frame', icon: '🟨', cost: 15, type: 'frame', value: 'gold', desc: 'A golden profile frame.' },
    { id: 'neon', name: 'Neon Frame', icon: '💚', cost: 25, type: 'frame', value: 'neon', desc: 'A glowing green frame.' },
    { id: 'orbit', name: 'Orbit Frame', icon: '🪐', cost: 35, type: 'frame', value: 'orbit', desc: 'A cosmic orbit frame.' }
];

function cosmeticPoints() {
    const achievements = readAchievements();
    const earned = Object.keys(achievements.unlocked).length * 10 +
        (achievements.stats.totalCorrect || 0) +
        (achievements.stats.eggsFound || 0) * 2 +
        (achievements.stats.questsCompleted || 0) * 5;
    const spent = readProgress('cosmetics', {}).spent || 0;
    return Math.max(0, earned - spent);
}

function applyCosmetics() {
    const state = readProgress('cosmetics', {});
    const equipped = state.equipped || {};
    document.documentElement.setAttribute('data-theme', equipped.theme || 'default');
    document.querySelectorAll('.cosmetic-profile').forEach(profile => {
        profile.className = 'cosmetic-profile' + (equipped.frame ? ' frame-' + equipped.frame : '');
    });
}

function initCosmetics() {
    const box = document.getElementById('cosmetics-shop');
    if (!box) return;

    const gridEl = box.querySelector('.cosmetic-grid');
    const pointsEl = box.querySelector('.cosmetic-points');

    function render() {
        const state = readProgress('cosmetics', {});
        const unlocked = Array.isArray(state.unlocked) ? state.unlocked : [];
        const equipped = state.equipped || {};
        pointsEl.textContent = `${cosmeticPoints()} points available`;
        gridEl.innerHTML = '';

        COSMETICS.forEach(item => {
            const card = document.createElement('div');
            card.className = 'cosmetic-card';
            const owned = unlocked.indexOf(item.id) !== -1;
            const isEquipped = (equipped[item.type] || '') === item.value;
            card.innerHTML = `
                <span class="cosmetic-icon">${item.icon}</span>
                <strong>${item.name}</strong>
                <span class="cosmetic-desc">${item.desc}</span>
                <span class="cosmetic-meta">${owned ? 'Owned' : item.cost + ' points'}</span>`;

            if (isEquipped) {
                const tag = document.createElement('span');
                tag.className = 'cosmetic-tag';
                tag.textContent = '✓ Equipped';
                card.appendChild(tag);
            } else if (owned) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'cosmetic-action';
                button.textContent = 'Equip';
                button.addEventListener('click', () => {
                    const current = readProgress('cosmetics', {});
                    current.equipped = current.equipped || {};
                    current.equipped[item.type] = item.value;
                    writeProgress('cosmetics', current);
                    applyCosmetics();
                    render();
                });
                card.appendChild(button);
            } else {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'cosmetic-action';
                button.textContent = 'Unlock';
                button.disabled = cosmeticPoints() < item.cost;
                button.addEventListener('click', () => {
                    const current = readProgress('cosmetics', {});
                    if (cosmeticPoints() < item.cost) return;
                    current.spent = (current.spent || 0) + item.cost;
                    current.unlocked = Array.isArray(current.unlocked) ? current.unlocked : [];
                    current.unlocked.push(item.id);
                    current.equipped = current.equipped || {};
                    current.equipped[item.type] = item.value;
                    writeProgress('cosmetics', current);
                    applyCosmetics();
                    updateStats({ cosmeticsUnlocked: 1 });
                    render();
                });
                card.appendChild(button);
            }
            gridEl.appendChild(card);
        });

        const preview = box.querySelector('.cosmetic-profile');
        if (preview) {
            const stateNow = readProgress('cosmetics', {});
            const eq = stateNow.equipped || {};
            preview.innerHTML = `<span class="profile-avatar">${eq.frame ? COSMETICS.find(c => c.value === eq.frame).icon : '🧮'}</span>
                <span><strong>My IQ Math profile</strong><br><small>Theme: ${eq.theme || 'default'} · Frame: ${eq.frame || 'none'}</small></span>`;
            applyCosmetics();
        }
    }

    render();
}

/* ---------------- 12. printable progress report ---------------- */

function initReport() {
    const box = document.getElementById('progress-report');
    if (!box) return;

    const achievements = readAchievements();
    const stats = achievements.stats || {};
    const mastery = readMastery();
    const daily = readDaily();
    const shields = readProgress('streakShields', {});
    const speed = readProgress('speedRuns', {});
    const eggState = readProgress('eggs', {});
    const detectiveState = readProgress('detective', {});
    const questState = readProgress('quests', {});

    const facts = [
        ['Mixed tests completed', stats.totalTests || 0],
        ['Best mixed test', (stats.bestPercent || 0) + '%'],
        ['Perfect tests', stats.perfectTests || 0],
        ['Daily streak', (daily.streak || 0) + ' days (best ' + (daily.bestStreak || 0) + ')'],
        ['Streak shields', shields.count || 0],
        ['Badges unlocked', Object.keys(achievements.unlocked || {}).length + ' / ' + BADGES.length],
        ['Detective cases', DETECTIVE_CASES.filter(c => detectiveState[c.id] && detectiveState[c.id].completed).length + ' / ' + DETECTIVE_CASES.length],
        ['Quests complete', QUESTS.filter(q => questState[q.id] && questState[q.id].completed).length + ' / ' + QUESTS.length],
        ['Hidden digits', (eggState.found || []).length + ' / ' + EGG_DIGITS.length]
    ];

    const table = box.querySelector('.report-facts');
    facts.forEach(([label, value]) => {
        const row = document.createElement('div');
        row.className = 'report-row';
        row.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
        table.appendChild(row);
    });

    const list = box.querySelector('.report-mastery');
    TOPIC_NAMES.forEach((topic, i) => {
        const state = masteryState(topic, i);
        const entry = mastery[topic] || {};
        const row = document.createElement('div');
        row.className = 'report-mastery-row';
        row.innerHTML = `<span>${topic}</span><span>${state === 'mastered' ? '★ Mastered' : state === 'ready' ? 'In progress' : 'Locked'}</span><small>${entry.bestStreak || 0} best streak · ${entry.correct || 0} correct</small>`;
        list.appendChild(row);
    });

    const speedList = box.querySelector('.report-speed');
    const speedEntries = Object.keys(speed);
    speedList.textContent = speedEntries.length
        ? speedEntries.map(topic => `${topic}: ${speed[topic].bestScore}/10`).join(' · ')
        : 'No speed runs recorded yet.';

    document.querySelectorAll('.report-print').forEach(button => {
        button.addEventListener('click', () => window.print());
    });
}

/* ---------------- boot ---------------- */

document.addEventListener('DOMContentLoaded', () => {
    applyCosmetics();
    initAudioToggle();
    initSkillTree();
    initFlashcards();
    initSpeedRun();
    initDetective();
    initQuests();
    initBaseExplorer();
    initEasterEggs();
    initCosmetics();
    initReport();
});
