import Notiflix from 'notiflix';
import { fetchPhotos } from './fetchPhotos.js';
import './css/styles.css';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

let page = 1;
let searchValue = '';

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', getMorePhotos);

async function onSubmit(e) {
  e.preventDefault();
  const photoName = e.target.searchQuery.value.trim();

  refs.gallery.innerHTML = '';
  if (photoName === '') return;

  const response = await fetchPhotos(photoName);

  getPhotos(response.data.hits);
}

function getPhotos(photos) {
  try {
    if (photos.length === 0) {
      throw new Error();
    }
    renderPhotos(photos);
    resetForm();
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    resetForm();
  }

  function getMorePhotos() {}

  // response
  //   .then(response => {
  //     const photos = response.data.hits;
  //     console.log(photos);
  //     if (photos.length === 0) {
  //       throw new Error();
  //     }

  //     renderPhotos(photos);
  //   })
  //   .catch(() =>
  //     Notiflix.Notify.failure(
  //       'Sorry, there are no images matching your search query. Please try again.'
  //     )
  //   )
  //   .finally(() => {
  //     refs.searchForm.reset();
  //   });
}

function renderPhotos(photos) {
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
        return `<div class="photo-card">
              <img src=${webformatURL} loading="lazy" />
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

function resetForm() {
  refs.searchForm.reset();
}
