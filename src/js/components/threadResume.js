const getSettings = () => JSON.parse(localStorage.getItem('4chan-continue-thread')) || {};

const saveSettings = (settings) => {
  localStorage.setItem('4chan-continue-thread', JSON.stringify(settings));
  document.dispatchEvent(new CustomEvent('fce:storage-updated'));
  document.dispatchEvent(new CustomEvent('fce:continue-updated'));
}

const updateUnseen = (threadID, lastSeen) => {
  const posts = document.querySelectorAll('.board .thread .postContainer');

  const unseen = posts.length - (Array.from(posts).indexOf(lastSeen) + 1);

  const settings = getSettings();
  settings[threadID] = [lastSeen.id, unseen, new Date().getTime()];
  saveSettings(settings);
}

const pruneOldThreads = () => {
  const settings = getSettings();
  const compareDate = new Date();
  compareDate.setMonth(compareDate.getMonth() - 2);

  Object.keys(settings).forEach(key => {
    if (settings[key][2] && settings[key][2] < compareDate.getTime()) {
      delete settings[key];
    }
  });

  saveSettings(settings);
}

const findLastSeen = (postID) => {
  const posts = Array.from(document.querySelectorAll('.board .thread .postContainer'));

  if (!postID) {
    return posts[0];
  }

  const lastSeen = document.querySelector(`#${postID}`);

  if (lastSeen) {
    return lastSeen;
  }

  const postNumber = parseInt(postID.replace(/\D/g, ''), 10);
  const previousPost = posts.filter(post => parseInt(post.id.replace(/\D/g, ''), 10) < postNumber).pop();

  return previousPost || posts[0];
}

export default () => {
  pruneOldThreads();

  if (location.href.match(/.+\/thread\/.+/)) {
    const threadID = location.href.match(/.+\/thread\/(\d*)/)[1];
    const settings = getSettings();
    let [postID, _] = settings[threadID] ? settings[threadID] : [];

    let lastSeen = findLastSeen(postID);

    updateUnseen(threadID, lastSeen);

    lastSeen.classList.add('current');
    const { bottom } = lastSeen.getBoundingClientRect();

    scrollTo({
      top: bottom - innerHeight + scrollY + 40,
      behavior: 'smooth',
    });


    const intersectionObserver = new IntersectionObserver((entries, self) => {
      entries.forEach(intersection => {
        if (intersection.isIntersecting) {
          document.querySelectorAll('.board .thread .postContainer.current').forEach(e => e.classList.remove('current'));

          intersection.target.classList.add('current');

          if (intersection.target !== lastSeen) {
            lastSeen = intersection.target;
            updateUnseen(threadID, lastSeen);
          }

          self.disconnect();

          if (lastSeen.nextElementSibling) {
            self.observe(lastSeen.nextElementSibling);
          }
        }
      });
    }, {
      threshold: 1,
    });

    intersectionObserver.observe(lastSeen);

    const mutationObserver = new MutationObserver(() => {
      document.dispatchEvent(new CustomEvent('fce:thread-updated'));
      updateUnseen(threadID, lastSeen);
      intersectionObserver.observe(lastSeen);
    });

    mutationObserver.observe(document.querySelector('.board .thread'), { attributes: true, childList: true });
  }
}
