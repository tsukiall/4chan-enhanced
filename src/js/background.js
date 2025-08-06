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
        for (let key in message.data) {
          data = await chrome.storage.sync.get(key);
          data[key] = message.data[key];

          await chrome.storage.sync.set(data);
        }

        sendResponse(true);
    }
  })();

  return true;
});
