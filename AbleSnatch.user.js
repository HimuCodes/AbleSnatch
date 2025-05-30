// ==UserScript==
// @name         AbleSnatch - Ableton Downloader
// @namespace    https://github.com/HimuCodes/AbleSnatch
// @version      2.10 // Or your current version, e.g., 1.0.0 for initial release
// @description  Replaces Ableton trial download button with a styled selector for stable/beta versions, with animations and stable layout.
// @author       HimuCodes
// @match        https://www.ableton.com/en/trial/
// @grant        GM_xmlhttpRequest
// @connect      cdn-downloads.ableton.com
// @connect      www.ableton.com
// @homepageURL  https://github.com/HimuCodes/AbleSnatch
// @supportURL   https://github.com/HimuCodes/AbleSnatch/issues
// @updateURL    https://raw.githubusercontent.com/HimuCodes/AbleSnatch/main/able_snatch.user.js
// @downloadURL  https://raw.githubusercontent.com/HimuCodes/AbleSnatch/main/able_snatch.user.js
// @license      MIT
// ==/UserScript==

// This script replaces the Ableton trial download button with a custom dropdown selector for stable and beta versions,

(function () {
  'use strict';

  // Inject CSS for styling and animations
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .abl-form-container {
        min-height: 10px; /* Reserve space to prevent layout shift */
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        align-items: flex-start;
      }
      .abl-form-input-group {
        display: inline-block;
        margin-bottom: 10px;
        vertical-align: top;
        opacity: 1;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .abl-form-input-group.hidden {
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
        position: absolute; /* Remove from flow but keep animation */
      }
      .abl-form-select-wrapper {
        position: relative;
        min-width: 200px;
      }
      .abl-form-select {
        appearance: none;
        background: #2b2b2b;
        color: #ffffff;
        border: 1px solid #555;
        border-radius: 4px;
        padding: 8px 30px 8px 12px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        width: 100%;
        cursor: pointer;
        transition: border-color 0.3s ease;
      }
      .abl-form-select:focus {
        outline: none;
        border-color: #ff7643;
      }
      .abl-form-select-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #ffffff;
        pointer-events: none;
      }
      .abl-button--primary {
        background: #002af5;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.2s ease;
      }
      .abl-button--primary:hover {
        background: #e55a2a;
        transform: scale(1.05);
      }
      .abl-button--primary:disabled {
        background: #555;
        cursor: not-allowed;
        transform: none;
      }
      .abl-form-input-group label {
        display: block;
      }
      .abl-visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }
    `;
    document.head.appendChild(style);
  }

  function fetchVersionsFrom(url, label, callback) {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      onload: function (response) {
        const html = response.responseText;
        const matches = [...html.matchAll(/<h2[^>]*>\s*(\d+\.\d+(?:\.\d+)?(?:b\d+)?)\s*Release Notes\s*<\/h2>/gi)];
        const versions = matches.map(m => ({ version: m[1], status: label }));
        callback(versions);
      }
    });
  }

  function createDropdown(options, id, labelText) {
    const wrapper = document.createElement('span');
    wrapper.className = 'abl-form-input-group';

    const label = document.createElement('label');
    label.htmlFor = id;
    label.innerHTML = `<span class="abl-visually-hidden"><span>${labelText}</span></span>`;

    const selectWrapper = document.createElement('span');
    selectWrapper.className = 'abl-form-select-wrapper abl-w-100p';

    const select = document.createElement('select');
    select.className = 'abl-form-select';
    select.name = id;
    select.id = id;
    select.required = true;

    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.selected) option.selected = true;
      select.appendChild(option);
    });

    const icon = document.createElement('span');
    icon.className = 'abl-form-select-icon';

    selectWrapper.appendChild(select);
    selectWrapper.appendChild(icon);
    label.appendChild(selectWrapper);
    wrapper.appendChild(label);

    return { wrapper, select };
  }

  function fetchAllVersions(callback) {
    let allVersions = [];
    let loaded = 0;

    function checkDone() {
      loaded++;
      if (loaded === 2) callback(allVersions);
    }

    fetchVersionsFrom('https://www.ableton.com/en/release-notes/live-12/', 'stable', (versions) => {
      allVersions = allVersions.concat(versions);
      checkDone();
    });

    fetchVersionsFrom('https://www.ableton.com/en/release-notes/live-12-beta/', 'beta', (versions) => {
      allVersions = allVersions.concat(versions);
      checkDone();
    });
  }

  function parseVersion(ver) {
    const match = ver.match(/(\d+)\.(\d+)(?:\.(\d+))?(?:b(\d+))?/);
    return match ? match.slice(1).map(n => parseInt(n || 0)) : [0, 0, 0, 0];
  }

  window.addEventListener('load', () => {
    injectStyles(); // Inject CSS and animations

    const interval = setInterval(() => {
      const originalBtn = document.querySelector('.test-download-lite-button');
      const osSelect = document.querySelector('#id_os_arch');

      if (originalBtn && osSelect) {
        clearInterval(interval);
        originalBtn.style.display = 'none';

        const form = osSelect.closest('form');

        // Create container for dropdowns to prevent layout shift
        const container = document.createElement('div');
        container.className = 'abl-form-container';
        form.appendChild(container);

        const { wrapper: typeWrapper, select: typeSelect } = createDropdown([
          { value: 'stable', label: 'Stable', selected: true },
          { value: 'beta', label: 'Beta' }
        ], 'version_type', 'Version Type');
        container.appendChild(typeWrapper);

        const versionWrapper = document.createElement('span');
        versionWrapper.className = 'abl-form-input-group';
        const versionLabel = document.createElement('label');
        versionLabel.htmlFor = 'version_select';
        versionLabel.innerHTML = '<span class="abl-visually-hidden"><span>Select Version</span></span>';

        const versionSelectWrapper = document.createElement('span');
        versionSelectWrapper.className = 'abl-form-select-wrapper abl-w-100p';
        const versionSelect = document.createElement('select');
        versionSelect.className = 'abl-form-select';
        versionSelect.id = 'version_select';
        versionSelect.required = true;
        versionSelectWrapper.appendChild(versionSelect);
        versionSelectWrapper.appendChild(document.createElement('span')).className = 'abl-form-select-icon';
        versionLabel.appendChild(versionSelectWrapper);
        versionWrapper.appendChild(versionLabel);
        container.appendChild(versionWrapper);

        const { wrapper: editionWrapper, select: editionSelect } = createDropdown([
          { value: '', label: 'Choose...', selected: true },
          { value: 'suite', label: 'Suite' },
          { value: 'standard', label: 'Standard' },
          { value: 'intro', label: 'Intro' },
          { value: 'trial', label: 'Trial' }
        ], 'edition', 'Edition');
        container.appendChild(editionWrapper);

        const customBtn = document.createElement('button');
        customBtn.className = 'abl-button abl-button--primary';
        customBtn.textContent = 'Loading versions...';
        customBtn.type = 'button';
        customBtn.disabled = true;
        customBtn.style.marginTop = '15px';
        form.appendChild(customBtn);

        fetchAllVersions((versions) => {
          const grouped = versions.reduce((acc, v) => {
            acc[v.status] = acc[v.status] || [];
            acc[v.status].push(v.version);
            return acc;
          }, {});

          function updateVersionOptions() {
            const selectedType = typeSelect.value;
            const opts = grouped[selectedType] || [];
            versionSelect.innerHTML = '';
            opts.sort((a, b) => {
              const va = parseVersion(a);
              const vb = parseVersion(b);
              for (let i = 0; i < va.length; i++) {
                if (vb[i] !== va[i]) return vb[i] - va[i];
              }
              return 0;
            }).forEach(v => {
              const opt = document.createElement('option');
              opt.value = v;
              opt.textContent = v;
              versionSelect.appendChild(opt);
            });
            customBtn.disabled = opts.length === 0;
            customBtn.textContent = opts.length ? 'Download Selected Version' : 'No Versions Available';
            editionWrapper.className = `abl-form-input-group${selectedType === 'stable' ? '' : ' hidden'}`;
            editionSelect.required = selectedType === 'stable';
          }

          typeSelect.addEventListener('change', updateVersionOptions);
          updateVersionOptions();
        });

        customBtn.addEventListener('click', () => {
          const osValue = osSelect.value;
          const selectedType = typeSelect.value;
          const version = versionSelect.value;
          const edition = editionSelect.value;

          if (!version) return alert('Please select a version.');
          if (selectedType === 'stable' && !edition) return alert('Please select an edition for stable version.');

          let url;
          if (selectedType === 'beta') {
            url = `https://cdn-downloads.ableton.com/channels/${version}/ableton_live_beta_${version.replace('.', '')}${osValue === 'mac-universal' ? '_universal.dmg' : '_64.zip'}`;
          } else {
            url = `https://cdn-downloads.ableton.com/channels/${version}/ableton_live_${edition}_${version}${osValue === 'mac-universal' ? '_universal.dmg' : '_64.zip'}`;
          }

          window.location.href = url; // Download in same tab
        });
      }
    }, 300);
  });
})();