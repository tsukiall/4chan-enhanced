import debounce from '../util/debounce.js';
import { iterableSettingKeys, settingKeys } from '../util/keys.js';

const sendMessage = async message => {
  const response = await chrome.runtime.sendMessage(message);

  if (response?.error) {
    throw new Error(response.error);
  }

  return response;
}

const downloadSettings = syncSettings => {
  for (let key in syncSettings) {
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

    try {
      await sendMessage({ event: 'setStorage', data: siteSettings });
    } catch (error) {
      console.error('4chan Enhanced: failed to upload settings', error);
    }
  }
}

export default async () => {
  const boards = Array.from(document.querySelectorAll('#boardNavDesktop .boardList>a')).map(e => e.textContent);

  const updateHash = localStorage.getItem('fce_update_hash');
  const uploadDebounce = debounce(uploadSettings, 5000);

  try {
    const syncSettings = await sendMessage({ event: 'getStorage', boards: boards });
    const syncHash = syncSettings?.fce_update_hash;

    if (!syncHash) {
      await uploadSettings(boards);
    } else if (!updateHash || updateHash < syncHash) {
      downloadSettings(syncSettings);
    } else if (updateHash > syncHash) {
      await uploadSettings(boards);
    }
  } catch (error) {
    console.error('4chan Enhanced: failed to sync settings', error);
  }

  document.addEventListener('fce:storage-updated', () => {
    const updateHash = new Date().getTime();
    localStorage.setItem('fce_update_hash', updateHash, false);

    uploadDebounce(boards);
  });
};
