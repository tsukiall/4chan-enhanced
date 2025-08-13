import { apiKeys } from '../util/keys.js';

const updateWatcher = (watchList) => {
  const threads = JSON.parse(localStorage.getItem('4chan-watch'));
  watchList.querySelectorAll('.heading').forEach(e => {
    e.remove();
  });

  watchList.querySelectorAll('li').forEach((item, index, items) => {
    if (index === 0 || items[index - 1].id.split('-')[2] !== item.id.split('-')[2]) {
      const heading = document.createElement('div');
      heading.textContent = `/${item.id.split('-')[2]}/`;
      heading.classList.add('heading');
      item.before(heading);
    }

    const threadKey = Object.keys(threads).find(e => e === item.id.replace('watch-', ''));
    const [threadID, board] = threadKey.split('-');
    const thread = threads[threadKey];

    const newItem = document.createElement('li');
    newItem.id = item.id;
    newItem.classList.add('thread-item');

    const unwatchButton = document.createElement('button');
    unwatchButton.classList.add('unwatch');
    unwatchButton.setAttribute('data-cmd', 'unwatch');
    unwatchButton.setAttribute('data-id', threadID);
    unwatchButton.setAttribute('data-board', board);
    newItem.append(unwatchButton);

    const unwatchIcon = document.createElement('img');
    unwatchIcon.src = chrome.runtime.getURL('icons/x-solid-full.svg');
    unwatchButton.append(unwatchIcon);

    let threadIcon = 'foundericon';

    if (!thread[1]) {
      threadIcon = 'adminicon';
    } else if (thread[3]) {
      threadIcon = 'developericon';
    } else if (thread[4]) {
      threadIcon = 'managericon';
    } else if (thread[2]) {
      threadIcon = 'modicon';
    }

    const threadStatus = document.createElement('img');
    threadStatus.src = `${apiKeys.staticApi}image/${threadIcon}.gif`;
    newItem.append(threadStatus);

    const continueThreads = JSON.parse(localStorage.getItem('4chan-continue-thread')) || {};
    const continueThread = Object.keys(continueThreads).find(e => e === threadID);
    let unseen = continueThread ? continueThreads[continueThread][1] : 0;
    unseen += thread[2];

    const replies = unseen > 0 ? `(${unseen}) ` : '';

    const link = document.createElement('a');
    link.href = item.querySelector('a').href.split('#')[0];
    link.classList = item.querySelector('a').classList;
    link.textContent = `${replies}${thread[0]}`;
    newItem.append(link);

    item.replaceWith(newItem);
  });
}

export default () => {
  const settings = JSON.parse(localStorage.getItem('4chan-settings'));
  const isEnabled = settings.threadWatcher;

  if (isEnabled) {
    const watchList = document.querySelector('#threadWatcher #watchList');

    updateWatcher(watchList);

    const observer = new MutationObserver((_, self) => {
      self.disconnect();
      updateWatcher(watchList);
      self.observe(watchList, { attributes: true, childList: true, subtree: true });
    });

    observer.observe(watchList, { attributes: true, childList: true, subtree: true });

    document.addEventListener('fce:continue-updated', () => {
      observer.disconnect();
      updateWatcher(watchList);
      observer.observe(watchList, { attributes: true, childList: true, subtree: true });
    });
  }
}
