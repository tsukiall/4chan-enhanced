
const catalogActions = () => {
  document.querySelectorAll('.postMenuBtn').forEach(dropdown => {
    const threadID = dropdown.getAttribute('data-post-menu');

    const container = document.createElement('div');
    container.classList.add('fce-quick-actions');
    dropdown.replaceWith(container);

    const report = document.createElement('button');
    report.classList.add('fce-quick-action');
    report.setAttribute('data-report', threadID);
    container.append(report);

    const reportIcon = document.createElement('img');
    reportIcon.src = chrome.runtime.getURL('icons/flag-solid-full.svg');
    report.append(reportIcon);

    const pin = document.createElement('button');
    pin.classList.add('fce-quick-action');
    pin.setAttribute('data-pin', threadID);
    container.append(pin);

    const pinIcon = document.createElement('img');
    pinIcon.src = chrome.runtime.getURL('icons/map-pin-solid-full.svg');
    pin.append(pinIcon);

    const hide = document.createElement('button');
    hide.classList.add('fce-quick-action');
    hide.setAttribute('data-hide', threadID);
    container.append(hide);

    const hideIcon = document.createElement('img');
    hideIcon.src = chrome.runtime.getURL('icons/eye-solid-full.svg');
    hide.append(hideIcon);
  });
}

export default () => {
  if (window.location.href.match(/.*boards\.4chan\.org\/.*\/catalog/)) {
    catalogActions();

    const observer = new MutationObserver(() => {
      catalogActions();
    });

    observer.observe(document.querySelector('#threads'), { attributes: true, childList: true, subtree: true });
  }
}
