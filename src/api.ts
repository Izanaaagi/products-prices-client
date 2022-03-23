import axios from 'axios';

export default axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`
      : `http://localhost:${import.meta.env.VITE_API_PORT}`,
});
