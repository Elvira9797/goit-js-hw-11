import axios from 'axios';

const searchParams = new URLSearchParams({
  key: '36397020-7287beafc150076ae86c61e54',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});

export default class PhotosService {
  constructor() {
    this.page = 1;
    this.perPage = 40;
    this.searchValue = '';
  }

  async fetchPhotos() {
    const response = await axios.get(
      `https://pixabay.com/api/?q=${this.searchValue}&page=${this.page}&${searchParams}`
    );
    this.incrementPage();
    return response.data;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}
