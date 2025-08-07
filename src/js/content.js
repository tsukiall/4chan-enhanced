import '../css/content.scss';

import quickActions from './components/quickActions.js';
import syncSettings from './components/syncSettings.js';
import threadWatcher from './components/threadWatcher.js';
import catalogImageHover from './components/catalogImageHover.js';
import galleryMode from './components/galleryMode.js';

(async () => {
  await syncSettings();
  quickActions();
  threadWatcher();
  galleryMode();

  document.body.classList.add('fce-loaded');

  await catalogImageHover();
})();
