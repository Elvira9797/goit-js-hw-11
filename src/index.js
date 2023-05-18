import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import PhotosService from './PhotosService.js';
import LoadMoreBtn from './LoadMoreBtn.js';
import btnUp from './btnUp.js';
import 'simplelightbox/dist/simple-lightbox.min.css';
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

  loadMoreBtn.show();
  loadMoreBtn.disable();
  getPhotosApi();
}

function getMorePhotos() {
  loadMoreBtn.disable();
  getMorePhotosApi();
}

async function getPhotosApi() {
  const data = await photosService.fetchPhotos();

  checkArrayOfPhotos(data.hits);
  showAmountOfPhotos(data.totalHits);
}

async function getMorePhotosApi() {
  const data = await photosService.fetchPhotos();

  checkAmountOfPhotos(data);
}

function showAmountOfPhotos(allPhotos) {
  if (allPhotos === 0) return;
  Notiflix.Notify.success(`Hooray! We found ${allPhotos} images.`);
}

function checkAmountOfPhotos(data) {
  const totalPages = data.totalHits / photosService.perPage;

  if (photosService.page - 1 >= totalPages) {
    loadMoreBtn.hide();
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      "<p class='text-end'>We're sorry, but you've reached the end of search results.</p>"
    );
    return;
  }

  checkArrayOfPhotos(data.hits);
}

function checkArrayOfPhotos(photos) {
  if (photos.length === 0) {
    loadMoreBtn.hide();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    renderPhotos(photos);
    new SimpleLightbox('.gallery a').refresh();
    loadMoreBtn.enable();
  }
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
