const updateUnseen = (settings, threadID, lastSeen) => {
  const posts = document.querySelectorAll('.board .thread .postContainer');

  const unseen = posts.length - (Array.from(posts).indexOf(lastSeen) + 1);

  settings[threadID] = [lastSeen.id, unseen];
  localStorage.setItem('4chan-continue-thread', JSON.stringify(settings));
  document.dispatchEvent(new CustomEvent('fce:storage-updated'));
  document.dispatchEvent(new CustomEvent('fce:continue-updated'));
}

export default () => {
  if (location.href.match(/.+\/thread\/.+/)) {
    const threadID = location.href.match(/.+\/thread\/(.*)/)[1];
    const settings = JSON.parse(localStorage.getItem('4chan-continue-thread')) || {};
    let [postID, _] = settings[threadID] ? settings[threadID] : [];

    let lastSeen = postID ? document.querySelector(`#${postID}`) : document.querySelector('.board .thread .postContainer');

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
            updateUnseen(settings, threadID, lastSeen);
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
      updateUnseen(settings, threadID, lastSeen);
      intersectionObserver.observe(lastSeen);
    });

    mutationObserver.observe(document.querySelector('.board .thread'), { attributes: true, childList: true });
  }
}
