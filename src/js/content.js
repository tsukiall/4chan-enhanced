import '../css/content.scss';

import galleryMode from './components/galleryMode.js';
import quickActions from './components/quickActions.js';
import syncSettings from './components/syncSettings.js';
import threadResume from './components/threadResume.js';
import threadWatcher from './components/threadWatcher.js';
import catalogImageHover from './components/catalogImageHover.js';

(async () => {
  if (!(document.querySelector("[alt='404']"))) {
    await syncSettings();
    quickActions();
    threadWatcher();
    galleryMode();
    threadResume();

    catalogImageHover();
  }

  document.body.classList.add('fce-loaded');
})();
