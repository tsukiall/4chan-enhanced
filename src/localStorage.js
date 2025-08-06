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

const baseSetItem = Storage.prototype.setItem;

Storage.prototype.setItem = function (key, _, calledFromSite = true) {
  if (settings.indexOf(key) > -1 && calledFromSite || iterableSettings.some(e => key.includes(e))) {
    document.dispatchEvent(new CustomEvent('fce:storage-updated'));
  }

  baseSetItem.apply(this, arguments);
}
