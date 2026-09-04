(function () {
  'use strict';

  // Keep the configurator usable even if the shared data script is delayed or cached.
  const DATA = window.CHEMSYNT_DATA || { countries: [], industries: [], sectors: {} };
  const questions = [
    { id: 'q1', number: 1, profile: true, multi: true, text: 'What best describes your typical workflow?', options: ['Early-stage reaction screening', 'Process optimization', 'Scale-up simulation', 'pH-controlled synthesis', 'Parallel process development', 'Academic research'] },
    { id: 'q2', number: 2, profile: true, text: 'Which activity is most critical in your workflow?', options: ['Reaction exploration', 'Parallel experimentation', 'Process definition', 'Process optimization'] },
    { id: 'q3', number: 3, profile: true, text: 'Have you ever used a reaction station for chemical synthesis?', options: ['No, I am not running chemical reactions yet', 'No, I run reactions but not on an automated system', 'Yes, I already use a chemical reaction station'] },
    { id: 'q4', number: 4, text: 'How many reactions do you typically need to run in parallel?', options: [['1', 1], ['2', 2], ['3', 3], ['4 or more', 4]] },
    { id: 'q5', number: 5, text: 'Which reactor scale is most relevant for your work?', options: [['Small vials (<20 mL)', 'vials'], ['100 mL scale', '100ml'], ['400 mL scale', '400ml'], ['Multiple scales depending on project phase', 'multi']] },
    { id: 'q6', number: 6, text: 'Which type of mixing is required?', options: [['Standard magnetic stirring', 'magnetic'], ['Mechanical stirring', 'ohs']] },
    { id: 'q7', number: 7, text: 'How important is controlled reagent addition?', options: [['Not required', 'none'], ['Manual addition is sufficient', 'funnel'], ['Timed dosing is important', 'du50'], ['Automated multi-reagent dosing is required', 'du50x2']] },
    { id: 'q8', number: 8, text: 'Do your reactions require controlled pH conditions?', options: [['No', 'none'], ['No, pH monitoring only', 'monitor'], ['Yes, pH monitoring & control', 'control']] },
    { id: 'q9', number: 9, text: 'Temperature range', options: [['-30 to 150', 'standard'], ['-40 to 150 (Requires external chiller)', 'chiller']] }
  ];
  const answers = {};
  const quiz = document.querySelector('#quiz');
  const rows = document.querySelector('#recommendation-rows');
  const notes = document.querySelector('#recommendation-notes');
  const code = document.querySelector('#config-code');
  const form = document.querySelector('#config-request-form');
  const message = document.querySelector('#request-message');
  const hiddenCode = document.querySelector('#request-code');
  const configureButton = document.querySelector('#configure');
  const requestSection = document.querySelector('#request');
  let requestPrepared = false;
  let generatedMessage = '';

  const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const labelFor = (question, index) => Array.isArray(question.options[index]) ? question.options[index][0] : question.options[index];
  const valueFor = (id) => {
    const question = questions.find((item) => item.id === id);
    if (answers[id] === undefined || question.multi) return null;
    const option = question.options[answers[id]];
    return Array.isArray(option) ? option[1] : option;
  };
  const selectedLabels = (id) => {
    const question = questions.find((item) => item.id === id);
    if (answers[id] === undefined) return null;
    if (question.multi) return answers[id].slice().sort((a, b) => a - b).map((index) => labelFor(question, index)).join(', ');
    return labelFor(question, answers[id]);
  };

  function renderQuiz() {
    quiz.innerHTML = questions.map((question) => {
      const type = question.multi ? 'checkbox' : 'radio';
      const options = question.options.map((option, index) => {
        const checked = question.multi ? Array.isArray(answers[question.id]) && answers[question.id].includes(index) : answers[question.id] === index;
        return `<label class="choice"><input type="${type}" name="${question.id}" value="${index}" ${checked ? 'checked' : ''}><span>${escapeHtml(labelFor(question, index))}</span></label>`;
      }).join('');
      const tag = question.multi ? 'Select all that apply' : question.profile ? 'Profile' : '';
      return `<fieldset class="question"><legend><span class="question__head"><span class="question__number">${question.number}</span><h3>${escapeHtml(question.text)}</h3>${tag ? `<span class="question__tag">${tag}</span>` : ''}</span></legend><div class="choices">${options}</div></fieldset>`;
    }).join('');
  }

  function stationsText(stations) {
    if (!stations) return null;
    if (stations === 1) return '1 ChemSynt 301 station';
    return `ChemSynt 301 + ${stations - 1} slave unit${stations - 1 > 1 ? 's' : ''} (${stations} in parallel)`;
  }
  const REACTOR = { vials: 'Glass vials (<20 mL) — accessory', '100ml': '100 mL reactor — accessory', '400ml': '400 mL reactor — accessory', multi: 'Vials + 100 mL + 400 mL — accessories' };
  const MIX = { magnetic: 'Magnetic stirring (included)', ohs: 'Overhead stirrer (OHS) — accessory' };
  const DOSING = { none: 'No dosing accessory', funnel: 'Dropping funnel — accessory', du50: 'DU50 dosing unit — accessory', du50x2: 'Double DU50 dosing unit — accessory' };
  const PH = { none: 'No pH accessory', monitor: 'pH meter — accessory', control: 'pH meter — accessory' };
  const TEMPERATURE = { standard: '-30 to 150', chiller: '-40 to 150 (Requires external chiller)' };
  const row = (category, detail) => `<div class="recommendation-row">${detail ? escapeHtml(detail) : '—'}<small>${escapeHtml(category)}</small></div>`;

  function renderRecommendation() {
    const stations = valueFor('q4');
    const reactor = valueFor('q5');
    const mixing = valueFor('q6');
    const dosing = valueFor('q7');
    const ph = valueFor('q8');
    const temperature = valueFor('q9');
    const output = [
      row('Reaction stations (Q4)', stationsText(stations)),
      row('Reactor scale (Q5)', reactor ? REACTOR[reactor] : null),
      row('Mixing (Q6)', mixing ? MIX[mixing] : null),
      row('Reagent dosing (Q7)', dosing ? DOSING[dosing] : null),
      row('pH (Q8)', ph ? PH[ph] : null),
      row('Temperature range (Q9)', temperature ? TEMPERATURE[temperature] : null)
    ];
    const profile = [['Workflow', 'q1'], ['Critical activity', 'q2'], ['Reaction-station experience', 'q3']].filter((item) => selectedLabels(item[1]));
    if (profile.length) {
      output.push('<div class="recommendation-profile">Your profile</div>');
      profile.forEach((item) => output.push(row(item[0], selectedLabels(item[1]))));
    }
    rows.innerHTML = output.join('');

    const notices = [];
    const answered = questions.filter((question) => answers[question.id] !== undefined).length;
    if (answered < questions.length) notices.push(`Answer all questions for a complete recommendation (${answered}/${questions.length}).`);
    if (reactor === 'multi') notices.push('Multiple scales: we suggest the full reactor set (vials, 100 mL and 400 mL).');
    if (ph === 'control' && dosing !== 'du50' && dosing !== 'du50x2') notices.push('Tip: pH control pairs best with a DU50 dosing unit for automated acid/base addition.');
    notes.innerHTML = notices.map((notice) => `<div class="recommendation-note">ⓘ ${escapeHtml(notice)}</div>`).join('');

    if (!stations && !reactor && !mixing && !dosing && !ph && !temperature) {
      code.textContent = 'Answer the questions to see your recommendation';
      return;
    }
    const parts = ['ChemSynt 301'];
    if (stations) parts.push(stations === 1 ? '1-Station' : `${stations}-Parallel`);
    if (reactor) parts.push({ vials: 'Vials', '100ml': '100mL', '400ml': '400mL', multi: 'Multi-Scale' }[reactor]);
    if (mixing) parts.push(mixing === 'ohs' ? 'OHS' : 'Magnetic');
    if (dosing && dosing !== 'none') parts.push({ funnel: 'Funnel', du50: 'DU50', du50x2: 'DU50x2' }[dosing]);
    if (ph && ph !== 'none') parts.push('pH-Meter');
    if (temperature === 'chiller') parts.push('External-Chiller');
    code.textContent = parts.join(' · ');
  }

  quiz.addEventListener('change', (event) => {
    const question = questions.find((item) => item.id === event.target.name);
    const index = Number(event.target.value);
    if (question.multi) {
      const selected = [...quiz.querySelectorAll(`input[name="${question.id}"]:checked`)].map((input) => Number(input.value));
      if (selected.length) answers[question.id] = selected;
      else delete answers[question.id];
    } else answers[question.id] = index;
    renderQuiz();
    renderRecommendation();
    if (requestPrepared || Object.keys(answers).length > 0) populateRequest();
  });

  function clean(value) { return value.replace(' — accessory', '').replace(' — accessories', ''); }
  function buildRecommendationText() {
    const stations = valueFor('q4');
    const reactor = valueFor('q5');
    const mixing = valueFor('q6');
    const dosing = valueFor('q7');
    const ph = valueFor('q8');
    const temperature = valueFor('q9');
    const lines = ['Recommended configuration:'];
    if (stations) lines.push(`• Reaction stations: ${stationsText(stations)}`);
    if (reactor) lines.push(`• Reactor scale: ${clean(REACTOR[reactor])}`);
    if (mixing) lines.push(`• Mixing: ${clean(MIX[mixing])}`);
    if (dosing) lines.push(`• Reagent dosing: ${clean(DOSING[dosing])}`);
    if (ph) lines.push(`• pH: ${clean(PH[ph])}`);
    if (temperature) lines.push(`• Temperature range: ${TEMPERATURE[temperature]}`);
    const profile = [];
    if (selectedLabels('q1')) profile.push(`• Workflow: ${selectedLabels('q1')}`);
    if (selectedLabels('q2')) profile.push(`• Critical activity: ${selectedLabels('q2')}`);
    if (selectedLabels('q3')) profile.push(`• Reaction-station experience: ${selectedLabels('q3')}`);
    let text = `ChemSynt 301 — configuration advisor result\nConfiguration code: ${code.textContent}\n\n${lines.join('\n')}`;
    if (profile.length) text += `\n\nProfile:\n${profile.join('\n')}`;
    return text;
  }

  function populateRequest(force = false) {
    if (!message || !hiddenCode) return;
    if (!force && message.value && message.value !== generatedMessage) return;
    requestPrepared = true;
    hiddenCode.value = code.textContent || 'ChemSynt 301';
    generatedMessage = buildRecommendationText();
    message.value = generatedMessage;
    message.dispatchEvent(new Event('input', { bubbles: true }));
  }

  configureButton.addEventListener('click', () => {
    populateRequest(true);
    requestSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => message.focus({ preventScroll: true }), 350);
  });
  document.querySelector('#reset-advisor').addEventListener('click', () => {
    Object.keys(answers).forEach((key) => delete answers[key]);
    requestPrepared = false;
    generatedMessage = '';
    hiddenCode.value = '';
    message.value = '';
    renderQuiz();
    renderRecommendation();
  });

  const country = form.querySelector('[data-country-select]');
  const industry = form.querySelector('[data-industry-select]');
  const segment = form.querySelector('[data-segment-select]');
  const relation = form.elements.relation;
  const optionMarkup = (values) => values.map((value) => `<option value="${escapeHtml(Array.isArray(value) ? value[0] : value)}">${escapeHtml(Array.isArray(value) ? value[1] : value)}</option>`).join('');
  country.insertAdjacentHTML('beforeend', optionMarkup(DATA.countries));
  industry.insertAdjacentHTML('beforeend', optionMarkup(DATA.industries));
  function updateSegment() {
    const values = DATA.sectors[industry.value] || [];
    const enabled = relation.value === 'End-user' && values.length > 0;
    segment.innerHTML = `<option value=""></option>${optionMarkup(values)}`;
    segment.disabled = !enabled;
    segment.required = enabled;
    if (!enabled) segment.value = '';
  }
  relation.addEventListener('change', updateSegment);
  industry.addEventListener('change', updateSegment);

  function validateForm() {
    form.classList.add('was-validated');
    form.querySelectorAll('input, select, textarea').forEach((field) => field.setAttribute('aria-invalid', String(!field.validity.valid)));
    if (!form.checkValidity()) {
      form.querySelector(':invalid')?.focus();
      return false;
    }
    return true;
  }
  form.addEventListener('input', (event) => {
    if (event.target.matches('input, select, textarea')) event.target.setAttribute('aria-invalid', String(!event.target.validity.valid));
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.querySelector('#request-status');
    status.classList.remove('is-success');
    if (!validateForm()) {
      status.textContent = 'Please complete the required fields.';
      return;
    }
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    status.textContent = 'Sending request...';
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.success) throw new Error(result?.message || 'We could not send your request. Please try again.');
        form.reset();
        form.classList.remove('was-validated');
        form.querySelectorAll('input, select, textarea').forEach((field) => field.removeAttribute('aria-invalid'));
        updateSegment();
        Object.keys(answers).forEach((key) => delete answers[key]);
        renderQuiz();
        renderRecommendation();
        requestPrepared = false;
        generatedMessage = '';
        status.textContent = result.message || 'Request sent.';
        status.classList.add('is-success');
        status.focus();
      })
      .catch((error) => {
        status.classList.remove('is-success');
        status.textContent = error.message || 'We could not send your request. Please try again.';
      })
      .finally(() => { submitButton.disabled = false; });
  });

  renderQuiz();
  renderRecommendation();
}());
