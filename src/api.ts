import axios from 'axios';

export default axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? 'http://130.61.29.179:5000'
      : 'http://localhost:5000',
});
