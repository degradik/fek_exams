(() => {
  const test = window.TEST_DATA;
  if (!test) return;
  const root = document.getElementById('questions');
  const state = { answered: 0, correct: 0, locked: new Set() };
  document.title = `${test.title} — русский язык`;
  document.getElementById('variant-title').textContent = test.title;
  document.getElementById('variant-subtitle').textContent = test.subtitle;
  document.getElementById('total').textContent = test.questions.length;
  document.getElementById('answered-total').textContent = test.questions.length;

  test.questions.forEach((q, index) => {
    const card = document.createElement('article');
    card.className = 'question';
    card.id = `q-${index + 1}`;
    card.innerHTML = `<div class="q-head"><span class="q-number">${String(index + 1).padStart(2,'0')}</span><span class="topic">${q.topic}</span></div><p class="prompt"></p><div class="options"></div><div class="feedback" aria-live="polite"></div>`;
    card.querySelector('.prompt').textContent = q.prompt;
    const options = card.querySelector('.options');
    q.options.forEach((option, optionIndex) => {
      const label = document.createElement('label');
      label.className = 'option';
      label.innerHTML = `<input type="radio" name="q${index}" value="${optionIndex}"><span></span>`;
      label.querySelector('span').textContent = option;
      label.querySelector('input').addEventListener('change', () => answer(index, optionIndex, card));
      options.appendChild(label);
    });
    root.appendChild(card);
  });

  function answer(questionIndex, selected, card) {
    if (state.locked.has(questionIndex)) return;
    state.locked.add(questionIndex);
    state.answered += 1;
    const q = test.questions[questionIndex];
    const labels = [...card.querySelectorAll('.option')];
    labels.forEach((label, i) => {
      label.classList.add('locked');
      label.querySelector('input').disabled = true;
      if (i === q.answer) label.classList.add('correct');
      if (i === selected && i !== q.answer) label.classList.add('wrong');
    });
    const feedback = card.querySelector('.feedback');
    const isCorrect = selected === q.answer;
    if (isCorrect) state.correct += 1;
    feedback.className = `feedback show ${isCorrect ? 'good' : 'bad'}`;
    feedback.textContent = `${isCorrect ? 'Верно. ' : 'Неверно. '} ${q.note}`;
    card.classList.add('answered');
    updateScore();
  }

  function updateScore() {
    document.getElementById('correct').textContent = state.correct;
    document.getElementById('points').textContent = state.correct * 4;
    document.getElementById('answered').textContent = state.answered;
    document.getElementById('progress').style.width = `${state.answered / test.questions.length * 100}%`;
    if (state.answered === test.questions.length) {
      const percent = Math.round(state.correct / test.questions.length * 100);
      const result = document.getElementById('result');
      result.classList.add('show');
      result.querySelector('strong').textContent = percent >= 80 ? 'Отличная работа' : percent >= 60 ? 'Хороший результат' : 'Нужна ещё практика';
      result.querySelector('span').textContent = `${percent}% правильных ответов`;
    }
  }

  document.getElementById('reset').addEventListener('click', () => location.reload());
  const started = Date.now();
  setInterval(() => {
    const seconds = Math.floor((Date.now() - started) / 1000);
    document.getElementById('timer').textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  }, 1000);
})();
