import '../css/content.scss';

import quickActions from './components/quickActions.js';
import syncSettings from './components/syncSettings.js';
import catalogImageHover from './components/catalogImageHover.js';

(async () => {
  await syncSettings();
  quickActions();
  await catalogImageHover();
})();
