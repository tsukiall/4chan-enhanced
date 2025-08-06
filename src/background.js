const settings = [
  '4chan-settings',
  'catalog-settings',
  'catalog-theme',
  '4chan-css',
  '4chan-volume',
  '4chan-watch',
  'fce_update_hash',
  '4chan-tw-timestamp',
];

const iterableSettings = [
  '4chan-hide-t',
  '4chan-pin',
];

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  (async () => {
    let data;

    switch (message.event) {
      case 'getStorage':
        const response = {};

        for (let key of settings) {
          data = await chrome.storage.sync.get(key);
          if (data[key]) {
            response[key] = data[key];
          }
        }

        for (let key of iterableSettings) {
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
