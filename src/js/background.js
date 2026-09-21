import { iterableSettingKeys, settingKeys } from "./util/keys.js";

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  (async () => {
    let data;

    switch (message.event) {
      case 'getStorage':
        const response = {};

        for (let key of settingKeys) {
          data = await chrome.storage.sync.get(key);
          if (data[key]) {
            response[key] = data[key];
          }
        }

        for (let key of iterableSettingKeys) {
          for (let board of message.boards) {
            data = await chrome.storage.sync.get(`${key}-${board}`);

            if (data[`${key}-${board}`]) {
              response[`${key}-${board}`] = data[`${key}-${board}`];
            }
          }
        }

        if (Object.keys(response).length) {
          sendResponse(response);
        } else {
          sendResponse(null);
        }

        break;
      case 'setStorage':
        const items = {};

        for (let key in message.data) {
          const size = new TextEncoder().encode(key + JSON.stringify(message.data[key])).length;

          if (size > chrome.storage.sync.QUOTA_BYTES_PER_ITEM) {
            console.warn(`4chan Enhanced: not syncing ${key}, ${size} bytes is over the ${chrome.storage.sync.QUOTA_BYTES_PER_ITEM} byte limit`);
            continue;
          }

          items[key] = message.data[key];
        }

        await chrome.storage.sync.set(items);

        sendResponse(true);
    }
  })().catch(error => {
    console.error(`4chan Enhanced: ${message.event} failed`, error);
    sendResponse({ error: error.message });
  });

  return true;
});
