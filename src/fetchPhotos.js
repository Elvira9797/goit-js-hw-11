import axios from 'axios';

const searchParams = new URLSearchParams({
  key: '36397020-7287beafc150076ae86c61e54',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});

async function fetchPhotos(name) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?q=${name}&${searchParams}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

export { fetchPhotos };
