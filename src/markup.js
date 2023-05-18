import { refs } from './index';

export default function renderPhotos(photos) {
  const markup = photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
          <a href=${largeImageURL}>
            <img class="img-gallery" src=${webformatURL} alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
            <b>Likes</b>
              ${likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${views}
            </p>
            <p class="info-item">
            <b>Comments</b>
              ${comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>
            ${downloads}
            </p>
          </div>
        </div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
