/* ═══════════════════════════════════════════════════════════
   OAKBES — app.js  TITAN EDITION
   Animated Mesh · Parallax · QR Codes · Rubrics · Exam Compiler
   Variable Injection · localStorage Persistence
   Created by @bayhes & @khkirill
═══════════════════════════════════════════════════════════ */

'use strict';

// ╔═══════════════════════════════════════════════════════╗
// ║  1. CONSTANTS & CONFIG                                ║
// ╚═══════════════════════════════════════════════════════╝

const _sx = value => {
  try {
    return atob(value);
  } catch (_) {
    return '';
  }
};

const QUASAR_API_URL = _sx('aHR0cHM6Ly9hcGkuZ3JvcS5jb20vb3BlbmFpL3YxL2NoYXQvY29tcGxldGlvbnM=');
const API_KEY_STORE = 'qs_quasar_key';
const WS_STORE_KEY = 'qs_worksheet_v3';
const THEME_STORE_KEY = 'qs_theme_v1';

const SHIPPED_KEY = _sx('Z3NrX0l2V044Y1EwN0dOSmVtNEY2RHpVV0dkeWIzRllJdmZHYUpMYjRQMzlHMHc1Y1pkSHRiMUc=');

const MODEL_REASONING = 'llama-3.3-70b-versatile';
const MODEL_FAST = 'llama-3.3-70b-versatile';
const MODEL_VISION = 'llama-3.2-11b-vision-preview';

// Pre-seed key if absent
if (!localStorage.getItem(API_KEY_STORE)) {
  localStorage.setItem(API_KEY_STORE, SHIPPED_KEY);
}


// ╔═══════════════════════════════════════════════════════╗
// ║  2. TOPIC DATABASE                                    ║
// ╚═══════════════════════════════════════════════════════╝

const TOPICS = {
  physics: [
    { label: 'Физические величины и измерения', value: 'phys_intro', grades: ['7'], detail: 'система СИ, скалярные и векторные величины, погрешности' },
    { label: 'Механическое движение', value: 'motion_7', grades: ['7'], detail: 'равномерное движение, скорость, путь, траектория' },
    { label: 'Плотность вещества', value: 'density', grades: ['7'], detail: 'масса, объём, плотность, способы определения' },
    { label: 'Давление твёрдых тел, жидкостей и газов', value: 'pressure', grades: ['7'], detail: 'давление, закон Паскаля, гидростатическое давление, сообщающиеся сосуды' },
    { label: 'Архимедова сила и плавание тел', value: 'archimedes', grades: ['7'], detail: 'закон Архимеда, условия плавания тел' },
    { label: 'Простые механизмы', value: 'simple_machines', grades: ['7'], detail: 'рычаг, блок, наклонная плоскость, момент силы, КПД' },
    { label: 'Силы в природе', value: 'forces_7', grades: ['7'], detail: 'сила тяжести, упругости, трения, вес тела, закон Гука' },
    { label: 'Работа, мощность, энергия', value: 'work_energy_7', grades: ['7'], detail: 'механическая работа, мощность, кинетическая и потенциальная энергия' },
    { label: 'Тепловые явления', value: 'thermal', grades: ['8'], detail: 'внутренняя энергия, теплопроводность, конвекция, излучение' },
    { label: 'Количество теплоты', value: 'heat_quantity', grades: ['8'], detail: 'удельная теплоёмкость, уравнение теплового баланса' },
    { label: 'Агрегатные состояния вещества', value: 'phase_changes', grades: ['8'], detail: 'плавление, кристаллизация, испарение, конденсация, кипение' },
    { label: 'Тепловые двигатели и КПД', value: 'heat_engines', grades: ['8'], detail: 'ДВС, паровая турбина, КПД тепловых двигателей' },
    { label: 'Электрический заряд и поле', value: 'charge_8', grades: ['8'], detail: 'электризация, проводники, диэлектрики' },
    { label: 'Постоянный ток (8 кл.)', value: 'circuits_8', grades: ['8'], detail: 'сила тока, напряжение, сопротивление, закон Ома для участка цепи' },
    { label: 'Соединения проводников', value: 'circuit_conn', grades: ['8'], detail: 'последовательное и параллельное соединение' },
    { label: 'Магнитное поле и электромагниты', value: 'magnetism_8', grades: ['8'], detail: 'постоянные магниты, магнитное поле тока' },
    { label: 'Световые явления (8 кл.)', value: 'optics_8', grades: ['8'], detail: 'отражение, преломление, линзы, оптические приборы' },
    { label: 'Кинематика', value: 'kinematics_9', grades: ['9'], detail: 'равноускоренное движение, свободное падение, графики v(t), s(t)' },
    { label: 'Динамика: законы Ньютона', value: 'dynamics_9', grades: ['9'], detail: 'три закона Ньютона, инерция, масса, сила' },
    { label: 'Импульс и закон сохранения', value: 'momentum_9', grades: ['9'], detail: 'импульс тела, закон сохранения импульса, реактивное движение' },
    { label: 'Энергия и закон сохранения (9 кл.)', value: 'energy_9', grades: ['9'], detail: 'закон сохранения механической энергии, мощность' },
    { label: 'Механические колебания и волны', value: 'oscillations_9', grades: ['9'], detail: 'период, частота, амплитуда, маятник, звуковые волны' },
    { label: 'Электромагнитная индукция (9 кл.)', value: 'em_induction_9', grades: ['9'], detail: 'опыты Фарадея, правило Ленца' },
    { label: 'Строение атома и ядра (9 кл.)', value: 'atom_9', grades: ['9'], detail: 'модели атома, радиоактивность, ядерные реакции' },
    { label: 'Кинематика (углублённая)', value: 'kinematics_10', grades: ['10'], detail: 'криволинейное движение, тело брошенное под углом, относительность' },
    { label: 'Статика и равновесие', value: 'statics', grades: ['10'], detail: 'условия равновесия, момент силы, центр тяжести' },
    { label: 'Молекулярная физика и МКТ', value: 'mkt', grades: ['10'], detail: 'основное уравнение МКТ, идеальный газ' },
    { label: 'Термодинамика', value: 'thermodynamics_10', grades: ['10'], detail: 'первое начало термодинамики, изопроцессы, цикл Карно' },
    { label: 'Электростатика', value: 'electrostatics', grades: ['10'], detail: 'закон Кулона, поле, потенциал, конденсаторы' },
    { label: 'Законы постоянного тока (10 кл.)', value: 'circuits_10', grades: ['10'], detail: 'закон Ома для полной цепи, законы Кирхгофа, ЭДС' },
    { label: 'Магнетизм и сила Лоренца', value: 'magnetism_11', grades: ['11'], detail: 'вектор индукции, сила Ампера, сила Лоренца, закон Фарадея' },
    { label: 'Переменный ток и ЭМ колебания', value: 'ac_circuits', grades: ['11'], detail: 'генератор, резонанс LC-контура, трансформатор' },
    { label: 'Геометрическая оптика', value: 'optics_geo', grades: ['11'], detail: 'законы отражения и преломления, линзы, приборы' },
    { label: 'Волновая оптика', value: 'optics_wave', grades: ['11'], detail: 'интерференция, дифракция, поляризация' },
    { label: 'Квантовая физика', value: 'quantum', grades: ['11'], detail: 'фотоэффект, уравнение Эйнштейна, атом Бора' },
    { label: 'Ядерная физика', value: 'nuclear', grades: ['11'], detail: 'строение ядра, радиоактивный распад, ядерные реакции, E=mc²' },
    { label: 'Астрофизика', value: 'astrophysics', grades: ['11'], detail: 'звёзды, чёрные дыры, закон Хаббла' },
  ],
  cs: [
    { label: 'Информация и кодирование', value: 'info_intro', grades: ['7'], detail: 'понятие информации, единицы, ASCII, Unicode' },
    { label: 'Устройство компьютера', value: 'computer_hw', grades: ['7'], detail: 'процессор, память, периферия, архитектура' },
    { label: 'Файловая система', value: 'filesystem', grades: ['7'], detail: 'файлы, папки, пути, форматы данных' },
    { label: 'Алгоритмы и блок-схемы', value: 'algorithms_intro', grades: ['7'], detail: 'понятие алгоритма, блок-схемы, виды алгоритмов' },
    { label: 'Системы счисления', value: 'number_systems', grades: ['8'], detail: 'двоичная, восьмеричная, шестнадцатеричная, перевод' },
    { label: 'Логические основы', value: 'boolean_logic', grades: ['8'], detail: 'AND, OR, NOT, XOR, таблицы истинности, логические схемы' },
    { label: 'Основы программирования', value: 'programming_basics', grades: ['8'], detail: 'переменные, типы, if/else, циклы, функции; Python' },
    { label: 'Работа с текстом и графикой', value: 'text_graphics', grades: ['8'], detail: 'текстовые и графические редакторы, форматы' },
    { label: 'Массивы и строки', value: 'arrays_strings', grades: ['9'], detail: 'одномерные и двумерные массивы, срезы, методы строк' },
    { label: 'Алгоритмы сортировки', value: 'sorting', grades: ['9'], detail: 'пузырьковая, вставками, быстрая сортировка, O-сложность' },
    { label: 'Алгоритмы поиска', value: 'searching', grades: ['9'], detail: 'линейный O(n), бинарный O(log n)' },
    { label: 'Рекурсия', value: 'recursion', grades: ['9'], detail: 'рекурсивные функции, факториал, Фибоначчи' },
    { label: 'Компьютерные сети', value: 'networks_9', grades: ['9'], detail: 'IP-адресация, протоколы TCP/IP, DNS, HTTP' },
    { label: 'Структуры данных', value: 'data_structures', grades: ['10'], detail: 'стек, очередь, связный список' },
    { label: 'Деревья и графы', value: 'trees_graphs', grades: ['10'], detail: 'бинарное дерево, BST, BFS, DFS, Дейкстра' },
    { label: 'Теория сложности', value: 'complexity', grades: ['10'], detail: 'O(n), Ω, Θ, пространственная сложность, P и NP' },
    { label: 'ООП', value: 'oop', grades: ['10'], detail: 'классы, объекты, инкапсуляция, наследование, полиморфизм' },
    { label: 'Базы данных и SQL', value: 'databases', grades: ['10'], detail: 'реляционная модель, SELECT, JOIN, GROUP BY' },
    { label: 'Кибербезопасность', value: 'cybersecurity', grades: ['11'], detail: 'фишинг, SQL-инъекции, хэширование, HTTPS, 2FA' },
    { label: 'Data Science', value: 'data_science', grades: ['11'], detail: 'pandas, numpy, визуализация, статистика, регрессия' },
    { label: 'Машинное обучение', value: 'ml_concepts', grades: ['11'], detail: 'supervised/unsupervised, k-NN, decision tree, нейронные сети' },
    { label: 'Веб-разработка', value: 'web_dev', grades: ['11'], detail: 'HTML, CSS, JavaScript, REST API, фреймворки' },
  ],
};


// ╔═══════════════════════════════════════════════════════╗
// ║  3. SYSTEM PROMPTS (Hyper-Tuned Titan Edition)        ║
// ╚═══════════════════════════════════════════════════════╝

const SYSTEM_SIMPLE = `Ты — сверх-обученный физик-преподаватель и эксперт по информатике уровня Titan. Твоя цель — обеспечить глубокое понимание материала.

ПРИНЦИПЫ ОБЩЕНИЯ:
1. **Контекстуальность**: Если вопрос простой (приветствие, как дела), отвечай кратко и вежливо, без лишних таблиц.
2. **Визуализация (когда уместно)**: 
   - Используй **Markdown-таблицы**, когда нужно сравнить данные или структурировать списки.
   - Используй **Mermaid-диаграммы**, если нужно объяснить процесс или структуру (\`\`\`mermaid).
   - Используй **JSON-графики**, если визуализация функций или трендов поможет лучше понять материал (\`\`\`chart).
3. **Формализация**: Всегда используй LaTeX для формул ($...$ или $$...$$).

Твой стиль: Профессиональный, но живой. Не навязывай визуализацию там, где достаточно обычного текста.`;

const SYSTEM_SOCRATIC = `Ты — Сократический наставник-эксперт. Ты никогда не даешь готовых ответов сразу.
Твоя задача — вести ученика к открытию через серию глубоких, наводящих вопросов.

АЛГОРИТМ:
1. **Диагностика**: Сначала пойми, на каком этапе затык.
2. **Активация**: Задай вопрос, который заставит вспомнить базовый закон (например, "Что мы знаем о сохранении энергии в этой системе?").
3. **Леса (Scaffolding)**: Дай небольшую подсказку через аналогию или формулу, но оставь вычисление ученику.
4. **Рефлексия**: После того как ученик решит, спроси: "А что изменится, если мы увеличим X вдвое?".

Используй LaTeX и красивое форматирование. Твой ответ должен заканчиваться вопросом.`;

const SYSTEM_TRACE = `You are a Computer Science execution tracer. Produce rigorous step-by-step execution traces.

FORMAT (strictly):
## Execution Trace
| Step | Line | Operation | Variable State |
|------|------|-----------|----------------|
...
## Output
Exact program output.
## Complexity Analysis
- Time: O(?)
- Space: O(?)
- Brief explanation.
## Potential Issues
Bugs, edge cases, or inefficiencies.
Respond in Russian unless code comments are in English.`;

const SYSTEM_GENERATOR = `You are an expert task generator for Physics and Computer Science education (grades 7–11).
Return ONLY valid JSON — no markdown fences, no preamble, no trailing text.

Return a JSON array of task objects. Each object has EXACTLY these fields:
{
  "num": <integer>,
  "condition": "<full problem statement with LaTeX for physics ($...$, $$...$$) or code spec>",
  "hint": "<Socratic hint — a guiding question, NOT the answer>",
  "solution": "<full step-by-step solution with LaTeX/code. After solution, include ## Common Mistakes section>",
  "answer": "<final boxed answer with units>",
  "rubric": [
    {"criterion": "<what is evaluated>", "points": <integer>, "description": "<what earns the points>"}
  ]
}

QUALITY:
- Physics: Always include 'Дано:' and 'Найти:' in condition. Use realistic numerical values. LaTeX for all formulas.
- CS: Include Input/Output examples. PEP 8 Python with inline comments.
- Olympiad: Multi-step derivation (energy + kinematics, calculus); CS: DP, graph algorithms, bit manipulation.
- Rubric: Always 3 rows minimum — e.g., 1pt for formula/approach, 1pt for calculation, 1pt for final answer.
- solution must end with a "## Common Mistakes" block.`;


// ╔═══════════════════════════════════════════════════════╗
// ║  4. APPLICATION STATE                                 ║
// ╚═══════════════════════════════════════════════════════╝

const state = {
  activeSection: 'physics',
  modes: { physics: 'simple', cs: 'simple' },
  histories: { physics: [], cs: [] },
  gen: { subject: 'physics', grade: '7', difficulty: 'easy', topic: '', customTopic: '', count: 3 },
  sched: { subject: 'physics', grade: '7', hours: 6, goal: 'exam', weeks: 16 },
  loading: { physics: false, cs: false, generator: false, schedule: false, cheatsheet: false },
  worksheet: [],            // persisted in localStorage
  qrTask: null,          // { condition, hint, label }
  varchangeTask: null,          // task object for variable injection
  suggestions: { physics: [], cs: [] },
  attachments: { physics: null, cs: null }, // base64 images
};

function _qMask(seed, shift = 1) {
  return seed.split('').map(ch => String.fromCharCode(ch.charCodeAt(0) - shift)).join('');
}

const __ax = (() => {
  const denyCode = _sx('Q0xJRU5UX05PVF9BTExPV0VE');

  const allowClient = () => {
    return true;
  };

  const restrictClient = () => {
    const app = document.getElementById('app');
    if (app) app.style.display = 'none';

    const heroContent = document.getElementById('hero-content');
    if (heroContent) heroContent.style.opacity = '0';

    const mesh = document.getElementById('mesh-bg');
    if (mesh) mesh.style.filter = 'brightness(0.2)';

    const video = document.getElementById('hero-bg-video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach(src => src.removeAttribute('src'));
      video.load();
      video.style.display = 'none';
    }

    const audio = document.getElementById('hero-bg-audio');
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.querySelectorAll('source').forEach(src => src.removeAttribute('src'));
      audio.load();
    }
  };

  const writeLock = isLocked => {
    try {
      Object.defineProperty(window, '__QS_LOCKED__', {
        value: !!isLocked,
        writable: false,
        configurable: false,
      });
    } catch (_) {
      window.__QS_LOCKED__ = !!isLocked;
    }
  };

  return {
    allowClient,
    restrictClient,
    writeLock,
    isLocked: () => window.__QS_LOCKED__ === true,
    denyCode,
  };
})();

function setupBasicHardening() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const key = (e.key || '').toLowerCase();
    if (key === 'f12') e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key)) e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && key === 'u') e.preventDefault();
  });
}


// ╔═══════════════════════════════════════════════════════╗
// ║  5. INIT                                              ║
// ╚═══════════════════════════════════════════════════════╝

document.addEventListener('DOMContentLoaded', () => {
  const accessAllowed = __ax.allowClient();
  __ax.writeLock(!accessAllowed);
  if (!accessAllowed) {
    __ax.restrictClient();
    return;
  }

  setupBasicHardening();

  if (window.lucide) lucide.createIcons();

  setupThemeToggle();
  setupAccessibilityHelpers();
  setupMobileOrientationHint();
  loadWorksheetFromStorage();
  setupMeshParallax();
  setupMagneticButtons();
  setupNav();
  setupApiKeyModal();
  setupChatSection('physics');
  setupChatSection('cs');
  setupGenerator();
  setupSchedule();
  setupWorksheet();
  setupCheatsheet();
  setupQrModal();
  setupVarchangeModal();
  setupExamModal();
  setupExamEngine();
  setupChartsSection();
  setupQrQuestsSection();
  setupAuth();
  setupRevealObserver();
  renderFlashcards();

  document.addEventListener('qs:icons', () => {
    if (window.lucide) lucide.createIcons();
  });
});


// ╔═══════════════════════════════════════════════════════╗
// ║  6. PARALLAX MESH EFFECT                              ║
// ╚═══════════════════════════════════════════════════════╝

function setupMeshParallax() {
  const layer = document.getElementById('parallax-layer');
  if (!layer) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    const cards = layer.querySelectorAll('.frost-card');
    cards.forEach((card, i) => {
      const depth = (i + 1) * 0.4;
      card.style.transform = `translate(${dx * depth * 12}px, ${dy * depth * 8}px) rotate(${i % 2 === 0 ? -8 + dy * 2 : 6 + dy * 1.5}deg)`;
    });
  }, { passive: true });
}


// ╔═══════════════════════════════════════════════════════╗
// ║  7. MAGNETIC BUTTONS                                  ║
// ╚═══════════════════════════════════════════════════════╝

function setupMagneticButtons() {
  const attachTo = el => {
    if (el._magneticWired) return;
    el._magneticWired = true;

    let frameId = null;

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - rect.left - rect.width / 2;
      const dy = e.clientY - rect.top - rect.height / 2;

      if (frameId) cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${dx * 0.15}px`);
        el.style.setProperty('--my', `${dy * 0.15}px`);
      });
    });

    el.addEventListener('mouseleave', () => {
      if (frameId) cancelAnimationFrame(frameId);
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  };

  const attachAll = () => {
    const selector = '.btn-primary, .btn-outline, .send-btn, .sidebar-btn, .seg-btn, .task-add-btn, .task-icon-btn, .auth-social-btn, .btn-icon';
    document.querySelectorAll(selector).forEach(attachTo);
  };

  attachAll();
  let throttle;
  const mo = new MutationObserver(() => {
    clearTimeout(throttle);
    throttle = setTimeout(attachAll, 100);
  });
  mo.observe(document.body, { childList: true, subtree: true });
}


// ╔═══════════════════════════════════════════════════════╗
// ║  8. NAVIGATION (cross-dissolve + blur)                ║
// ╚═══════════════════════════════════════════════════════╝

function setupNav() {
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
    btn.addEventListener('click', () => navigateTo(btn.dataset.section));
  });
}

function navigateTo(section) {
  if (section === state.activeSection) return;

  const current = document.getElementById(`section-${state.activeSection}`);
  const target = document.getElementById(`section-${section}`);
  if (!target) return;

  // Cross-dissolve: outgoing blurs out, incoming fades in
  if (current) {
    current.classList.add('leaving');
    current.classList.remove('active');
    setTimeout(() => {
      current.classList.remove('leaving');
    }, 300);
  }

  state.activeSection = section;

  document.querySelectorAll('.sidebar-btn').forEach(b => {
    const isActive = b.dataset.section === section;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  void target.offsetWidth; // reflow
  target.classList.add('active');

  // Trigger reveal for children
  const reveals = target.querySelectorAll('[data-reveal]');
  reveals.forEach(el => {
    el.classList.remove('revealed');
    setTimeout(() => el.classList.add('revealed'), 50);
  });
}

function setupRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}


// ╔═══════════════════════════════════════════════════════╗
// ║  9. HERO SCROLL                                       ║
// ╚═══════════════════════════════════════════════════════╝

function setupHeroScroll() {
  if (window.__QS_LOCKED__) return;
  const hero = document.getElementById('hero');
  const bgVideo = document.getElementById('hero-bg-video');
  if (!hero || !bgVideo) return;

  // Force muted via JS property (HTML attribute alone is ignored by some Windows browsers)
  bgVideo.muted = true;
  bgVideo.volume = 0;
  bgVideo.loop = true;
  bgVideo.setAttribute('loop', '');

  const isLightTheme = () => document.body.dataset.theme === 'light';

  const tryPlay = () => {
    if (document.hidden || isLightTheme()) return;
    bgVideo.muted = true; // re-assert before every play() call
    const p = bgVideo.play();
    if (p && typeof p.catch === 'function') p.catch(() => { });
  };

  // Kick off loading explicitly — critical on Windows where preload="auto" is sometimes ignored
  bgVideo.load();

  // Fire play on every readyState milestone
  bgVideo.addEventListener('loadedmetadata', tryPlay);
  bgVideo.addEventListener('loadeddata', tryPlay, { once: true });
  bgVideo.addEventListener('canplay', tryPlay, { once: true });
  bgVideo.addEventListener('canplaythrough', tryPlay, { once: true });

  // Already have data (cached / fast disk)
  if (bgVideo.readyState >= 2) tryPlay();

  // Retry with small delay in case browser is still initialising
  setTimeout(tryPlay, 200);
  setTimeout(tryPlay, 800);

  // Windows Chrome/Edge autoplay-blocked fallback: unlock on first user gesture
  const unlockOnGesture = () => {
    if (bgVideo.paused && !isLightTheme()) tryPlay();
    document.removeEventListener('pointerdown', unlockOnGesture);
    document.removeEventListener('keydown', unlockOnGesture);
    document.removeEventListener('touchstart', unlockOnGesture);
  };
  document.addEventListener('pointerdown', unlockOnGesture, { passive: true });
  document.addEventListener('keydown', unlockOnGesture);
  document.addEventListener('touchstart', unlockOnGesture, { passive: true });

  bgVideo.addEventListener('ended', () => {
    bgVideo.currentTime = 0;
    tryPlay();
  });

  const syncVideoState = () => {
    const heroRect = hero.getBoundingClientRect();
    const heroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
    if (document.hidden || !heroVisible || isLightTheme()) {
      bgVideo.pause();
      return;
    }
    if (bgVideo.paused) tryPlay();
  };

  const syncScrolled = () => {
    hero.classList.toggle('scrolled', window.scrollY > 40);
    syncVideoState();
  };
  syncScrolled();
  window.addEventListener('scroll', syncScrolled, { passive: true });
  window.addEventListener('resize', syncVideoState, { passive: true });
  document.addEventListener('visibilitychange', syncVideoState);
  const themeObserver = new MutationObserver(syncVideoState);
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
}

function setupBackgroundAudio() {
  if (window.__QS_LOCKED__) return;
  const audio = document.getElementById('hero-bg-audio');
  if (!audio) return;
  audio.volume = 0.12;

  const tryPlay = () => {
    if (document.hidden) {
      audio.pause();
      return;
    }
    const maybePromise = audio.play();
    if (maybePromise && typeof maybePromise.catch === 'function') {
      maybePromise.catch(() => { });
    }
  };

  const unlockAudio = () => {
    tryPlay();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };

  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio.pause();
    else tryPlay();
  });
}

function updateThemeIcon(btn, theme) {
  const icon = btn?.querySelector('i[data-lucide]');
  if (!icon) return;
  icon.setAttribute('data-lucide', theme === 'light' ? 'sun' : 'moon');
  if (window.lucide) lucide.createIcons();
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  const btnMobile = document.getElementById('theme-toggle-btn-mobile');
  const savedTheme = localStorage.getItem(THEME_STORE_KEY);
  const initialTheme = savedTheme || 'light';
  document.body.dataset.theme = initialTheme;
  updateThemeIcon(btn, initialTheme);
  updateThemeIcon(btnMobile, initialTheme);

  const toggle = (triggerBtn) => {
    const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = nextTheme;
    localStorage.setItem(THEME_STORE_KEY, nextTheme);
    if (triggerBtn) {
      triggerBtn.classList.add('spinning');
      setTimeout(() => triggerBtn.classList.remove('spinning'), 560);
    }
    updateThemeIcon(btn, nextTheme);
    updateThemeIcon(btnMobile, nextTheme);
  };

  if (btn) btn.addEventListener('click', () => toggle(btn));
  if (btnMobile) btnMobile.addEventListener('click', () => toggle(btnMobile));
}

function setupAccessibilityHelpers() {
  document.querySelectorAll('button.btn-icon').forEach(btn => {
    const label = btn.getAttribute('aria-label') || btn.getAttribute('title');
    if (label) btn.setAttribute('aria-label', label);
  });
}

function setupMobileOrientationHint() {
  const tip = document.getElementById('orientation-tip');
  if (!tip) return;
  const updateTip = () => {
    const isPhone = window.matchMedia('(max-width: 900px)').matches;
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    tip.classList.toggle('hidden', !(isPhone && isPortrait));
  };
  updateTip();
  window.addEventListener('resize', updateTip, { passive: true });
  window.addEventListener('orientationchange', updateTip, { passive: true });
}


// ╔═══════════════════════════════════════════════════════╗
// ║  10. API KEY MODAL                                    ║
// ╚═══════════════════════════════════════════════════════╝

function setupApiKeyModal() {
  const modal = document.getElementById('api-modal');
  const input = document.getElementById('api-key-input');
  const openBtn = document.getElementById('api-key-btn');
  const saveBtn = document.getElementById('api-save-btn');
  const cancelBtn = document.getElementById('api-cancel-btn');
  if (!modal || !input || !openBtn || !saveBtn || !cancelBtn) return;

  openBtn.addEventListener('click', () => {
    input.value = localStorage.getItem(API_KEY_STORE) || '';
    modal.classList.remove('hidden');
    setTimeout(() => input.focus(), 100);
  });
  saveBtn.addEventListener('click', () => {
    const key = input.value.trim();
    if (!key) return;
    localStorage.setItem(API_KEY_STORE, key);
    modal.classList.add('hidden');
    showToast('API ключ сохранён ✓');
  });
  cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveBtn.click();
    if (e.key === 'Escape') cancelBtn.click();
  });
}


// ╔═══════════════════════════════════════════════════════╗
// ║  11. CHAT SECTIONS (Physics & CS)                     ║
// ╚═══════════════════════════════════════════════════════╝

function setupChatSection(subject) {
  const inputEl = document.getElementById(`input-${subject}`);
  const sendBtn = document.getElementById(`send-${subject}`);
  const clearBtn = document.getElementById(`clear-${subject}`);
  const newChatBtn = document.getElementById(`new-chat-${subject}`);
  const printBtn = document.getElementById(`print-${subject}`);
  const section = document.getElementById(`section-${subject}`);

  // Mode toggle
  section.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      section.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.modes[subject] = btn.dataset.mode;
    });
  });

  // Auto-resize textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 160) + 'px';
  });

  // Send on Enter (no shift)
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(subject);
    }
  });

  sendBtn.addEventListener('click', () => sendMessage(subject));
  clearBtn.addEventListener('click', () => clearChat(subject));
  newChatBtn.addEventListener('click', () => startNewChat(subject));
  printBtn.addEventListener('click', () => {
    const msgs = document.getElementById(`messages-${subject}`);
    doPrint(`<h1>OakBes — ${subject === 'physics' ? 'Физика' : 'Информатика'}</h1>${msgs.innerHTML}`);
  });

  const quizBtn = document.getElementById(`quiz-${subject}`);
  if (quizBtn) {
    quizBtn.addEventListener('click', () => startQuickQuiz(subject));
  }

  // Attachment Logic
  const attachBtn = document.getElementById(`attach-${subject}`);
  const fileInput = document.getElementById(`file-${subject}`);
  const previewBar = document.getElementById(`preview-${subject}`);

  if (attachBtn && fileInput) {
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => handleImageUpload(subject, e));
  }
}

function handleImageUpload(subject, event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const base64 = e.target.result;
    state.attachments[subject] = base64;
    renderImagePreview(subject, base64);
  };
  reader.readAsDataURL(file);
}

function renderImagePreview(subject, base64) {
  const bar = document.getElementById(`preview-${subject}`);
  bar.innerHTML = `
    <div class="preview-item">
      <img src="${base64}" />
      <button class="preview-remove" onclick="removeAttachment('${subject}')"><i data-lucide="x"></i></button>
    </div>
  `;
  bar.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function removeAttachment(subject) {
  state.attachments[subject] = null;
  const bar = document.getElementById(`preview-${subject}`);
  bar.innerHTML = '';
  bar.classList.add('hidden');
  document.getElementById(`file-${subject}`).value = '';
}

async function startQuickQuiz(subject) {
  const inputEl = document.getElementById(`input-${subject}`);
  inputEl.value = "Проведи быстрый квиз по последней теме. Задай 3 вопроса с вариантами ответов (A, B, C).";
  sendMessage(subject);
}

async function sendMessage(subject) {
  if (state.loading[subject]) return;

  const inputEl = document.getElementById(`input-${subject}`);
  const messagesEl = document.getElementById(`messages-${subject}`);
  const sendBtn = document.getElementById(`send-${subject}`);
  const text = inputEl.value.trim();
  if (!text) return;

  const apiKey = getApiKey();
  if (!apiKey) { showGlassError('API ключ не найден'); return; }

  // Render user message
  appendChatMessage(messagesEl, 'user', text);
  state.histories[subject].push({ role: 'user', content: text });

  inputEl.value = '';
  inputEl.style.height = 'auto';
  state.loading[subject] = true;
  sendBtn.disabled = true;

  // Add typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-message';
  typingEl.innerHTML = `
    <div class="msg-role">OakBes AI</div>
    <div class="msg-body" style="display:flex;align-items:center;gap:12px;padding:14px 18px">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <span style="font-size:13px;color:var(--text-3)">Думаю…</span>
    </div>`;
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const mode = state.modes[subject];
  const sysPrompt = mode === 'socratic' ? SYSTEM_SOCRATIC
    : mode === 'trace' ? SYSTEM_TRACE
      : SYSTEM_SIMPLE;

  try {
    const response = await callQuasarAI(apiKey, MODEL_REASONING, sysPrompt,
      state.histories[subject]
    );
    const reply = response.choices[0].message.content;
    state.histories[subject].push({ role: 'assistant', content: reply });

    typingEl.remove();
    const msgEl = appendChatMessage(messagesEl, 'assistant', reply);
    renderKaTeX(msgEl);
    if (window.Prism) msgEl.querySelectorAll('pre code').forEach(b => Prism.highlightElement(b));

    // GENERATE SUGGESTED FOLLOW-UPS
    generateFollowUpChips(subject, reply);

    messagesEl.scrollTop = messagesEl.scrollHeight;

  } catch (err) {
    typingEl.remove();
    showGlassError(friendlyError(err));
  } finally {
    state.loading[subject] = false;
    sendBtn.disabled = false;
  }
}

function appendChatMessage(container, role, content) {
  const isUser = role === 'user';
  const el = document.createElement('div');
  el.className = 'chat-message';

  el.innerHTML = `
    <div class="msg-header" style="display:flex; justify-content:space-between; align-items:center;">
      <div class="msg-role ${isUser ? 'user-role' : ''}">${isUser ? 'Вы' : 'OakBes AI'}</div>
      <div style="display:flex; gap:4px">
        ${!isUser ? `
          <button class="btn-icon flash-btn" title="Создать карточку" onclick="createFlashcard(this)">
            <i data-lucide="zap" style="width:14px; height:14px;"></i>
          </button>
        ` : ''}
        <button class="btn-icon fav-btn" title="В избранное" onclick="this.classList.toggle('active-fav'); if(window.showToast) window.showToast('Добавлено в избранное');">
          <i data-lucide="star" style="width:14px; height:14px;"></i>
        </button>
      </div>
    </div>
    <div class="msg-body ${isUser ? 'user-msg' : ''}">${isUser ? escapeHtml(content) : formatContent(content)}</div>`;
  container.appendChild(el);
  if (window.lucide) lucide.createIcons();
  return el;
}

function generateFollowUpChips(subject, reply) {
  const chipsEl = document.getElementById(`chips-${subject}`);
  if (!chipsEl) return;
  chipsEl.innerHTML = '';

  const suggestions = [];
  const text = reply.toLowerCase();

  if (subject === 'physics') {
    if (text.includes('энерг')) suggestions.push('Примеры сохранения энергии', 'Задачи на энергию');
    if (text.includes('сил')) suggestions.push('Какие еще силы есть?', 'Нарисуй схему сил');
    if (text.includes('закон')) suggestions.push('Где это применяется?', 'История открытия');
    if (text.includes('формул')) suggestions.push('Выведи формулу', 'Размерности величин');
  } else {
    if (text.includes('код') || text.includes('python')) suggestions.push('Оптимизируй код', 'Напиши тесты');
    if (text.includes('алгоритм')) suggestions.push('Сложность O(n)?', 'Визуализируй шаги');
    if (text.includes('цикл')) suggestions.push('Как избежать циклов?', 'Recursion vs Iteration');
  }

  // Fallback / Generic
  suggestions.push('Дай проверочный вопрос', 'Объясни проще', 'Более сложный пример');

  // Take unique 4 random
  const unique = [...new Set(suggestions)].sort(() => 0.5 - Math.random()).slice(0, 4);

  unique.forEach(s => {
    const chip = document.createElement('div');
    chip.className = 'chat-chip';
    chip.textContent = s;
    chip.onclick = () => {
      const inputEl = document.getElementById(`input-${subject}`);
      inputEl.value = s;
      chipsEl.innerHTML = '';
      sendMessage(subject);
    };
    chipsEl.appendChild(chip);
  });
}

function createFlashcard(btn) {
  const msgBody = btn.closest('.chat-message').querySelector('.msg-body').innerText;
  const lines = msgBody.split('\n');
  const title = lines.find(l => l.trim().length > 5) || 'Карточка';
  const cleanTitle = title.replace(/[#*]/g, '').trim().substring(0, 50);

  const cards = JSON.parse(localStorage.getItem('qs_flashcards') || '[]');
  cards.push({ id: Date.now(), title: cleanTitle, content: msgBody });
  localStorage.setItem('qs_flashcards', JSON.stringify(cards));

  btn.classList.add('active');
  showToast('Карточка создана! Загляните в План.');
  renderFlashcards();
}

function renderFlashcards() {
  const listEl = document.getElementById('flashcards-list');
  if (!listEl) return;

  const cards = JSON.parse(localStorage.getItem('qs_flashcards') || '[]');
  if (cards.length === 0) {
    listEl.innerHTML = `
      <div class="output-empty" style="padding: 10px;">
        <p style="font-size: 12px; color: var(--text-3)">Здесь появятся ваши карточки из чата</p>
      </div>`;
    return;
  }

  listEl.innerHTML = '';
  cards.reverse().forEach(card => {
    const el = document.createElement('div');
    el.className = 'flashcard-item';
    el.innerHTML = `
      <div class="fc-title">${escapeHtml(card.title)}</div>
      <div class="fc-content">${escapeHtml(card.content)}</div>
    `;
    el.onclick = () => {
      // Toggle expanded view or send back to chat
      showToast('Карточка активна: повторите материал!');
    };
    listEl.appendChild(el);
  });
}

function startNewChat(subject) {
  clearChat(subject);
  showToast('Новый чат начат!');
}

function clearChat(subject) {
  state.histories[subject] = [];
  const msgs = document.getElementById(`messages-${subject}`);
  const icon = subject === 'physics' ? 'atom' : 'circuit-board';
  const text = subject === 'physics' ? 'Задайте вопрос по физике — формулы, задачи, теория.' : 'Задайте вопрос по информатике — алгоритмы, код, теория.';
  msgs.innerHTML = `
    <div class="chat-welcome">
      <i data-lucide="${icon}" class="welcome-icon"></i>
      <p>${text}</p>
    </div>`;
  document.dispatchEvent(new Event('qs:icons'));
}


// ╔═══════════════════════════════════════════════════════╗
// ║  12. GENERATOR                                        ║
// ╚═══════════════════════════════════════════════════════╝

function setupGenerator() {
  setupSegmented('gen-subject', val => {
    state.gen.subject = val;
    updateTopicSelect(val);
  });
  setupSegmented('gen-grade', val => {
    state.gen.grade = val;
    updateTopicSelect(state.gen.subject);
  });
  setupSegmented('gen-difficulty', val => { state.gen.difficulty = val; });

  document.getElementById('gen-topic').addEventListener('change', e => {
    state.gen.topic = e.target.value;
  });
  document.getElementById('gen-topic-custom')?.addEventListener('input', e => {
    state.gen.customTopic = (e.target.value || '').trim();
  });

  const countSlider = document.getElementById('gen-count');
  const countVal = document.getElementById('gen-count-val');
  countSlider.addEventListener('input', () => {
    state.gen.count = parseInt(countSlider.value, 10);
    countVal.textContent = countSlider.value;
    // Update range fill
    const pct = ((countSlider.value - 1) / 9) * 100;
    countSlider.style.background = `linear-gradient(to right, var(--accent) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
  });

  document.getElementById('gen-btn').addEventListener('click', generateTasks);
  document.getElementById('print-gen').addEventListener('click', () => {
    const result = document.getElementById('gen-result');
    if (result.querySelector('.output-empty')) return;
    const sub = state.gen.subject === 'physics' ? 'Физика' : 'Информатика';
    const tasks = state.worksheet.length > 0 ? state.worksheet : collectGenTasks();
    printWorksheet(tasks, `${sub}, ${state.gen.grade} класс`, true);
  });

  document.getElementById('ws-open-btn').addEventListener('click', openWorksheet);

  // ── Flash-Task Button ──
  document.getElementById('flash-task-btn')?.addEventListener('click', generateFlashTask);

  // ── Cheatsheet Button ──
  document.getElementById('cheatsheet-btn')?.addEventListener('click', generateCheatsheet);

  // ── Day picker for lesson planner ──
  document.querySelectorAll('#lesson-days .day-btn')?.forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('active'));
  });

  // ── Lesson count slider ──
  const lessonCountSlider = document.getElementById('lesson-count');
  const lessonCountVal = document.getElementById('lesson-count-val');
  if (lessonCountSlider) {
    lessonCountSlider.addEventListener('input', () => {
      lessonCountVal.textContent = lessonCountSlider.value;
      const pct = ((lessonCountSlider.value - 1) / 5) * 100;
      lessonCountSlider.style.background = `linear-gradient(to right, var(--accent) ${pct}%, rgba(255,255,255,0.08) ${pct}%)`;
    });
  }

  updateTopicSelect('physics');
}

// ── FLASH-TASK: instant 1-question quiz ──
async function generateFlashTask() {
  const apiKey = getApiKey();
  if (!apiKey) { showGlassError('API ключ не найден'); return; }

  const { subject, grade, topic, customTopic, difficulty } = state.gen;
  const { label: topicLabel } = getGeneratorTopicContext(subject, topic, customTopic);
  const subLabel = subject === 'physics' ? 'физике' : 'информатике';
  const diffLabels = { easy: 'базовый', medium: 'средний', olympiad: 'олимпиадный' };

  const prompt = `Сгенерируй 1 задачу-блиц по ${subLabel}, ${grade} класс, тема «${topicLabel}», сложность: ${diffLabels[difficulty] || 'базовый'}.
Верни СТРОГО JSON массив из 1 объекта: [{ "num":1, "condition":"...", "hint":"...", "solution":"...", "answer":"...", "rubric":[{"criterion":"...","points":2,"description":"..."}] }]`;

  const result = document.getElementById('gen-result');
  const flashBtn = document.getElementById('flash-task-btn');
  if (flashBtn) { flashBtn.disabled = true; flashBtn.classList.add('shimmer'); }
  result.innerHTML = `<div class="output-empty"><div class="typing-dots"><span></span><span></span><span></span></div><p style="margin-top:14px;color:var(--text-3);font-size:13px">⚡ Flash-Task…</p></div>`;

  try {
    const response = await callQuasarAI(apiKey, MODEL_FAST, SYSTEM_GENERATOR, [{ role: 'user', content: prompt }]);
    const text = response.choices[0].message.content;
    const clean = text.replace(/^```json\s*|```\s*$/gm, '').trim();
    const tasks = await parseJsonWithRepair(apiKey, clean);
    renderAllTasks(Array.isArray(tasks) ? tasks : [tasks], result);
  } catch (err) {
    showGlassError(friendlyError(err));
    result.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i><p>${friendlyError(err)}</p></div>`;
    document.dispatchEvent(new Event('qs:icons'));
  } finally {
    if (flashBtn) { flashBtn.disabled = false; flashBtn.classList.remove('shimmer'); }
  }
}

// ── CHEATSHEET: Teacher's quick reference ──
async function generateCheatsheet() {
  const apiKey = getApiKey();
  if (!apiKey) { showGlassError('API ключ не найден'); return; }

  const { subject, grade, topic, customTopic } = state.gen;
  const { label: topicLabel } = getGeneratorTopicContext(subject, topic, customTopic);
  const subLabel = subject === 'physics' ? 'физике' : 'информатике';

  const modal = document.getElementById('cheatsheet-modal');
  const content = document.getElementById('cheatsheet-content');
  const title = document.getElementById('cheatsheet-title');
  const subtitle = document.getElementById('cheatsheet-subtitle');
  if (!modal || !content) return;

  title.textContent = `Шпаргалка: ${topicLabel}`;
  subtitle.textContent = `${subLabel}, ${grade} класс`;
  content.innerHTML = `<div class="output-empty"><div class="typing-dots"><span></span><span></span><span></span></div><p style="margin-top:14px;font-size:13px">Генерирую шпаргалку…</p></div>`;
  modal.classList.remove('hidden');

  const prompt = `Составь краткую шпаргалку-справочник для учителя по ${subLabel}, ${grade} класс, тема «${topicLabel}».
Включи: все ключевые формулы (LaTeX), определения (2-3 слова), единицы измерения, типичные значения.
Формат: markdown с ## заголовками. Максимум конспективно, без воды.`;

  try {
    const response = await callQuasarAI(apiKey, MODEL_FAST, SYSTEM_SIMPLE, [{ role: 'user', content: prompt }]);
    const text = response.choices[0].message.content;
    content.innerHTML = formatContent(text);
    renderKaTeX(content);
    if (window.Prism) content.querySelectorAll('pre code').forEach(b => Prism.highlightElement(b));
  } catch (err) {
    content.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i><p>${friendlyError(err)}</p></div>`;
  }
  document.dispatchEvent(new Event('qs:icons'));
}

// ── GLASS ERROR NOTIFICATION ──
function showGlassError(msg, retryFn) {
  const el = document.getElementById('glass-error');
  const msgEl = document.getElementById('glass-error-msg');
  if (!el || !msgEl) return;

  msgEl.textContent = msg;
  el.classList.remove('hidden');

  const retryBtn = document.getElementById('glass-error-retry');
  const closeBtn = document.getElementById('glass-error-close');

  if (retryBtn) {
    retryBtn.onclick = () => {
      el.classList.add('hidden');
      if (typeof retryFn === 'function') retryFn();
    };
    retryBtn.style.display = retryFn ? '' : 'none';
  }
  if (closeBtn) {
    closeBtn.onclick = () => el.classList.add('hidden');
  }

  // Auto-hide after 8 seconds
  setTimeout(() => el.classList.add('hidden'), 8000);
  if (window.lucide) lucide.createIcons();
}

function collectGenTasks() {
  const cards = document.querySelectorAll('#gen-result .task-card');
  const tasks = [];
  cards.forEach(card => {
    const num = card.querySelector('.task-num')?.textContent || '';
    const cond = card.querySelector('.task-condition')?.innerText || '';
    tasks.push({ num, label: num, condition: cond, rawText: cond, solution: '', answer: '' });
  });
  return tasks;
}

function updateTopicSelect(subject) {
  const select = document.getElementById('gen-topic');
  if (!select) return;
  const grade = state.gen.grade || '7';
  const topics = TOPICS[subject] || [];
  select.innerHTML = '';

  const forGrade = topics.filter(t => t.grades.includes(grade));
  if (forGrade.length) {
    forGrade.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.value; opt.textContent = t.label;
      select.appendChild(opt);
    });
  } else {
    select.innerHTML = '<option value="">Нет тем для этого класса</option>';
  }
  const def = forGrade[0];
  if (def) { select.value = def.value; state.gen.topic = def.value; }
}

function getGeneratorTopicContext(subject, topic, customTopic) {
  if (customTopic && customTopic.trim()) {
    const custom = customTopic.trim();
    return { label: custom, detail: custom };
  }
  const topicData = (TOPICS[subject] || []).find(t => t.value === topic);
  return {
    label: topicData?.label || topic || 'Без темы',
    detail: topicData?.detail || topicData?.label || topic || 'Без темы',
  };
}

function setupCheatsheet() {
  const modal = document.getElementById('cheatsheet-modal');
  const closeBtn = document.getElementById('cheatsheet-close');
  if (closeBtn && modal) {
    closeBtn.onclick = () => modal.classList.add('hidden');
    modal.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };
  }
}

function setupQrModal() {
  const modal = document.getElementById('qr-modal');
  const closeBtn = document.getElementById('qr-close');
  const tabs = document.querySelectorAll('.qr-tab');

  if (closeBtn && modal) {
    closeBtn.onclick = () => modal.classList.add('hidden');
    modal.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (state.qrTask) {
        const type = tab.dataset.qrType;
        const qrCanvas = document.getElementById('qr-canvas');
        if (qrCanvas) {
          const payload = type === 'hint'
            ? { hint: state.qrTask.hint || '', label: state.qrTask.label || 'Задача' }
            : { solution: state.qrTask.solution || '', answer: state.qrTask.answer || '' };

          const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
          const qrUrl = `${window.location.href.split('#')[0]}#${type}=${encoded}`;
          generateQrOnCanvas(qrUrl, 'qr-canvas');
        }
      }
    });
  });
}

function setupVarchangeModal() {
  const modal = document.getElementById('varchange-modal');
  const closeBtn = document.getElementById('varchange-close');
  if (closeBtn && modal) {
    closeBtn.onclick = () => modal.classList.add('hidden');
    modal.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };
  }
}

function setupExamModal() {
  const modal = document.getElementById('exam-modal');
  const closeBtn = document.getElementById('exam-close');
  if (closeBtn && modal) {
    closeBtn.onclick = () => modal.classList.add('hidden');
    modal.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };
  }
}

async function generateTasks() {
  if (state.loading.generator) return;

  const apiKey = getApiKey();
  if (!apiKey) { showGlassError('API ключ не найден'); return; }

  const { subject, grade, difficulty, topic, customTopic, count } = state.gen;
  const { label: topicLabel, detail: topicDetail } = getGeneratorTopicContext(subject, topic, customTopic);

  const difficultyLabels = {
    easy: 'базовый — прямое применение одной формулы',
    medium: 'средний — нестандартные задачи, несколько шагов',
    olympiad: 'олимпиадный — многошаговые задачи; физика: вывод через уравнения или дифференциальные соображения; ИТ: DP, теория графов',
  };

  const subjectLabel = subject === 'physics' ? 'физике' : 'информатике';

  const prompt = `Сгенерируй ровно ${count} ${count === 1 ? 'задачу' : 'задачи'} по ${subjectLabel} для ${grade} класса.
Тема: «${topicLabel}» — ${topicDetail}
Сложность: ${difficultyLabels[difficulty]}

Верни ТОЛЬКО валидный JSON-массив, где каждый элемент имеет поля: num, condition, hint, solution, answer, rubric.
Для физики: condition содержит "**Дано:**" и "**Найти:**" с LaTeX.
Для информатики: condition содержит "**Вход:**" и "**Выход:**" с примерами.
Rubric: минимум 3 строки [{"criterion":"...", "points": N, "description":"..."}].
Решение должно заканчиваться разделом "## Типичные ошибки".`;

  state.loading.generator = true;
  const btn = document.getElementById('gen-btn');
  btn.disabled = true; btn.classList.add('shimmer');

  const result = document.getElementById('gen-result');
  result.innerHTML = `
    <div class="output-empty">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <p style="margin-top:14px;color:var(--text-3);font-size:13px">Quasar AI генерирует задачи…</p>
    </div>`;

  try {
    const response = await callQuasarAI(apiKey, MODEL_REASONING, SYSTEM_GENERATOR,
      [{ role: 'user', content: prompt }]
    );
    const text = response.choices[0].message.content;

    let tasks = [];
    try {
      const clean = text.replace(/^```json\s*|```\s*$/gm, '').trim();
      tasks = await parseJsonWithRepair(apiKey, clean);
      if (!Array.isArray(tasks)) tasks = [];
    } catch (_) { tasks = null; }

    result.innerHTML = '';

    if (!tasks) {
      throw new SyntaxError('MODEL_JSON_INVALID');
    } else {
      tasks.forEach((task, i) => {
        const card = renderStructuredTaskCard(task, i);
        result.appendChild(card);
        renderKaTeX(card);
        if (window.Prism) card.querySelectorAll('pre code').forEach(b => Prism.highlightElement(b));
      });
    }

  } catch (err) {
    result.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i><p style="text-align:center;margin-top:10px">${friendlyError(err)}</p></div>`;
    document.dispatchEvent(new Event('qs:icons'));
  } finally {
    state.loading.generator = false;
    btn.disabled = false; btn.classList.remove('shimmer');
    if (window.lucide) lucide.createIcons();
  }
}

function renderStructuredTaskCard(task, index) {
  const num = task.num || (index + 1);
  const label = `Задача ${num}`;
  const delay = index * 0.07;

  const card = document.createElement('div');
  card.className = 'task-card';
  card.style.animationDelay = `${delay}s`;
  card.dataset.taskIndex = index;

  // Build rubric HTML
  const rubricHtml = buildRubricHtml(task.rubric || []);

  card.innerHTML = `
    <div class="task-card-header">
      <div class="task-num">${label}</div>
      <div class="task-toolbar">
        <button class="task-icon-btn qr-btn" title="QR-код" data-task-index="${index}">
          <i data-lucide="qr-code"></i>
        </button>
        <button class="task-icon-btn varchange-btn" title="Изменить значения" data-task-index="${index}">
          <i data-lucide="sliders-horizontal"></i>
        </button>
        <button class="task-add-btn" data-task-index="${index}">
          <i data-lucide="plus"></i>
          <span>В лист</span>
        </button>
      </div>
    </div>
    <div class="task-condition">${formatContent(task.condition || '')}</div>

    <button class="task-section-toggle hint-toggle" data-target="hint-${index}">
      <i data-lucide="lightbulb"></i>
      <span>Подсказка</span>
      <i data-lucide="chevron-down" style="margin-left:auto"></i>
    </button>
    <div class="task-collapsible" id="hint-${index}">
      <div class="task-hint-body">${formatContent(task.hint || '')}</div>
    </div>

    <button class="task-section-toggle solution-toggle" data-target="solution-${index}">
      <i data-lucide="book-open"></i>
      <span>Подробное решение</span>
      <i data-lucide="chevron-down" style="margin-left:auto"></i>
    </button>
    <div class="task-collapsible" id="solution-${index}">
      <div class="task-solution-body">${formatContent(task.solution || '')}</div>
      <div class="task-answer-box">
        <strong>Ответ:</strong> ${formatContent(task.answer || '')}
      </div>
    </div>

    ${rubricHtml ? `
    <button class="task-section-toggle" data-target="rubric-${index}" style="color:rgba(180,140,255,0.8)">
      <i data-lucide="clipboard-check"></i>
      <span>Критерии оценивания</span>
      <i data-lucide="chevron-down" style="margin-left:auto"></i>
    </button>
    <div class="task-collapsible" id="rubric-${index}">
      ${rubricHtml}
    </div>` : ''}
  `;

  // Wire collapsible toggles
  card.querySelectorAll('.task-section-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const panel = document.getElementById(targetId);
      if (!panel) return;
      const isOpen = panel.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      if (isOpen) renderKaTeX(panel);
    });
  });

  // Wire "Add to worksheet"
  card.querySelector('.task-add-btn').addEventListener('click', () => {
    addToWorksheet(task, num, label, card);
  });

  // Wire QR button
  card.querySelector('.qr-btn').addEventListener('click', () => {
    openQrModal(task, label);
  });

  // Wire variable change button
  card.querySelector('.varchange-btn').addEventListener('click', () => {
    openVarchangeModal(task, label);
  });

  return card;
}

function buildRubricHtml(rubric) {
  if (!rubric || rubric.length === 0) return '';
  const total = rubric.reduce((s, r) => s + (r.points || 0), 0);
  const rows = rubric.map(r => `
    <tr>
      <td>${escapeHtml(r.criterion || '')}</td>
      <td>${escapeHtml(r.description || '')}</td>
      <td class="rubric-pts">${r.points || 0} б.</td>
    </tr>`).join('');
  return `
    <div class="rubric-section">
      <div class="rubric-label">Критерии оценивания · Итого: ${total} б.</div>
      <table class="rubric-table">
        <thead><tr><th>Критерий</th><th>Описание</th><th>Баллы</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}


// ╔═══════════════════════════════════════════════════════╗
// ║  13. QR CODE MODAL                                    ║
// ╚═══════════════════════════════════════════════════════╝

function setupQrModal() {
  const modal = document.getElementById('qr-modal');
  const closeBtn = document.getElementById('qr-modal-close');

  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

  modal.querySelectorAll('.qr-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      modal.querySelectorAll('.qr-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (state.qrTask) {
        const type = tab.dataset.qrType;
        const text = type === 'hint' ? state.qrTask.hint : state.qrTask.condition;
        generateQrOnCanvas(text, 'qr-canvas');
      }
    });
  });
}

function openQrModal(task, label) {
  state.qrTask = task;
  const modal = document.getElementById('qr-modal');
  document.getElementById('qr-task-label').textContent = label;

  // Reset to hint tab
  modal.querySelectorAll('.qr-tab').forEach((t, i) => t.classList.toggle('active', i === 0));

  // Generate QR from hint text (encode as data URI for portability)
  const text = task.hint || task.condition || '';
  generateQrOnCanvas(text, 'qr-canvas');

  modal.classList.remove('hidden');
  document.dispatchEvent(new Event('qs:icons'));
}

function generateQrOnCanvas(text, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear previous QR
  container.innerHTML = '';

  // Trim to QR-friendly length and fix UTF-8 for Cyrillic
  const utf8Encode = (str) => unescape(encodeURIComponent(str));
  const content = utf8Encode(text.replace(/\*\*/g, '').replace(/\$/g, '').substring(0, 150));

  if (window.QRCode) {
    new QRCode(container, {
      text: content || 'Нет содержимого',
      width: 220,
      height: 220,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.L
    });
  } else {
    container.innerHTML = '<div style="padding:20px;color:rgba(255,255,255,0.4);font-size:12px">Загрузка QR-библиотеки…</div>';
  }
}


// ╔═══════════════════════════════════════════════════════╗
// ║  14. VARIABLE INJECTION MODAL                         ║
// ╚═══════════════════════════════════════════════════════╝

function setupVarchangeModal() {
  const modal = document.getElementById('varchange-modal');
  const closeBtn = document.getElementById('varchange-close');
  const btn = document.getElementById('varchange-btn');

  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

  btn.addEventListener('click', () => applyVariableChange());
}

function openVarchangeModal(task, label) {
  state.varchangeTask = task;
  const modal = document.getElementById('varchange-modal');
  document.getElementById('varchange-input').value = '';
  const resultEl = document.getElementById('varchange-result');
  resultEl.classList.add('hidden');
  resultEl.innerHTML = '';
  modal.classList.remove('hidden');
  setTimeout(() => document.getElementById('varchange-input').focus(), 100);
  document.dispatchEvent(new Event('qs:icons'));
}

async function applyVariableChange() {
  const task = state.varchangeTask;
  if (!task) return;

  const instruction = document.getElementById('varchange-input').value.trim();
  if (!instruction) return;

  const apiKey = getApiKey();
  const btn = document.getElementById('varchange-btn');
  const resultEl = document.getElementById('varchange-result');

  btn.disabled = true; btn.classList.add('shimmer');
  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `<div class="typing-dots" style="justify-content:center"><span></span><span></span><span></span></div>`;

  const prompt = `Вот задача:\n${task.condition}\n\nИнструкция по изменению значений: ${instruction}\n\nПерепиши задачу с новыми значениями. Верни ТОЛЬКО новый текст условия задачи в том же формате (с "Дано:" и "Найти:" если физика, или "Вход:"/"Выход:" если ИТ), а затем пересчитай решение и ответ. Формат ответа:\n\nУСЛОВИЕ:\n<новое условие>\n\nРЕШЕНИЕ:\n<новое решение>\n\nОТВЕТ:\n<новый ответ>`;

  try {
    const response = await callQuasarAI(apiKey, MODEL_REASONING, SYSTEM_SIMPLE,
      [{ role: 'user', content: prompt }]
    );
    const text = response.choices[0].message.content;
    resultEl.innerHTML = `<div style="font-size:13.5px;line-height:1.8">${formatContent(text)}</div>`;
    renderKaTeX(resultEl);
    if (window.Prism) resultEl.querySelectorAll('pre code').forEach(b => Prism.highlightElement(b));
  } catch (err) {
    resultEl.innerHTML = `<p style="color:rgba(255,100,80,0.9);font-size:13px">${friendlyError(err)}</p>`;
  } finally {
    btn.disabled = false; btn.classList.remove('shimmer');
  }
}


// ╔═══════════════════════════════════════════════════════╗
// ║  15. EXAM COMPILER MODAL                              ║
// ╚═══════════════════════════════════════════════════════╝

function setupExamModal() {
  const modal = document.getElementById('exam-modal');
  const closeBtn = document.getElementById('exam-modal-close');
  const wsBtn = document.getElementById('ws-exam-btn');

  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

  if (wsBtn) wsBtn.addEventListener('click', () => {
    if (state.worksheet.length === 0) { showToast('Рабочий лист пуст'); return; }
    modal.classList.remove('hidden');
    document.dispatchEvent(new Event('qs:icons'));
  });

  document.getElementById('exam-teacher-btn').addEventListener('click', () => {
    compileExam(true);
    modal.classList.add('hidden');
  });
  document.getElementById('exam-student-btn').addEventListener('click', () => {
    compileExam(false);
    modal.classList.add('hidden');
  });
}

function compileExam(teacherCopy) {
  if (state.worksheet.length === 0) { showToast('Рабочий лист пуст'); return; }

  const shuffle = document.getElementById('exam-shuffle')?.checked ?? true;
  const addRubric = document.getElementById('exam-rubric')?.checked ?? true;

  let tasks = [...state.worksheet];
  if (shuffle) {
    for (let i = tasks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
    }
  }

  const sub = state.gen.subject === 'physics' ? 'Физика' : 'Информатика';
  const grade = state.gen.grade;
  const ver = teacherCopy ? 'Версия учителя (с ответами)' : 'Версия ученика';
  const date = new Date().toLocaleDateString('ru-RU');

  let html = `<h1>Quasar Study — Контрольная работа</h1>
<h2>${sub}, ${grade} класс · ${ver} · ${date}</h2>`;

  tasks.forEach((task, i) => {
    const num = i + 1;
    const condHtml = formatContent(task.condition || task.rawText || '');
    html += `<div class="task-print">
      <div class="task-print-num">Задача ${num}</div>
      ${condHtml}`;

    if (teacherCopy && task.solution) {
      html += `<div style="margin-top:8px;padding:8px 12px;background:#f9f9f9;border-left:3px solid #888">
        <strong>Решение:</strong> ${formatContent(task.solution)}
      </div>
      <div style="margin-top:4px;padding:6px 12px;background:#eef5ff;border-left:3px solid #336">
        <strong>Ответ:</strong> ${formatContent(task.answer || '')}
      </div>`;
    }

    if (addRubric && task.rubric && task.rubric.length > 0) {
      const total = task.rubric.reduce((s, r) => s + (r.points || 0), 0);
      const rows = task.rubric.map(r => `<tr><td>${escapeHtml(r.criterion || '')}</td><td>${escapeHtml(r.description || '')}</td><td>${r.points || 0} б.</td></tr>`).join('');
      html += `<table style="margin-top:8px">
        <thead><tr><th>Критерий</th><th>Описание</th><th>Баллы</th></tr></thead>
        <tbody>${rows}</tbody>
      </table><p style="font-size:10pt;color:#555">Итого: ${total} б.</p>`;
    }

    html += `</div>`;
  });

  html += `<p style="margin-top:12mm;font-size:9pt;color:#888">
    Quasar Study Titan Edition · @ihatehates &amp; @khkirill · ${date}
  </p>`;

  doPrint(html);
}

// ╔═══════════════════════════════════════════════════════╗
// ║  15.5 EXAM ENGINE GENERATION                          ║
// ╚═══════════════════════════════════════════════════════╝

function setupExamEngine() {
  const section = document.getElementById('section-exam-engine');
  if (!section) return;

  setupSegmented('ee-subject', val => {
    state.gen.eeSubject = val;
    updateEETopicSelect(val);
  });
  setupSegmented('ee-grade', val => {
    state.gen.eeGrade = val;
    updateEETopicSelect(state.gen.eeSubject || 'physics');
  });
  setupSegmented('ee-difficulty', val => { state.gen.eeDifficulty = val; });
  setupSegmented('ee-variant-toggle', val => { state.gen.eeMode = val; });

  document.getElementById('ee-topic')?.addEventListener('change', e => {
    state.gen.eeTopic = e.target.value;
  });

  const countSlider = document.getElementById('ee-count');
  const countVal = document.getElementById('ee-count-val');
  if (countSlider) {
    countSlider.addEventListener('input', () => {
      state.gen.eeCount = parseInt(countSlider.value, 10);
      countVal.textContent = countSlider.value;
      const pct = ((countSlider.value - 3) / 7) * 100;
      countSlider.style.background = `linear-gradient(to right, var(--accent) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
    });
  }

  document.getElementById('ee-gen-btn')?.addEventListener('click', generateExamEngine);
  updateEETopicSelect('physics');
}

function updateEETopicSelect(subject) {
  const select = document.getElementById('ee-topic');
  if (!select) return;
  const grade = state.gen.eeGrade || '9';
  const topics = TOPICS[subject] || [];
  select.innerHTML = '';

  const rec = topics.filter(t => t.grades.includes(grade));
  const oth = topics.filter(t => !t.grades.includes(grade));

  if (rec.length) {
    const grp = document.createElement('optgroup');
    grp.label = `Рекомендовано · ${grade} класс`;
    rec.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.value; opt.textContent = t.label;
      grp.appendChild(opt);
    });
    select.appendChild(grp);
  }
  if (oth.length) {
    const grp = document.createElement('optgroup');
    grp.label = 'Другие классы';
    oth.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.value; opt.textContent = `${t.label} (${t.grades.join(', ')} кл.)`;
      grp.appendChild(opt);
    });
    select.appendChild(grp);
  }

  const def = rec[0] || topics[0];
  if (def) { select.value = def.value; state.gen.eeTopic = def.value; }
}

async function generateExamEngine() {
  if (state.loading.exam) return;
  const apiKey = getApiKey();
  if (!apiKey) { showGlassError('API ключ не найден'); return; }

  const btn = document.getElementById('ee-gen-btn');
  const result = document.getElementById('ee-result');
  const count = state.gen.eeCount || 5;
  const subject = state.gen.eeSubject || 'physics';
  const grade = state.gen.eeGrade || '9';
  const topicData = (TOPICS[subject] || []).find(t => t.value === state.gen.eeTopic);
  const topicLabel = topicData?.label || state.gen.eeTopic;

  state.loading.exam = true;
  btn.disabled = true; btn.classList.add('shimmer');
  result.innerHTML = `
    <div class="output-empty">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <p style="margin-top:14px;color:var(--text-3);font-size:13px">Создаю варианты А и Б…</p>
    </div>`;

  const prompt = `Сгенерируй экзамен для ${grade} класса по предмету "${subject === 'physics' ? 'Физика' : 'Информатика'}".
Тема: "${topicLabel}". Сложность: ${state.gen.eeDifficulty || 'easy'}.
Нужно ровно ${count} задач в каждом варианте. Всего сгенерируй Вариант А и Вариант Б.
Формат ответа: детальный маркдаун с использованием LaTeX. Для каждой задачи добавь полное решение под спойлером (или отдельно).`;

  try {
    const response = await callQuasarAI(apiKey, MODEL_REASONING, SYSTEM_SIMPLE,
      [{ role: 'user', content: prompt }]
    );
    const text = response.choices[0].message.content;
    result.innerHTML = `<div class="gen-result-content" style="padding: 10px;">${formatContent(text)}</div>`;
    renderKaTeX(result);
  } catch (err) {
    result.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i><p>${friendlyError(err)}</p></div>`;
  } finally {
    state.loading.exam = false;
    btn.disabled = false; btn.classList.remove('shimmer');
    document.dispatchEvent(new Event('qs:icons'));
  }
}



// ╔═══════════════════════════════════════════════════════╗
// ║  16. WORKSHEET BUILDER (with localStorage)            ║
// ╚═══════════════════════════════════════════════════════╝

function loadWorksheetFromStorage() {
  try {
    const stored = localStorage.getItem(WS_STORE_KEY);
    if (stored) {
      state.worksheet = JSON.parse(stored);
    }
  } catch (_) { state.worksheet = []; }
}

function saveWorksheetToStorage() {
  try {
    localStorage.setItem(WS_STORE_KEY, JSON.stringify(state.worksheet));
  } catch (_) { }
}

function setupWorksheet() {
  document.getElementById('ws-close').addEventListener('click', closeWorksheet);
  document.getElementById('ws-toggle-btn').addEventListener('click', openWorksheet);
  document.getElementById('ws-clear-btn').addEventListener('click', clearWorksheet);
  document.getElementById('ws-print-btn').addEventListener('click', () => {
    const sub = state.gen.subject === 'physics' ? 'Физика' : 'Информатика';
    printWorksheet(state.worksheet, `${sub}, ${state.gen.grade} класс`, false);
  });

  // Show toggle button if there are persisted tasks
  if (state.worksheet.length > 0) {
    document.getElementById('ws-toggle-btn').classList.remove('hidden');
    updateWorksheetUI();
  }
}

function addToWorksheet(task, num, label, card) {
  const alreadyIn = state.worksheet.some(t => t.num === num);
  if (alreadyIn) { showToast('Задача уже в листе'); return; }

  state.worksheet.push({
    num, label,
    condition: task.condition || '',
    solution: task.solution || '',
    answer: task.answer || '',
    rubric: task.rubric || [],
    rawText: task.condition || '',
  });

  saveWorksheetToStorage();

  const addBtn = card.querySelector('.task-add-btn');
  if (addBtn) {
    addBtn.classList.add('added');
    addBtn.innerHTML = `<i data-lucide="check"></i><span>Добавлено</span>`;
    addBtn.disabled = true;
    if (window.lucide) lucide.createIcons();
  }

  updateWorksheetUI();
  showToast(`Задача ${num} добавлена в рабочий лист`);
  document.getElementById('ws-toggle-btn').classList.remove('hidden');

  // Glow the sidebar if open
  const sidebar = document.getElementById('worksheet-sidebar');
  if (!sidebar.classList.contains('hidden')) {
    sidebar.classList.remove('ws-glow');
    void sidebar.offsetWidth;
    sidebar.classList.add('ws-glow');
    setTimeout(() => sidebar.classList.remove('ws-glow'), 700);
  }
}

function removeFromWorksheet(index) {
  state.worksheet.splice(index, 1);
  saveWorksheetToStorage();
  updateWorksheetUI();
  if (state.worksheet.length === 0) {
    document.getElementById('ws-toggle-btn').classList.add('hidden');
  }
}

function clearWorksheet() {
  state.worksheet = [];
  saveWorksheetToStorage();
  updateWorksheetUI();
  document.querySelectorAll('.task-add-btn').forEach(btn => {
    btn.classList.remove('added');
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="plus"></i><span>В лист</span>`;
  });
  if (window.lucide) lucide.createIcons();
  document.getElementById('ws-toggle-btn').classList.add('hidden');
}

function updateWorksheetUI() {
  const count = state.worksheet.length;
  const badge = document.getElementById('ws-badge');
  const wsCount = document.getElementById('ws-count');
  if (badge) badge.textContent = count;
  if (wsCount) wsCount.textContent = `${count} ${pluralTask(count)} `;

  const taskList = document.getElementById('ws-tasks');
  if (!taskList) return;

  if (count === 0) {
    taskList.innerHTML = `
      <div class="ws-empty">
        <i data-lucide="plus-circle"></i>
        <p>Нажмите «В лист» под задачей,<br>чтобы добавить её сюда</p>
      </div>`;
  } else {
    taskList.innerHTML = '';
    state.worksheet.forEach((task, i) => {
      const item = document.createElement('div');
      item.className = 'ws-task-item';
      const preview = (task.condition || '').replace(/\*\*/g, '').replace(/\$/g, '').substring(0, 120) + '…';
      item.innerHTML = `
        <button class="ws-task-remove" data-ws-index="${i}"><i data-lucide="x"></i></button>
        <div class="ws-task-num">${escapeHtml(task.label || `Задача ${task.num}`)}</div>
        <div class="ws-task-preview">${escapeHtml(preview)}</div>`;
      item.querySelector('.ws-task-remove').addEventListener('click', () => removeFromWorksheet(i));
      taskList.appendChild(item);
    });
  }

  document.dispatchEvent(new Event('qs:icons'));
}

function pluralTask(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'задача';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'задачи';
  return 'задач';
}

function openWorksheet() {
  const sidebar = document.getElementById('worksheet-sidebar');
  sidebar.classList.remove('hidden');
  updateWorksheetUI();
}

function closeWorksheet() {
  document.getElementById('worksheet-sidebar').classList.add('hidden');
}

function printWorksheet(tasks, titleSuffix, teacherCopy) {
  if (!tasks || tasks.length === 0) { showToast('Рабочий лист пуст'); return; }
  const date = new Date().toLocaleDateString('ru-RU');
  let html = `<h1>Quasar Study — Рабочий лист (${escapeHtml(titleSuffix)})</h1>`;
  html += `<p style="font-size:9pt;color:#666;margin-bottom:8mm">${date}</p>`;
  tasks.forEach((task, i) => {
    const condHtml = formatContent(task.condition || task.rawText || '');
    html += `<div class="task-print">
        <div class="task-print-num">Задача ${task.num || (i + 1)}</div>
      ${condHtml}`;
    if (teacherCopy && task.answer) {
      html += `<p style="margin-top:6px"><strong>Ответ:</strong> ${formatContent(task.answer)}</p>`;
    }
    html += `</div>`;
  });
  html += `<p style="margin-top:10mm;font-size:9pt;color:#666">Quasar Study</p>`;
  doPrint(html);
}


// ╔═══════════════════════════════════════════════════════╗
// ║  17. FORMULA CHEAT SHEET                              ║
// ╚═══════════════════════════════════════════════════════╝

function setupCheatsheet() {
  const modal = document.getElementById('cheatsheet-modal');
  const closeBtn = document.getElementById('cheatsheet-close');
  const genBtn = document.getElementById('cheatsheet-btn');

  genBtn.addEventListener('click', openCheatsheet);
  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
}

async function openCheatsheet() {
  if (state.loading.cheatsheet) return;

  const modal = document.getElementById('cheatsheet-modal');
  const title = document.getElementById('cheatsheet-title');
  const subtitle = document.getElementById('cheatsheet-subtitle');
  const content = document.getElementById('cheatsheet-content');

  const { subject, grade, topic, customTopic } = state.gen;
  const { label: topicLabel } = getGeneratorTopicContext(subject, topic, customTopic);

  title.textContent = topicLabel;
  subtitle.textContent = `${grade} класс · ${subject === 'physics' ? 'Физика' : 'Информатика'} `;

  content.innerHTML = `
      <div class="output-empty">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <p style="margin-top:14px;font-size:13px">Генерирую шпаргалку…</p>
    </div>`;

  modal.classList.remove('hidden');
  document.dispatchEvent(new Event('qs:icons'));

  const apiKey = getApiKey();
  if (!apiKey) return;
  state.loading.cheatsheet = true;

  const sysPrompt = `Return ONLY valid JSON: { "title": "<topic>", "items": [{ "name": "<formula name in Russian>", "latex": "<LaTeX>" }] }. For CS use "code" field instead of "latex".Max 16 items.No preamble.`;
  const isPhysics = subject === 'physics';
  const userPrompt = isPhysics
    ? `Все ключевые формулы по теме "${topicLabel}" для ${grade} класса с обозначениями.`
    : `Все ключевые концепции, алгоритмы и сложности по теме "${topicLabel}" для ${grade} класса.`;

  try {
    const response = await callQuasarAI(apiKey, MODEL_FAST, sysPrompt, [{ role: 'user', content: userPrompt }]);
    const text = response.choices[0].message.content;
    const clean = text.replace(/^```json\s *| ```\s*$/gm, '').trim();
    const data = await parseJsonWithRepair(apiKey, clean);
    const items = data.items || [];

    content.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'formula-grid';

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'formula-item';
      const display = item.latex
        ? `<div class="formula-eq">$$${item.latex}$$</div>`
        : `<pre style="font-size:12px;background:rgba(255,255,255,0.03);border-radius:8px;padding:10px;overflow-x:auto"><code>${escapeHtml(item.code || '')}</code></pre>`;
      el.innerHTML = `<div class="formula-name">${escapeHtml(item.name || '')}</div>${display}`;
      grid.appendChild(el);
    });

    content.appendChild(grid);
    renderKaTeX(content);
    if (window.Prism) content.querySelectorAll('pre code').forEach(b => Prism.highlightElement(b));
  } catch (err) {
    content.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i><p>${friendlyError(err)}</p></div>`;
    document.dispatchEvent(new Event('qs:icons'));
  } finally {
    state.loading.cheatsheet = false;
    if (window.lucide) lucide.createIcons();
  }
}


// ╔═══════════════════════════════════════════════════════╗
// ║  18. LEARNING PLAN GENERATOR                          ║
// ╚═══════════════════════════════════════════════════════╝

function setupSchedule() {
  setupSegmented('sched-subject', val => { state.sched.subject = val; });
  setupSegmented('sched-grade', val => { state.sched.grade = val; });

  const hoursSlider = document.getElementById('sched-hours');
  const hoursVal = document.getElementById('sched-hours-val');
  hoursSlider.addEventListener('input', () => {
    state.sched.hours = parseInt(hoursSlider.value, 10);
    hoursVal.textContent = hoursSlider.value + ' ч';
    updateRangeFill(hoursSlider, 1, 20);
  });

  const weeksSlider = document.getElementById('sched-weeks');
  const weeksVal = document.getElementById('sched-weeks-val');
  weeksSlider.addEventListener('input', () => {
    state.sched.weeks = parseInt(weeksSlider.value, 10);
    weeksVal.textContent = weeksSlider.value + ' нед';
    updateRangeFill(weeksSlider, 2, 52);
  });

  document.getElementById('sched-goal').addEventListener('change', e => { state.sched.goal = e.target.value; });
  document.getElementById('sched-btn').addEventListener('click', generateSchedule);
  document.getElementById('print-sched').addEventListener('click', () => {
    const result = document.getElementById('sched-result');
    if (result.querySelector('.output-empty')) return;
    doPrint(`<h1>Quasar Study — Учебный план</h1>${result.innerHTML}`);
  });
}

function updateRangeFill(slider, min, max) {
  const pct = ((slider.value - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, var(--accent) ${pct}%, rgba(255, 255, 255, 0.1) ${pct}%)`;
}

async function generateSchedule() {
  if (state.loading.schedule) return;
  const apiKey = getApiKey();
  if (!apiKey) { showGlassError('API ключ не найден'); return; }

  const { subject, grade, hours, goal, weeks } = state.sched;
  const totalHours = hours * weeks;
  const topics = buildScheduleTopics(subject, grade);
  const calendar = distributeTopics(topics, weeks, hours);
  const calendarBlock = calendar
    .slice(0, Math.min(20, weeks))
    .map(w => `Неделя ${w.week}: ${w.topics.join(', ')} (~${w.hoursThisWeek} ч)`)
    .join('\n');

  const goalLabels = { exam: 'подготовка к ОГЭ/ЕГЭ', olympiad: 'подготовка к олимпиаде', program: 'прохождение программы', 'catch-up': 'восполнение пробелов' };
  const subjectLabel = subject === 'physics' ? 'физика' : subject === 'cs' ? 'информатика' : 'физика и информатика';

  const prompt = `Составь подробный учебный план.
      Ученик: ${grade} класс | Предмет: ${subjectLabel} | Цель: ${goalLabels[goal]}
Часов в неделю: ${hours} | Недель: ${weeks} | Итого: ~${totalHours} ч

Предлагаемое распределение(корректируй при необходимости):
${calendarBlock}

Для каждой из ${Math.min(weeks, 20)} недель:
• Основную тему
• 2–3 ключевых понятия
• Вид работы(теория / практика / контрольная / повторение)

    Формат: "Неделя N: [Тема]" — затем список через "–".`;

  state.loading.schedule = true;
  const btn = document.getElementById('sched-btn');
  btn.disabled = true; btn.classList.add('shimmer');

  const result = document.getElementById('sched-result');
  result.innerHTML = `<div class="output-empty"><div class="typing-dots"><span></span><span></span><span></span></div><p style="margin-top:14px;color:var(--text-3);font-size:13px">AI строит план на ${weeks} недель…</p></div>`;

  try {
    const response = await callQuasarAI(apiKey, MODEL_REASONING, SYSTEM_SIMPLE, [{ role: 'user', content: prompt }]);
    const text = response.choices[0].message.content;

    const weekBlocks = text.split(/(?=Неделя\s+\d+)/i).map(b => b.trim()).filter(Boolean);
    result.innerHTML = '';

    if (!weekBlocks.length) {
      const card = document.createElement('div');
      card.className = 'task-card';
      card.innerHTML = `<div class="task-condition">${formatContent(text)}</div>`;
      result.appendChild(card);
    } else {
      weekBlocks.forEach((block, i) => {
        const lines = block.split('\n').filter(l => l.trim());
        const header = lines[0] || `Неделя ${i + 1} `;
        const details = lines.slice(1);
        const weekMeta = calendar[i];
        const hoursLabel = weekMeta ? ` — ${weekMeta.hoursThisWeek} ч` : '';

        const card = document.createElement('div');
        card.className = 'week-card';
        card.style.animationDelay = `${i * 0.04} s`;

        const detailsHtml = details
          .map(d => { const c = d.replace(/^[-–•*]\s*/, '').trim(); return c ? `<div class="week-topic">${escapeHtml(c)}</div>` : ''; })
          .join('');

        card.innerHTML = `<div class="week-header">${escapeHtml(header)}${hoursLabel}</div>${detailsHtml}`;
        result.appendChild(card);
      });
    }

    const footer = document.createElement('div');
    footer.style.cssText = `margin - top: 24px; padding: 16px 20px; border - top: 1px solid var(--border); color: var(--text - 2); font - size: 13px; font - weight: 300; letter - spacing: 0.02em; `;
    footer.textContent = `Итого: ${weeks} нед · ${hours} ч / нед · ~${totalHours} ч · ${goalLabels[goal]} `;
    result.appendChild(footer);

  } catch (err) {
    result.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i><p style="text-align:center;margin-top:10px">${friendlyError(err)}</p></div>`;
    document.dispatchEvent(new Event('qs:icons'));
  } finally {
    state.loading.schedule = false;
    btn.disabled = false; btn.classList.remove('shimmer');
  }
}

function buildScheduleTopics(subject, grade) {
  const subjects = subject === 'both' ? ['physics', 'cs'] : [subject];
  let topics = [];
  subjects.forEach(s => {
    const list = TOPICS[s] || [];
    const byGrade = list.filter(t => t.grades.includes(grade));
    const others = list.filter(t => !t.grades.includes(grade));
    topics = topics.concat(byGrade, others);
  });
  return topics;
}

function distributeTopics(topics, weeks, hoursPerWeek) {
  const calendar = [];
  const topicCount = topics.length;
  const slotsPerWeek = Math.max(1, topicCount / Math.max(1, weeks - 2));

  for (let w = 1; w <= weeks; w++) {
    if (w > weeks - 2) {
      calendar.push({ week: w, topics: ['Повторение и закрепление', 'Итоговый контроль'], hoursThisWeek: hoursPerWeek });
      continue;
    }
    const startIdx = Math.floor((w - 1) * slotsPerWeek);
    const endIdx = Math.min(Math.ceil(w * slotsPerWeek), topicCount);
    const weekTopics = topics.slice(startIdx, endIdx).map(t => t.label);
    calendar.push({ week: w, topics: weekTopics.length ? weekTopics : ['Повторение пройденного'], hoursThisWeek: hoursPerWeek });
  }
  return calendar;
}


// ╔═══════════════════════════════════════════════════════╗
// ║  19. QUASAR API                                         ║
// ╚═══════════════════════════════════════════════════════╝

// Trim conversation history to avoid context window overflow.
// Keeps the last 12 messages (6 exchanges) while always preserving order.
function trimHistory(messages, maxMessages = 12) {
  if (messages.length <= maxMessages) return messages;
  return messages.slice(messages.length - maxMessages);
}

async function callQuasarAI(apiKey, model, systemPrompt, messages) {
  if (__ax.isLocked()) {
    throw new Error(__ax.denyCode);
  }
  const trimmedMessages = trimHistory(messages);
  const visualRules = 'If the user request naturally involves data, comparisons, trends or functions, provide an informative Markdown table or a JSON Chart block. However, for simple social interactions or casual questions, respond naturally without forcing visualizations.';
  const response = await fetch(QUASAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        { role: 'system', content: [systemPrompt, visualRules].join('\n\n') },
        ...trimmedMessages,
      ],
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const msg = errBody?.error?.message || `HTTP ${response.status} `;
    throw new Error(msg);
  }

  return response.json();
}

function getApiKey() {
  return localStorage.getItem(API_KEY_STORE) || SHIPPED_KEY;
}

async function parseJsonWithRepair(apiKey, raw) {
  try {
    return safeJsonParse(raw);
  } catch (baseError) {
    const repairPrompt = `Исправь сломанный JSON. Верни только валидный JSON без markdown и комментариев.\n\n${raw}`;
    try {
      const response = await callQuasarAI(apiKey, MODEL_FAST,
        'You repair malformed JSON. Return only valid JSON, no markdown fences, no explanation.',
        [{ role: 'user', content: repairPrompt }]
      );
      const repaired = response?.choices?.[0]?.message?.content || '';
      return safeJsonParse(repaired);
    } catch (_) {
      throw new SyntaxError('MODEL_JSON_INVALID');
    }
  }
}

// ── Safe JSON parser: fixes common LLM output issues ──────────
function safeJsonParse(raw) {
  const source = String(raw || '')
    .replace(/^```json\s*|^```\s*|```\s*$/gm, '')
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\ufeff/g, '')
    .trim();

  const candidates = [];
  const pushCandidate = value => {
    const v = String(value || '').trim();
    if (v && !candidates.includes(v)) candidates.push(v);
  };

  const extracted = extractFirstJsonBlock(source);
  pushCandidate(source);
  pushCandidate(extracted);
  pushCandidate((extracted || source).replace(/,\s*([}\]])/g, '$1'));
  pushCandidate(normalizeJsonStringEscapes(extracted || source));
  pushCandidate(normalizeJsonStringEscapes((extracted || source).replace(/,\s*([}\]])/g, '$1')));

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      return repairEscapedLatexControls(parsed);
    } catch (_) { }
  }

  throw new SyntaxError('safeJsonParse: unable to parse AI response');
}

function extractFirstJsonBlock(text) {
  const start = text.search(/[\[{]/);
  if (start < 0) return text;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{' || ch === '[') depth += 1;
    if (ch === '}' || ch === ']') {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return text.slice(start);
}

function normalizeJsonStringEscapes(text) {
  let out = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (!inString) {
      out += ch;
      if (ch === '"') inString = true;
      continue;
    }

    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      const next = text[i + 1] || '';
      if (/["\\\/]/.test(next)) {
        out += ch;
        escaped = true;
        continue;
      }
      if (/[bfnrt]/.test(next)) {
        // Keep common LaTeX commands literal (\frac, \rho, \text, \nu, ...)
        out += '\\\\';
        continue;
      }
      if (next === 'u' && /^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) {
        out += ch;
        escaped = true;
        continue;
      }
      out += '\\\\';
      continue;
    }

    if (ch === '"') {
      inString = false;
      out += ch;
      continue;
    }

    if (ch === '\n') {
      out += '\\n';
      continue;
    }

    if (ch === '\r') {
      out += '\\r';
      continue;
    }

    out += ch;
  }

  return out;
}

function repairEscapedLatexControls(value) {
  if (Array.isArray(value)) {
    return value.map(repairEscapedLatexControls);
  }
  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value).forEach(key => {
      out[key] = repairEscapedLatexControls(value[key]);
    });
    return out;
  }
  if (typeof value !== 'string') return value;

  const looksLikeMath = /[$\\]/.test(value);
  if (!looksLikeMath) return value;

  return value
    .replace(/\u0008/g, '\\b')
    .replace(/\u000c/g, '\\f')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}



// ╔═══════════════════════════════════════════════════════╗
// ║  20. KATEX RENDERING                                  ║
// ╚═══════════════════════════════════════════════════════╝

function renderKaTeX(el) {
  if (!el) return;
  const attempt = tries => {
    if (window.renderMathInElement) {
      try {
        renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
          ],
          throwOnError: false,
          strict: false,
        });
      } catch (_) { }
    } else if (tries > 0) {
      setTimeout(() => attempt(tries - 1), 300);
    }
  };
  attempt(12);
  renderMermaid(el);
  renderChartsInChat(el);
}

function renderChartsInChat(el) {
  if (!el || !window.Chart) return;
  const containers = el.querySelectorAll('.chat-chart-container:not([data-processed])');
  containers.forEach(cont => {
    cont.setAttribute('data-processed', 'true');
    const canvas = cont.querySelector('.chat-chart-canvas');
    const ctx = canvas.getContext('2d');
    const rawData = cont.querySelector('pre').textContent;
    try {
      const data = JSON.parse(rawData);

      // Premium Green Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(45, 138, 78, 0.3)');
      gradient.addColorStop(1, 'rgba(45, 138, 78, 0.0)');

      const config = data.type ? data : {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: data.datasets || [{
            label: data.title || '',
            data: data.data,
            borderColor: '#2d8a4e',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2
          }]
        }
      };

      const textColor = 'rgba(0,0,0,0.5)';

      const chart = new Chart(canvas, {
        ...config,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 2000,
            easing: 'easeOutQuart',
            delay: (context) => context.dataIndex * 15
          },
          plugins: {
            legend: {
              display: (data.datasets && data.datasets.length > 1) || !!data.title,
              labels: { color: textColor, font: { family: 'Inter', size: 11, weight: 500 }, usePointStyle: true, padding: 15 }
            },
            tooltip: {
              backgroundColor: '#fff',
              titleColor: '#111',
              bodyColor: '#555',
              borderColor: 'rgba(0,0,0,0.05)',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 12,
              displayColors: true
            }
          },
          scales: config.options?.scales || {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 10 } }
            },
            y: {
              grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
              ticks: { color: textColor, font: { size: 10 } }
            }
          }
        }
      });
      canvas._chartInstance = chart;

      // Play button for chat charts
      const playBtn = document.createElement('button');
      playBtn.className = 'chat-chart-play-btn';
      playBtn.innerHTML = '<i data-lucide="play"></i>';
      playBtn.onclick = () => {
        chart.stop();
        chart.reset();
        chart.update();
      };
      cont.appendChild(playBtn);
      if (window.lucide) lucide.createIcons();
    } catch (e) {
      cont.innerHTML = `<div class="md-warning">Ошибка графика: ${e.message}</div>`;
    }
  });
}

function renderMermaid(el) {
  if (!el || !window.mermaid) return;
  const mermaidDivs = el.querySelectorAll('.mermaid:not([data-processed])');
  if (mermaidDivs.length === 0) return;

  mermaidDivs.forEach(div => {
    div.setAttribute('data-processed', 'true');
    const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
    const content = div.textContent;
    div.innerHTML = '';

    mermaid.render(id, content).then(({ svg }) => {
      div.innerHTML = svg;
      div.classList.add('rendered');
      // Trigger Lucide if needed, though usually not for diagrams
    }).catch(err => {
      div.innerHTML = `<div class="md-warning">Ошибка рендеринга диаграммы: ${err.message}</div>`;
    });
  });
}


// ╔═══════════════════════════════════════════════════════╗
// ║  21. UTILITIES                                        ║
// ╚═══════════════════════════════════════════════════════╝

function setupSegmented(containerId, onChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.setAttribute('role', 'tablist');
  container.querySelectorAll('.seg-btn').forEach(btn => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
    btn.addEventListener('click', () => {
      container.querySelectorAll('.seg-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      onChange(btn.dataset.val);
    });
  });
}

/**
 * formatContent — converts raw AI markdown to safe HTML.
 * Handles: code blocks → LaTeX → !!! Warning: → > [Concept]: → inline code → bold/italic → headers → lists → newlines
 */
function formatContent(text) {
  if (!text) return '';

  // 1. Extract fenced code blocks
  const codeBlocks = [];
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const langClass = (lang || 'plaintext').toLowerCase();
    const cleanCode = code.trim();
    const safeCode = escapeHtml(cleanCode);
    const isHtml = langClass === 'html' || langClass === 'xml' || (cleanCode.startsWith('<') && cleanCode.includes('>'));

    let actions = `<button class="code-btn" onclick="copyCode(this)" title="Копировать"><i data-lucide="copy"></i></button>`;
    if (isHtml) {
      actions += `<button class="code-btn preview" onclick="previewHtml(this)" title="Открыть в новом окне"><i data-lucide="external-link"></i></button>`;
    }

    if (langClass === 'mermaid') {
      const block = `<div class="mermaid">${code.trim()}</div>`;
      codeBlocks.push(block);
      return `%%CB_${codeBlocks.length - 1}%%`;
    }

    if (langClass === 'chart' || langClass === 'chart.js') {
      const block = `<div class="chat-chart-container"><canvas class="chat-chart-canvas"></canvas><pre class="hidden">${code.trim()}</pre></div>`;
      codeBlocks.push(block);
      return `%%CB_${codeBlocks.length - 1}%%`;
    }

    const block = `
      <div class="code-wrapper">
        <div class="code-meta">
          <span>${langClass}</span>
          <div class="code-btns">${actions}</div>
        </div>
        <pre><code class="language-${langClass}">${safeCode}</code></pre>
      </div>
    `;
    codeBlocks.push(block);
    return `%%CB_${codeBlocks.length - 1}%%`;
  });

  // 2. Extract LaTeX display and inline
  const latexBlocks = [];
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    latexBlocks.push(`$$${math}$$`);
    return `%%LX_${latexBlocks.length - 1}%%`;
  });
  text = text.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    latexBlocks.push(`$${math}$`);
    return `%%LX_${latexBlocks.length - 1}%%`;
  });

  // 3. Custom blocks: !!! Warning: text
  text = text.replace(/^!!!\s*Warning:\s*(.+)$/gm,
    '<div class="md-warning">⚠ $1</div>');

  // 4. Custom blocks: > [Concept]: Definition
  text = text.replace(/^>\s*\[([^\]]+)\]:\s*(.+)$/gm,
    '<div class="md-concept"><span class="concept-key">$1:</span> $2</div>');

  // 5. Inline formatting
  text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 6. Headers
  text = text.replace(/^### (.+)$/gm, '<h4 style="font-size:13.5px;font-weight:500;margin:14px 0 4px;letter-spacing:-0.01em">$1</h4>');
  text = text.replace(/^## (.+)$/gm, '<h3 style="font-size:15px;font-weight:400;margin:18px 0 6px;letter-spacing:-0.01em">$1</h3>');
  text = text.replace(/^# (.+)$/gm, '<h2 style="font-size:17px;font-weight:300;margin:22px 0 8px;letter-spacing:-0.02em">$1</h2>');

  // 7. HR
  text = text.replace(/^— — —$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:16px 0"/>');
  text = text.replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:16px 0"/>');

  // 8. Markdown Tables
  text = text.replace(/^\|(.+)\|$/gm, (line) => {
    const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
    const tag = line.includes('---') ? 'th' : 'td';
    return `<tr style="border-bottom:1px solid var(--border)">${cells.map(c => `<${tag} style="padding:8px;text-align:left">${c.trim()}</${tag}>`).join('')}</tr>`;
  });
  text = text.replace(/((?:<tr.*?>.*?<\/tr>\s*)+)/g, '<div style="overflow-x:auto;margin:12px 0;border:1px solid var(--border);border-radius:6px;background:rgba(255,255,255,0.3)"><table style="width:100%;border-collapse:collapse;font-size:12.5px">$1</table></div>');
  // Clean up divider rows
  text = text.replace(/<tr.*?>\s*(?:<td.*?>\s*-+\s*<\/td>\s*)+<\/tr>/g, '');

  // 9. Ordered + unordered lists
  text = text.replace(/^(\d+)\.\s+(.+)$/gm, '<div style="padding:3px 0 3px 16px">$1. $2</div>');
  text = text.replace(/^[-–•*]\s+(.+)$/gm,
    '<div style="padding:3px 0 3px 16px;display:flex;gap:8px"><span style="color:var(--accent);flex-shrink:0">·</span><span>$1</span></div>');

  // 9. Newlines → br
  text = text.replace(/\n/g, '<br>');

  // 10. Restore extracted blocks
  text = text.replace(/%%LX_(\d+)%%/g, (_, i) => latexBlocks[parseInt(i, 10)]);
  text = text.replace(/%%CB_(\d+)%%/g, (_, i) => codeBlocks[parseInt(i, 10)]);

  return text;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function friendlyError(err) {
  const msg = err?.message || String(err);
  if (msg === __ax.denyCode) return 'Функция недоступна на этом устройстве.';
  if (/401|invalid_api_key|unauthorized/i.test(msg)) return 'Неверный API ключ. Проверьте ключ и повторите.';
  if (/429|rate_limit/i.test(msg)) return 'Превышен лимит запросов. Подождите минуту и повторите.';
  if (/503|overloaded|service_unavail/i.test(msg)) return 'Сервер перегружен. Попробуйте через 30 секунд.';
  if (/model_not_found|does not exist/i.test(msg)) return 'Выбранная модель недоступна.';
  if (/failed to fetch|networkerror|load failed/i.test(msg)) return 'Ошибка сети: не удалось подключиться к api.groq.com. Убедитесь что сайт открыт через HTTP(S)-сервер (не file://), и проверьте актуальность API-ключа Groq.';
  if (/safeJsonParse|MODEL_JSON_INVALID/i.test(msg)) return 'Модель вернула невалидный JSON. Нажмите «Сгенерировать» еще раз.';
  return `Ошибка: ${msg}`;
}

/** Glass-morphic inline error popup (not a blocking alert) */
/** Glass-morphic inline error popup (simple version) */
function showSimpleError(message) {
  let el = document.getElementById('qs-error-popup');
  if (!el) {
    el = document.createElement('div');
    el.id = 'qs-error-popup';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.classList.remove('visible'); }, 4000);
}

function showToast(message) {
  let toast = document.getElementById('qs-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'qs-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.classList.remove('visible'); }, 3000);
}

function copyCode(btn) {
  const code = btn.closest('.code-wrapper').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const icon = btn.querySelector('i');
    const oldName = icon.getAttribute('data-lucide');
    icon.setAttribute('data-lucide', 'check');
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      icon.setAttribute('data-lucide', oldName);
      if (window.lucide) lucide.createIcons();
    }, 2000);
    if (window.showToast) showToast('Код скопирован ✓');
  });
}

function previewHtml(btn) {
  const code = btn.closest('.code-wrapper').querySelector('code').textContent;
  const blob = new Blob([code], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    if (window.showSimpleError) showSimpleError('Всплывающее окно заблокировано бразуером');
  }
}

function doPrint(html) {
  const area = document.getElementById('print-area');
  area.classList.remove('hidden');
  area.innerHTML = html;
  renderKaTeX(area);
  setTimeout(() => {
    window.print();
    setTimeout(() => {
      area.innerHTML = '';
      area.classList.add('hidden');
    }, 600);
  }, 350);
}/* ═══════════════════════════════════════════════════════════
   QUASAR STUDY — app_nexus_patch.js  NEXUS UPGRADE
   Pro Modules: Lesson Script + Lab Generator
   Split-Print System: Teacher / Student Views
   Variable Swap (instant regenerate)
   QR Hint Mode (scan → hint in UI)
   Enhanced AI system prompt wrapper
   Append this to the end of app.js (before closing)
═══════════════════════════════════════════════════════════ */

// ╔═══════════════════════════════════════════════════════╗
// ║  NEXUS: SYSTEM PROMPT WRAPPER                         ║
// ║  Wraps all AI calls with Senior Curriculum Dev      ║
// ╚═══════════════════════════════════════════════════════╝

const SYSTEM_CURRICULUM = `You are a Senior Curriculum Developer for Physics and Informatics (grades 7–11).

CORE OUTPUT RULES:
- Output strictly structured Markdown.
- Use LaTeX for ALL mathematical formulas: inline $formula$ and display $$formula$$.
- Provide high-contrast code blocks with language tags.
- No filler, no preamble, no pleasantries — dense, scientific, pedagogical content only.
- Respond in the same language as the input (default: Russian).

FORMATTING:
- Use ## for major sections, ### for subsections.
- Bold **key terms** on first use.
- LaTeX units always shown in brackets: $F = ma$, $[F] = \\text{N}$, $[m] = \\text{kg}$, $[a] = \\text{m/s}^2$.
- Code blocks must have language tags and inline comments on non-trivial lines.
- End every response with ## Методические заметки (pedagogical notes for teacher).`;

const SYSTEM_LAB = `You are a Senior Laboratory Curriculum Developer.
Return ONLY valid JSON — no markdown fences, no preamble.

Return a single object with EXACTLY these fields:
{
  "title": "<lab title>",
  "subject": "<subject>",
  "grade": "<grade>",
  "objective": "<1-2 sentences, what students will learn>",
  "hypothesis": "<testable hypothesis for students to verify>",
  "equipment": ["<item 1>", "<item 2>", ...],
  "safety": ["<safety rule 1>", ...],
  "procedure": [
    {"step": 1, "action": "<imperative instruction>", "note": "<optional teacher note>"}
  ],
  "dataTable": {
    "columns": ["<col1>", "<col2>", "<col3>", ...],
    "rows": 6
  },
  "analysisQuestions": ["<question 1>", "<question 2>", "<question 3>"],
  "expectedResult": "<what result students should find — TEACHER ONLY>",
  "teacherTips": ["<tip 1>", "<tip 2>"],
  "rubric": [
    {"criterion": "<criterion>", "points": N, "description": "<what earns points>"}
  ]
}

Quality requirements:
- Equipment: specific quantities (e.g. "Пружинный динамометр, 0–5 Н × 1 шт.")
- Procedure: 6–10 concrete, numbered steps
- DataTable: 3–5 columns relevant to the measurement
- Safety: 2–3 relevant rules
- Rubric: 4 rows minimum`;

const SYSTEM_LESSON = `You are a Senior Curriculum Developer writing lesson scripts.
Return ONLY valid JSON — no markdown fences, no preamble.

Return a single object with EXACTLY these fields:
{
  "title": "<lesson title>",
  "subject": "<subject>",
  "grade": "<grade>",
  "totalMinutes": 45,
  "learningObjectives": ["<objective 1>", "<objective 2>"],
  "phases": [
    {
      "name": "Введение",
      "type": "intro",
      "durationMin": 5,
      "teacherScript": "<what teacher says/does — full script with stage directions>",
      "studentActivity": "<what students do>",
      "materials": ["<material>"],
      "teacherTips": "<differentiation or pacing advice>"
    },
    {
      "name": "Теория",
      "type": "theory",
      "durationMin": 15,
      "teacherScript": "<full script with LaTeX formulas where relevant>",
      "studentActivity": "<note-taking / discussion prompts>",
      "materials": [],
      "teacherTips": "<common misconceptions to address>"
    },
    {
      "name": "Практика",
      "type": "practice",
      "durationMin": 20,
      "teacherScript": "<guided practice instructions>",
      "studentActivity": "<tasks, problems to solve — include 2–3 examples with LaTeX>",
      "materials": [],
      "teacherTips": "<grouping suggestions, scaffolding>"
    },
    {
      "name": "Выходной билет",
      "type": "exit",
      "durationMin": 5,
      "teacherScript": "<exit ticket prompt and closing>",
      "studentActivity": "<1 formative assessment question — with answer for teacher>",
      "materials": [],
      "teacherTips": "<how to use results for next lesson>"
    }
  ],
  "homework": "<optional homework assignment>",
  "assessmentAnswer": "<answer to exit ticket — TEACHER ONLY>"
}

Strictly output valid JSON only.`;


// ╔═══════════════════════════════════════════════════════╗
// ║  QR QUESTS GENERATOR                                  ║
// ╚═══════════════════════════════════════════════════════╝



// ╔═══════════════════════════════════════════════════════╗
// ║  NEXUS INIT — runs after original DOMContentLoaded    ║
// ╚═══════════════════════════════════════════════════════╝

document.addEventListener('DOMContentLoaded', () => {
  if (window.__QS_LOCKED__) return;
  injectNexusNav();
  injectNexusSections();
  setupLessonModule();
  setupLabModule();
  setupQrHintOverlay();
  setupPrintPreviewModal();
  // Extend existing varchange with swap button
  extendVariableSwap();
});


// ╔═══════════════════════════════════════════════════════╗
// ║  NEXUS NAV INJECTION                                  ║
// ╚═══════════════════════════════════════════════════════╝

function injectNexusNav() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  // Guard: nav buttons already exist in index.html — skip injection to avoid duplicates
  if (navLinks.querySelector('[data-section="lesson"]') || navLinks.querySelector('[data-section="lab"]')) return;

  const lessonBtn = document.createElement('button');
  lessonBtn.className = 'nav-btn';
  lessonBtn.dataset.section = 'lesson';
  lessonBtn.innerHTML = `<i data-lucide="book-text"></i><span>Конспект урока</span>`;
  lessonBtn.addEventListener('click', () => navigateTo('lesson'));

  const labBtn = document.createElement('button');
  labBtn.className = 'nav-btn';
  labBtn.dataset.section = 'lab';
  labBtn.innerHTML = `<i data-lucide="flask-conical"></i><span>Лабораторная</span>`;
  labBtn.addEventListener('click', () => navigateTo('lab'));

  navLinks.appendChild(lessonBtn);
  navLinks.appendChild(labBtn);

  if (window.lucide) lucide.createIcons();
}


// ╔═══════════════════════════════════════════════════════╗
// ║  NEXUS SECTIONS HTML INJECTION                        ║
// ╚═══════════════════════════════════════════════════════╝

function injectNexusSections() {
  const app = document.getElementById('app');
  if (!app) return;
  // Guard: sections already exist in index.html — skip injection to avoid duplicate IDs
  if (document.getElementById('section-lesson') || document.getElementById('section-lab')) return;

  // ── LESSON SECTION ──
  const lessonSection = document.createElement('section');
  lessonSection.id = 'section-lesson';
  lessonSection.className = 'content-section';
  lessonSection.innerHTML = `
    <div class="section-header">
      <h2>Конспект урока</h2>
      <p>Генератор 45-минутных планов уроков с поминутным сценарием</p>
    </div>
    <div class="lesson-layout">
      <div class="lesson-form glass-card">
        <div class="gen-field">
          <label class="field-label">Предмет</label>
          <div class="segmented" id="lesson-subject">
            <button class="seg-btn active" data-val="physics">Физика</button>
            <button class="seg-btn" data-val="cs">Информатика</button>
          </div>
        </div>
        <div class="gen-field">
          <label class="field-label">Класс</label>
          <div class="segmented" id="lesson-grade">
            <button class="seg-btn active" data-val="7">7</button>
            <button class="seg-btn" data-val="8">8</button>
            <button class="seg-btn" data-val="9">9</button>
            <button class="seg-btn" data-val="10">10</button>
            <button class="seg-btn" data-val="11">11</button>
          </div>
        </div>
        <div class="gen-field">
          <label class="field-label">Тема урока</label>
          <select id="lesson-topic" class="qs-select"></select>
        </div>
        <div class="gen-field">
          <label class="field-label">Тип урока</label>
          <div class="lesson-type-grid" id="lesson-type-grid">
            <button class="lesson-type-card active" data-val="new">
              <i data-lucide="sparkles"></i>
              <span>Новый материал</span>
            </button>
            <button class="lesson-type-card" data-val="practice">
              <i data-lucide="pencil-ruler"></i>
              <span>Закрепление</span>
            </button>
            <button class="lesson-type-card" data-val="revision">
              <i data-lucide="rotate-ccw"></i>
              <span>Повторение</span>
            </button>
            <button class="lesson-type-card" data-val="test">
              <i data-lucide="clipboard-check"></i>
              <span>Контроль</span>
            </button>
          </div>
        </div>
        <button class="btn-primary w-full" id="lesson-gen-btn">
          <i data-lucide="book-text"></i>
          <span>Сгенерировать конспект</span>
        </button>
      </div>

      <div class="lesson-output glass-card" id="lesson-output-card">
        <div class="gen-output-header">
          <span class="output-label">Конспект урока</span>
          <div style="display:flex;gap:8px">
            <button class="btn-icon" id="lesson-print-teacher" title="Версия учителя">
              <i data-lucide="user-check"></i>
            </button>
            <button class="btn-icon" id="lesson-print-student" title="Версия ученика">
              <i data-lucide="user"></i>
            </button>
          </div>
        </div>
        <div id="lesson-result" class="gen-result-area">
          <div class="output-empty">
            <i data-lucide="book-text"></i>
            <p>Конспект появится здесь</p>
          </div>
        </div>
      </div>
    </div>`;

  // ── LAB SECTION ──
  const labSection = document.createElement('section');
  labSection.id = 'section-lab';
  labSection.className = 'content-section';
  labSection.innerHTML = `
    <div class="section-header">
      <h2>Лабораторная работа</h2>
      <p>Полная лабораторная: цель, оборудование, процедура, таблицы данных</p>
    </div>
    <div class="lab-layout">
      <div class="lab-form glass-card">
        <div class="gen-field">
          <label class="field-label">Предмет</label>
          <div class="segmented" id="lab-subject">
            <button class="seg-btn active" data-val="physics">Физика</button>
            <button class="seg-btn" data-val="cs">Информатика</button>
          </div>
        </div>
        <div class="gen-field">
          <label class="field-label">Класс</label>
          <div class="segmented" id="lab-grade">
            <button class="seg-btn active" data-val="8">8</button>
            <button class="seg-btn" data-val="9">9</button>
            <button class="seg-btn" data-val="10">10</button>
            <button class="seg-btn" data-val="11">11</button>
          </div>
        </div>
        <div class="gen-field">
          <label class="field-label">Тема</label>
          <select id="lab-topic" class="qs-select"></select>
        </div>
        <div class="gen-field">
          <label class="field-label">Тип лабораторной</label>
          <div class="lab-type-grid" id="lab-type-grid">
            <button class="lab-type-card active" data-val="measurement">
              <i data-lucide="ruler"></i>
              <span>Измерение</span>
            </button>
            <button class="lab-type-card" data-val="investigation">
              <i data-lucide="search"></i>
              <span>Исследование</span>
            </button>
            <button class="lab-type-card" data-val="verification">
              <i data-lucide="check-circle-2"></i>
              <span>Проверка закона</span>
            </button>
            <button class="lab-type-card" data-val="simulation">
              <i data-lucide="monitor-play"></i>
              <span>Симуляция/Модель</span>
            </button>
          </div>
        </div>
        <div class="gen-field">
          <label class="field-label">Дополнительные требования</label>
          <textarea id="lab-requirements" class="qs-input" rows="2"
            placeholder="Например: использовать динамометр, группы по 3 человека…"></textarea>
        </div>
        <button class="btn-primary w-full" id="lab-gen-btn">
          <i data-lucide="flask-conical"></i>
          <span>Сгенерировать лабораторную</span>
        </button>
      </div>

      <div class="lab-output glass-card" id="lab-output-card">
        <div class="gen-output-header">
          <span class="output-label">Лабораторная работа</span>
          <div style="display:flex;gap:8px">
            <button class="btn-icon" id="lab-print-teacher" title="Версия учителя (с ответами)">
              <i data-lucide="user-check"></i>
            </button>
            <button class="btn-icon" id="lab-print-student" title="Версия ученика (чистый бланк)">
              <i data-lucide="user"></i>
            </button>
          </div>
        </div>
        <div id="lab-result" class="gen-result-area">
          <div class="output-empty">
            <i data-lucide="flask-conical"></i>
            <p>Лабораторная работа появится здесь</p>
          </div>
        </div>
      </div>
    </div>`;

  app.appendChild(lessonSection);
  app.appendChild(labSection);

  if (window.lucide) lucide.createIcons();
}


// ╔═══════════════════════════════════════════════════════╗
// ║  LESSON MODULE                                        ║
// ╚═══════════════════════════════════════════════════════╝

const lessonState = {
  subject: 'physics',
  grade: '7',
  topic: '',
  lessonType: 'new',
  data: null,
};

function setupLessonModule() {
  // Wait for section to exist
  const check = setInterval(() => {
    const section = document.getElementById('section-lesson');
    if (!section) return;
    clearInterval(check);

    setupSegmented('lesson-subject', val => {
      lessonState.subject = val;
      updateLessonTopicSelect(val);
    });
    setupSegmented('lesson-grade', val => {
      lessonState.grade = val;
      updateLessonTopicSelect(lessonState.subject);
    });

    // Lesson type cards
    section.querySelectorAll('.lesson-type-card').forEach(card => {
      card.addEventListener('click', () => {
        section.querySelectorAll('.lesson-type-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        lessonState.lessonType = card.dataset.val;
      });
    });

    document.getElementById('lesson-topic')?.addEventListener('change', e => {
      lessonState.topic = e.target.value;
    });

    document.getElementById('lesson-gen-btn')?.addEventListener('click', generateLesson);
    document.getElementById('lesson-print-teacher')?.addEventListener('click', () => printLessonDoc(true));
    document.getElementById('lesson-print-student')?.addEventListener('click', () => printLessonDoc(false));

    // Mark as wired so setupLessonScript (infinity patch) doesn't double-wire
    const genBtn = document.getElementById('lesson-gen-btn');
    if (genBtn) genBtn._lessonWired = true;

    updateLessonTopicSelect('physics');
    if (window.lucide) lucide.createIcons();
  }, 200);
}

function updateLessonTopicSelect(subject) {
  const select = document.getElementById('lesson-topic');
  if (!select) return;
  const grade = lessonState.grade || '7';
  const topics = TOPICS[subject] || [];
  select.innerHTML = '';

  const rec = topics.filter(t => t.grades.includes(grade));
  const oth = topics.filter(t => !t.grades.includes(grade));

  if (rec.length) {
    const grp = document.createElement('optgroup');
    grp.label = `Рекомендовано · ${grade} класс`;
    rec.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.value; opt.textContent = t.label;
      grp.appendChild(opt);
    });
    select.appendChild(grp);
  }
  if (oth.length) {
    const grp = document.createElement('optgroup');
    grp.label = 'Другие классы';
    oth.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.value; opt.textContent = `${t.label} (${t.grades.join(', ')} кл.)`;
      grp.appendChild(opt);
    });
    select.appendChild(grp);
  }

  const def = rec[0] || topics[0];
  if (def) { select.value = def.value; lessonState.topic = def.value; }
}

async function generateLesson() {
  const apiKey = getApiKey();
  if (!apiKey) { showSimpleError('API ключ не найден'); return; }

  const { subject, grade, topic, lessonType } = lessonState;
  const topicData = (TOPICS[subject] || []).find(t => t.value === topic);
  const topicLabel = topicData?.label || topic;
  const topicDetail = topicData?.detail || '';

  const typeLabels = {
    new: 'объяснение нового материала',
    practice: 'закрепление и отработка навыков',
    revision: 'повторение и систематизация',
    test: 'контроль знаний',
  };

  const subjectLabel = subject === 'physics' ? 'физика' : 'информатика';
  const prompt = `Создай подробный конспект урока по ${subjectLabel} для ${grade} класса.
Тема: «${topicLabel}»${topicDetail ? ` — ${topicDetail}` : ''}
Тип урока: ${typeLabels[lessonType] || typeLabels.new}
Продолжительность: 45 минут

Строго следуй структуре JSON из инструкции. LaTeX для всех формул физики.`;

  const btn = document.getElementById('lesson-gen-btn');
  const result = document.getElementById('lesson-result');
  btn.disabled = true; btn.classList.add('shimmer');
  result.innerHTML = `
    <div class="output-empty">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <p style="margin-top:14px;color:var(--text-3);font-size:13px">Составляю конспект урока…</p>
    </div>`;

  try {
    const response = await callQuasarAI(apiKey, MODEL_REASONING, SYSTEM_LESSON,
      [{ role: 'user', content: prompt }]
    );
    const text = response.choices[0].message.content;
    const clean = text.replace(/^```json\s*|```\s*$/gm, '').trim();
    const data = await parseJsonWithRepair(apiKey, clean);
    lessonState.data = data;
    renderLessonOutput(data, result);
  } catch (err) {
    result.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i>
      <p style="text-align:center;margin-top:10px">${friendlyError(err)}</p></div>`;
    document.dispatchEvent(new Event('qs:icons'));
  } finally {
    btn.disabled = false; btn.classList.remove('shimmer');
  }
}

function renderLessonOutput(data, container) {
  container.innerHTML = '';

  // Header card
  const headerCard = document.createElement('div');
  headerCard.style.cssText = 'padding:16px 18px;border-bottom:1px solid var(--border);';
  headerCard.innerHTML = `
    <div style="font-size:16px;font-weight:400;letter-spacing:-0.01em;margin-bottom:6px">${escapeHtml(data.title || '')}</div>
    <div style="font-size:12px;color:var(--text-3);font-weight:300;display:flex;gap:12px;flex-wrap:wrap">
      <span>${escapeHtml(data.subject || '')} · ${escapeHtml(data.grade || '')} класс</span>
      <span>· ${data.totalMinutes || 45} мин</span>
    </div>
    ${data.learningObjectives?.length ? `
    <div style="margin-top:12px">
      <div style="font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-3);margin-bottom:6px">Цели урока</div>
      ${data.learningObjectives.map(o => `<div style="font-size:12.5px;font-weight:300;color:var(--text-2);padding:2px 0 2px 12px;border-left:2px solid var(--accent-dim)">${escapeHtml(o)}</div>`).join('')}
    </div>` : ''}
  `;
  container.appendChild(headerCard);

  // Phase timeline
  const plan = document.createElement('div');
  plan.className = 'lesson-plan';

  const phaseConfig = {
    intro: { cls: 'phase-intro', icon: 'zap', color: 'var(--accent)' },
    theory: { cls: 'phase-theory', icon: 'book-open', color: 'var(--teal)' },
    practice: { cls: 'phase-practice', icon: 'pencil-ruler', color: 'var(--amber)' },
    exit: { cls: 'phase-exit', icon: 'door-open', color: 'var(--rose)' },
  };

  (data.phases || []).forEach((phase, i) => {
    const cfg = phaseConfig[phase.type] || phaseConfig.intro;
    const phaseEl = document.createElement('div');
    phaseEl.className = `lesson-phase ${cfg.cls}`;
    phaseEl.style.animationDelay = `${i * 0.08}s`;

    phaseEl.innerHTML = `
      <div class="lesson-phase-line">
        <div class="lesson-phase-dot" style="border-color:${cfg.color}"></div>
        <div class="lesson-phase-track"></div>
      </div>
      <div class="lesson-phase-content">
        <div class="lesson-phase-label">
          <span class="lesson-phase-title" style="color:${cfg.color}">${escapeHtml(phase.name || '')}</span>
          <span class="lesson-phase-dur">${phase.durationMin || '?'} мин</span>
        </div>
        <div class="lesson-phase-body">
          <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:8px">Сценарий учителя</div>
          <div style="font-size:13.5px;font-weight:300;line-height:1.85;margin-bottom:12px">${formatContent(phase.teacherScript || '')}</div>
          ${phase.studentActivity ? `
          <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:6px;margin-top:10px">Деятельность учеников</div>
          <div style="font-size:13px;font-weight:300;line-height:1.8;color:var(--text-2)">${formatContent(phase.studentActivity)}</div>
          ` : ''}
          ${phase.teacherTips ? `
          <div class="md-concept" style="margin-top:10px">
            <span class="concept-key">💡 Совет:</span> ${escapeHtml(phase.teacherTips)}
          </div>
          ` : ''}
        </div>
      </div>
    `;
    plan.appendChild(phaseEl);
  });

  container.appendChild(plan);

  // Homework + assessment answer
  if (data.homework || data.assessmentAnswer) {
    const footer = document.createElement('div');
    footer.style.cssText = 'padding:14px 18px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px';
    if (data.homework) {
      footer.innerHTML += `<div style="font-size:12.5px;font-weight:300;color:var(--text-2)">
        <strong style="color:var(--text);font-weight:400">Домашнее задание:</strong> ${escapeHtml(data.homework)}
      </div>`;
    }
    if (data.assessmentAnswer) {
      footer.innerHTML += `<div style="font-size:12.5px;font-weight:300;background:rgba(255,190,60,0.06);border:1px solid rgba(255,190,60,0.2);border-radius:var(--radius-xs);padding:10px 14px;">
        <strong style="color:var(--amber);font-weight:400;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;display:block;margin-bottom:4px">Ответ выходного билета (только для учителя)</strong>
        ${formatContent(data.assessmentAnswer)}
      </div>`;
    }
    container.appendChild(footer);
  }

  renderKaTeX(container);
  if (window.lucide) lucide.createIcons();
}


// ╔═══════════════════════════════════════════════════════╗
// ║  LESSON PRINT (Split Teacher / Student)               ║
// ╚═══════════════════════════════════════════════════════╝

function printLessonDoc(teacherView) {
  const data = lessonState.data;
  if (!data) { showToast('Сначала сгенерируйте конспект'); return; }

  const date = new Date().toLocaleDateString('ru-RU');
  const badge = teacherView ? 'lesson' : 'student';
  const ver = teacherView ? 'ВЕРСИЯ УЧИТЕЛЯ' : 'ВЕРСИЯ УЧЕНИКА';

  let html = `
    <div class="pa-title">${escapeHtml(data.title || 'Конспект урока')}</div>
    <div class="pa-meta">
      <span class="pa-badge pa-badge-${badge}">${ver}</span>
      ${escapeHtml(data.subject || '')} · ${escapeHtml(data.grade || '')} класс · ${data.totalMinutes || 45} мин · ${date}
    </div>`;

  if (data.learningObjectives?.length) {
    html += `<div style="margin-bottom:6mm"><strong>Цели урока:</strong><ul>
      ${data.learningObjectives.map(o => `<li>${escapeHtml(o)}</li>`).join('')}
    </ul></div>`;
  }

  (data.phases || []).forEach(phase => {
    const phaseTypeMap = {
      intro: 'phase-intro-print',
      theory: 'phase-theory-print',
      practice: 'phase-practice-print',
      exit: 'phase-exit-print',
    };
    const phaseClass = phaseTypeMap[phase.type] || 'phase-intro-print';

    html += `<div class="pa-phase ${phaseClass}">
      <div class="pa-phase-label">${escapeHtml(phase.name || '')} — ${phase.durationMin || '?'} мин</div>`;

    if (teacherView) {
      html += `<div>${formatContent(phase.teacherScript || '')}</div>`;
      if (phase.teacherTips) {
        html += `<div class="pa-tip">💡 ${escapeHtml(phase.teacherTips)}</div>`;
      }
    }

    if (phase.studentActivity) {
      html += `<div><strong>Задание ученикам:</strong> ${formatContent(phase.studentActivity)}</div>`;
    }

    if (!teacherView && (phase.type === 'practice' || phase.type === 'exit')) {
      html += `<div class="pa-workspace"></div>`;
    }

    html += `</div>`;
  });

  if (teacherView && data.assessmentAnswer) {
    html += `<div class="pa-answer"><strong>Ответ выходного билета:</strong> ${formatContent(data.assessmentAnswer)}</div>`;
  }

  if (data.homework) {
    html += `<div style="margin-top:5mm"><strong>Домашнее задание:</strong> ${escapeHtml(data.homework)}</div>`;
  }

  html += `<div class="pa-footer">
    <span>Quasar Study Nexus · @ihatehates &amp; @khkirill</span>
    <span>${date}</span>
  </div>`;

  doPrint(html);
}


// ╔═══════════════════════════════════════════════════════╗
// ║  LAB MODULE                                           ║
// ╚═══════════════════════════════════════════════════════╝

const labState = {
  subject: 'physics',
  grade: '8',
  topic: '',
  labType: 'measurement',
  data: null,
};

function setupLabModule() {
  const check = setInterval(() => {
    const section = document.getElementById('section-lab');
    if (!section) return;
    clearInterval(check);

    setupSegmented('lab-subject', val => {
      labState.subject = val;
      updateLabTopicSelect(val);
    });
    setupSegmented('lab-grade', val => {
      labState.grade = val;
      updateLabTopicSelect(labState.subject);
    });

    section.querySelectorAll('.lab-type-card').forEach(card => {
      card.addEventListener('click', () => {
        section.querySelectorAll('.lab-type-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        labState.labType = card.dataset.val;
      });
    });

    document.getElementById('lab-topic')?.addEventListener('change', e => {
      labState.topic = e.target.value;
    });

    document.getElementById('lab-gen-btn')?.addEventListener('click', generateLab);
    document.getElementById('lab-print-teacher')?.addEventListener('click', () => printLabDoc(true));
    document.getElementById('lab-print-student')?.addEventListener('click', () => printLabDoc(false));

    // Mark as wired so setupLabFallback doesn't double-wire
    const genBtn = document.getElementById('lab-gen-btn');
    if (genBtn) genBtn._labModuleWired = true;

    updateLabTopicSelect('physics');
    if (window.lucide) lucide.createIcons();
  }, 200);
}

function updateLabTopicSelect(subject) {
  const select = document.getElementById('lab-topic');
  if (!select) return;
  const grade = labState.grade || '8';
  const topics = TOPICS[subject] || [];
  select.innerHTML = '';

  const rec = topics.filter(t => t.grades.includes(grade));
  const oth = topics.filter(t => !t.grades.includes(grade));

  if (rec.length) {
    const grp = document.createElement('optgroup');
    grp.label = `Рекомендовано · ${grade} класс`;
    rec.forEach(t => {
      const opt = document.createElement('option'); opt.value = t.value; opt.textContent = t.label;
      grp.appendChild(opt);
    });
    select.appendChild(grp);
  }
  if (oth.length) {
    const grp = document.createElement('optgroup');
    grp.label = 'Другие классы';
    oth.forEach(t => {
      const opt = document.createElement('option'); opt.value = t.value;
      opt.textContent = `${t.label} (${t.grades.join(', ')} кл.)`;
      grp.appendChild(opt);
    });
    select.appendChild(grp);
  }

  const def = rec[0] || topics[0];
  if (def) { select.value = def.value; labState.topic = def.value; }
}

async function generateLab() {
  const apiKey = getApiKey();
  if (!apiKey) { showGlassError('API ключ не найден'); return; }

  const { subject, grade, topic, labType } = labState;
  const topicData = (TOPICS[subject] || []).find(t => t.value === topic);
  const topicLabel = topicData?.label || topic;
  const topicDetail = topicData?.detail || '';
  const requirements = document.getElementById('lab-requirements')?.value?.trim() || '';

  const typeLabels = {
    measurement: 'измерительная (определить физическую величину)',
    investigation: 'исследовательская (изучить зависимость)',
    verification: 'проверочная (верифицировать закон или теорему)',
    simulation: 'компьютерная симуляция или модель',
  };

  const subjectLabel = subject === 'physics' ? 'физике' : 'информатике';
  const prompt = `Создай полную лабораторную работу по ${subjectLabel} для ${grade} класса.
Тема: «${topicLabel}»${topicDetail ? ` — ${topicDetail}` : ''}
Тип: ${typeLabels[labType] || typeLabels.measurement}
${requirements ? `Дополнительно: ${requirements}` : ''}

Верни строго валидный JSON согласно инструкции.`;

  const btn = document.getElementById('lab-gen-btn');
  const result = document.getElementById('lab-result');
  btn.disabled = true; btn.classList.add('shimmer');
  result.innerHTML = `
    <div class="output-empty">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <p style="margin-top:14px;color:var(--text-3);font-size:13px">Составляю лабораторную работу…</p>
    </div>`;

  try {
    const response = await callQuasarAI(apiKey, MODEL_REASONING, SYSTEM_LAB,
      [{ role: 'user', content: prompt }]
    );
    const text = response.choices[0].message.content;
    const clean = text.replace(/^```json\s*|```\s*$/gm, '').trim();
    const data = await parseJsonWithRepair(apiKey, clean);
    labState.data = data;
    renderLabOutput(data, result);
  } catch (err) {
    result.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i>
      <p style="text-align:center;margin-top:10px">${friendlyError(err)}</p></div>`;
    document.dispatchEvent(new Event('qs:icons'));
  } finally {
    btn.disabled = false; btn.classList.remove('shimmer');
  }
}

function renderLabOutput(data, container) {
  container.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.style.cssText = 'padding:16px 18px;border-bottom:1px solid var(--border)';
  header.innerHTML = `
    <div style="font-size:16px;font-weight:400;letter-spacing:-0.01em;margin-bottom:6px">${escapeHtml(data.title || 'Лабораторная работа')}</div>
    <div style="font-size:12px;color:var(--text-3);font-weight:300">
      ${escapeHtml(data.subject || '')} · ${escapeHtml(data.grade || '')} класс
    </div>`;
  container.appendChild(header);

  const doc = document.createElement('div');
  doc.className = 'lab-doc';

  const sectionDefs = [
    {
      key: 'objective', icon: 'target', iconCls: 'lab-icon-obj', title: 'Цель работы', render: d => `<div style="font-size:14px;font-weight:300;line-height:1.8">${formatContent(d.objective || '')}</div>` +
        (d.hypothesis ? `<div style="font-size:13px;font-weight:300;color:var(--text-2);margin-top:8px;padding:8px 12px;background:rgba(41,121,255,0.05);border-radius:var(--radius-xs);border:1px solid rgba(41,121,255,0.12)"><strong>Гипотеза:</strong> ${escapeHtml(d.hypothesis)}</div>` : '')
    },
    { key: 'equipment', icon: 'wrench', iconCls: 'lab-icon-eq', title: 'Оборудование', render: d => (d.equipment || []).map(e => `<div style="font-size:13px;font-weight:300;padding:3px 0 3px 12px;border-left:1.5px solid var(--teal-dim);color:var(--text-2)">· ${escapeHtml(e)}</div>`).join('') },
    { key: 'safety', icon: 'shield-alert', iconCls: 'lab-icon-safe', title: 'Техника безопасности', render: d => (d.safety || []).map(s => `<div style="font-size:12.5px;font-weight:300;color:rgba(255,80,100,0.8);padding:3px 0 3px 12px">⚠ ${escapeHtml(s)}</div>`).join('') },
    {
      key: 'procedure', icon: 'list-ordered', iconCls: 'lab-icon-proc', title: 'Ход работы', render: d => (d.procedure || []).map(s => `
        <div style="display:flex;gap:10px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
          <div style="font-size:10px;font-weight:600;color:var(--amber);min-width:22px;padding-top:3px">${s.step}.</div>
          <div>
            <div style="font-size:13.5px;font-weight:300;line-height:1.75">${formatContent(s.action || '')}</div>
            ${s.note ? `<div style="font-size:12px;font-style:italic;color:var(--text-3);margin-top:2px">${escapeHtml(s.note)}</div>` : ''}
          </div>
        </div>`).join('')
    },
    { key: 'dataTable', icon: 'table', iconCls: 'lab-icon-data', title: 'Таблица данных', render: d => renderLabDataTable(d.dataTable) },
  ];

  sectionDefs.forEach((def, i) => {
    const sec = document.createElement('div');
    sec.className = 'lab-section';
    sec.style.animationDelay = `${i * 0.06}s`;
    sec.innerHTML = `
      <div class="lab-section-header">
        <div class="lab-section-icon ${def.iconCls}"><i data-lucide="${def.icon}"></i></div>
        <div class="lab-section-title">${def.title}</div>
      </div>
      <div class="lab-section-body">${def.render(data)}</div>`;
    doc.appendChild(sec);
  });

  // Analysis questions
  if (data.analysisQuestions?.length) {
    const aq = document.createElement('div');
    aq.className = 'lab-section';
    aq.style.animationDelay = `${sectionDefs.length * 0.06}s`;
    aq.innerHTML = `
      <div class="lab-section-header">
        <div class="lab-section-icon lab-icon-eq"><i data-lucide="help-circle"></i></div>
        <div class="lab-section-title">Вопросы для анализа</div>
      </div>
      <div class="lab-section-body">
        ${data.analysisQuestions.map((q, qi) => `
          <div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
            <div style="font-size:10px;font-weight:600;color:var(--teal);min-width:18px;padding-top:3px">${qi + 1}.</div>
            <div style="font-size:13.5px;font-weight:300;line-height:1.75">${formatContent(q)}</div>
          </div>`).join('')}
      </div>`;
    doc.appendChild(aq);
  }

  // Teacher-only section
  if (data.expectedResult || data.teacherTips?.length) {
    const tc = document.createElement('div');
    tc.className = 'lab-section';
    tc.style.cssText = `animation-delay:${(sectionDefs.length + 1) * 0.06}s;border-color:rgba(255,190,60,0.2);background:rgba(255,190,60,0.04)`;
    tc.innerHTML = `
      <div class="lab-section-header">
        <div class="lab-section-icon" style="background:rgba(255,190,60,0.12);color:var(--amber)"><i data-lucide="user-check"></i></div>
        <div class="lab-section-title" style="color:var(--amber)">Только для учителя</div>
      </div>
      <div class="lab-section-body">
        ${data.expectedResult ? `<div style="font-size:13.5px;font-weight:300;line-height:1.8;margin-bottom:10px"><strong style="color:var(--amber)">Ожидаемый результат:</strong> ${formatContent(data.expectedResult)}</div>` : ''}
        ${(data.teacherTips || []).map(tip => `
          <div class="md-concept" style="border-left-color:rgba(255,190,60,0.5)">
            <span class="concept-key" style="color:var(--amber)">Совет:</span> ${escapeHtml(tip)}
          </div>`).join('')}
      </div>`;
    doc.appendChild(tc);
  }

  // Rubric
  if (data.rubric?.length) {
    const rc = document.createElement('div');
    rc.className = 'lab-section';
    rc.innerHTML = `
      <div class="lab-section-header">
        <div class="lab-section-icon lab-icon-obj"><i data-lucide="clipboard-check"></i></div>
        <div class="lab-section-title">Критерии оценивания</div>
      </div>
      <div class="lab-section-body">${buildRubricHtml(data.rubric)}</div>`;
    doc.appendChild(rc);
  }

  container.appendChild(doc);
  renderKaTeX(container);
  if (window.lucide) lucide.createIcons();
}

function renderLabDataTable(dt) {
  if (!dt || !dt.columns?.length) return '<p style="font-size:13px;color:var(--text-3)">Нет данных</p>';

  const cols = dt.columns;
  const rows = dt.rows || 6;

  let html = `<div style="overflow-x:auto"><table class="lab-data-table">
    <thead><tr>
      <th>№</th>
      ${cols.map(c => `<th>${escapeHtml(c)}</th>`).join('')}
    </tr></thead>
    <tbody>`;

  for (let r = 1; r <= rows; r++) {
    html += `<tr><td style="color:var(--text-3);text-align:center">${r}</td>`;
    cols.forEach(() => { html += `<td class="empty-cell"></td>`; });
    html += `</tr>`;
  }

  html += `</tbody></table></div>`;
  return html;
}


// ╔═══════════════════════════════════════════════════════╗
// ║  LAB PRINT (Split Teacher / Student)                  ║
// ╚═══════════════════════════════════════════════════════╝

function printLabDoc(teacherView) {
  const data = labState.data;
  if (!data) { showToast('Сначала сгенерируйте лабораторную'); return; }

  const date = new Date().toLocaleDateString('ru-RU');
  const badge = teacherView ? 'lab' : 'student';
  const ver = teacherView ? 'ВЕРСИЯ УЧИТЕЛЯ' : 'ВЕРСИЯ УЧЕНИКА';

  let html = `
    <div class="pa-title">${escapeHtml(data.title || 'Лабораторная работа')}</div>
    <div class="pa-meta">
      <span class="pa-badge pa-badge-${badge}">${ver}</span>
      ${escapeHtml(data.subject || '')} · ${escapeHtml(data.grade || '')} класс · ${date}
    </div>`;

  // Name / Date fields for student
  if (!teacherView) {
    html += `<div style="margin-bottom:6mm;display:flex;gap:20mm">
      <div>Фамилия Имя: <span style="border-bottom:1px solid #999;display:inline-block;width:60mm">&nbsp;</span></div>
      <div>Дата: <span style="border-bottom:1px solid #999;display:inline-block;width:30mm">&nbsp;</span></div>
    </div>`;
  }

  // Objective
  html += `<div class="pa-lab-section">
    <div class="pa-lab-title">Цель работы</div>
    <div>${formatContent(data.objective || '')}</div>
    ${data.hypothesis ? `<div style="margin-top:2mm;font-style:italic"><strong>Гипотеза:</strong> ${escapeHtml(data.hypothesis)}</div>` : ''}
  </div>`;

  // Equipment
  html += `<div class="pa-lab-section">
    <div class="pa-lab-title">Оборудование</div>
    <ul>${(data.equipment || []).map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ul>
  </div>`;

  // Safety
  if (data.safety?.length) {
    html += `<div class="pa-lab-section">
      <div class="pa-lab-title">Техника безопасности</div>
      <div class="lab-print-safety">${data.safety.map(s => `⚠ ${escapeHtml(s)}`).join('<br>')}</div>
    </div>`;
  }

  // Procedure
  html += `<div class="pa-lab-section">
    <div class="pa-lab-title">Ход работы</div>
    <ol>${(data.procedure || []).map(s => `<li>${escapeHtml(s.action || '')}${teacherView && s.note ? `<br><em style="color:#888;font-size:9pt">${escapeHtml(s.note)}</em>` : ''}</li>`).join('')}</ol>
  </div>`;

  // Data table
  if (data.dataTable?.columns?.length) {
    const cols = data.dataTable.columns;
    const rows = data.dataTable.rows || 6;
    html += `<div class="pa-lab-section">
      <div class="pa-lab-title">Таблица результатов</div>
      <table class="pa-data-table">
        <thead><tr><th>№</th>${cols.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
        <tbody>${Array.from({ length: rows }, (_, i) => `<tr><td style="text-align:center">${i + 1}</td>${cols.map(() => `<td class="empty-cell">&nbsp;</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>`;
  }

  // Analysis questions
  if (data.analysisQuestions?.length) {
    html += `<div class="pa-lab-section">
      <div class="pa-lab-title">Вопросы для анализа</div>
      <ol>${data.analysisQuestions.map(q => `<li>${formatContent(q)}</li>`).join('')}</ol>
    </div>`;

    if (!teacherView) {
      html += `<div class="pa-lab-section">
        <div class="pa-lab-title">Выводы</div>
        <div class="pa-workspace" style="height:40mm"></div>
      </div>`;
    }
  }

  // Teacher-only
  if (teacherView) {
    if (data.expectedResult) {
      html += `<div class="pa-answer"><strong>Ожидаемый результат:</strong> ${formatContent(data.expectedResult)}</div>`;
    }
    if (data.teacherTips?.length) {
      data.teacherTips.forEach(tip => {
        html += `<div class="pa-tip">💡 ${escapeHtml(tip)}</div>`;
      });
    }
    if (data.rubric?.length) {
      const total = data.rubric.reduce((s, r) => s + (r.points || 0), 0);
      html += `<div class="pa-rubric" style="margin-top:5mm">
        <div class="pa-lab-title">Критерии оценивания · Итого: ${total} б.</div>
        <table><thead><tr><th>Критерий</th><th>Описание</th><th>Баллы</th></tr></thead>
        <tbody>${data.rubric.map(r => `<tr><td>${escapeHtml(r.criterion || '')}</td><td>${escapeHtml(r.description || '')}</td><td>${r.points || 0}</td></tr>`).join('')}</tbody>
        </table>
      </div>`;
    }
  }

  html += `<div class="pa-footer">
    <span>Quasar Study Nexus · @ihatehates &amp; @khkirill</span>
    <span>${date}</span>
  </div>`;

  doPrint(html);
}


// ╔═══════════════════════════════════════════════════════╗
// ║  VARIABLE SWAP — instant regenerate same logic        ║
// ╚═══════════════════════════════════════════════════════╝

function extendVariableSwap() {
  // Add "Swap Variables" quick button to task cards when they are rendered
  // We use a MutationObserver to detect new task cards
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        // Find task cards without a swap btn already
        const cards = node.classList?.contains('task-card')
          ? [node]
          : Array.from(node.querySelectorAll?.('.task-card') || []);
        cards.forEach(attachSwapButton);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function attachSwapButton(card) {
  if (card._swapAttached) return;
  card._swapAttached = true;

  const toolbar = card.querySelector('.task-toolbar');
  if (!toolbar) return;

  const swapBtn = document.createElement('button');
  swapBtn.className = 'task-icon-btn varswap-btn';
  swapBtn.title = 'Сменить числа (та же логика)';
  swapBtn.innerHTML = `<i data-lucide="shuffle"></i>`;
  if (window.lucide) lucide.createIcons();

  swapBtn.addEventListener('click', async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    const condEl = card.querySelector('.task-condition');
    if (!condEl) return;

    const originalText = condEl.innerText || condEl.textContent || '';
    swapBtn.classList.add('loading');
    swapBtn.disabled = true;

    const prompt = `Возьми эту задачу и сгенерируй новую версию с ДРУГИМИ числовыми значениями, но ТОЖДЕСТВЕННОЙ структурой, логикой и уровнем сложности. Верни ТОЛЬКО JSON объект (НЕ массив) с теми же полями: num, condition, hint, solution, answer, rubric.

Исходная задача:
${originalText}`;

    try {
      const response = await callQuasarAI(apiKey, MODEL_REASONING, SYSTEM_GENERATOR,
        [{ role: 'user', content: prompt }]
      );
      const text = response.choices[0].message.content;
      const clean = text.replace(/^```json\s*|```\s*$/gm, '').trim();
      let parsed = await parseJsonWithRepair(apiKey, clean);
      // Handle if AI returns array
      if (Array.isArray(parsed)) parsed = parsed[0];

      // Get the task index from card to reuse renderStructuredTaskCard
      const idx = parseInt(card.dataset.taskIndex ?? '0', 10);
      parsed.num = parsed.num || (idx + 1);

      const newCard = renderStructuredTaskCard(parsed, idx);
      newCard.dataset.taskIndex = card.dataset.taskIndex;
      newCard._swapAttached = true;

      card.parentNode?.replaceChild(newCard, card);
      renderKaTeX(newCard);
      if (window.Prism) newCard.querySelectorAll('pre code').forEach(b => Prism.highlightElement(b));
      if (window.lucide) lucide.createIcons();
      showToast('Числа изменены — та же логика задачи');
    } catch (err) {
      showGlassError(friendlyError(err));
      swapBtn.classList.remove('loading');
      swapBtn.disabled = false;
    }
  });

  // Insert before existing first button in toolbar
  toolbar.insertBefore(swapBtn, toolbar.firstChild);
}


// ╔═══════════════════════════════════════════════════════╗
// ║  QR HINT MODE OVERLAY                                 ║
// ║  Activated via URL hash #hint= or manual trigger      ║
// ╚═══════════════════════════════════════════════════════╝

function setupQrHintOverlay() {
  // Inject overlay HTML
  const overlay = document.createElement('div');
  overlay.id = 'qr-hint-overlay';
  overlay.className = 'qr-hint-overlay hidden';
  overlay.innerHTML = `
    <div class="qr-hint-card glass-card">
      <div class="qr-hint-header">
        <div>
          <div class="qr-hint-badge">
            <i data-lucide="lightbulb"></i>
            <span class="qr-hint-badge-text">Подсказка</span>
          </div>
          <div class="qr-hint-title" id="qr-hint-task-label">Задача</div>
        </div>
        <button class="btn-icon" id="qr-hint-close"><i data-lucide="x"></i></button>
      </div>
      <div class="qr-hint-body" id="qr-hint-body"></div>
      <div class="qr-hint-footer">Подсказка — не ответ. Попробуй сам.</div>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById('qr-hint-close')?.addEventListener('click', () => {
    overlay.classList.add('hidden');
    // Clean URL hash
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });

  // Check on load if URL has #hint= hash (from QR scan)
  checkQrHintHash();
  window.addEventListener('hashchange', checkQrHintHash);

  if (window.lucide) lucide.createIcons();
}

function checkQrHintHash() {
  const hash = window.location.hash;
  if (!hash.startsWith('#hint=')) return;

  try {
    const encoded = hash.slice(6);
    const decodedB64 = decodeURIComponent(encoded);
    const decodedStr = decodeURIComponent(escape(atob(decodedB64)));
    const payload = JSON.parse(decodedStr);

    showQrHintMode(payload.hint || payload.condition || 'Нет подсказки', payload.label || 'Задача');
    // Clean hash after showing
    setTimeout(() => {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }, 200);
  } catch (_) {
    // Ignore malformed hash
  }
}

function showQrHintMode(hintText, label) {
  const overlay = document.getElementById('qr-hint-overlay');
  const body = document.getElementById('qr-hint-body');
  const taskLbl = document.getElementById('qr-hint-task-label');
  if (!overlay || !body) return;

  taskLbl.textContent = label || 'Задача';
  body.innerHTML = formatContent(hintText);
  overlay.classList.remove('hidden');
  renderKaTeX(body);
  document.dispatchEvent(new Event('qs:icons'));
}

// Extend openQrModal to encode hint-mode URL into QR
const _origOpenQrModal = typeof openQrModal === 'function' ? openQrModal : null;
if (_origOpenQrModal) {
  // Monkey-patch the QR generation to use hint-mode URL
  const _origGenerateQrOnCanvas = generateQrOnCanvas;
  window.generateQrOnCanvas = function (text, canvasId) {
    // If we're in hint mode tab, generate a URL QR pointing to this page with hint payload
    if (state.qrTask && canvasId === 'qr-canvas') {
      const activeTab = document.querySelector('.qr-tab.active');
      if (activeTab?.dataset.qrType === 'hint') {
        try {
          const payload = {
            hint: (state.qrTask.hint || state.qrTask.condition || '').substring(0, 150),
            label: state.qrTask.label || 'Задача',
          };
          const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
          const encoded = encodeURIComponent(b64);
          const hintUrl = `${window.location.href.split('#')[0]}#hint=${encoded}`;

          const canvas = document.getElementById(canvasId);
          if (canvas && window.QRCode) {
            canvas.innerHTML = '';
            new QRCode(canvas, {
              text: hintUrl,
              width: 220,
              height: 220,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.L
            });
          }
          return;
        } catch (_) { /* fallback */ }
      }
    }
    _origGenerateQrOnCanvas(text, canvasId);
  };
}


// ╔═══════════════════════════════════════════════════════╗
// ║  PRINT PREVIEW MODAL (wrapper for split-print)        ║
// ╚═══════════════════════════════════════════════════════╝

function setupPrintPreviewModal() {
  // Inject print preview modal
  const modal = document.createElement('div');
  modal.id = 'print-preview-modal';
  modal.className = 'print-preview-modal hidden';
  modal.innerHTML = `
    <div class="print-preview-header" style="max-width:860px">
      <div class="print-preview-tabs" id="print-preview-tabs">
        <button class="print-tab active" data-view="teacher">
          <i data-lucide="user-check"></i> Учитель
        </button>
        <button class="print-tab" data-view="student">
          <i data-lucide="user"></i> Ученик
        </button>
      </div>
      <div class="print-preview-actions">
        <button class="btn-primary" id="print-preview-print-btn">
          <i data-lucide="printer"></i> Печатать
        </button>
        <button class="btn-icon" id="print-preview-close"><i data-lucide="x"></i></button>
      </div>
    </div>
    <div id="print-sheet-area" style="width:100%;max-width:860px"></div>`;
  document.body.appendChild(modal);

  document.getElementById('print-preview-close')?.addEventListener('click', () =>
    modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

  if (window.lucide) lucide.createIcons();
}

// Expose helper for other modules
window.openPrintPreview = function (teacherHtml, studentHtml, title) {
  const modal = document.getElementById('print-preview-modal');
  const sheetArea = document.getElementById('print-sheet-area');
  const tabs = document.querySelectorAll('#print-preview-tabs .print-tab');
  if (!modal || !sheetArea) return;

  let currentView = 'teacher';
  function renderView() {
    sheetArea.innerHTML = currentView === 'teacher' ? teacherHtml : studentHtml;
    renderKaTeX(sheetArea);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentView = tab.dataset.view;
      renderView();
    });
  });

  document.getElementById('print-preview-print-btn').onclick = () => {
    doPrint(sheetArea.innerHTML);
  };

  renderView();
  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
};
/* ═══════════════════════════════════════════════════════════
   QUASAR STUDY — hero_patch.js
   Replaces hero text content with premium Apple-style layout.
   Append this to the end of app.js (after nexus patch).
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  if (window.__QS_LOCKED__) return;
  upgradeHeroContent();
});

function upgradeHeroContent() {
  const heroContent = document.getElementById('hero-content');
  if (!heroContent) return;

  // Replace all inner content with clean premium markup
  heroContent.innerHTML = `
    <h1 class="hero-title">
      Quasar&thinsp;Study
      <span class="hero-title-sub">Titan Edition · Physics &amp; Informatics</span>
    </h1>
  `;

  // Remove scroll hint arrow if it exists outside hero-content
  const scrollHint = document.getElementById('hero-scroll-hint');
  if (scrollHint) scrollHint.remove();
}
/* ═══════════════════════════════════════════════════════════
   QUASAR STUDY — app_infinity.js  INFINITY UPGRADE
   Exam Engine (A/B variants, ETA, auto-rubric, split-print)
   Hero fix (nav always visible)
   Production print (header fields, serif, A4)
   Lesson Script (minute-by-minute)
   @ihatehates & @khkirill
═══════════════════════════════════════════════════════════ */

// ╔═══════════════════════════════════════════════════════╗
// ║  EXAM ENGINE STATE                                    ║
// ╚═══════════════════════════════════════════════════════╝

const eeState = {
  subject: 'physics',
  grade: '9',
  topic: '',
  difficulty: 'easy',
  count: 5,
  variant: 'both',
  variantA: [],
  variantB: [],
  activeTab: 'A',
  loading: false,
};

const SYSTEM_EXAM_ENGINE = `You are an expert exam generator for Physics and Computer Science (grades 7–11).
Return ONLY valid JSON — no markdown fences, no preamble, no trailing text.

Return an object with two keys: "variantA" and "variantB".
Each is an array of task objects with EXACTLY these fields:
{
  "num": <integer>,
  "condition": "<full problem statement — LaTeX for physics, code spec for CS>",
  "hint": "<Socratic hint>",
  "solution": "<full step-by-step solution>",
  "answer": "<final answer with units>",
  "rubric": [{"criterion":"<text>","points":<int>,"description":"<text>"}],
  "eta_minutes": <estimated student solve time in minutes>
}

VARIANT RULES:
- Variants A and B must have IDENTICAL difficulty and topic coverage.
- Variant B must use DIFFERENT numerical values, parameters, and initial conditions from Variant A.
- All LaTeX must be valid KaTeX-compatible syntax.
- Physics: Always include "Дано:" and "Найти:". Use realistic SI values.
- CS: Include Input/Output examples. PEP 8 Python with comments.
- Minimum 3 rubric rows per task.
- solution must end with "## Типичные ошибки".`;


// ╔═══════════════════════════════════════════════════════╗
// ║  EXAM ENGINE SETUP                                    ║
// ╚═══════════════════════════════════════════════════════╝

document.addEventListener('DOMContentLoaded', () => {
  if (window.__QS_LOCKED__) return;
  // Small delay to ensure base DOMContentLoaded handlers ran first
  setTimeout(() => {
    fixHeroNav();
    fixQrHintClose();
  }, 100);
});

function fixHeroNav() {
  // The hero is now compact — ensure nav is always sticky & visible
  const hero = document.getElementById('hero');
  if (hero) {
    hero.style.height = 'clamp(180px, 38vh, 340px)';
    hero.style.minHeight = '180px';
    hero.style.maxHeight = '340px';
  }
}

function fixQrHintClose() {
  // Wire close button if it exists in HTML (not just JS-injected)
  const btn = document.getElementById('qr-hint-close');
  if (btn) {
    btn.addEventListener('click', () => {
      const overlay = document.getElementById('qr-hint-overlay');
      if (overlay) overlay.classList.add('hidden');
    });
  }
}

function setupExamEngine() {
  // Subject
  setupSegmentedFor('ee-subject', val => {
    eeState.subject = val;
    updateExamTopicSelect(val);
  });

  // Grade
  setupSegmentedFor('ee-grade', val => {
    eeState.grade = val;
    updateExamTopicSelect(eeState.subject);
  });

  // Difficulty
  setupSegmentedFor('ee-difficulty', val => { eeState.difficulty = val; });

  // Variant toggle
  setupSegmentedFor('ee-variant-toggle', val => { eeState.variant = val; });

  // Count slider
  const countSlider = document.getElementById('ee-count');
  const countVal = document.getElementById('ee-count-val');
  if (countSlider) {
    countSlider.addEventListener('input', () => {
      eeState.count = parseInt(countSlider.value, 10);
      if (countVal) countVal.textContent = countSlider.value;
      const pct = ((countSlider.value - 3) / 7) * 100;
      countSlider.style.background = `linear-gradient(to right, var(--accent) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
    });
  }

  // Topic select
  document.getElementById('ee-topic')?.addEventListener('change', e => {
    eeState.topic = e.target.value;
  });

  // Generate button
  document.getElementById('ee-gen-btn')?.addEventListener('click', generateExamEngine);

  // Variant tabs
  document.querySelectorAll('#ee-variant-tabs .ee-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#ee-variant-tabs .ee-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      eeState.activeTab = tab.dataset.variant;
      renderExamVariant(eeState.activeTab);
    });
  });

  // Print buttons
  document.getElementById('ee-print-teacher')?.addEventListener('click', () => printExamEngine(true));
  document.getElementById('ee-print-student')?.addEventListener('click', () => printExamEngine(false));

  updateExamTopicSelect('physics');
  if (window.lucide) lucide.createIcons();
}

function setupSegmentedFor(containerId, callback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.setAttribute('role', 'tablist');
  container.querySelectorAll('.seg-btn').forEach(btn => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
    btn.addEventListener('click', () => {
      container.querySelectorAll('.seg-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      callback(btn.dataset.val);
    });
  });
}

function updateExamTopicSelect(subject) {
  const select = document.getElementById('ee-topic');
  if (!select) return;
  const grade = eeState.grade || '9';
  const topics = TOPICS[subject] || [];
  select.innerHTML = '';

  const forGrade = topics.filter(t => t.grades.includes(grade));
  if (forGrade.length) {
    forGrade.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.value; opt.textContent = t.label;
      select.appendChild(opt);
    });
  } else {
    const opt = document.createElement('option');
    opt.value = ''; opt.textContent = 'Нет тем для этого класса';
    select.appendChild(opt);
  }

  const def = forGrade[0];
  if (def) { select.value = def.value; eeState.topic = def.value; }
}


// ╔═══════════════════════════════════════════════════════╗
// ║  EXAM GENERATION (A + B variants)                     ║
// ╚═══════════════════════════════════════════════════════╝

async function generateExamEngine() {
  if (eeState.loading) return;

  const apiKey = getApiKey();
  if (!apiKey) { showGlassError('API ключ не найден'); return; }

  const { subject, grade, difficulty, topic, count, variant } = eeState;
  const topicData = (TOPICS[subject] || []).find(t => t.value === topic);
  const topicLabel = topicData?.label || topic;
  const topicDetail = topicData?.detail || topic;

  const diffLabels = {
    easy: 'базовый — прямое применение одной формулы',
    medium: 'средний — несколько шагов, нестандартное применение',
    olympiad: 'олимпиадный — многошаговый вывод, нестандартные приёмы',
  };

  const subLabel = subject === 'physics' ? 'физике' : 'информатике';
  const variantsNeeded = variant === 'both' ? 'оба варианта (A и B)' : `только вариант ${variant}`;

  const prompt = `Сгенерируй экзаменационный тест по ${subLabel}, ${grade} класс.
Тема: «${topicLabel}» — ${topicDetail}
Сложность: ${diffLabels[difficulty]}
Количество задач в каждом варианте: ${count}
Варианты: ${variantsNeeded}

Верни СТРОГО валидный JSON объект: { "variantA": [...], "variantB": [...] }
Если нужен только один вариант — другой сделай пустым массивом [].
Каждый объект задачи: num, condition, hint, solution, answer, rubric (мин. 3 строки), eta_minutes.`;

  eeState.loading = true;
  const btn = document.getElementById('ee-gen-btn');
  const result = document.getElementById('ee-result');
  if (btn) { btn.disabled = true; btn.classList.add('shimmer'); }
  result.innerHTML = `
    <div class="output-empty">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <p style="margin-top:14px;color:var(--text-3);font-size:13px">Quasar AI генерирует варианты A и B…</p>
    </div>`;

  try {
    const response = await callQuasarAI(apiKey, MODEL_REASONING, SYSTEM_EXAM_ENGINE,
      [{ role: 'user', content: prompt }]
    );
    const text = response.choices[0].message.content;
    const clean = text.replace(/^```json\s*|```\s*$/gm, '').trim();
    const data = await parseJsonWithRepair(apiKey, clean);

    eeState.variantA = Array.isArray(data.variantA) ? data.variantA : [];
    eeState.variantB = Array.isArray(data.variantB) ? data.variantB : [];

    // Show variant tabs
    const tabs = document.getElementById('ee-variant-tabs');
    if (tabs) tabs.classList.remove('hidden');

    // ETA calculation
    showExamEta();

    // Render active variant
    eeState.activeTab = variant === 'B' ? 'B' : 'A';
    document.querySelectorAll('#ee-variant-tabs .ee-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.variant === eeState.activeTab);
    });
    renderExamVariant(eeState.activeTab);

  } catch (err) {
    result.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i><p style="text-align:center;margin-top:10px">${friendlyError(err)}</p></div>`;
    document.dispatchEvent(new Event('qs:icons'));
  } finally {
    eeState.loading = false;
    if (btn) { btn.disabled = false; btn.classList.remove('shimmer'); }
    if (window.lucide) lucide.createIcons();
  }
}

function showExamEta() {
  const etaEl = document.getElementById('ee-eta');
  const etaValue = document.getElementById('ee-eta-value');
  if (!etaEl || !etaValue) return;

  const allTasks = [...eeState.variantA, ...eeState.variantB];
  const validEtas = allTasks.map(t => t.eta_minutes || 0).filter(m => m > 0);
  if (!validEtas.length) return;

  const avgPerVariant = Math.round(validEtas.slice(0, eeState.variantA.length).reduce((a, b) => a + b, 0));
  etaValue.textContent = `ETA: ~${avgPerVariant} мин`;
  etaEl.classList.remove('hidden');
}

function renderExamVariant(variant) {
  const result = document.getElementById('ee-result');
  if (!result) return;

  const tasks = variant === 'A' ? eeState.variantA : eeState.variantB;

  if (!tasks || tasks.length === 0) {
    result.innerHTML = `<div class="output-empty"><i data-lucide="file-x"></i><p>Вариант ${variant} не был сгенерирован</p></div>`;
    document.dispatchEvent(new Event('qs:icons'));
    return;
  }

  result.innerHTML = '';

  // Variant badge header
  const badge = document.createElement('div');
  badge.innerHTML = `<div class="variant-badge variant-badge-${variant}">
    <i data-lucide="layers"></i> Вариант ${variant}
  </div>`;
  result.appendChild(badge);

  tasks.forEach((task, i) => {
    const card = renderStructuredTaskCard(task, i);
    // Add ETA chip to each card header
    if (task.eta_minutes) {
      const header = card.querySelector('.task-card-header');
      if (header) {
        const etaChip = document.createElement('span');
        etaChip.style.cssText = `font-size:10px;color:var(--teal);font-weight:300;opacity:0.7;margin-left:auto;margin-right:8px`;
        etaChip.textContent = `~${task.eta_minutes} мин`;
        const toolbar = header.querySelector('.task-toolbar');
        if (toolbar) header.insertBefore(etaChip, toolbar);
      }
    }
    result.appendChild(card);
    renderKaTeX(card);
    if (window.Prism) card.querySelectorAll('pre code').forEach(b => Prism.highlightElement(b));
  });

  if (window.lucide) lucide.createIcons();
}


// ╔═══════════════════════════════════════════════════════╗
// ║  EXAM ENGINE PRINT (Split Teacher / Student)          ║
// ╚═══════════════════════════════════════════════════════╝

function printExamEngine(teacherView) {
  const varA = eeState.variantA;
  const varB = eeState.variantB;

  if (!varA.length && !varB.length) {
    showToast('Сначала сгенерируйте экзамен');
    return;
  }

  const date = new Date().toLocaleDateString('ru-RU');
  const sub = eeState.subject === 'physics' ? 'Физика' : 'Информатика';
  const grade = eeState.grade;
  const topicData = (TOPICS[eeState.subject] || []).find(t => t.value === eeState.topic);
  const topicLabel = topicData?.label || eeState.topic;

  function buildVariantHtml(tasks, variantLetter) {
    if (!tasks || !tasks.length) return '';

    const headerFields = teacherView ? '' : `
      <div style="margin-bottom:7mm;display:grid;grid-template-columns:1fr 1fr;gap:5mm;border-bottom:2px solid #000;padding-bottom:4mm">
        <div style="display:flex;align-items:flex-end;gap:3mm;border-bottom:1px solid #555;padding-bottom:1mm">
          <strong style="font-size:9pt;white-space:nowrap">Фамилия Имя:</strong>
          <span style="flex:1"></span>
        </div>
        <div style="display:flex;align-items:flex-end;gap:3mm;border-bottom:1px solid #555;padding-bottom:1mm">
          <strong style="font-size:9pt;white-space:nowrap">Класс:</strong>
          <span style="flex:1"></span>
        </div>
        <div style="display:flex;align-items:flex-end;gap:3mm;border-bottom:1px solid #555;padding-bottom:1mm">
          <strong style="font-size:9pt;white-space:nowrap">Дата:</strong>
          <span style="flex:1"></span>
        </div>
        <div style="display:flex;align-items:flex-end;gap:3mm;border-bottom:1px solid #555;padding-bottom:1mm">
          <strong style="font-size:9pt;white-space:nowrap">Вариант:</strong>
          <span style="font-weight:700;font-size:11pt">&nbsp;${variantLetter}</span>
        </div>
      </div>`;

    const verBadge = teacherView
      ? `<span style="display:inline-block;background:#d97706;color:#fff;font-size:7pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:2px 8px;border-radius:3px;margin-right:8px">УЧИТЕЛЬ</span>`
      : `<span style="display:inline-block;background:#2979ff;color:#fff;font-size:7pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:2px 8px;border-radius:3px;margin-right:8px">УЧЕНИК</span>`;

    // ETA total
    const totalEta = tasks.reduce((s, t) => s + (t.eta_minutes || 0), 0);
    const etaStr = totalEta > 0 ? ` · ETA: ~${totalEta} мин` : '';

    let html = `
      <div style="border-bottom:2px solid #000;padding-bottom:4mm;margin-bottom:6mm;display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          ${verBadge}
          <span style="font-size:16pt;font-weight:700;font-family:Georgia,serif">${sub} · Вариант ${variantLetter}</span>
          <div style="font-size:9pt;color:#555;margin-top:2mm">${grade} класс · ${topicLabel}${etaStr} · ${date}</div>
        </div>
      </div>
      ${headerFields}`;

    tasks.forEach((task, i) => {
      const condHtml = formatContent(task.condition || '');
      html += `<div class="task-print" style="margin-bottom:7mm;padding-bottom:5mm;border-bottom:1px solid #bbb;page-break-inside:avoid">
        <div class="task-print-num" style="font-size:8pt;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#555;margin-bottom:2mm">Задача ${i + 1}</div>
        <div style="font-size:11pt;line-height:1.75;color:#000">${condHtml}</div>`;

      if (!teacherView) {
        html += `<div style="margin-top:3mm;height:28mm;background:repeating-linear-gradient(transparent,transparent 7.5mm,#e0e0e0 7.5mm,#e0e0e0 8mm);border:1px dashed #ccc;border-radius:4px"></div>`;
      }

      if (teacherView && task.solution) {
        html += `<div style="margin-top:3mm;padding:3mm 5mm;background:#fff8e8;border-left:3px solid #d97706;font-size:10pt;color:#333">
          <strong>Решение:</strong> ${formatContent(task.solution)}
        </div>
        <div style="margin-top:2mm;padding:2mm 5mm;background:#eef5ff;border-left:3px solid #2979ff;font-size:10pt;color:#333">
          <strong>Ответ:</strong> ${formatContent(task.answer || '')}
        </div>`;
      }

      // Auto-rubric (teacher only)
      if (teacherView && task.rubric?.length) {
        const total = task.rubric.reduce((s, r) => s + (r.points || 0), 0);
        const rows = task.rubric.map(r => `<tr><td>${escapeHtml(r.criterion || '')}</td><td>${escapeHtml(r.description || '')}</td><td style="text-align:center">${r.points || 0} б.</td></tr>`).join('');
        html += `<div style="margin-top:3mm;font-size:8.5pt">
          <div style="font-weight:700;color:#888;margin-bottom:1mm">КРИТЕРИИ · Итого: ${total} б.</div>
          <table style="width:100%;border-collapse:collapse;font-size:8.5pt">
            <thead><tr>
              <th style="background:#f0f0f0;border:1px solid #ccc;padding:2px 6px">Критерий</th>
              <th style="background:#f0f0f0;border:1px solid #ccc;padding:2px 6px">Описание</th>
              <th style="background:#f0f0f0;border:1px solid #ccc;padding:2px 6px;white-space:nowrap">Баллы</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
      }

      html += `</div>`;
    });

    // Footer
    html += `<div style="margin-top:8mm;padding-top:3mm;border-top:1px solid #ccc;font-size:8pt;color:#aaa;display:flex;justify-content:space-between">
      <span>Quasar Study Titan Infinity · @ihatehates &amp; @khkirill</span>
      <span>${date}</span>
    </div>`;

    return html;
  }

  // Decide which variants to print
  const needA = eeState.variant !== 'B' && varA.length > 0;
  const needB = eeState.variant !== 'A' && varB.length > 0;

  let fullHtml = buildVariantHtml(needA ? varA : varB.length ? varB : varA, needA ? 'A' : 'B');

  if (needA && needB) {
    fullHtml += `<div style="page-break-before:always"></div>`;
    fullHtml += buildVariantHtml(varB, 'B');
  }

  doPrint(fullHtml);
}


// ╔═══════════════════════════════════════════════════════╗
// ║  ENHANCED SCHEDULE (Lesson Script upgrade)            ║
// ╚═══════════════════════════════════════════════════════╝
// Lesson section is wired in nexus patch — we just enhance
// the schedule prompt to generate minute-by-minute scripts

const _origGenerateSchedule = typeof generateSchedule === 'function' ? generateSchedule : null;

// Patch schedule section description to mention lesson script
document.addEventListener('DOMContentLoaded', () => {
  if (window.__QS_LOCKED__) return;
  const schedHeader = document.querySelector('#section-schedule .section-header p');
  if (schedHeader) {
    schedHeader.textContent = 'Поминутный сценарий: разминка (5м) · теория (15м) · практика (20м) · выходной билет (5м)';
  }
});


// ╔═══════════════════════════════════════════════════════╗
// ║  ENHANCED doPrint — always injects A4 header fields   ║
// ╚═══════════════════════════════════════════════════════╝

const _origDoPrint = typeof doPrint === 'function' ? doPrint : null;
const PRINT_LOGO_SVG = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="60" cy="60" r="54" fill="#8fdac1"/>
  <circle cx="60" cy="60" r="41" fill="#ffffff"/>
  <circle cx="60" cy="60" r="25" fill="#8fdac1"/>
  <path d="M60 7 A53 53 0 0 1 107 34 L96 40 A40 40 0 0 0 60 20Z" fill="#ffffff"/>
  <path d="M20 84 A53 53 0 0 1 44 12 L52 22 A40 40 0 0 0 32 80Z" fill="#ffffff"/>
  <path d="M96 86 A53 53 0 0 1 69 112 L62 102 A40 40 0 0 0 84 80Z" fill="#ffffff"/>
</svg>`;

function buildPrintDocument(html) {
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Quasar Print</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    @page { size: A4; margin: 10mm; }
    html, body { margin: 0; padding: 0; background: #fff; color: #000; }
    body { font-family: "Times New Roman", Georgia, serif; font-size: 12pt; line-height: 1.75; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .print-shell { position: relative; }
    .print-brand { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4mm; }
    .print-brand-logo { width: 38px; height: 38px; flex: 0 0 auto; }
    .print-brand-title { font-size: 10pt; color: #1a1a1a !important; letter-spacing: .03em; text-transform: uppercase; font-weight: 600; }
    .print-doc { position: relative; }
    h1 { font-family: Georgia, serif; font-size: 18pt; margin: 0 0 4mm; border-bottom: 2px solid #000; padding-bottom: 2mm; }
    h2 { font-size: 13pt; margin: 5mm 0 2mm; }
    h3 { font-size: 11pt; margin: 4mm 0 1mm; }
    p, div, li, td, th, code, pre { color: #000 !important; }
    table { width: 100%; border-collapse: collapse; margin: 3mm 0; font-size: 10.5pt; }
    th, td { border: 1px solid #999; padding: 4px 8px; vertical-align: top; }
    th { background: #f0f0f0; font-weight: 600; }
    pre, code { background: #f6f6f6 !important; border: 1px solid #ccc !important; font-family: "Courier New", monospace !important; font-size: 9.5pt !important; white-space: pre-wrap; word-break: break-word; }
    .task-print { margin-bottom: 8mm; padding-bottom: 6mm; border-bottom: 1px solid #bbb; page-break-inside: avoid; }
    .task-print-num { font-size: 8pt; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: #555 !important; margin-bottom: 2mm; }
    .pa-footer { margin-top: 10mm; padding-top: 3mm; border-top: 1px solid #ccc; font-size: 8pt; color: #777 !important; display: flex; justify-content: space-between; }
    .pa-workspace { border: 1px dashed #ccc; border-radius: 4px; background: repeating-linear-gradient(transparent, transparent 7.5mm, #e0e0e0 7.5mm, #e0e0e0 8mm); }
    .katex { color: #000 !important; }
  </style>
</head>
<body>
  <div class="print-shell">
    <div class="print-brand">
      <div class="print-brand-logo">${PRINT_LOGO_SVG}</div>
      <div class="print-brand-title">Quasar Study</div>
    </div>
    <div class="print-doc">${html}</div>
  </div>
</body>
</html>`;
}

function parseMathSegments(text) {
  const re = /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g;
  let last = 0;
  let m;
  const out = [];
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    const token = m[0];
    if (token.startsWith('$$')) {
      out.push({ type: 'math', value: token.slice(2, -2), display: true });
    } else {
      out.push({ type: 'math', value: token.slice(1, -1), display: false });
    }
    last = m.index + token.length;
  }
  if (!out.length) return null;
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
}

function normalizeLatexForPrint(source) {
  return String(source || '')
    .replace(/\\\$/g, '$')
    .replace(/\\boxed\s*([^\s{}]+)/g, '\\\\boxed{$1}')
    .replace(/\\frac\s*([A-Za-z0-9])\s*([A-Za-z0-9])/g, '\\\\frac{$1}{$2}');
}

function renderMathForPrint(html) {
  const root = document.createElement('div');
  root.innerHTML = normalizeLatexForPrint(html);
  const hasKatex = !!window.katex?.renderToString;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const parent = node.parentElement;
    if (!parent) return;
    if (parent.closest('code, pre, script, style, textarea')) return;
    const text = node.nodeValue || '';
    if (!text.includes('$')) return;
    const segments = parseMathSegments(text);
    if (!segments) return;

    const frag = document.createDocumentFragment();
    segments.forEach(seg => {
      if (seg.type === 'text') {
        frag.appendChild(document.createTextNode(seg.value));
        return;
      }
      if (!hasKatex) {
        frag.appendChild(document.createTextNode(seg.value));
        return;
      }
      try {
        const span = document.createElement('span');
        span.innerHTML = window.katex.renderToString(seg.value, {
          displayMode: !!seg.display,
          throwOnError: false,
          strict: 'ignore',
        });
        while (span.firstChild) frag.appendChild(span.firstChild);
      } catch (_) {
        frag.appendChild(document.createTextNode(seg.value));
      }
    });
    node.parentNode?.replaceChild(frag, node);
  });

  return root.innerHTML;
}

function printInIsolatedFrame(html) {
  const printableHtml = renderMathForPrint(html);
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(buildPrintDocument(printableHtml));
  doc.close();

  const doNativePrint = () => {
    const win = iframe.contentWindow;
    if (!win) return;
    win.focus();
    try { win.print(); } finally {
      setTimeout(() => iframe.remove(), 1500);
    }
  };

  if (doc.readyState === 'complete') {
    setTimeout(doNativePrint, 180);
  } else {
    iframe.onload = () => setTimeout(doNativePrint, 180);
  }
}

// Override printing globally to avoid printing the whole app on mobile browsers.
window.doPrint = doPrint = function (html) {
  printInIsolatedFrame(html);
};


// ╔═══════════════════════════════════════════════════════╗
// ║  LESSON MODULE SETUP (wires lesson-gen-btn etc.)      ║
// ║  Standalone — does not depend on nexus patch          ║
// ╚═══════════════════════════════════════════════════════╝

// lessonState is already declared in the nexus patch above; extend it here if needed
document.addEventListener('DOMContentLoaded', () => {
  if (window.__QS_LOCKED__) return;
  setTimeout(setupLessonScript, 150);
});

function setupLessonScript() {
  // Only run if lesson section is in DOM but not yet wired (avoid double-init from nexus)
  const btn = document.getElementById('lesson-gen-btn');
  if (!btn || btn._lessonWired) return;
  btn._lessonWired = true;

  setupSegmentedFor('lesson-subject', val => {
    lessonState.subject = val;
    updateLessonTopicSelect(val);
  });
  setupSegmentedFor('lesson-grade', val => {
    lessonState.grade = val;
    updateLessonTopicSelect(lessonState.subject);
  });

  const typeGrid = document.getElementById('lesson-type-grid');
  typeGrid?.querySelectorAll('.lesson-type-card').forEach(card => {
    card.addEventListener('click', () => {
      typeGrid.querySelectorAll('.lesson-type-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      lessonState.lessonType = card.dataset.val;
    });
  });

  document.getElementById('lesson-topic')?.addEventListener('change', e => {
    lessonState.topic = e.target.value;
  });

  btn.addEventListener('click', generateLessonScript);

  document.getElementById('lesson-print-teacher')?.addEventListener('click', () => printLessonScript(true));
  document.getElementById('lesson-print-student')?.addEventListener('click', () => printLessonScript(false));

  updateLessonTopicSelect('physics');
}

function updateLessonTopicSelect(subject) {
  const select = document.getElementById('lesson-topic');
  if (!select) return;
  const grade = lessonState.grade || '7';
  const topics = TOPICS[subject] || [];
  select.innerHTML = '';

  const forGrade = topics.filter(t => t.grades.includes(grade));
  if (forGrade.length) {
    forGrade.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.value; opt.textContent = t.label;
      select.appendChild(opt);
    });
  } else {
    const opt = document.createElement('option');
    opt.value = ''; opt.textContent = 'Нет тем для этого класса';
    select.appendChild(opt);
  }

  const def = forGrade[0];
  if (def) { select.value = def.value; lessonState.topic = def.value; }
}

async function generateLessonScript() {
  const apiKey = getApiKey();
  if (!apiKey) { showGlassError('API ключ не найден'); return; }

  const { subject, grade, topic, lessonType } = lessonState;
  const topicData = (TOPICS[subject] || []).find(t => t.value === topic);
  const topicLabel = topicData?.label || topic;
  const topicDetail = topicData?.detail || '';

  const typeLabels = {
    new: 'новый материал',
    practice: 'закрепление',
    revision: 'повторение',
    test: 'контрольная / проверочная работа',
  };

  const subLabel = subject === 'physics' ? 'физике' : 'информатике';

  const prompt = `Составь детальный поминутный сценарий урока по ${subLabel}, ${grade} класс.
Тема: «${topicLabel}»${topicDetail ? ` — ${topicDetail}` : ''}
Тип урока: ${typeLabels[lessonType] || typeLabels.new}

Структура 45 минут:
- Разминка / введение: 5 минут
- Теоретическая карточка: 15 минут
- Практика / закрепление: 20 минут
- Выходной билет / рефлексия: 5 минут

Для каждой фазы выведи что учитель говорит и делает (полный сценарий), что делают ученики, материалы, и советы по дифференциации.

Верни СТРОГО валидный JSON объект (без оберток) с полями:
title, subject, grade, totalMinutes, learningObjectives (массив), phases (массив объектов: name, type, durationMin, teacherScript, studentActivity, materials, teacherTips), homework, assessmentAnswer.`;

  const btn = document.getElementById('lesson-gen-btn');
  const result = document.getElementById('lesson-result');
  if (btn) { btn.disabled = true; btn.classList.add('shimmer'); }
  result.innerHTML = `
    <div class="output-empty">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <p style="margin-top:14px;color:var(--text-3);font-size:13px">Составляю поминутный сценарий урока…</p>
    </div>`;

  // Use SYSTEM_LESSON from nexus patch if available, else SYSTEM_SIMPLE
  const sysPrompt = typeof SYSTEM_LESSON !== 'undefined' ? SYSTEM_LESSON : SYSTEM_SIMPLE;

  try {
    const response = await callQuasarAI(apiKey, MODEL_REASONING, sysPrompt,
      [{ role: 'user', content: prompt }]
    );
    const text = response.choices[0].message.content;
    const clean = text.replace(/^```json\s*|```\s*$/gm, '').trim();
    const data = await parseJsonWithRepair(apiKey, clean);

    lessonState.data = data;
    renderLessonOutput(data, result);
  } catch (err) {
    result.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i><p style="text-align:center;margin-top:10px">${friendlyError(err)}</p></div>`;
    document.dispatchEvent(new Event('qs:icons'));
  } finally {
    if (btn) { btn.disabled = false; btn.classList.remove('shimmer'); }
    if (window.lucide) lucide.createIcons();
  }
}

function renderLessonOutput(data, container) {
  container.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.style.cssText = 'padding:16px 18px;border-bottom:1px solid var(--border)';
  header.innerHTML = `
    <div style="font-size:16px;font-weight:400;letter-spacing:-0.01em;margin-bottom:6px">${escapeHtml(data.title || 'Конспект урока')}</div>
    <div style="font-size:12px;color:var(--text-3);font-weight:300">
      ${escapeHtml(data.subject || '')} · ${escapeHtml(data.grade || '')} класс · ${data.totalMinutes || 45} мин
    </div>`;
  container.appendChild(header);

  // Learning objectives
  if (data.learningObjectives?.length) {
    const objEl = document.createElement('div');
    objEl.style.cssText = 'padding:10px 18px;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:4px';
    data.learningObjectives.forEach(obj => {
      const d = document.createElement('div');
      d.style.cssText = 'font-size:12.5px;font-weight:300;color:var(--text-2);display:flex;gap:8px;align-items:flex-start';
      d.innerHTML = `<span style="color:var(--accent);font-size:10px;margin-top:4px">◆</span>${escapeHtml(obj)}`;
      objEl.appendChild(d);
    });
    container.appendChild(objEl);
  }

  // Phases timeline
  const plan = document.createElement('div');
  plan.className = 'lesson-plan';

  const phaseColors = {
    intro: { cls: 'phase-intro', label: 'Введение / Разминка', icon: 'zap' },
    theory: { cls: 'phase-theory', label: 'Теоретическая карточка', icon: 'book-open' },
    practice: { cls: 'phase-practice', label: 'Практика', icon: 'pencil-ruler' },
    exit: { cls: 'phase-exit', label: 'Выходной билет', icon: 'check-square' },
  };

  (data.phases || []).forEach((phase, i) => {
    const meta = phaseColors[phase.type] || { cls: 'phase-intro', label: phase.name, icon: 'circle' };
    const phDiv = document.createElement('div');
    phDiv.className = `lesson-phase ${meta.cls}`;
    phDiv.style.animationDelay = `${i * 0.08}s`;

    phDiv.innerHTML = `
      <div class="lesson-phase-line">
        <div class="lesson-phase-dot"></div>
        <div class="lesson-phase-track"></div>
      </div>
      <div class="lesson-phase-content">
        <div class="lesson-phase-label">
          <span class="lesson-phase-title">${escapeHtml(phase.name || meta.label)}</span>
          <span class="lesson-phase-dur">${phase.durationMin || '?'} мин</span>
        </div>
        <div class="lesson-phase-body">
          <div style="margin-bottom:8px">
            <div style="font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:5px">Учитель</div>
            <div style="font-size:13px;line-height:1.85;font-weight:300">${formatContent(phase.teacherScript || '')}</div>
          </div>
          <div style="margin-bottom:6px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.05)">
            <div style="font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:5px">Ученики</div>
            <div style="font-size:13px;line-height:1.85;font-weight:300;color:var(--text-2)">${escapeHtml(phase.studentActivity || '')}</div>
          </div>
          ${phase.teacherTips ? `<div style="margin-top:6px;padding:8px 10px;background:rgba(255,190,60,0.05);border-radius:6px;border:1px solid rgba(255,190,60,0.14);font-size:11.5px;color:rgba(255,190,60,0.7);font-weight:300"><span style="opacity:.6">💡 </span>${escapeHtml(phase.teacherTips)}</div>` : ''}
        </div>
      </div>`;

    plan.appendChild(phDiv);
    renderKaTeX(phDiv);
  });

  container.appendChild(plan);

  // Homework & assessment
  if (data.homework || data.assessmentAnswer) {
    const footer = document.createElement('div');
    footer.style.cssText = 'margin:0 16px 16px;display:flex;flex-direction:column;gap:8px';
    if (data.homework) {
      footer.innerHTML += `<div style="padding:10px 14px;background:rgba(41,121,255,0.06);border:1px solid rgba(41,121,255,0.18);border-radius:var(--radius-xs);font-size:13px;font-weight:300"><strong style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)">Домашнее задание</strong><br>${escapeHtml(data.homework)}</div>`;
    }
    if (data.assessmentAnswer) {
      footer.innerHTML += `<div style="padding:10px 14px;background:rgba(255,190,60,0.05);border:1px solid rgba(255,190,60,0.18);border-radius:var(--radius-xs);font-size:13px;font-weight:300"><strong style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--amber)">Ответ (учитель)</strong><br>${formatContent(data.assessmentAnswer)}</div>`;
    }
    container.appendChild(footer);
    renderKaTeX(footer);
  }

  if (window.lucide) lucide.createIcons();
}

function printLessonScript(teacherView) {
  const data = lessonState.data;
  if (!data) { showToast('Сначала сгенерируйте конспект урока'); return; }

  const date = new Date().toLocaleDateString('ru-RU');
  const ver = teacherView ? 'Версия учителя' : 'Версия ученика';
  const badge = teacherView ? 'teacher' : 'student';

  let html = `
    <div class="pa-title">${escapeHtml(data.title || 'Конспект урока')}</div>
    <div class="pa-meta">
      <span class="pa-badge pa-badge-${badge}">${ver.toUpperCase()}</span>
      ${escapeHtml(data.subject || '')} · ${escapeHtml(data.grade || '')} класс · ${data.totalMinutes || 45} мин · ${date}
    </div>`;

  if (data.learningObjectives?.length) {
    html += `<div class="pa-lab-section"><div class="pa-lab-title">Цели урока</div>
      <ul>${data.learningObjectives.map(o => `<li>${escapeHtml(o)}</li>`).join('')}</ul>
    </div>`;
  }

  const phaseNames = { intro: 'Введение / Разминка', theory: 'Теория (15 мин)', practice: 'Практика (20 мин)', exit: 'Выходной билет (5 мин)' };

  (data.phases || []).forEach(phase => {
    const label = phaseNames[phase.type] || phase.name;
    html += `<div class="pa-lab-section">
      <div class="pa-lab-title">${label} · ${phase.durationMin || '?'} мин</div>
      <div><strong>Учитель:</strong> ${formatContent(phase.teacherScript || '')}</div>
      <div style="margin-top:2mm;color:#555"><strong>Ученики:</strong> ${escapeHtml(phase.studentActivity || '')}</div>
      ${teacherView && phase.teacherTips ? `<div style="margin-top:2mm;color:#d97706;font-style:italic">💡 ${escapeHtml(phase.teacherTips)}</div>` : ''}
    </div>`;
  });

  if (data.homework) {
    html += `<div class="pa-lab-section"><div class="pa-lab-title">Домашнее задание</div><div>${escapeHtml(data.homework)}</div></div>`;
  }
  if (teacherView && data.assessmentAnswer) {
    html += `<div class="pa-answer"><strong>Ответ на выходной билет:</strong> ${formatContent(data.assessmentAnswer)}</div>`;
  }

  html += `<div class="pa-footer"><span>Quasar Study Infinity · @ihatehates &amp; @khkirill</span><span>${date}</span></div>`;

  doPrint(html);
}


// ╔═══════════════════════════════════════════════════════╗
// ║  LAB MODULE FALLBACK SETUP                            ║
// ║  Runs if nexus patch setupLabModule didn't fire       ║
// ╚═══════════════════════════════════════════════════════╝

document.addEventListener('DOMContentLoaded', () => {
  if (window.__QS_LOCKED__) return;
  setTimeout(() => {
    const labBtn = document.getElementById('lab-gen-btn');
    if (labBtn && !labBtn._labWired) {
      labBtn._labWired = true;
      setupLabFallback();
    }
  }, 200);
});

function setupLabFallback() {
  // Lab module — full wire-up (mirrors nexus setupLabModule)
  // If nexus setupLabModule already ran (it sets a flag on the button), skip
  const labBtn = document.getElementById('lab-gen-btn');
  if (!labBtn || labBtn._labModuleWired) return;

  const labStateLocal = { subject: 'physics', grade: '8', topic: '', labType: 'measurement', data: null };

  setupSegmentedFor('lab-subject', val => {
    labStateLocal.subject = val;
    updateLabTopicSelectLocal(val, labStateLocal);
  });
  setupSegmentedFor('lab-grade', val => {
    labStateLocal.grade = val;
    updateLabTopicSelectLocal(labStateLocal.subject, labStateLocal);
  });

  document.getElementById('lab-type-grid')?.querySelectorAll('.lab-type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('lab-type-grid').querySelectorAll('.lab-type-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      labStateLocal.labType = card.dataset.val;
    });
  });

  document.getElementById('lab-topic')?.addEventListener('change', e => {
    labStateLocal.topic = e.target.value;
  });

  document.getElementById('lab-gen-btn')?.addEventListener('click', () => generateLabLocal(labStateLocal));
  document.getElementById('lab-print-teacher')?.addEventListener('click', () => {
    if (!labStateLocal.data) { showToast('Сначала сгенерируйте лабораторную'); return; }
    if (typeof printLabDoc === 'function') printLabDoc(true);
    else showToast('Данные лаб. не найдены');
  });
  document.getElementById('lab-print-student')?.addEventListener('click', () => {
    if (!labStateLocal.data) { showToast('Сначала сгенерируйте лабораторную'); return; }
    if (typeof printLabDoc === 'function') printLabDoc(false);
    else showToast('Данные лаб. не найдены');
  });

  updateLabTopicSelectLocal('physics', labStateLocal);
}

function updateLabTopicSelectLocal(subject, labStateLocal) {
  const select = document.getElementById('lab-topic');
  if (!select) return;
  const grade = labStateLocal.grade || '8';
  const topics = TOPICS[subject] || [];
  select.innerHTML = '';

  const forGrade = topics.filter(t => t.grades.includes(grade));
  if (forGrade.length) {
    forGrade.forEach(t => {
      const opt = document.createElement('option'); opt.value = t.value; opt.textContent = t.label;
      select.appendChild(opt);
    });
  } else {
    const opt = document.createElement('option');
    opt.value = ''; opt.textContent = 'Нет тем для этого класса';
    select.appendChild(opt);
  }
  const def = forGrade[0];
  if (def) { select.value = def.value; labStateLocal.topic = def.value; }
}

async function generateLabLocal(labStateLocal) {
  if (labStateLocal._loading) return;
  labStateLocal._loading = true;
  const apiKey = getApiKey();
  if (!apiKey) { labStateLocal._loading = false; showGlassError('API ключ не найден'); return; }

  const { subject, grade, topic, labType } = labStateLocal;
  const topicData = (TOPICS[subject] || []).find(t => t.value === topic);
  const topicLabel = topicData?.label || topic;
  const topicDetail = topicData?.detail || '';
  const requirements = document.getElementById('lab-requirements')?.value?.trim() || '';

  const typeLabels = {
    measurement: 'измерительная (определить физическую величину)',
    investigation: 'исследовательская (изучить зависимость)',
    verification: 'проверочная (верифицировать закон или теорему)',
    simulation: 'компьютерная симуляция или модель',
  };

  const subjectLabel = subject === 'physics' ? 'физике' : 'информатике';
  const prompt = `Создай полную лабораторную работу по ${subjectLabel} для ${grade} класса.
Тема: «${topicLabel}»${topicDetail ? ` — ${topicDetail}` : ''}
Тип: ${typeLabels[labType] || typeLabels.measurement}
${requirements ? `Дополнительно: ${requirements}` : ''}
Верни строго валидный JSON с полями: title, subject, grade, objective, hypothesis, equipment (массив), safety (массив), procedure (массив {step,action,note}), dataTable ({columns,rows}), analysisQuestions (массив), expectedResult, teacherTips (массив), rubric (массив {criterion,points,description}).`;

  const btn = document.getElementById('lab-gen-btn');
  const result = document.getElementById('lab-result');
  if (btn) { btn.disabled = true; btn.classList.add('shimmer'); }
  result.innerHTML = `
    <div class="output-empty">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <p style="margin-top:14px;color:var(--text-3);font-size:13px">Составляю лабораторную работу…</p>
    </div>`;

  const sysPrompt = typeof SYSTEM_LAB !== 'undefined' ? SYSTEM_LAB : SYSTEM_SIMPLE;

  try {
    const response = await callQuasarAI(apiKey, MODEL_REASONING, sysPrompt,
      [{ role: 'user', content: prompt }]
    );
    const text = response.choices[0].message.content;
    const clean = text.replace(/^```json\s*|```\s*$/gm, '').trim();
    const data = await parseJsonWithRepair(apiKey, clean);
    labStateLocal.data = data;
    // If nexus renderLabOutput is available use it
    if (typeof renderLabOutput === 'function') {
      renderLabOutput(data, result);
    } else {
      renderLabFallbackOutput(data, result);
    }
    // Expose for print
    if (typeof labState !== 'undefined') {
      labState.data = data;
    }
  } catch (err) {
    result.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i><p style="text-align:center;margin-top:10px">${friendlyError(err)}</p></div>`;
    document.dispatchEvent(new Event('qs:icons'));
  } finally {
    labStateLocal._loading = false;
    if (btn) { btn.disabled = false; btn.classList.remove('shimmer'); }
    if (window.lucide) lucide.createIcons();
  }
}

function renderLabFallbackOutput(data, container) {
  container.innerHTML = '';
  const header = document.createElement('div');
  header.style.cssText = 'padding:16px 18px;border-bottom:1px solid var(--border)';
  header.innerHTML = `<div style="font-size:16px;font-weight:400;letter-spacing:-0.01em;margin-bottom:6px">${escapeHtml(data.title || 'Лабораторная работа')}</div><div style="font-size:12px;color:var(--text-3);font-weight:300">${escapeHtml(data.subject || '')} · ${escapeHtml(data.grade || '')} класс</div>`;
  container.appendChild(header);

  const sections = [
    { title: 'Цель работы', content: `${formatContent(data.objective || '')}${data.hypothesis ? `<div style="margin-top:8px;padding:8px 12px;background:rgba(41,121,255,0.05);border-radius:6px;border:1px solid rgba(41,121,255,0.12);font-size:13px;font-weight:300"><strong>Гипотеза:</strong> ${escapeHtml(data.hypothesis)}</div>` : ''}` },
    { title: 'Оборудование', content: (data.equipment || []).map(e => `<div style="font-size:13px;font-weight:300;padding:3px 0 3px 12px;border-left:1.5px solid rgba(0,212,170,0.3);color:var(--text-2)">· ${escapeHtml(e)}</div>`).join('') },
    { title: 'Техника безопасности', content: (data.safety || []).map(s => `<div style="font-size:12.5px;font-weight:300;color:rgba(255,80,100,0.8);padding:3px 0">⚠ ${escapeHtml(s)}</div>`).join('') },
    { title: 'Ход работы', content: (data.procedure || []).map(s => `<div style="display:flex;gap:10px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><div style="font-size:10px;font-weight:600;color:rgba(255,190,60,0.8);min-width:22px;padding-top:3px">${s.step}.</div><div><div style="font-size:13.5px;font-weight:300;line-height:1.75">${formatContent(s.action || '')}</div>${s.note ? `<div style="font-size:12px;font-style:italic;color:var(--text-3);margin-top:2px">${escapeHtml(s.note)}</div>` : ''}</div></div>`).join('') },
  ];

  sections.forEach(sec => {
    const el = document.createElement('div');
    el.style.cssText = 'padding:12px 18px;border-bottom:1px solid var(--border)';
    el.innerHTML = `<div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3);margin-bottom:8px">${sec.title}</div><div>${sec.content}</div>`;
    container.appendChild(el);
  });

  // Data table
  if (data.dataTable?.columns?.length) {
    const dt = data.dataTable;
    const dtEl = document.createElement('div');
    dtEl.style.cssText = 'padding:12px 18px;border-bottom:1px solid var(--border)';
    let tableHtml = `<div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3);margin-bottom:8px">Таблица данных</div><div style="overflow-x:auto"><table class="lab-data-table"><thead><tr><th>№</th>${dt.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>`;
    for (let r = 1; r <= (dt.rows || 6); r++) {
      tableHtml += `<tr><td style="color:var(--text-3);text-align:center">${r}</td>${dt.columns.map(() => '<td class="empty-cell"></td>').join('')}</tr>`;
    }
    tableHtml += `</tbody></table></div>`;
    dtEl.innerHTML = tableHtml;
    container.appendChild(dtEl);
  }

  // Analysis questions
  if (data.analysisQuestions?.length) {
    const aqEl = document.createElement('div');
    aqEl.style.cssText = 'padding:12px 18px;border-bottom:1px solid var(--border)';
    aqEl.innerHTML = `<div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3);margin-bottom:8px">Вопросы для анализа</div>${data.analysisQuestions.map((q, qi) => `<div style="display:flex;gap:8px;padding:5px 0"><div style="font-size:10px;font-weight:600;color:rgba(0,212,170,0.8);min-width:18px;padding-top:3px">${qi + 1}.</div><div style="font-size:13.5px;font-weight:300;line-height:1.75">${formatContent(q)}</div></div>`).join('')}`;
    container.appendChild(aqEl);
    renderKaTeX(aqEl);
  }

  // Teacher-only
  if (data.expectedResult || data.teacherTips?.length) {
    const tcEl = document.createElement('div');
    tcEl.style.cssText = 'padding:12px 18px;border:1px solid rgba(255,190,60,0.2);border-radius:0 0 var(--radius-sm) var(--radius-sm);background:rgba(255,190,60,0.03)';
    tcEl.innerHTML = `<div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,190,60,0.7);margin-bottom:8px">Только для учителя</div>${data.expectedResult ? `<div style="font-size:13.5px;font-weight:300;line-height:1.8;margin-bottom:8px"><strong style="color:rgba(255,190,60,0.8)">Ожидаемый результат:</strong> ${formatContent(data.expectedResult)}</div>` : ''}${(data.teacherTips || []).map(tip => `<div style="padding:8px 10px;background:rgba(255,190,60,0.05);border-radius:6px;border-left:2px solid rgba(255,190,60,0.3);font-size:12.5px;font-weight:300;margin-bottom:5px;color:var(--text-2)">💡 ${escapeHtml(tip)}</div>`).join('')}`;
    container.appendChild(tcEl);
  }

  renderKaTeX(container);
  if (window.lucide) lucide.createIcons();
}

// ╔═══════════════════════════════════════════════════════╗
// ║  CHARTS & TABLES SECTION                              ║
// ╚═══════════════════════════════════════════════════════╝

function setupChartsSection() {
  const genBtn = document.getElementById('chart-gen-btn');
  const promptEl = document.getElementById('chart-prompt');
  const resultEl = document.getElementById('chart-result');
  const downloadBtn = document.getElementById('chart-download-btn');
  const printBtn = document.getElementById('chart-print-btn');
  const replayBtn = document.getElementById('chart-replay-btn');
  const typeSeg = document.getElementById('chart-type-seg');

  if (!genBtn || !promptEl || !resultEl) return;

  // Quick template buttons
  document.querySelectorAll('.chart-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      promptEl.value = btn.dataset.q;
    });
  });

  // Type segmented control
  if (typeSeg) {
    typeSeg.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        typeSeg.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  genBtn.addEventListener('click', async () => {
    const prompt = promptEl.value.trim();
    if (!prompt) return;
    const apiKey = localStorage.getItem(API_KEY_STORE) || '';
    if (!apiKey) { showGlassError('Укажи API ключ'); return; }

    const chartType = typeSeg?.querySelector('.seg-btn.active')?.dataset?.val || 'line';
    const isTable = chartType === 'table';

    genBtn.disabled = true;
    genBtn.classList.add('shimmer');
    resultEl.innerHTML = `<div class="output-empty"><div class="typing-dots"><span></span><span></span><span></span></div><p style="margin-top:14px;font-size:13px;color:var(--text-3)">Генерирую ${isTable ? 'таблицу' : 'график'}…</p></div>`;

    const sysPrompt = isTable
      ? `Ты — преподаватель физики/информатики. Сгенерируй таблицу по запросу пользователя.
Верни ТОЛЬКО JSON без markdown-обёрток:
{"title":"...","headers":["col1","col2",...],"rows":[["val","val",...],...],"note":"необязательное пояснение"}`
      : `Ты — преподаватель физики/информатики. Сгенерируй данные для графика по запросу.
Тип графика: ${chartType}. Верни ТОЛЬКО JSON без markdown-обёрток:
{"title":"...","xLabel":"...","yLabel":"...","labels":[x1,x2,...],"datasets":[{"label":"...","data":[y1,y2,...],"color":"rgba(77,139,255,0.85)"}],"note":"необязательное пояснение"}
labels — массив числовых или строковых значений оси X. datasets — массив наборов данных.`;

    try {
      const res = await callQuasarAI(apiKey, MODEL_FAST, sysPrompt, [{ role: 'user', content: prompt }]);
      const text = res.choices[0].message.content;
      const clean = text.replace(/^```(?:json)?\s*|```\s*$/gm, '').trim();
      const data = JSON.parse(clean);

      resultEl.innerHTML = '';

      if (data.title) {
        const titleEl = document.createElement('div');
        titleEl.style.cssText = 'padding:14px 18px 0;font-size:14px;font-weight:400;letter-spacing:-0.01em';
        titleEl.textContent = data.title;
        resultEl.appendChild(titleEl);
      }

      if (isTable) {
        renderChartTable(data, resultEl);
      } else {
        renderChartCanvas(data, chartType, resultEl);
      }

      if (data.note) {
        const noteEl = document.createElement('div');
        noteEl.style.cssText = 'padding:10px 18px;font-size:12px;color:var(--text-3);font-weight:300;border-top:1px solid var(--border);margin-top:12px';
        noteEl.textContent = data.note;
        resultEl.appendChild(noteEl);
      }

    } catch (err) {
      resultEl.innerHTML = `<div class="output-empty"><i data-lucide="alert-circle"></i><p style="margin-top:10px;text-align:center">${friendlyError(err)}</p></div>`;
      if (window.lucide) lucide.createIcons();
    } finally {
      genBtn.disabled = false;
      genBtn.classList.remove('shimmer');
    }
  });

  // Download PNG
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const canvas = resultEl.querySelector('canvas');
      if (!canvas) { showToast('Нет графика для скачивания'); return; }
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  // Replay Animation
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      const canvas = resultEl.querySelector('canvas');
      if (canvas && canvas._chartInstance) {
        canvas._chartInstance.stop();
        canvas._chartInstance.reset();
        canvas._chartInstance.update();
      } else {
        showToast('Нет подходящего графика');
      }
    });
  }

  // Print
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      const canvas = resultEl.querySelector('canvas');
      const table = resultEl.querySelector('table');
      const title = resultEl.querySelector('div')?.textContent || 'График';
      const printWin = window.open('', '_blank');
      if (!printWin) return;
      let content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Georgia,serif;padding:20mm;color:#000}h2{margin-bottom:10mm}table{border-collapse:collapse;width:100%}th,td{border:1px solid #aaa;padding:6px 10px}th{background:#f0f0f0;font-weight:600}img{max-width:100%}</style></head><body><h2>${title}</h2>`;
      if (canvas) content += `<img src="${canvas.toDataURL()}"/>`;
      if (table) content += table.outerHTML;
      content += '</body></html>';
      printWin.document.write(content);
      printWin.document.close();
      printWin.print();
    });
  }
}

function renderChartCanvas(data, type, container) {
  const wrap = document.createElement('div');
  wrap.className = 'chart-canvas-wrap';
  wrap.style.cssText = 'padding:16px 18px';

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'width:100%;height:320px';
  wrap.appendChild(canvas);
  container.appendChild(wrap);

  const isDark = document.body.dataset.theme !== 'light';
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.55)';

  const TITAN_PALETTE = [
    'rgba(77, 139, 255, 0.85)', // Blue
    'rgba(0, 212, 170, 0.85)',   // Teal
    'rgba(255, 190, 60, 0.85)',  // Amber
    'rgba(255, 80, 100, 0.85)',  // Rose
    'rgba(156, 106, 222, 0.85)', // Purple
  ];

  const datasets = (data.datasets || []).map((ds, i) => {
    const c = ds.color || TITAN_PALETTE[i % TITAN_PALETTE.length];
    return {
      label: ds.label || '',
      data: ds.data || [],
      borderColor: c,
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, c.replace(/[\d.]+\)$/, '0.4)'));
        gradient.addColorStop(1, c.replace(/[\d.]+\)$/, '0)'));
        return type === 'line' ? gradient : c.replace(/[\d.]+\)$/, '0.6)');
      },
      borderWidth: type === 'bar' ? 0 : 3,
      pointRadius: type === 'scatter' ? 5 : 4,
      pointBackgroundColor: '#fff',
      pointBorderColor: c,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: type === 'line',
    };
  });

  const chartInstance = new Chart(canvas, {
    type: type === 'scatter' ? 'scatter' : type,
    data: { labels: data.labels || [], datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1800,
        easing: 'easeOutQuart',
        delay: (context) => context.dataIndex * 20
      },
      plugins: {
        legend: { labels: { color: textColor, font: { family: 'Inter, sans-serif', size: 12 } } },
      },
      scales: {
        x: {
          title: { display: !!data.xLabel, text: data.xLabel || '', color: textColor, font: { size: 11 } },
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 11 } },
        },
        y: {
          title: { display: !!data.yLabel, text: data.yLabel || '', color: textColor, font: { size: 11 } },
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 11 } },
        },
      },
    },
  });
  canvas._chartInstance = chartInstance;
}

function renderChartTable(data, container) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:12px 18px;overflow-x:auto';

  const table = document.createElement('table');
  table.className = 'chart-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  (data.headers || []).forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  (data.rows || []).forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  container.appendChild(wrap);
}

// ╔═══════════════════════════════════════════════════════╗
// ║  19. AUTHENTICATION (Titan Improved)                   ║
// ╚═══════════════════════════════════════════════════════╝

function setupAuth() {
  const tabs = document.querySelectorAll('.auth-tab');
  const passwordGroup = document.getElementById('password-group');
  const submitBtn = document.getElementById('auth-submit-btn');
  const emailInput = document.getElementById('auth-email-input');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.id === 'tab-register') {
        passwordGroup.classList.remove('hidden');
        submitBtn.querySelector('span').textContent = 'Создать аккаунт';
      } else {
        passwordGroup.classList.add('hidden');
        submitBtn.querySelector('span').textContent = 'Продолжить';
      }
    });
  });

  // Simple validation feedback
  emailInput.addEventListener('blur', () => {
    if (emailInput.value && !emailInput.value.includes('@')) {
      emailInput.style.borderColor = 'var(--rose)';
    } else {
      emailInput.style.borderColor = '';
    }
  });
}

function handleAuth() {
  const btn = document.getElementById('auth-submit-btn');
  const email = document.getElementById('auth-email-input').value;

  if (!email) {
    showGlassError('Пожалуйста, введите Email');
    return;
  }

  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;

  // Simulate realistic network delay
  setTimeout(() => {
    btn.innerHTML = originalContent;
    btn.disabled = false;

    // In a real app, we'd check credentials here
    if (typeof dismissAuth === 'function') {
      dismissAuth();
      showToast('Добро пожаловать в OakBes Titan Edition!');
    }
  }, 1200);
}