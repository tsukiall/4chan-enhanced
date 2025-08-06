import quickActions from './components/quickActions.js';
import syncSettings from './components/syncSettings.js';

import '../css/content.scss';

(async () => {
  await syncSettings();
  quickActions();
})();
