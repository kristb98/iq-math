document.addEventListener('DOMContentLoaded', () => {
    // Dynamic navigation with category dropdowns
    buildNavigation();

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Generate perfect square roots table (0-500, no decimals)
    const sqrtBody = document.getElementById('sqrt-body');
    if (sqrtBody) {
        for (let i = 0; i * i <= 500; i++) {
            const n = i * i;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${n}</td><td>${i}</td><td>${i} × ${i} = ${n}</td>`;
            sqrtBody.appendChild(row);
        }
    }

    // Generate perfect cube roots table (0-500, no decimals)
    const cbrtBody = document.getElementById('cbrt-body');
    if (cbrtBody) {
        for (let i = 0; i * i * i <= 500; i++) {
            const n = i * i * i;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${n}</td><td>${i}</td><td>${i} × ${i} × ${i} = ${n}</td>`;
            cbrtBody.appendChild(row);
        }
    }

    // Standard multiple-choice quizzes
    document.querySelectorAll('.quiz').forEach(quiz => {
        const buttons = quiz.querySelectorAll('.options button');
        const feedback = quiz.querySelector('.feedback');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Prevent multiple answers
                if (button.disabled) return;
                buttons.forEach(btn => btn.disabled = true);

                const isCorrect = button.dataset.answer === 'correct';
                if (isCorrect) {
                    button.classList.add('correct');
                    feedback.textContent = '✅ Correct! Great job.';
                    feedback.className = 'feedback correct';
                } else {
                    button.classList.add('wrong');
                    feedback.textContent = '❌ Not quite. Try reviewing the section above.';
                    feedback.className = 'feedback wrong';
                }
            });
        });
    });

    // ---------------- INTERACTIVE EXERCISES ----------------

    // 1. Factorial Exercise
    initInputExercise('factorial-exercise', () => {
        const n = randInt(2, 10);
        let result = 1;
        let calc = '';
        for (let i = n; i >= 1; i--) {
            result *= i;
            calc += (i === n ? '' : ' × ') + i;
        }
        return {
            question: `Calculate ${n}!`,
            answer: result,
            hint: `${calc} = ${result}`
        };
    });

    // 2. Power Exercise
    initInputExercise('power-exercise', () => {
        const base = randInt(2, 9);
        const exp = randInt(2, 4);
        const answer = Math.pow(base, exp);
        const calc = Array(exp).fill(base).join(' × ');
        return {
            question: `Calculate ${base}<sup>${exp}</sup>`,
            answer: answer,
            hint: `${calc} = ${answer}`
        };
    });

    // 3. Square Root Exercise (perfect squares 0-500)
    initInputExercise('sqrt-exercise', () => {
        const root = randInt(0, 22);
        const n = root * root;
        return {
            question: `What is √${n}?`,
            answer: root,
            hint: `${root} × ${root} = ${n}`
        };
    });

    // 4. Cube Root Exercise (perfect cubes 0-500)
    initInputExercise('cbrt-exercise', () => {
        const root = randInt(0, 7);
        const n = root * root * root;
        return {
            question: `What is ∛${n}?`,
            answer: root,
            hint: `${root} × ${root} × ${root} = ${n}`
        };
    });

    // 5. Log(80) Check Exercise
    initLogExercise();

    // 6. E=mc² Energy Calculator
    initEnergyCalculator();

    // 7. Tetration Exercise
    initInputExercise('tetration-exercise', () => {
        const base = randChoice([2, 2, 3]);
        const height = randChoice([2, 3]);
        let answer;
        if (base === 2) {
            answer = height === 2 ? 4 : 16;
        } else {
            answer = height === 2 ? 27 : 7625597484987;
        }
        const notation = `<sup>${height}</sup>${base}`;
        return {
            question: `Calculate ${notation}`,
            answer: answer,
            hint: `Tetration height ${height} with base ${base} equals ${answer.toLocaleString()}`
        };
    });

    // 8. Tesseract Exercise
    const tesseractFacts = [
        { question: 'How many vertices does a tesseract have?', answer: 16 },
        { question: 'How many edges does a tesseract have?', answer: 32 },
        { question: 'How many square faces does a tesseract have?', answer: 24 },
        { question: 'How many cubic cells does a tesseract have?', answer: 8 }
    ];
    initInputExercise('tesseract-exercise', () => randChoice(tesseractFacts));

    // 9. Visual explorers
    initLogVisualizer();
    initFactorialVisualizer();
    initEnergyVisualizer();
    initPowerVisualizer();
    initTowerVisualizer();
    initSqrtVisualizer();
    initCbrtVisualizer();

    // 10. Mini Games
    initRocketGame();
    initAnimalGame();
    initCityGame();
    initMatchGame();
    initSqrtGame();
    initCbrtGame();
    initTesseractGame();

    // 11. Speed Challenge: mixed questions
    initSpeedChallenge();
});

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function initInputExercise(containerId, generator) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const questionEl = container.querySelector('.exercise-question');
    const inputEl = container.querySelector('.exercise-input');
    const submitBtn = container.querySelector('.exercise-submit');
    const feedbackEl = container.querySelector('.exercise-feedback');
    const nextBtn = container.querySelector('.exercise-next');
    const streakEl = container.querySelector('.exercise-streak');

    let current = null;
    let streak = 0;

    function nextQuestion() {
        current = generator();
        questionEl.innerHTML = current.question;
        inputEl.value = '';
        inputEl.disabled = false;
        submitBtn.disabled = false;
        feedbackEl.textContent = '';
        feedbackEl.className = 'exercise-feedback';
        nextBtn.style.display = 'none';
        inputEl.focus();
    }

    function checkAnswer() {
        const userVal = parseFloat(inputEl.value);
        if (isNaN(userVal)) {
            feedbackEl.textContent = 'Please enter a number.';
            feedbackEl.className = 'exercise-feedback wrong';
            return;
        }

        inputEl.disabled = true;
        submitBtn.disabled = true;
        nextBtn.style.display = 'inline-block';

        if (userVal === current.answer) {
            streak++;
            feedbackEl.innerHTML = `✅ Correct! ${current.hint}`;
            feedbackEl.className = 'exercise-feedback correct';
        } else {
            streak = 0;
            feedbackEl.innerHTML = `❌ Not quite. ${current.hint}`;
            feedbackEl.className = 'exercise-feedback wrong';
        }

        if (streakEl) streakEl.textContent = `Streak: ${streak}`;
    }

    submitBtn.addEventListener('click', checkAnswer);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
    nextBtn.addEventListener('click', nextQuestion);

    nextQuestion();
}

function initLogExercise() {
    const container = document.getElementById('log-exercise');
    if (!container) return;

    const inputEl = container.querySelector('.exercise-input');
    const submitBtn = container.querySelector('.exercise-submit');
    const feedbackEl = container.querySelector('.exercise-feedback');
    const nextBtn = container.querySelector('.exercise-next');

    function check() {
        const val = parseFloat(inputEl.value);
        if (isNaN(val)) {
            feedbackEl.textContent = 'Please enter a number.';
            feedbackEl.className = 'exercise-feedback wrong';
            return;
        }

        // Allow a small tolerance for rounding to 1 decimal place
        const correct = 1.9;

        inputEl.disabled = true;
        submitBtn.disabled = true;
        nextBtn.style.display = 'inline-block';

        if (Math.abs(val - correct) < 0.05) {
            feedbackEl.innerHTML = `✅ Correct! log(80) ≈ ${correct}`;
            feedbackEl.className = 'exercise-feedback correct';
        } else {
            feedbackEl.innerHTML = `❌ Not quite. log(80) ≈ ${correct}`;
            feedbackEl.className = 'exercise-feedback wrong';
        }
    }

    submitBtn.addEventListener('click', check);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') check();
    });
    nextBtn.addEventListener('click', () => {
        inputEl.value = '';
        inputEl.disabled = false;
        submitBtn.disabled = false;
        feedbackEl.textContent = '';
        nextBtn.style.display = 'none';
        inputEl.focus();
    });
}

function initEnergyCalculator() {
    const container = document.getElementById('energy-calculator');
    if (!container) return;

    const massInput = container.querySelector('.mass-input');
    const calcBtn = container.querySelector('.calc-energy');
    const resultEl = container.querySelector('.energy-result');

    const c = 299792458;

    calcBtn.addEventListener('click', () => {
        const mass = parseFloat(massInput.value);
        if (isNaN(mass) || mass < 0) {
            resultEl.textContent = 'Please enter a valid mass in kilograms.';
            resultEl.className = 'energy-result wrong';
            return;
        }
        const energy = mass * c * c;
        resultEl.innerHTML = `E = ${mass} × (${c.toLocaleString()})² ≈ ${energy.toExponential(4)} joules`;
        resultEl.className = 'energy-result correct';
    });
}

function initLogVisualizer() {
    const slider = document.getElementById('log-slider');
    if (!slider) return;

    const powerEl = document.getElementById('log-power');
    const supEl = document.getElementById('log-sup');
    const resultEl = document.getElementById('log-result');
    const markerEl = document.getElementById('log-marker');
    const messageEl = document.getElementById('log-message');

    function update() {
        const power = slider.value / 10;
        const result = Math.pow(10, power);
        powerEl.textContent = power.toFixed(1);
        supEl.textContent = power.toFixed(1);
        resultEl.textContent = result.toFixed(2);

        // Position marker on number line (log scale from 10 to 100)
        const percent = ((Math.log10(result) - 1) / (2 - 1)) * 100;
        markerEl.style.left = `calc(1rem + (100% - 2rem) * ${percent} / 100)`;

        const diff = Math.abs(result - 80);
        if (diff < 1) {
            messageEl.textContent = '🎯 Perfect! You found log(80) ≈ 1.9!';
            messageEl.className = 'visual-feedback correct';
        } else if (diff < 10) {
            messageEl.textContent = '🔥 Very close to 80!';
            messageEl.className = 'visual-feedback';
        } else if (result < 80) {
            messageEl.textContent = '📈 Go higher — we need to reach 80!';
            messageEl.className = 'visual-feedback';
        } else {
            messageEl.textContent = '📉 Too high! Slide back down.';
            messageEl.className = 'visual-feedback';
        }
    }

    slider.addEventListener('input', update);
    update();
}

function initFactorialVisualizer() {
    const slider = document.getElementById('factorial-slider');
    if (!slider) return;

    const nEl = document.getElementById('factorial-n');
    const blocksEl = document.getElementById('factorial-blocks');
    const visualEl = document.getElementById('factorial-blocks-visual');
    const scenarioEl = document.getElementById('factorial-scenario');

    const colors = ['#2563eb', '#7c3aed', '#06b6d4', '#22c55e', '#f59e0b'];

    function factorial(n) {
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }

    function update() {
        const n = parseInt(slider.value);
        const result = factorial(n);
        nEl.textContent = n;
        blocksEl.textContent = result.toLocaleString();

        visualEl.innerHTML = '';
        const showCount = Math.min(n, 5);
        for (let i = 0; i < showCount; i++) {
            const block = document.createElement('div');
            block.className = 'block';
            block.textContent = i + 1;
            block.style.background = colors[i % colors.length];
            visualEl.appendChild(block);
        }

        if (n > 5) {
            const more = document.createElement('div');
            more.className = 'block';
            more.textContent = '+' + (n - 5);
            more.style.background = '#64748b';
            visualEl.appendChild(more);
        }

        const examples = {
            1: '1 block has only 1 arrangement.',
            2: '2 blocks can be arranged in 2 ways.',
            3: '3 blocks can be arranged in 6 ways.',
            4: '4 blocks can be arranged in 24 ways.',
            5: '5 blocks can be arranged in 120 ways!'
        };
        scenarioEl.textContent = examples[n] || `${n} blocks have ${result.toLocaleString()} arrangements!`;
    }

    slider.addEventListener('input', update);
    update();
}

function initEnergyVisualizer() {
    const slider = document.getElementById('energy-slider');
    if (!slider) return;

    const massEl = document.getElementById('energy-mass');
    const bubbleEl = document.getElementById('energy-bubble');
    const labelEl = document.getElementById('energy-label');
    const scenarioEl = document.getElementById('energy-scenario');

    const c = 299792458;

    function update() {
        const mass = parseFloat(slider.value);
        const energy = mass * c * c;
        massEl.textContent = mass;

        const size = 30 + mass * 15;
        bubbleEl.style.width = size + 'px';
        bubbleEl.style.height = size + 'px';
        bubbleEl.style.boxShadow = `0 0 ${size}px rgba(250, 204, 21, ${0.3 + mass * 0.05})`;

        labelEl.textContent = `E ≈ ${energy.toExponential(2)} J`;

        if (mass === 0) {
            scenarioEl.textContent = 'No mass means no energy!';
        } else if (mass < 1) {
            scenarioEl.textContent = 'A tiny mass still makes a LOT of energy!';
        } else if (mass < 5) {
            scenarioEl.textContent = 'That is enough energy to power a small city!';
        } else {
            scenarioEl.textContent = 'Wow! That much mass could power whole countries!';
        }
    }

    slider.addEventListener('input', update);
    update();
}

function initPowerVisualizer() {
    const baseSlider = document.getElementById('power-base');
    const expSlider = document.getElementById('power-exp');
    if (!baseSlider || !expSlider) return;

    const equationEl = document.getElementById('power-equation');
    const totalEl = document.getElementById('power-total');
    const gridEl = document.getElementById('power-grid');
    const scenarioEl = document.getElementById('power-scenario');

    function update() {
        const base = parseInt(baseSlider.value);
        const exp = parseInt(expSlider.value);
        const total = Math.pow(base, exp);

        equationEl.innerHTML = `${base}<sup>${exp}</sup>`;
        totalEl.textContent = total;

        gridEl.innerHTML = '';
        const showCount = Math.min(total, 200);
        for (let i = 0; i < showCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'power-dot';
            gridEl.appendChild(dot);
        }
        if (total > 200) {
            const more = document.createElement('div');
            more.textContent = `+${(total - 200).toLocaleString()} more`;
            more.style.width = '100%';
            more.style.textAlign = 'center';
            more.style.fontWeight = 'bold';
            more.style.color = '#64748b';
            gridEl.appendChild(more);
        }

        scenarioEl.textContent = `${base} multiplied by itself ${exp} times equals ${total.toLocaleString()} dots!`;
    }

    baseSlider.addEventListener('input', update);
    expSlider.addEventListener('input', update);
    update();
}

function initTowerVisualizer() {
    const baseSlider = document.getElementById('tower-base');
    const heightSlider = document.getElementById('tower-height');
    if (!baseSlider || !heightSlider) return;

    const valueEl = document.getElementById('tower-value');
    const displayEl = document.getElementById('tower-display');
    const scenarioEl = document.getElementById('tower-scenario');

    function tetration(base, height) {
        if (height === 1) return base;
        let result = base;
        for (let i = 2; i <= height; i++) {
            result = Math.pow(base, result);
            if (!isFinite(result)) return Infinity;
        }
        return result;
    }

    function update() {
        const base = parseInt(baseSlider.value);
        const height = parseInt(heightSlider.value);
        const value = tetration(base, height);

        valueEl.textContent = isFinite(value) ? value.toLocaleString() : 'HUGE!';

        displayEl.innerHTML = '';
        for (let i = 0; i < height; i++) {
            const block = document.createElement('div');
            block.className = 'tower-block';
            block.textContent = base;
            displayEl.appendChild(block);
        }

        if (height === 2) {
            scenarioEl.textContent = 'A tower of height 2 is just a regular power.';
        } else if (height === 3 && base === 2) {
            scenarioEl.textContent = 'Height 3 with base 2 already gives 16!';
        } else if (height === 3 && base === 3) {
            scenarioEl.textContent = 'Height 3 with base 3 explodes to 7.6 trillion!';
        }
    }

    baseSlider.addEventListener('input', update);
    heightSlider.addEventListener('input', update);
    update();
}

function initSqrtVisualizer() {
    const slider = document.getElementById('sqrt-slider');
    if (!slider) return;

    const sideEl = document.getElementById('sqrt-side');
    const areaEl = document.getElementById('sqrt-area');
    const gridEl = document.getElementById('sqrt-grid');
    const scenarioEl = document.getElementById('sqrt-scenario');

    function update() {
        const side = parseInt(slider.value);
        const area = side * side;
        sideEl.textContent = side;
        areaEl.textContent = area;

        gridEl.style.gridTemplateColumns = `repeat(${side}, 24px)`;
        gridEl.innerHTML = '';
        for (let i = 0; i < area; i++) {
            const cell = document.createElement('div');
            cell.className = 'sqrt-cell';
            gridEl.appendChild(cell);
        }

        scenarioEl.textContent = `A square with side ${side} has area ${area}. So √${area} = ${side}!`;
    }

    slider.addEventListener('input', update);
    update();
}

function initCbrtVisualizer() {
    const slider = document.getElementById('cbrt-slider');
    if (!slider) return;

    const sideEl = document.getElementById('cbrt-side');
    const volumeEl = document.getElementById('cbrt-volume');
    const visualEl = document.getElementById('cbrt-3d');
    const scenarioEl = document.getElementById('cbrt-scenario');

    function update() {
        const side = parseInt(slider.value);
        const volume = side * side * side;
        sideEl.textContent = side;
        volumeEl.textContent = volume;

        visualEl.innerHTML = '';
        for (let layer = 0; layer < side; layer++) {
            const layerDiv = document.createElement('div');
            layerDiv.className = 'cube-layer';
            layerDiv.style.gridTemplateColumns = `repeat(${side}, 18px)`;
            for (let i = 0; i < side * side; i++) {
                const cell = document.createElement('div');
                cell.className = 'cube-cell';
                layerDiv.appendChild(cell);
            }
            visualEl.appendChild(layerDiv);
        }

        scenarioEl.textContent = `A cube with side ${side} has volume ${volume}. So ∛${volume} = ${side}!`;
    }

    slider.addEventListener('input', update);
    update();
}

function initRocketGame() {
    const slider = document.getElementById('rocket-slider');
    const launchBtn = document.getElementById('rocket-launch');
    if (!slider || !launchBtn) return;

    const powerEl = document.getElementById('rocket-power');
    const heightEl = document.getElementById('rocket-height');
    const rocketEl = document.getElementById('rocket');
    const messageEl = document.getElementById('rocket-message');

    function updatePower() {
        const power = slider.value / 10;
        powerEl.textContent = power.toFixed(1);
        heightEl.textContent = Math.pow(10, power).toFixed(2);
    }

    launchBtn.addEventListener('click', () => {
        const power = slider.value / 10;
        const height = Math.pow(10, power);
        const target = 80;

        // Map 10-100 to 10%-90% of track
        const percent = Math.min(90, Math.max(10, ((height - 10) / 90) * 80 + 10));
        rocketEl.style.left = percent + '%';

        const diff = Math.abs(height - target);
        if (diff < 1) {
            messageEl.textContent = '🎉 PERFECT LANDING! You found log(80) ≈ 1.9!';
            messageEl.className = 'game-feedback correct';
        } else if (diff < 5) {
            messageEl.textContent = '🔥 So close! Try a tiny bit more or less power.';
            messageEl.className = 'game-feedback';
        } else if (height < target) {
            messageEl.textContent = '📈 Too low! The rocket needs more power.';
            messageEl.className = 'game-feedback wrong';
        } else {
            messageEl.textContent = '📉 Too high! Bring the rocket back down.';
            messageEl.className = 'game-feedback wrong';
        }
    });

    slider.addEventListener('input', updatePower);
    updatePower();
}

function initAnimalGame() {
    const row = document.getElementById('animals-row');
    const shuffleBtn = document.getElementById('shuffle-animals');
    if (!row || !shuffleBtn) return;

    const totalEl = document.getElementById('animal-total');
    const foundEl = document.getElementById('animal-found');
    const maxEl = document.getElementById('animal-max');
    const messageEl = document.getElementById('animal-message');

    const animals = ['🐶', '🐱', '🐭'];
    let found = new Set();
    let currentArrangement = [...animals];

    function factorial(n) {
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
    }

    const max = factorial(animals.length);
    totalEl.textContent = max;
    maxEl.textContent = max;

    function render() {
        row.innerHTML = currentArrangement.map(a => `<span class="animal">${a}</span>`).join('');
    }

    function getKey(arr) {
        return arr.join('|');
    }

    shuffleBtn.addEventListener('click', () => {
        row.classList.add('shuffle');

        // Shuffle
        const arr = [...animals];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        currentArrangement = arr;
        render();

        const key = getKey(currentArrangement);
        if (!found.has(key)) {
            found.add(key);
            foundEl.textContent = found.size;
            if (found.size === max) {
                messageEl.textContent = '🏆 You found ALL the arrangements! Amazing!';
                messageEl.className = 'game-feedback correct';
            } else {
                messageEl.textContent = `✨ New arrangement found! That's ${found.size} out of ${max}!`;
                messageEl.className = 'game-feedback';
            }
        } else {
            messageEl.textContent = '🔁 You already found this one. Try again!';
            messageEl.className = 'game-feedback';
        }

        setTimeout(() => row.classList.remove('shuffle'), 300);
    });

    render();
}

function initCityGame() {
    const slider = document.getElementById('city-slider');
    if (!slider) return;

    const massEl = document.getElementById('city-mass');
    const gridEl = document.getElementById('city-grid');
    const messageEl = document.getElementById('city-message');
    const litEl = document.getElementById('city-lit');

    const houses = 10;
    const houseEls = [];

    // Create houses
    for (let i = 0; i < houses; i++) {
        const house = document.createElement('div');
        house.className = 'city-house';
        house.textContent = '🏠';
        gridEl.appendChild(house);
        houseEls.push(house);
    }

    function update() {
        const mass = parseFloat(slider.value);
        massEl.textContent = mass;

        const litCount = Math.min(houses, Math.floor(mass));
        litEl.textContent = litCount;

        houseEls.forEach((house, i) => {
            if (i < litCount) {
                house.classList.add('lit');
            } else {
                house.classList.remove('lit');
            }
        });

        if (litCount === 0) {
            messageEl.textContent = 'No houses lit yet. Try adding mass!';
            messageEl.className = 'game-feedback';
        } else if (litCount < 5) {
            messageEl.textContent = 'Some houses are lit! Keep adding mass!';
            messageEl.className = 'game-feedback';
        } else if (litCount < houses) {
            messageEl.textContent = 'Almost there! The city is getting bright!';
            messageEl.className = 'game-feedback';
        } else {
            messageEl.textContent = '🎉 All houses lit! Mass really IS energy!';
            messageEl.className = 'game-feedback correct';
        }
    }

    slider.addEventListener('input', update);
    update();
}

function initMatchGame() {
    const gridEl = document.getElementById('match-grid');
    if (!gridEl) return;

    const messageEl = document.getElementById('match-message');
    const scoreEl = document.getElementById('match-score');

    const pairs = [
        { power: '2³', value: '8' },
        { power: '3²', value: '9' },
        { power: '2⁴', value: '16' },
        { power: '5²', value: '25' }
    ];

    const cards = [];
    pairs.forEach((pair, i) => {
        cards.push({ id: i, text: pair.power, type: 'power' });
        cards.push({ id: i, text: pair.value, type: 'value' });
    });

    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    let flipped = [];
    let matched = 0;
    let lock = false;

    cards.forEach((card, idx) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'match-card';
        cardEl.dataset.id = card.id;
        cardEl.dataset.idx = idx;
        cardEl.textContent = '?';

        cardEl.addEventListener('click', () => {
            if (lock || cardEl.classList.contains('matched') || cardEl.classList.contains('flipped')) return;

            cardEl.classList.add('flipped');
            cardEl.textContent = card.text;
            flipped.push(cardEl);

            if (flipped.length === 2) {
                lock = true;
                const [a, b] = flipped;
                if (a.dataset.id === b.dataset.id && a.dataset.idx !== b.dataset.idx) {
                    // Match!
                    setTimeout(() => {
                        a.classList.add('matched');
                        b.classList.add('matched');
                        matched++;
                        scoreEl.textContent = matched;
                        if (matched === pairs.length) {
                            messageEl.textContent = '🏆 All matched! You know your powers!';
                            messageEl.className = 'game-feedback correct';
                        } else {
                            messageEl.textContent = '✅ Match found! Keep going!';
                            messageEl.className = 'game-feedback correct';
                        }
                        flipped = [];
                        lock = false;
                    }, 500);
                } else {
                    // No match
                    setTimeout(() => {
                        a.classList.remove('flipped');
                        b.classList.remove('flipped');
                        a.textContent = '?';
                        b.textContent = '?';
                        messageEl.textContent = '❌ Not a match. Try again!';
                        messageEl.className = 'game-feedback wrong';
                        flipped = [];
                        lock = false;
                    }, 800);
                }
            }
        });

        gridEl.appendChild(cardEl);
    });
}

function initSqrtGame() {
    const areaEl = document.getElementById('sqrt-game-area');
    const inputEl = document.getElementById('sqrt-game-input');
    const checkBtn = document.getElementById('sqrt-game-check');
    const gridEl = document.getElementById('sqrt-game-grid');
    const messageEl = document.getElementById('sqrt-game-message');
    const scoreEl = document.getElementById('sqrt-game-score');
    if (!areaEl || !inputEl || !checkBtn) return;

    let score = 0;
    let currentSide = 0;

    function newQuestion() {
        currentSide = randInt(2, 10);
        const area = currentSide * currentSide;
        areaEl.textContent = area;
        inputEl.value = '';
        gridEl.innerHTML = '';
        gridEl.style.gridTemplateColumns = `repeat(${currentSide}, 24px)`;
        messageEl.textContent = 'Guess the side!';
        messageEl.className = 'game-feedback';
    }

    function buildSquare(side) {
        gridEl.innerHTML = '';
        for (let i = 0; i < side * side; i++) {
            const cell = document.createElement('div');
            cell.className = 'sqrt-cell';
            gridEl.appendChild(cell);
        }
    }

    checkBtn.addEventListener('click', () => {
        const guess = parseInt(inputEl.value);
        if (isNaN(guess)) {
            messageEl.textContent = 'Enter a number!';
            messageEl.className = 'game-feedback wrong';
            return;
        }

        if (guess === currentSide) {
            buildSquare(currentSide);
            score++;
            scoreEl.textContent = score;
            messageEl.textContent = `🎉 Perfect! √${currentSide * currentSide} = ${currentSide}!`;
            messageEl.className = 'game-feedback correct';
            setTimeout(newQuestion, 2000);
        } else {
            messageEl.textContent = `❌ Not quite. The side is ${currentSide}. Try again!`;
            messageEl.className = 'game-feedback wrong';
        }
    });

    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkBtn.click();
    });

    newQuestion();
}

function initCbrtGame() {
    const volumeEl = document.getElementById('cbrt-game-volume');
    const inputEl = document.getElementById('cbrt-game-input');
    const checkBtn = document.getElementById('cbrt-game-check');
    const visualEl = document.getElementById('cbrt-game-visual');
    const messageEl = document.getElementById('cbrt-game-message');
    const scoreEl = document.getElementById('cbrt-game-score');
    if (!volumeEl || !inputEl || !checkBtn) return;

    let score = 0;
    let currentSide = 0;

    function newQuestion() {
        currentSide = randInt(1, 5);
        const volume = currentSide * currentSide * currentSide;
        volumeEl.textContent = volume;
        inputEl.value = '';
        visualEl.innerHTML = '';
        messageEl.textContent = 'Guess the side!';
        messageEl.className = 'game-feedback';
    }

    function buildCube(side) {
        visualEl.innerHTML = '';
        for (let layer = 0; layer < side; layer++) {
            const layerDiv = document.createElement('div');
            layerDiv.className = 'cube-layer';
            layerDiv.style.gridTemplateColumns = `repeat(${side}, 18px)`;
            for (let i = 0; i < side * side; i++) {
                const cell = document.createElement('div');
                cell.className = 'cube-cell';
                layerDiv.appendChild(cell);
            }
            visualEl.appendChild(layerDiv);
        }
    }

    checkBtn.addEventListener('click', () => {
        const guess = parseInt(inputEl.value);
        if (isNaN(guess)) {
            messageEl.textContent = 'Enter a number!';
            messageEl.className = 'game-feedback wrong';
            return;
        }

        if (guess === currentSide) {
            buildCube(currentSide);
            score++;
            scoreEl.textContent = score;
            messageEl.textContent = `🎉 Perfect! ∛${currentSide * currentSide * currentSide} = ${currentSide}!`;
            messageEl.className = 'game-feedback correct';
            setTimeout(newQuestion, 2000);
        } else {
            messageEl.textContent = `❌ Not quite. The side is ${currentSide}. Try again!`;
            messageEl.className = 'game-feedback wrong';
        }
    });

    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkBtn.click();
    });

    newQuestion();
}

function initTesseractGame() {
    const svg = document.getElementById('tesseract-game-svg');
    if (!svg) return;

    const buttons = document.querySelectorAll('.part-btn');
    const messageEl = document.getElementById('part-message');
    const scoreEl = document.getElementById('part-score');

    const parts = new Set();
    const partNames = {
        vertices: 'Vertices are the corner points!',
        edges: 'Edges are the lines connecting corners!',
        faces: 'Faces are the flat square surfaces!',
        cells: 'Cells are the 3D cubes inside the tesseract!'
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const part = btn.dataset.part;

            // Remove previous highlights
            svg.classList.remove('highlight-vertices', 'highlight-edges', 'highlight-faces', 'highlight-cells');
            buttons.forEach(b => b.classList.remove('active'));

            // Add new highlight
            svg.classList.add(`highlight-${part}`);
            btn.classList.add('active');

            if (!parts.has(part)) {
                parts.add(part);
                scoreEl.textContent = parts.size;
                if (parts.size === 4) {
                    messageEl.textContent = '🏆 You explored all the parts of the tesseract!';
                    messageEl.className = 'game-feedback correct';
                } else {
                    messageEl.textContent = partNames[part];
                    messageEl.className = 'game-feedback';
                }
            } else {
                messageEl.textContent = partNames[part];
                messageEl.className = 'game-feedback';
            }
        });
    });
}

const NAV_DATA = {
    categories: [
        {
            name: 'Numbers & Operations',
            emoji: '🔢',
            topics: [
                { id: 'factorial', name: 'Factorials' },
                { id: 'sqrt', name: 'Square Roots' },
                { id: 'cbrt', name: 'Cube Roots' }
            ]
        },
        {
            name: 'Exponents & Growth',
            emoji: '⚡',
            topics: [
                { id: 'powers', name: 'Powers' },
                { id: 'tetration', name: 'Tetration' },
                { id: 'pentation', name: 'Pentation' },
                { id: 'hexation', name: 'Hexation' },
                { id: 'log', name: 'Logarithms' }
            ]
        },
        {
            name: 'Physics & Dimensions',
            emoji: '🌌',
            topics: [
                { id: 'emc2', name: 'E=mc²' },
                { id: 'tesseract', name: 'Tesseract' }
            ]
        }
    ]
};

function buildNavigation() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.innerHTML = '';

    // Home link
    const homeLi = document.createElement('li');
    const homeLink = document.createElement('a');
    homeLink.href = 'index.html';
    homeLink.textContent = 'Home';
    if (currentPage === 'index.html' || currentPage === '') homeLink.classList.add('active');
    homeLi.appendChild(homeLink);
    navLinks.appendChild(homeLi);

    // Category dropdowns
    NAV_DATA.categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'nav-dropdown';

        const btn = document.createElement('button');
        btn.className = 'nav-dropdown-btn';
        btn.innerHTML = `${category.emoji} ${category.name} <span class="dropdown-arrow">▾</span>`;

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';

        category.topics.forEach(topic => {
            const a = document.createElement('a');
            a.href = `${topic.id}.html`;
            a.textContent = topic.name;
            if (currentPage === `${topic.id}.html`) a.classList.add('active');
            dropdown.appendChild(a);
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== dropdown) menu.classList.remove('show');
            });
            dropdown.classList.toggle('show');
        });

        li.appendChild(btn);
        li.appendChild(dropdown);
        navLinks.appendChild(li);
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

function initSpeedChallenge() {
    const container = document.getElementById('speed-challenge');
    if (!container) return;

    const questionEl = container.querySelector('.challenge-question');
    const inputEl = container.querySelector('.challenge-input');
    const submitBtn = container.querySelector('.challenge-submit');
    const feedbackEl = container.querySelector('.challenge-feedback');
    const nextBtn = container.querySelector('.challenge-next');
    const scoreEl = container.querySelector('.challenge-score');

    let current = null;
    let score = 0;
    let total = 0;

    const generators = [
        () => {
            const n = randInt(2, 10);
            let result = 1;
            for (let i = n; i >= 1; i--) result *= i;
            return {
                question: `Calculate ${n}!`,
                answer: result
            };
        },
        () => {
            const base = randInt(2, 9);
            const exp = randInt(2, 4);
            return {
                question: `Calculate ${base}<sup>${exp}</sup>`,
                answer: Math.pow(base, exp)
            };
        },
        () => {
            const root = randInt(0, 22);
            return {
                question: `What is √${root * root}?`,
                answer: root
            };
        },
        () => {
            const root = randInt(0, 7);
            return {
                question: `What is ∛${root * root * root}?`,
                answer: root
            };
        },
        () => {
            const facts = [
                { q: 'How many vertices does a tesseract have?', a: 16 },
                { q: 'How many edges does a tesseract have?', a: 32 },
                { q: 'How many square faces does a tesseract have?', a: 24 },
                { q: 'How many cubic cells does a tesseract have?', a: 8 }
            ];
            const fact = randChoice(facts);
            return {
                question: fact.q,
                answer: fact.a
            };
        }
    ];

    function nextQuestion() {
        current = randChoice(generators)();
        questionEl.innerHTML = current.question;
        inputEl.value = '';
        inputEl.disabled = false;
        submitBtn.disabled = false;
        feedbackEl.textContent = '';
        feedbackEl.className = 'challenge-feedback';
        nextBtn.style.display = 'none';
        inputEl.focus();
    }

    function check() {
        const val = parseFloat(inputEl.value);
        if (isNaN(val)) {
            feedbackEl.textContent = 'Please enter a number.';
            feedbackEl.className = 'challenge-feedback wrong';
            return;
        }

        total++;
        inputEl.disabled = true;
        submitBtn.disabled = true;
        nextBtn.style.display = 'inline-block';

        if (val === current.answer) {
            score++;
            feedbackEl.innerHTML = '✅ Correct!';
            feedbackEl.className = 'challenge-feedback correct';
        } else {
            feedbackEl.innerHTML = `❌ Not quite. The answer was ${current.answer.toLocaleString()}.`;
            feedbackEl.className = 'challenge-feedback wrong';
        }

        scoreEl.textContent = `Score: ${score} / ${total}`;
    }

    submitBtn.addEventListener('click', check);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') check();
    });
    nextBtn.addEventListener('click', nextQuestion);

    nextQuestion();
}
