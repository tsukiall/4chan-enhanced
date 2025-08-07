import debounce from '../util/debounce.js';
import { iterableSettingKeys, settingKeys } from '../util/keys.js';

const downloadSettings = syncSettings => {
  for (let key of settingKeys) {
    localStorage.setItem(key, syncSettings[key], false);
  }

  window.location.reload();
}

const uploadSettings = async boards => {
  const siteSettings = {};

  for (let key of settingKeys) {
    const siteSetting = localStorage.getItem(key);

    if (siteSetting) {
      siteSettings[key] = siteSetting;
    }
  }

  for (let key of iterableSettingKeys) {
    for (let board of boards) {
      const siteSetting = localStorage.getItem(`${key}-${board}`);

      if (siteSetting) {
        siteSettings[`${key}-${board}`] = siteSetting;
      }
    }
  }

  if (Object.keys(siteSettings).length) {
    if (!siteSettings.fce_update_hash) {
      siteSettings.fce_update_hash = new Date().getTime();
      localStorage.setItem('fce_update_hash', siteSettings.fce_update_hash, false);
    }

    await chrome.runtime.sendMessage({ event: 'setStorage', data: siteSettings });
  }
}

export default async () => {
  const boards = Array.from(document.querySelectorAll('#boardNavDesktop .boardList>a')).map(e => e.textContent);

  const updateHash = localStorage.getItem('fce_update_hash');
  const syncSettings = await chrome.runtime.sendMessage({ event: 'getStorage', boards: boards });

  if (syncSettings) {
    if (updateHash) {
      if (updateHash < syncSettings.fce_update_hash) {
        downloadSettings(syncSettings);
      } else if (updateHash > syncSettings.fce_update_hash) {
        await uploadSettings(boards);
      }
    } else {
      downloadSettings(syncSettings);
    }
  } else {
    await uploadSettings(boards);
  }

  const syncLocalStorage = async () => {
    const updateHash = new Date().getTime();
    localStorage.setItem('fce_update_hash', updateHash, false);
    await uploadSettings(boards);
  }

  document.addEventListener('fce:storage-updated', debounce(syncLocalStorage, 1000));
};