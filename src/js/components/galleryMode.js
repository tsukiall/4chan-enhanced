let isOpen = false;

const openGallery = (overlay, link, index, links) => {
  while (overlay.children.length) {
    overlay.removeChild(overlay.lastChild);
  }

  const mediaLink = link.querySelector('a');
  const url = mediaLink.href;
  const ext = url.match(/.*[!\/].*(\..*)/)[1];

  let media;

  switch (ext) {
    case '.jpg':
    case '.png':
    case '.gif':
    case '.svg':
      media = document.createElement('img');
      break;
    case '.webm':
    case '.mp4':
      media = document.createElement('video');
      media.autoplay = true;
      media.volume = localStorage.getItem('4chan-volume');
      media.loop = true;
      media.controls = true;
      break;
    default:
      media = document.createElement('span');
      media.textContent = ext;
  }

  media.src = url;
  media.classList.add('media');
  overlay.append(media);
  link.scrollIntoView();

  if (index > 0) {
    const prevButton = document.createElement('button');
    prevButton.classList.add('nav-button', 'previous');
    prevButton.addEventListener('click', e => {
      e.preventDefault();
      openGallery(overlay, links[index - 1], index - 1, links);
    });
    media.before(prevButton);

    const prevIcon = document.createElement('img');
    prevIcon.src = chrome.runtime.getURL('icons/backward-solid-full.svg');
    prevButton.append(prevIcon);
  }

  if (index < links.length - 1) {
    const nextButton = document.createElement('button');
    nextButton.classList.add('nav-button', 'next');
    nextButton.addEventListener('click', e => {
      e.preventDefault();
      openGallery(overlay, links[index + 1], index + 1, links);
    });
    media.after(nextButton);

    const nextIcon = document.createElement('img');
    nextIcon.src = chrome.runtime.getURL('icons/forward-solid-full.svg');
    nextButton.append(nextIcon);
  }

  const closeButton = document.createElement('button');
  closeButton.classList.add('close');
  closeButton.addEventListener('click', e => {
    e.preventDefault();
    isOpen = false;
    overlay.remove();
  });
  media.after(closeButton);

  const closeIcon = document.createElement('img');
  closeIcon.src = chrome.runtime.getURL('icons/x-solid-full.svg');
  closeButton.append(closeIcon);
}

export default () => {
  const overlay = document.createElement('div');
  overlay.id = 'fce-gallery';

  document.querySelectorAll('.board .thread .postContainer .fileText').forEach((link, index, links) => {
    const gallery = document.createElement('button');
    gallery.classList.add('fce-gallery-button');
    link.append(gallery);

    const galleryIcon = document.createElement('img');
    galleryIcon.src = chrome.runtime.getURL('icons/video-solid-full.svg');
    gallery.append(galleryIcon);

    gallery.addEventListener('click', e => {
      e.preventDefault();

      if (!isOpen) {
        isOpen = true;
        document.body.append(overlay);
        openGallery(overlay, link, index, links);
      }

    });
  });

  document.addEventListener('keyup', e => {
    if (isOpen) {
      if (e.key === 'Escape') {
        isOpen = false;
        overlay.remove();

        return;
      }

      if (e.key === 'ArrowLeft') {
        const button = document.querySelector('#fce-gallery .nav-button.previous');

        if (button) {
          button.click();
        }

        return;
      }

      if (e.key === 'ArrowRight') {
        const button = document.querySelector('#fce-gallery .nav-button.next');

        if (button) {
          button.click();
        }

        return;
      }
    }
  });
}
