(function () {
  'use strict';

  const DATA = window.CHEMSYNT_DATA;
  const technicalService = 'technical-service@chemglass.com';
  const galleryImages = [
    ['assets/images/chemsynt-301-reattore-per-sintesi-chimica-1-335253-335265.jpg', 'ChemSynt 301 Chemical Synthesis Reactor front view'],
    ['assets/images/chemsynt-301-reattore-per-sintesi-chimica-2-335256-335268.jpg', 'ChemSynt 301 Chemical Synthesis Reactor angled view'],
    ['assets/images/chemsynt-301-reattore-per-sintesi-chimica-3-335259-335271.jpg', 'ChemSynt 301 Chemical Synthesis Reactor with dosing equipment'],
    ['assets/images/chemsynt-301-reattore-per-sintesi-chimica-4-335262-335274.jpg', 'ChemSynt 301 Chemical Synthesis Reactor detail view']
  ];

  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  /* Product gallery */
  const galleryStage = document.querySelector('.gallery-stage');
  const galleryMain = document.querySelector('#gallery-main');
  const galleryPrev = document.querySelector('[data-gallery-prev]');
  const galleryNext = document.querySelector('[data-gallery-next]');
  const galleryStatus = document.querySelector('#gallery-status');
  let galleryIndex = 0;
  let pointerStart = null;

  function renderGallery(nextIndex, announce = true) {
    galleryIndex = Math.max(0, Math.min(galleryImages.length - 1, nextIndex));
    galleryMain.src = galleryImages[galleryIndex][0];
    galleryMain.alt = galleryImages[galleryIndex][1];
    galleryPrev.disabled = galleryIndex === 0;
    galleryNext.disabled = galleryIndex === galleryImages.length - 1;
    galleryPrev.setAttribute('aria-disabled', String(galleryPrev.disabled));
    galleryNext.setAttribute('aria-disabled', String(galleryNext.disabled));
    if (announce) galleryStatus.textContent = `Image ${galleryIndex + 1} of ${galleryImages.length}`;
  }

  galleryPrev.addEventListener('click', () => renderGallery(galleryIndex - 1));
  galleryNext.addEventListener('click', () => renderGallery(galleryIndex + 1));
  galleryStage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  galleryStage.addEventListener('pointerup', (event) => {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    renderGallery(galleryIndex + (deltaX < 0 ? 1 : -1));
  });
  galleryStage.addEventListener('pointercancel', () => { pointerStart = null; });
  renderGallery(0, false);

  /* Product tabs and responsive navigator */
  const tabShell = document.querySelector('#product-tabs');
  const productNav = document.querySelector('.product-nav');
  const tabButtons = [...document.querySelectorAll('[data-tab]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  const mobileMenuButton = document.querySelector('.product-nav-mobile');
  const mobileTabLabel = document.querySelector('[data-mobile-tab-label]');
  const quoteCta = document.querySelector('[data-quote-cta]');
  const productRecap = document.querySelector('[data-product-recap]');
  const accessoryRecap = document.querySelector('[data-accessory-recap]');
  const hashAliases = { resources: 'download', support: 'service', configurator: 'description' };
  let activeTab = 'description';

  function closeMobileMenu(restoreFocus = false) {
    productNav.classList.remove('is-menu-open');
    document.body.classList.remove('is-menu-open');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) mobileMenuButton.focus();
  }

  function openMobileMenu() {
    productNav.classList.add('is-menu-open');
    document.body.classList.add('is-menu-open');
    mobileMenuButton.setAttribute('aria-expanded', 'true');
    document.querySelector(`[data-tab="${activeTab}"]`).focus();
  }

  function scrollToTabs() {
    tabShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function activateTab(name, options = {}) {
    const tabName = tabButtons.some((button) => button.dataset.tab === name) ? name : 'description';
    const leavingModels = activeTab === 'models' && tabName !== 'models';
    activeTab = tabName;
    if (leavingModels) resetModelState();

    tabButtons.forEach((button) => {
      const selected = button.dataset.tab === tabName;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== tabName; });
    mobileTabLabel.textContent = document.querySelector(`[data-tab="${tabName}"]`).textContent;
    closeMobileMenu(false);

    if (tabName === 'models') initializeModels();
    updateProductRecap();

    if (options.updateHash !== false) history.pushState(null, '', `#${tabName}`);
    if (options.scroll !== false) scrollToTabs();
    if (options.focus) document.querySelector(`[data-tab="${tabName}"]`).focus();
  }

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
    button.addEventListener('keydown', (event) => {
      let nextIndex = null;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % tabButtons.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabButtons.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      activateTab(tabButtons[nextIndex].dataset.tab, { focus: true });
    });
  });

  mobileMenuButton.addEventListener('click', () => {
    if (productNav.classList.contains('is-menu-open')) closeMobileMenu(true);
    else openMobileMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && productNav.classList.contains('is-menu-open')) closeMobileMenu(true);
  });
  window.addEventListener('hashchange', () => {
    const requested = location.hash.slice(1);
    activateTab(hashAliases[requested] || requested, { updateHash: false });
  });

  document.querySelectorAll('[data-open-models]').forEach((button) => {
    button.addEventListener('click', () => activateTab('models'));
  });

  /* Models and model-specific accessory selection */
  const modelGrid = document.querySelector('#model-grid');
  const modelGroups = document.querySelector('#model-groups');
  const modelLoader = document.querySelector('[data-model-loader]');
  const modelContent = document.querySelector('[data-model-content]');
  const modelError = document.querySelector('[data-model-error]');
  const quoteSection = document.querySelector('#model-quote');
  const selectedProducts = document.querySelector('#selected-products');
  let modelsInitialized = false;
  let selectedModel = null;
  let openDetails = null;
  let selectedOptional = new Set();
  let modelLoadTimer = null;

  function modelByCode(code) {
    return DATA.models.find((model) => model.code === code) || null;
  }

  function initializeModels() {
    if (modelsInitialized) return;
    modelsInitialized = true;
    modelLoader.hidden = false;
    modelContent.hidden = true;
    modelError.hidden = true;
    modelLoadTimer = window.setTimeout(() => {
      try {
        renderModels();
        modelLoader.hidden = true;
        modelContent.hidden = false;
      } catch (error) {
        modelLoader.hidden = true;
        modelError.hidden = false;
      }
    }, 180);
  }

  function renderModels() {
    const cards = DATA.models.map((model) => {
      const isSelected = selectedModel && selectedModel.code === model.code;
      const isOpen = openDetails === model.code;
      return `
        <article class="model-card${isSelected ? ' is-selected' : ''}">
          <button class="model-select" type="button" data-select-model="${model.code}" aria-pressed="${isSelected}">
            <span class="model-card__image"><img src="${model.image}" alt="${escapeHtml(model.name)}" loading="lazy"></span>
            <span class="model-card__info"><h3>${escapeHtml(model.name)}</h3><span class="model-card__code">cod. ${model.code}</span></span>
          </button>
          <button class="model-details-button" type="button" data-model-details="${model.code}" aria-expanded="${isOpen}" aria-controls="details-${model.code}">Details</button>
        </article>`;
    }).join('');
    const details = openDetails ? (() => {
      const model = modelByCode(openDetails);
      return `<section id="details-${model.code}" class="model-details-panel"><button class="model-details-close" type="button" data-close-model-details aria-label="Close details">×</button><h3>${escapeHtml(model.name)}</h3><strong>Includes:</strong><ul>${model.details.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`;
    })() : '';
    modelGrid.innerHTML = cards + details;
  }

  function renderAccessoryCard(accessory, type, groupTitle) {
    const selectable = type === 'optional';
    const selected = selectable && selectedOptional.has(accessory.code);
    return `
      <article class="accessory-card${selected ? ' is-selected' : ''}" data-accessory-card="${accessory.code}">
        <button class="accessory-select" type="button" ${selectable ? `data-toggle-accessory="${accessory.code}" aria-pressed="${selected}" aria-label="${selected ? 'Remove' : 'Add'} ${escapeHtml(accessory.name)} ${selected ? 'from' : 'to'} quote request"` : 'disabled aria-hidden="true" tabindex="-1"'}>
          <img src="${accessory.image}" alt="${escapeHtml(accessory.name)}" loading="lazy">
        </button>
        <div class="accessory-card__info"><h4>${escapeHtml(accessory.name)}</h4><span class="accessory-card__code">cod. ${accessory.code}</span></div>
        <button class="discover-button" type="button" data-discover="${accessory.code}" data-group="${escapeHtml(groupTitle)}">Discover more</button>
      </article>`;
  }

  function renderGroups() {
    if (!selectedModel) {
      modelGroups.innerHTML = '';
      return;
    }
    modelGroups.innerHTML = selectedModel.groups.map((group) => {
      let abstract = `Click on the image of the accessory to include it in your information request.`;
      if (group.type === 'included') abstract = `The <strong>“${escapeHtml(selectedModel.name)}”</strong> model includes the following accessories:`;
      if (group.type === 'required') abstract = `The <strong>“${escapeHtml(selectedModel.name)}”</strong> model requires the following accessories:`;
      const cards = group.codes.map((code) => renderAccessoryCard(DATA.accessories[code], group.type, group.title)).join('');
      return `<section class="accessory-group" data-group-type="${group.type}"><h3>${escapeHtml(group.title)}</h3><p class="accessory-group__abstract">${abstract}</p><div class="accessory-group__grid">${cards}</div></section>`;
    }).join('');
    updateSelectedProducts();
  }

  function selectModel(code) {
    const model = modelByCode(code);
    if (!model) return;
    selectedOptional = new Set();
    selectedModel = model;
    openDetails = null;
    quoteSection.hidden = true;
    modelLoader.hidden = false;
    modelContent.hidden = true;
    window.clearTimeout(modelLoadTimer);
    modelLoadTimer = window.setTimeout(() => {
      renderModels();
      renderGroups();
      updateProductRecap();
      modelLoader.hidden = true;
      modelContent.hidden = false;
      modelGroups.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 160);
  }

  function toggleAccessory(code) {
    if (!selectedModel || !DATA.accessories[code]) return;
    if (selectedOptional.has(code)) selectedOptional.delete(code);
    else selectedOptional.add(code);
    renderGroups();
    updateProductRecap();
  }

  function resetModelState() {
    selectedModel = null;
    selectedOptional = new Set();
    openDetails = null;
    quoteSection.hidden = true;
    document.querySelector('#model-quote-form').reset();
    document.querySelector('#model-quote-form').classList.remove('was-validated');
    updateSegmentField();
    renderRegionField();
    if (modelsInitialized) {
      renderModels();
      renderGroups();
    }
  }

  function updateSelectedProducts() {
    if (!selectedModel) {
      selectedProducts.textContent = 'Please select a model.';
      return;
    }
    const lines = [`Model`, `cod. ${selectedModel.code} - ${selectedModel.name}`];
    if (selectedOptional.size) {
      lines.push('', 'Optional accessories');
      selectedOptional.forEach((code) => lines.push(`cod. ${code} - ${DATA.accessories[code].name}`));
    }
    selectedProducts.innerText = lines.join('\n');
  }

  function updateProductRecap() {
    if (activeTab === 'models' && selectedModel) {
      productRecap.textContent = `${selectedModel.code} — ${selectedModel.name}`;
      accessoryRecap.hidden = false;
      accessoryRecap.textContent = selectedOptional.size ? `${selectedOptional.size} optional accessor${selectedOptional.size === 1 ? 'y' : 'ies'} selected` : 'No optional accessories selected';
      quoteCta.textContent = 'Send quote';
      return;
    }
    productRecap.textContent = 'ChemSynt 301 Chemical Synthesis Reactor';
    accessoryRecap.hidden = true;
    quoteCta.textContent = activeTab === 'models' ? 'Please select the model' : 'Request a quote';
  }

  modelGrid.addEventListener('click', (event) => {
    const selectButton = event.target.closest('[data-select-model]');
    if (selectButton) selectModel(selectButton.dataset.selectModel);
    const detailsButton = event.target.closest('[data-model-details]');
    if (detailsButton) {
      openDetails = openDetails === detailsButton.dataset.modelDetails ? null : detailsButton.dataset.modelDetails;
      renderModels();
    }
    if (event.target.closest('[data-close-model-details]')) {
      const previous = openDetails;
      openDetails = null;
      renderModels();
      document.querySelector(`[data-model-details="${previous}"]`)?.focus();
    }
  });

  modelGroups.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-toggle-accessory]');
    if (toggle) toggleAccessory(toggle.dataset.toggleAccessory);
    const discover = event.target.closest('[data-discover]');
    if (discover) openAccessoryDialog(discover.dataset.discover, discover.dataset.group, discover);
  });

  function openQuoteForm() {
    if (activeTab !== 'models') {
      activateTab('models');
      return;
    }
    if (!selectedModel) {
      document.querySelector('[data-select-model]')?.focus();
      return;
    }
    updateSelectedProducts();
    quoteSection.hidden = false;
    quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  quoteCta.addEventListener('click', openQuoteForm);

  /* Product quote form dependencies and offline handoff */
  const quoteForm = document.querySelector('#model-quote-form');
  const countrySelect = quoteForm.querySelector('[data-country-select]');
  const industrySelect = quoteForm.querySelector('[data-industry-select]');
  const segmentSelect = quoteForm.querySelector('[data-segment-select]');
  const regionField = quoteForm.querySelector('[data-region-field]');
  const relationSelect = quoteForm.elements.relation;
  const modelFormStatus = document.querySelector('#model-form-status');
  const modelFallback = document.querySelector('#model-email-fallback');

  function optionMarkup(values) {
    return values.map((value) => `<option value="${escapeHtml(Array.isArray(value) ? value[0] : value)}">${escapeHtml(Array.isArray(value) ? value[1] : value)}</option>`).join('');
  }
  countrySelect.insertAdjacentHTML('beforeend', optionMarkup(DATA.countries));
  industrySelect.insertAdjacentHTML('beforeend', optionMarkup(DATA.industries));

  function renderRegionField() {
    const values = DATA.provinces[countrySelect.value];
    if (values) {
      regionField.innerHTML = `Province/State *<select name="region" autocomplete="address-level1" required><option value=""></option>${optionMarkup(values)}</select><span class="field-error">required</span>`;
    } else {
      regionField.innerHTML = 'Province/State *<input name="region" autocomplete="address-level1" required><span class="field-error">required</span>';
    }
  }
  renderRegionField();

  function updateSegmentField() {
    const values = DATA.sectors[industrySelect.value] || [];
    const enabled = relationSelect.value === 'user' && values.length > 0;
    segmentSelect.innerHTML = `<option value=""></option>${optionMarkup(values)}`;
    segmentSelect.disabled = !enabled;
    segmentSelect.required = enabled;
    if (!enabled) segmentSelect.value = '';
  }
  countrySelect.addEventListener('change', renderRegionField);
  industrySelect.addEventListener('change', updateSegmentField);
  relationSelect.addEventListener('change', updateSegmentField);

  function markFormValidity(form) {
    form.classList.add('was-validated');
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.setAttribute('aria-invalid', String(!field.validity.valid));
    });
    if (!form.checkValidity()) {
      form.querySelector(':invalid')?.focus();
      return false;
    }
    return true;
  }

  quoteForm.addEventListener('input', (event) => {
    if (event.target.matches('input, select, textarea')) event.target.setAttribute('aria-invalid', String(!event.target.validity.valid));
  });

  function buildProductQuoteBody(formData) {
    const optionalLines = [...selectedOptional].map((code) => `- ${code}: ${DATA.accessories[code].name}`);
    return [
      'ChemSynt 301 product quote request', '',
      `Selected model: ${selectedModel.code} - ${selectedModel.name}`,
      `Optional accessories:`, optionalLines.length ? optionalLines.join('\n') : 'None selected', '',
      'Contact data',
      `Title: ${formData.get('title')}`,
      `Name: ${formData.get('firstName')} ${formData.get('lastName')}`,
      `Email: ${formData.get('email')}`,
      `Phone: ${formData.get('phone')}`, '',
      'Company data',
      `Company: ${formData.get('company')}`,
      `Relation with Chemglass: ${formData.get('relation') === 'user' ? 'End-user' : 'Dealer'}`,
      `Address: ${formData.get('address')}`,
      `City: ${formData.get('city')}`,
      `ZIP code: ${formData.get('zip')}`,
      `Country: ${formData.get('country')}`,
      `Province/State: ${formData.get('region')}`,
      `Industry: ${industrySelect.options[industrySelect.selectedIndex].text}`,
      `Segment: ${formData.get('segment') || 'Not applicable'}`, '',
      'Notes', formData.get('notes') || 'None', '',
      `Privacy accepted: Yes`,
      `Marketing communications: ${formData.get('marketing') ? 'Yes' : 'No'}`
    ].join('\n');
  }

  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selectedModel) {
      activateTab('models');
      return;
    }
    if (!markFormValidity(quoteForm)) {
      modelFormStatus.textContent = 'Please complete the required fields.';
      return;
    }
    const body = buildProductQuoteBody(new FormData(quoteForm));
    const subject = `ChemSynt 301 quote request — ${selectedModel.code}`;
    modelFormStatus.textContent = `Opening your email application. Send the prepared message to ${technicalService}.`;
    modelFallback.hidden = false;
    modelFallback.querySelector('textarea').value = body;
    window.location.href = `mailto:${technicalService}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /* Accessible local dialogs */
  const dialog = document.querySelector('#site-dialog');
  const dialogImage = dialog.querySelector('[data-dialog-image]');
  const dialogKicker = dialog.querySelector('[data-dialog-kicker]');
  const dialogTitle = dialog.querySelector('[data-dialog-title]');
  const dialogBody = dialog.querySelector('[data-dialog-body]');
  const dialogActions = dialog.querySelector('[data-dialog-actions]');
  let dialogTrigger = null;

  function openDialog(content, trigger) {
    dialogTrigger = trigger || document.activeElement;
    dialogImage.hidden = !content.image;
    if (content.image) {
      dialogImage.src = content.image;
      dialogImage.alt = content.imageAlt || '';
    } else {
      dialogImage.removeAttribute('src');
      dialogImage.alt = '';
    }
    dialogKicker.textContent = content.kicker || '';
    dialogTitle.textContent = content.title;
    dialogBody.innerHTML = content.body;
    dialogActions.innerHTML = content.actions;
    dialog.showModal();
    dialog.querySelector('[data-dialog-close]').focus();
  }

  function closeDialog() { dialog.close(); }
  dialog.querySelector('[data-dialog-close]').addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) closeDialog();
    if (event.target.closest('[data-dialog-cancel]')) closeDialog();
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('close', () => dialogTrigger?.focus());

  function openAccessoryDialog(code, group, trigger) {
    const item = DATA.accessories[code];
    if (!item) return;
    const subject = `ChemSynt 301 accessory inquiry: ${item.name} (${item.code})`;
    openDialog({
      image: item.image,
      imageAlt: item.name,
      kicker: `cod. ${item.code}`,
      title: item.name,
      body: `<p>This accessory appears in the <strong>${escapeHtml(group)}</strong> group for the selected ChemSynt 301 model. Chemglass Technical Service can confirm compatibility and prepare a quotation.</p>`,
      actions: `<a class="button button--primary" href="mailto:${technicalService}?subject=${encodeURIComponent(subject)}">Contact Technical Service</a><button class="button button--outline" type="button" data-dialog-cancel>Close</button>`
    }, trigger);
  }

  document.querySelector('[data-download-brochure]').addEventListener('click', (event) => {
    openDialog({
      kicker: 'Brochures & Leaflets',
      title: 'ChemSynt 301 Chemical Synthesis Reactor [EN]',
      body: `<p>The reference document requires an authenticated account and cannot be bundled for anonymous offline download. Request the brochure from Chemglass Technical Service and it will be sent to you directly.</p>`,
      actions: `<a class="button button--primary" href="mailto:${technicalService}?subject=${encodeURIComponent('ChemSynt 301 brochure request')}">Request brochure</a><button class="button button--outline" type="button" data-dialog-cancel>Cancel</button>`
    }, event.currentTarget);
  });

  /* Initial deep-link state */
  const initialHash = location.hash.slice(1);
  const initialTab = hashAliases[initialHash] || initialHash || 'description';
  activateTab(initialTab, { updateHash: false, scroll: false });
  if (initialTab !== 'description') {
    window.addEventListener('load', () => {
      window.setTimeout(() => window.scrollTo({ top: tabShell.offsetTop, behavior: 'instant' }), 250);
    }, { once: true });
  }
}());
