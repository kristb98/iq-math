document.addEventListener('DOMContentLoaded', () => {
    // Highlight the current page in the top bar
    buildNavigation();
    enhanceGames();

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
    initEmc2MemoryTest();
    initPiMemoryTest();
    initPowerVisualizer();
    initTowerVisualizer();
    initSqrtVisualizer();
    initCbrtVisualizer();
    initCircleExplorer();
    initCirclePartGame();
    initFourierVisualizer();

    // 10. Mini Games
    initRocketGame();
    initAnimalGame();
    initCityGame();
    initMatchGame();
    initSqrtGame();
    initCbrtGame();
    initTesseractGame();
    initStickmanPhysicsLab();

    // 11. Speed Challenge: mixed questions
    initSpeedChallenge();

    // 12. Full mixed test + calculation box
    initMixedTest();
    initCalcBox();
});

function enhanceGames() {
    const hints = {
        'Rocket to 80': 'Use power 1.9. The height should be close to 80.',
        'Animal Line-Up': 'For 3 animals, start with one animal, then swap the other two.',
        'Light the City': 'Each extra kilogram lights another house in this simple model.',
        'Power Match': 'Read the exponent as repeated multiplication: 2³ means 2 × 2 × 2.',
        'Build the Square': 'Ask: what number multiplied by itself gives the area?',
        'Fill the Cube': 'Ask: what number multiplied by itself three times gives the volume?',
        'Count the Parts': 'A tesseract has 16 vertices, 32 edges, 24 faces, and 8 cubic cells.',
        'Stickman Physics Lab': 'Start with angle 45° and power 20. Change one slider, then watch the path.'
    };

    document.querySelectorAll('.game-box').forEach(game => {
        const title = game.querySelector('h3')?.textContent || '';
        const key = Object.keys(hints).find(name => title.includes(name));
        if (!key || game.querySelector('.game-flow')) return;

        const flow = document.createElement('div');
        flow.className = 'game-flow';
        flow.innerHTML = '<span>1. Learn</span><span>2. Try</span><span>3. Check</span>';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'game-hint-button';
        button.textContent = '💡 Show Hint';

        const hint = document.createElement('div');
        hint.className = 'game-hint';
        hint.textContent = hints[key];
        hint.setAttribute('role', 'status');

        const firstContent = game.querySelector('.stickman-hint, p');
        (firstContent || game.querySelector('h3')).insertAdjacentElement('afterend', flow);
        game.append(button, hint);

        button.addEventListener('click', () => {
            const open = hint.classList.toggle('show');
            button.textContent = open ? '🙈 Hide Hint' : '💡 Show Hint';
        });
    });
}

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

function initEmc2MemoryTest() {
    const test = document.getElementById('emc2-memory-test');
    if (!test) return;

    const questionEl = document.getElementById('memory-question');
    const optionsEl = document.getElementById('memory-options');
    const feedbackEl = document.getElementById('memory-feedback');
    const scoreEl = document.getElementById('memory-score');
    const nextBtn = document.getElementById('memory-next');
    const restartBtn = document.getElementById('memory-restart');

    const questions = [
        {
            question: 'What does E stand for?',
            answers: ['Energy', 'Edges', 'Exponent'],
            correct: 'Energy'
        },
        {
            question: 'What does m stand for?',
            answers: ['Meters', 'Mass', 'Motion'],
            correct: 'Mass'
        },
        {
            question: 'What does c stand for?',
            answers: ['Circle', 'Current', 'Speed of light'],
            correct: 'Speed of light'
        }
    ];

    let questionIndex = 0;
    let score = 0;
    let answered = false;

    function showQuestion() {
        const current = questions[questionIndex];
        answered = false;
        questionEl.innerHTML = `Question ${questionIndex + 1} of 3: <strong>${current.question}</strong>`;
        optionsEl.innerHTML = '';
        feedbackEl.textContent = '';
        feedbackEl.className = 'exercise-feedback';
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'none';

        current.answers.forEach(answer => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'memory-option';
            button.textContent = answer;
            button.addEventListener('click', () => answerQuestion(button, answer, current.correct));
            optionsEl.appendChild(button);
        });
    }

    function answerQuestion(button, answer, correct) {
        if (answered) return;
        answered = true;
        optionsEl.querySelectorAll('button').forEach(option => option.disabled = true);

        if (answer === correct) {
            score++;
            button.classList.add('correct');
            feedbackEl.textContent = '✅ Correct! Say the formula out loud: E = m c squared.';
            feedbackEl.className = 'exercise-feedback correct';
        } else {
            button.classList.add('wrong');
            feedbackEl.textContent = `Not quite. Remember: ${correct}.`;
            feedbackEl.className = 'exercise-feedback wrong';
            optionsEl.querySelectorAll('button').forEach(option => {
                if (option.textContent === correct) option.classList.add('correct');
            });
        }

        scoreEl.textContent = score;
        if (questionIndex < questions.length - 1) {
            nextBtn.style.display = 'inline-block';
        } else {
            restartBtn.style.display = 'inline-block';
            feedbackEl.textContent += ` Final score: ${score} / 3.`;
        }
    }

    nextBtn.addEventListener('click', () => {
        questionIndex++;
        showQuestion();
    });

    restartBtn.addEventListener('click', () => {
        questionIndex = 0;
        score = 0;
        scoreEl.textContent = '0';
        showQuestion();
    });

    showQuestion();
}

function initPiMemoryTest() {
    const test = document.getElementById('pi-memory-test');
    if (!test) return;

    const questionEl = document.getElementById('pi-question');
    const optionsEl = document.getElementById('pi-options');
    const feedbackEl = document.getElementById('pi-feedback');
    const scoreEl = document.getElementById('pi-score');
    const nextBtn = document.getElementById('pi-next');
    const restartBtn = document.getElementById('pi-restart');

    const questions = [
        {
            question: 'What is π (pi)?',
            answers: ['A special number ≈ 3.14', 'A kind of pie', 'A type of circle'],
            correct: 'A special number ≈ 3.14'
        },
        {
            question: 'Circumference = ?',
            answers: ['π × diameter', 'diameter ÷ 2', 'radius × radius'],
            correct: 'π × diameter'
        },
        {
            question: 'Diameter = ?',
            answers: ['radius ÷ 2', '2 × radius', 'π × radius'],
            correct: '2 × radius'
        }
    ];

    let questionIndex = 0;
    let score = 0;
    let answered = false;

    function showQuestion() {
        const current = questions[questionIndex];
        answered = false;
        questionEl.innerHTML = `Question ${questionIndex + 1} of 3: <strong>${current.question}</strong>`;
        optionsEl.innerHTML = '';
        feedbackEl.textContent = '';
        feedbackEl.className = 'exercise-feedback';
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'none';

        current.answers.forEach(answer => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'memory-option';
            button.textContent = answer;
            button.addEventListener('click', () => {
                if (answered) return;
                answered = true;
                optionsEl.querySelectorAll('button').forEach(option => option.disabled = true);

                if (answer === current.correct) {
                    score++;
                    button.classList.add('correct');
                    feedbackEl.textContent = '✅ Correct! Say it out loud: π ≈ 3.14!';
                    feedbackEl.className = 'exercise-feedback correct';
                    celebrateStickman('circle-stickman');
                } else {
                    button.classList.add('wrong');
                    feedbackEl.textContent = `Not quite. Remember: ${current.correct}.`;
                    feedbackEl.className = 'exercise-feedback wrong';
                    optionsEl.querySelectorAll('button').forEach(optionBtn => {
                        if (optionBtn.textContent === current.correct) optionBtn.classList.add('correct');
                    });
                }

                scoreEl.textContent = score;
                if (questionIndex < questions.length - 1) {
                    nextBtn.style.display = 'inline-block';
                } else {
                    restartBtn.style.display = 'inline-block';
                    feedbackEl.textContent += ` Final score: ${score} / 3.`;
                }
            });
            optionsEl.appendChild(button);
        });
    }

    nextBtn.addEventListener('click', () => {
        questionIndex++;
        showQuestion();
    });

    restartBtn.addEventListener('click', () => {
        questionIndex = 0;
        score = 0;
        scoreEl.textContent = '0';
        showQuestion();
    });

    showQuestion();
}

function initCircleExplorer() {
    const slider = document.getElementById('circle-radius-slider');
    if (!slider) return;

    const circleEl = document.getElementById('explorer-circle');
    const radiusLine = document.getElementById('explorer-radius');
    const diameterLine = document.getElementById('explorer-diameter');
    const rEl = document.getElementById('circle-r');
    const dEl = document.getElementById('circle-d');
    const dEl2 = document.getElementById('circle-d2');
    const cEl = document.getElementById('circle-c');
    const scenarioEl = document.getElementById('circle-scenario');

    function update() {
        const r = parseInt(slider.value);
        // Scale: radius 1-10 maps to SVG radius 10-100
        const svgR = 10 + r * 9;
        const center = 120;

        circleEl.setAttribute('r', svgR);
        radiusLine.setAttribute('x2', center + svgR);
        diameterLine.setAttribute('x1', center - svgR);
        diameterLine.setAttribute('x2', center + svgR);

        const diameter = r * 2;
        const circumference = 3.14 * diameter;

        rEl.textContent = r;
        dEl.textContent = diameter;
        dEl2.textContent = diameter;
        cEl.textContent = circumference.toFixed(2);

        scenarioEl.textContent = `A circle with radius ${r} has a diameter of ${diameter} and a circumference of about ${circumference.toFixed(1)}!`;
    }

    slider.addEventListener('input', update);
    update();
}

function initCirclePartGame() {
    const optionsEl = document.getElementById('circle-game-options');
    if (!optionsEl) return;

    const lineEl = document.getElementById('game-part-line');
    const circEl = document.getElementById('game-part-circumference');
    const labelEl = document.getElementById('game-part-label');
    const messageEl = document.getElementById('circle-game-message');
    const scoreEl = document.getElementById('circle-game-score');

    const parts = [
        {
            name: 'radius',
            setup: () => {
                lineEl.setAttribute('x1', 120);
                lineEl.setAttribute('y1', 120);
                lineEl.setAttribute('x2', 200);
                lineEl.setAttribute('y2', 120);
                lineEl.style.display = '';
                circEl.style.stroke = 'transparent';
                labelEl.textContent = 'from center to edge';
            }
        },
        {
            name: 'diameter',
            setup: () => {
                lineEl.setAttribute('x1', 40);
                lineEl.setAttribute('y1', 120);
                lineEl.setAttribute('x2', 200);
                lineEl.setAttribute('y2', 120);
                lineEl.style.display = '';
                circEl.style.stroke = 'transparent';
                labelEl.textContent = 'all the way across, through the center';
            }
        },
        {
            name: 'circumference',
            setup: () => {
                lineEl.style.display = 'none';
                circEl.style.stroke = '#ef4444';
                labelEl.textContent = 'the distance all the way around';
            }
        }
    ];

    let current = null;
    let score = 0;

    function nextPart() {
        current = parts[randInt(0, parts.length - 1)];
        current.setup();
        messageEl.textContent = 'Which part is highlighted?';
        messageEl.className = 'game-feedback';
        optionsEl.querySelectorAll('button').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong');
        });
    }

    optionsEl.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            optionsEl.querySelectorAll('button').forEach(b => b.disabled = true);

            if (btn.dataset.part === current.name) {
                score++;
                scoreEl.textContent = score;
                btn.classList.add('correct');
                messageEl.textContent = `✅ Correct! That's the ${current.name}!`;
                messageEl.className = 'game-feedback correct';
                celebrateStickman('circle-stickman');
            } else {
                btn.classList.add('wrong');
                const right = [...optionsEl.querySelectorAll('button')].find(b => b.dataset.part === current.name);
                if (right) right.classList.add('correct');
                messageEl.textContent = `❌ That was the ${current.name}. Try the next one!`;
                messageEl.className = 'game-feedback wrong';
            }

            setTimeout(nextPart, 1600);
        });
    });

    nextPart();
}

function initFourierVisualizer() {
    const canvas = document.getElementById('fourier-canvas');
    if (!canvas) return;

    const slider = document.getElementById('fourier-slider');
    const countEl = document.getElementById('fourier-count');
    const scenarioEl = document.getElementById('fourier-scenario');
    const ctx = canvas.getContext('2d');

    let animId = null;
    let running = false;
    let time = 0;
    const wavePoints = [];

    function draw() {
        time += 0.02;
        const numCircles = parseInt(slider.value);
        countEl.textContent = numCircles;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);

        // Spinning circles on the left side
        let x = 60;
        let y = canvas.height / 2;

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        for (let i = 0; i < numCircles; i++) {
            const radius = 40 / (i + 1);
            const speed = 2 * (i + 1) * (i % 2 === 0 ? 1 : -1);

            // Draw circle
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();

            // Compute next position on this circle
            const angle = time * speed;
            const nextX = x + radius * Math.cos(angle);
            const nextY = y + radius * Math.sin(angle);

            // Radius arm
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();

            x = nextX;
            y = nextY;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1;
        }

        // Tip of the last circle
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Add point to the wave
        wavePoints.unshift({ y });
        if (wavePoints.length > canvas.width - 140) wavePoints.pop();

        // Draw the wave
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        wavePoints.forEach((point, index) => {
            const waveX = 140 + index;
            if (index === 0) {
                ctx.moveTo(waveX, point.y);
            } else {
                ctx.lineTo(waveX, point.y);
            }
        });
        ctx.stroke();

        // Connector from tip to wave start
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(140, wavePoints[0] ? wavePoints[0].y : y);
        ctx.stroke();
        ctx.setLineDash([]);

        const scenarios = {
            1: 'One circle makes a smooth wave.',
            2: 'Two circles make the wave bumpier!',
            3: 'Three circles — getting wiggly!',
            4: 'Four circles — a super wiggly wave! This is the Fourier technique!'
        };
        scenarioEl.textContent = scenarios[numCircles];

        animId = requestAnimationFrame(draw);
    }

    if (slider) {
        slider.addEventListener('input', () => {
            wavePoints.length = 0;
        });
    }

    function start() {
        if (running) return;
        running = true;
        draw();
    }

    function stop() {
        running = false;
        cancelAnimationFrame(animId);
    }

    start();

    // Stop the animation when the page is hidden to save battery
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stop();
        } else {
            start();
        }
    });
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

function celebrateStickman(id) {
    const stickman = id ? document.getElementById(id) : null;
    if (stickman) {
        stickman.classList.add('celebrate');
        setTimeout(() => stickman.classList.remove('celebrate'), 1500);
    }
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
            celebrateStickman('log-stickman');
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
                celebrateStickman('factorial-stickman');
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
            celebrateStickman('energy-stickman');
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
                            celebrateStickman('power-stickman');
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
            celebrateStickman('sqrt-stickman');
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
            celebrateStickman('cbrt-stickman');
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

function initStickmanPhysicsLab() {
    const canvas = document.getElementById('physics-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const angleSlider = document.getElementById('physics-angle');
    const powerSlider = document.getElementById('physics-power');
    const angleValue = document.getElementById('angle-value');
    const powerValue = document.getElementById('power-value');
    const launchBtn = document.getElementById('physics-launch');
    const resetBtn = document.getElementById('physics-reset');
    const messageEl = document.getElementById('physics-message');
    const scoreEl = document.getElementById('physics-score');

    let score = 0;
    let targetX = 0;
    let targetY = 0;
    let isAnimating = false;
    let animId = null;

    const groundY = 250;
    const startX = 60;
    const startY = groundY - 60;
    const scale = 6; // scale meters to pixels

    function randomTarget() {
        targetX = randInt(220, 520);
        targetY = groundY - 20;
    }

    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sky gradient already in CSS, but draw ground line
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

        // Target
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(targetX, targetY - 10, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎯', targetX, targetY - 5);

        // Launcher
        ctx.fillStyle = '#64748b';
        ctx.fillRect(startX - 20, groundY - 10, 40, 10);

        // Stickman at launcher
        drawStickman(ctx, startX, startY - 25, 1);

        // Angle line
        const angle = parseInt(angleSlider.value) * Math.PI / 180;
        const power = parseInt(powerSlider.value);
        const lineLen = power * 3;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(startX, startY - 25);
        ctx.lineTo(startX + Math.cos(angle) * lineLen, startY - 25 - Math.sin(angle) * lineLen);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function drawStickman(context, x, y, scaleFactor = 1) {
        const s = scaleFactor;
        context.strokeStyle = '#1e293b';
        context.lineWidth = 2 * s;
        context.lineCap = 'round';

        // Head
        context.beginPath();
        context.arc(x, y - 20 * s, 8 * s, 0, Math.PI * 2);
        context.stroke();

        // Body
        context.beginPath();
        context.moveTo(x, y - 12 * s);
        context.lineTo(x, y + 10 * s);
        context.stroke();

        // Arms
        context.beginPath();
        context.moveTo(x, y - 5 * s);
        context.lineTo(x - 12 * s, y + 5 * s);
        context.moveTo(x, y - 5 * s);
        context.lineTo(x + 12 * s, y + 5 * s);
        context.stroke();

        // Legs
        context.beginPath();
        context.moveTo(x, y + 10 * s);
        context.lineTo(x - 10 * s, y + 28 * s);
        context.moveTo(x, y + 10 * s);
        context.lineTo(x + 10 * s, y + 28 * s);
        context.stroke();
    }

    function launch() {
        if (isAnimating) return;
        isAnimating = true;
        launchBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';

        const angleRad = parseInt(angleSlider.value) * Math.PI / 180;
        const v0 = parseInt(powerSlider.value);
        const g = 9.8;

        let t = 0;
        const dt = 0.05;
        const points = [];

        function animate() {
            t += dt;
            const x = startX + (v0 * Math.cos(angleRad) * t) * scale;
            const y = (startY - 25) - (v0 * Math.sin(angleRad) * t - 0.5 * g * t * t) * scale;

            points.push({ x, y });

            drawScene();

            // Draw trajectory
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (points.length > 0) {
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
            }
            ctx.stroke();

            // Draw flying stickman
            drawStickman(ctx, x, y, 0.8);

            // Check ground hit
            if (y >= groundY - 10 || x > canvas.width || x < 0) {
                isAnimating = false;
                cancelAnimationFrame(animId);

                const distance = Math.abs(x - targetX);
                if (distance < 20) {
                    score++;
                    scoreEl.textContent = score;
                    messageEl.textContent = '🎉 Direct hit! Physics + math = success!';
                    messageEl.className = 'game-feedback correct';
                    celebrateStickman('physics-stickman');
                } else if (distance < 60) {
                    messageEl.textContent = '🔥 Close! Adjust angle or power a little.';
                    messageEl.className = 'game-feedback';
                } else if (x < targetX) {
                    messageEl.textContent = '📈 Too short! Try more power or a higher angle.';
                    messageEl.className = 'game-feedback wrong';
                } else {
                    messageEl.textContent = '📉 Too far! Try less power or a lower angle.';
                    messageEl.className = 'game-feedback wrong';
                }
                return;
            }

            animId = requestAnimationFrame(animate);
        }

        animate();
    }

    function reset() {
        if (animId) cancelAnimationFrame(animId);
        isAnimating = false;
        randomTarget();
        drawScene();
        launchBtn.style.display = 'inline-block';
        resetBtn.style.display = 'none';
        messageEl.textContent = 'Hit the red target!';
        messageEl.className = 'game-feedback';
    }

    angleSlider.addEventListener('input', () => {
        angleValue.textContent = angleSlider.value + '°';
        if (!isAnimating) drawScene();
    });

    powerSlider.addEventListener('input', () => {
        powerValue.textContent = powerSlider.value;
        if (!isAnimating) drawScene();
    });

    launchBtn.addEventListener('click', launch);
    resetBtn.addEventListener('click', reset);

    randomTarget();
    drawScene();
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
                    celebrateStickman('tesseract-stickman');
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

function buildNavigation() {
    // The top bar only contains the brand, Home and Test (defined in each page's HTML).
    // Here we just mark whichever link matches the current page.
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
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

// ---------------- FULL MIXED TEST ----------------

const TEST_QUESTION_GENERATORS = [
    // 1. Factorials
    () => {
        const n = randInt(2, 9);
        let answer = 1;
        for (let i = 2; i <= n; i++) answer *= i;
        return { question: `Calculate ${n}!`, answer: answer };
    },
    // 2. Square roots
    () => {
        const root = randInt(1, 22);
        return { question: `What is √${root * root}?`, answer: root };
    },
    // 3. Cube roots
    () => {
        const root = randInt(1, 7);
        return { question: `What is ∛${root * root * root}?`, answer: root };
    },
    // 4. Powers
    () => {
        const base = randInt(2, 9);
        const exp = randInt(2, 4);
        return { question: `Calculate ${base}<sup>${exp}</sup>`, answer: Math.pow(base, exp) };
    },
    // 5. Tetration
    () => {
        const options = [
            { question: 'Calculate <sup>2</sup>2 (2 tetrated to height 2)', answer: 4 },
            { question: 'Calculate <sup>3</sup>2 (2 tetrated to height 3)', answer: 16 },
            { question: 'Calculate <sup>2</sup>3 (3 tetrated to height 2)', answer: 27 }
        ];
        return randChoice(options);
    },
    // 6. Pentation
    () => {
        const options = [
            { question: 'What is 2 ↑↑↑ 2?', answer: 4 },
            { question: 'What is 2 ↑↑↑ 3?', answer: 65536 }
        ];
        return randChoice(options);
    },
    // 7. Hexation
    () => {
        const options = [
            { question: 'What is 2 ↑↑↑↑ 2?', answer: 4 },
            { question: 'How many up-arrows does hexation use?', answer: 4 }
        ];
        return randChoice(options);
    },
    // 8. Logarithms
    () => {
        const options = [
            { question: 'What is log(80) rounded to 1 decimal place?', answer: 1.9, tolerance: 0.05 },
            { question: 'What is log(10)?', answer: 1 },
            { question: 'What is log(100)?', answer: 2 },
            { question: 'What is log(1000)?', answer: 3 }
        ];
        return randChoice(options);
    },
    // 9. E=mc²
    () => {
        const options = [
            { question: 'In E = mc², what is the exponent on c?', answer: 2 },
            { question: 'E = what?', answer: 'mc²', choices: shuffleQuestions(['mc²', 'm²c', '2mc', 'm + c²']) },
            { question: 'E = what? (m is mass, c is the speed of light)', answer: 'mc²', choices: shuffleQuestions(['mc²', 'cm²', 'c² + m', 'm ÷ c²']) }
        ];
        return randChoice(options);
    },
    // 10. Tesseract
    () => {
        const facts = [
            { question: 'How many vertices does a tesseract have?', answer: 16 },
            { question: 'How many edges does a tesseract have?', answer: 32 },
            { question: 'How many square faces does a tesseract have?', answer: 24 },
            { question: 'How many cubic cells does a tesseract have?', answer: 8 }
        ];
        return randChoice(facts);
    }
];

function shuffleQuestions(questions) {
    const copy = questions.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildTestQuestions() {
    // One question from every topic, plus 5 extra random ones, all shuffled.
    const questions = TEST_QUESTION_GENERATORS.map(generator => generator());
    for (let i = 0; i < 5; i++) {
        questions.push(randChoice(TEST_QUESTION_GENERATORS)());
    }
    return shuffleQuestions(questions);
}

const TEST_HISTORY_KEY = 'iqMathTestHistory';

function readTestHistory() {
    try {
        const raw = localStorage.getItem(TEST_HISTORY_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveTestResult(score, total, percent) {
    const history = readTestHistory();
    history.unshift({ score: score, total: total, percent: percent, date: new Date().toISOString() });
    const trimmed = history.slice(0, 10);
    try {
        localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(trimmed));
    } catch (error) {
        // Storage can be unavailable in some private browsing modes; history still shows this session.
    }
    return trimmed;
}

function formatHistoryDate(value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    try {
        return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch (error) {
        return date.toLocaleString();
    }
}

function renderTestHistory(listEl, history) {
    if (!listEl) return;
    listEl.innerHTML = '';
    if (!history.length) {
        const empty = document.createElement('li');
        empty.className = 'test-history-empty';
        empty.textContent = 'No attempts recorded yet.';
        listEl.appendChild(empty);
        return;
    }

    history.forEach((entry, i) => {
        const item = document.createElement('li');
        item.className = 'test-history-item' + (i === 0 ? ' latest' : '');
        const label = i === 0 ? 'Last time' : `${i + 1} attempts ago`;
        const percent = typeof entry.percent === 'number' ? `${entry.percent}%` : '—';
        const score = `${entry.score}/${entry.total}`;
        item.innerHTML = `<span class="history-label">${label}</span><span class="history-percent">${percent}</span><span class="history-score">${score}</span><span class="history-date">${formatHistoryDate(entry.date)}</span>`;
        listEl.appendChild(item);
    });
}

function initMixedTest() {
    const container = document.getElementById('mixed-test');
    if (!container) return;

    const activeArea = container.querySelector('.test-active');
    const questionEl = container.querySelector('.test-question');
    const inputEl = container.querySelector('.test-input');
    const submitBtn = container.querySelector('.test-submit');
    const nextBtn = container.querySelector('.test-next');
    const feedbackEl = container.querySelector('.test-feedback');
    const progressEl = container.querySelector('.test-progress');
    const scoreEl = container.querySelector('.test-score');
    const resultEl = container.querySelector('.test-result');
    const finalScoreEl = container.querySelector('.test-final-score');
    const percentageEl = container.querySelector('.test-percentage');
    const restartBtn = container.querySelector('.test-restart');
    const historyListEl = container.querySelector('.test-history-list');
    const choicesEl = container.querySelector('.test-choices');

    let questions = [];
    let index = 0;
    let score = 0;

    function showQuestion() {
        const current = questions[index];
        questionEl.innerHTML = current.question;
        progressEl.textContent = `Question ${index + 1} / ${questions.length}`;
        scoreEl.textContent = `Correct: ${score}`;
        feedbackEl.textContent = '';
        feedbackEl.className = 'test-feedback';
        nextBtn.style.display = 'none';

        if (current.choices && choicesEl) {
            // Multiple-choice question: show buttons, hide the text input.
            inputEl.style.display = 'none';
            submitBtn.style.display = 'none';
            choicesEl.innerHTML = '';
            current.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'test-choice';
                btn.textContent = choice;
                btn.addEventListener('click', () => checkChoice(btn, current));
                choicesEl.appendChild(btn);
            });
            choicesEl.style.display = 'grid';
        } else {
            // Regular numeric question.
            if (choicesEl) choicesEl.style.display = 'none';
            inputEl.style.display = '';
            submitBtn.style.display = '';
            inputEl.value = '';
            inputEl.disabled = false;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Answer';
            inputEl.focus();
        }
    }

    function startTest() {
        questions = buildTestQuestions();
        index = 0;
        score = 0;
        resultEl.style.display = 'none';
        activeArea.style.display = 'block';
        showQuestion();
    }

    function finishAnswer(wasCorrect) {
        if (wasCorrect) {
            score++;
            feedbackEl.textContent = '✅ Correct';
            feedbackEl.className = 'test-feedback correct';
        } else {
            // No explanation and no correct answer is revealed.
            feedbackEl.textContent = '❌ Incorrect';
            feedbackEl.className = 'test-feedback wrong';
        }

        inputEl.disabled = true;
        submitBtn.disabled = true;
        scoreEl.textContent = `Correct: ${score}`;

        if (index === questions.length - 1) {
            const percent = Math.round((score / questions.length) * 100);
            finalScoreEl.textContent = `${score} out of ${questions.length} correct`;
            percentageEl.textContent = `${percent}%`;

            // Reveal the result first; history is a bonus and must never block it.
            activeArea.style.display = 'none';
            resultEl.style.display = 'block';

            try {
                renderTestHistory(historyListEl, saveTestResult(score, questions.length, percent));
            } catch (error) {
                // If storage or history rendering fails, the result stays visible.
            }
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.textContent = 'Answered';
        }
    }

    function checkChoice(btn, current) {
        if (btn.disabled) return;
        choicesEl.querySelectorAll('button').forEach(b => b.disabled = true);
        const isCorrect = btn.textContent === current.answer;
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
        finishAnswer(isCorrect);
    }

    function check() {
        const value = parseFloat(inputEl.value);
        if (isNaN(value)) {
            feedbackEl.textContent = 'Enter a number to answer.';
            feedbackEl.className = 'test-feedback wrong';
            return;
        }

        const current = questions[index];
        const tolerance = current.tolerance || 0;
        finishAnswer(Math.abs(value - current.answer) <= tolerance);
    }

    submitBtn.addEventListener('click', check);
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !submitBtn.disabled) check();
    });
    nextBtn.addEventListener('click', () => {
        index++;
        showQuestion();
    });
    restartBtn.addEventListener('click', startTest);

    renderTestHistory(historyListEl, readTestHistory());
    startTest();
}

// ---------------- BIG CALCULATION BOX ----------------

function factorialValue(n) {
    if (!Number.isInteger(n) || n < 0 || n > 170) {
        throw new Error('Factorial needs a whole number from 0 to 170');
    }
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function calculateExpression(expression) {
    const cleaned = expression
        .replace(/√/g, 'sqrt')
        .replace(/∛/g, 'cbrt')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/\s+/g, '');

    if (!cleaned) throw new Error('Type an expression to calculate');

    const tokens = cleaned.match(/\d+(?:\.\d+)?|sqrt|cbrt|[+\-*/^%()!]/g) || [];
    if (tokens.join('') !== cleaned) {
        throw new Error('Use numbers and + - * / ^ % ( ) sqrt cbrt !');
    }

    let pos = 0;
    const peek = () => tokens[pos];
    const take = (value) => {
        if (tokens[pos] === value) {
            pos++;
            return true;
        }
        return false;
    };
    const expect = (value, label) => {
        if (!take(value)) throw new Error(`Missing ${label}`);
    };

    function parseExpression() {
        let value = parseTerm();
        while (peek() === '+' || peek() === '-') {
            const op = tokens[pos++];
            const right = parseTerm();
            value = op === '+' ? value + right : value - right;
        }
        return value;
    }

    function parseTerm() {
        let value = parsePower();
        while (peek() === '*' || peek() === '/' || peek() === '%') {
            const op = tokens[pos++];
            const right = parsePower();
            if (op === '*') value *= right;
            else if (op === '/') value /= right;
            else value %= right;
        }
        return value;
    }

    function parsePower() {
        let value = parseFactor();
        if (take('^')) value = Math.pow(value, parsePower());
        return value;
    }

    function parseFactor() {
        if (take('-')) return -parseFactor();
        let value = parsePrimary();
        while (take('!')) value = factorialValue(value);
        return value;
    }

    function parsePrimary() {
        if (take('(')) {
            const value = parseExpression();
            expect(')', ')');
            return value;
        }
        if (peek() === 'sqrt' || peek() === 'cbrt') {
            const fn = tokens[pos++];
            expect('(', '(');
            const value = parseExpression();
            expect(')', ')');
            return fn === 'sqrt' ? Math.sqrt(value) : Math.cbrt(value);
        }
        const token = peek();
        if (token !== undefined && /^\d/.test(token)) {
            pos++;
            return parseFloat(token);
        }
        throw new Error('Invalid expression');
    }

    const result = parseExpression();
    if (pos !== tokens.length) throw new Error('Invalid expression');
    if (!Number.isFinite(result)) throw new Error('Result is too large or not a number');
    return result;
}

function initCalcBox() {
    const box = document.getElementById('calc-box');
    if (!box) return;

    const input = box.querySelector('.calc-input');
    const resultEl = box.querySelector('.calc-result');
    const evaluateBtn = box.querySelector('.calc-evaluate');
    const clearBtn = box.querySelector('.calc-clear');

    box.querySelectorAll('[data-insert]').forEach(button => {
        button.addEventListener('click', () => {
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const insert = button.dataset.insert;
            input.value = input.value.slice(0, start) + insert + input.value.slice(end);
            const caret = start + insert.length;
            input.focus();
            input.setSelectionRange(caret, caret);
        });
    });

    evaluateBtn.addEventListener('click', () => {
        try {
            const value = calculateExpression(input.value);
            resultEl.textContent = '= ' + Number(value.toPrecision(12)).toLocaleString();
            resultEl.className = 'calc-result correct';
        } catch (error) {
            resultEl.textContent = error.message;
            resultEl.className = 'calc-result wrong';
        }
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        resultEl.textContent = '';
        resultEl.className = 'calc-result';
        input.focus();
    });
}
