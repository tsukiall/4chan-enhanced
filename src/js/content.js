import '../css/content.scss';

import quickActions from './components/quickActions.js';
import syncSettings from './components/syncSettings.js';
import threadWatcher from './components/threadWatcher.js';
import catalogImageHover from './components/catalogImageHover.js';

(async () => {
  await syncSettings();
  quickActions();
  threadWatcher();
  await catalogImageHover();
})();
