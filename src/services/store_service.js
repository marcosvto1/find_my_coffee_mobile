import Api from './api';

const StoreService = {
  show: (google_place_id) => Api.get(`/stores/${google_place_id}`),
  index: (latitude,longitude) => Api.get(`/stores`, {
    params: {latitude, longitude}
  })
};

export default StoreService;