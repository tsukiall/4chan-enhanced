import { iterableSettingKeys, settingKeys } from './util/keys.js';

const baseSetItem = Storage.prototype.setItem;

Storage.prototype.setItem = function (key, _, calledFromSite = true) {
  if (settingKeys.indexOf(key) > -1 && calledFromSite || iterableSettingKeys.some(e => key.includes(e))) {
    document.dispatchEvent(new CustomEvent('fce:storage-updated'));
  }

  baseSetItem.apply(this, arguments);
}
