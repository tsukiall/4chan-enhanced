import { apiKeys } from '../util/keys.js';

export default async () => {
  const settings = JSON.parse(localStorage.getItem('4chan-settings'));
  const board = location.href.match(/.*boards\.4chan\.org\/(.*)[!\/]/)[1];
  const thumbnails = document.querySelectorAll('#content #threads .thread .thumb');

  if (settings && settings.imageHover) {
    for (let thumbnail of thumbnails) {
      const threadID = thumbnail.getAttribute('data-id');
      const response = await fetch(`${apiKeys.dataApi}${board}/thread/${threadID}.json`);
      const thread = await response.json();
      const op = thread.posts[0];

      let overlay;
      let showing = false;

      thumbnail.addEventListener('mouseenter', () => {
        if (!showing) {
          showing = true;

          document.querySelectorAll('#image-hover').forEach(e => {
            e.remove();
          });

          switch (op.ext) {
            case '.jpg':
            case '.png':
            case '.gif':
            case '.svg':
              overlay = document.createElement('img');
              break;
            case '.webm':
            case '.mp4':
              overlay = document.createElement('video');
              overlay.autoplay = true;
              overlay.volume = localStorage.getItem('4chan-volume');
              overlay.loop = true;
              break;
            default:
              overlay = document.createElement('span');
              overlay.textContent = op.ext;
          }

          overlay.id = 'image-hover';
          overlay.src = `${apiKeys.mediaApi}${board}/${op.tim}${op.ext}`;
          document.body.append(overlay);
        }
      });

      thumbnail.addEventListener('mouseleave', () => {
        if (showing) {
          showing = false;
          overlay.remove();
        }
      });
    }
  }
}
