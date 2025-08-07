const updateWatcher = (watchList) => {
  watchList.querySelectorAll('li').forEach((item, index, items) => {
    if (index === 0 || items[index - 1].id.split('-')[2] !== item.id.split('-')[2]) {
      const heading = document.createElement('div');
      heading.textContent = `/${item.id.split('-')[2]}/`;
      heading.classList.add('heading');
      item.before(heading);
    }
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
  }
}
