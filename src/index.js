import Notiflix from 'notiflix';
import PhotosService from './PhotosService.js';
import LoadMoreBtn from './LoadMoreBtn.js';
import './css/styles.css';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
};

const photosService = new PhotosService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

refs.searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', getMorePhotos);

function onSubmit(e) {
  e.preventDefault();

  const photoName = e.target.searchQuery.value.trim();

  refs.gallery.innerHTML = '';
  if (photoName === '') {
    loadMoreBtn.hide();
    return;
  }

  photosService.searchValue = photoName;
  photosService.resetPage();
  photosService.resetSumPhotos();

  loadMoreBtn.show();
  getMorePhotos();
}

async function getPhotos() {
  const response = await photosService.fetchPhotos();

  checkAmountOfPhotos(response);
}

function checkAmountOfPhotos(response) {
  photosService.amountOfPhotos = response.data.hits.length;
  photosService.incrementSumPhotos();

  if (
    (photosService.amountOfPhotos !== 0 &&
      photosService.sum === response.data.totalHits) ||
    photosService.sum > response.data.totalHits
  ) {
    loadMoreBtn.hide();
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }

  checkArrayOfPhotos(response.data.hits);
}

function checkArrayOfPhotos(photos) {
  try {
    if (photos.length === 0) {
      throw new Error();
    }
    renderPhotos(photos);
    loadMoreBtn.enable();
    resetForm();
  } catch {
    loadMoreBtn.hide();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    resetForm();
  }
}

function getMorePhotos() {
  loadMoreBtn.disable();
  getPhotos();
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
        return `
        <div class="photo-card">
          <img src=${webformatURL} alt="${tags}" loading="lazy" />
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
