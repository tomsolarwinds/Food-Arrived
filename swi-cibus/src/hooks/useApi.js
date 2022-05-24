import axios from 'axios';
import { useCallback, useMemo } from 'react';

const useApi = () => {
  const onRequest = useCallback(
    (config) => {
      config.headers.Authorization = `Bearer TOKEN`;
      return config;
    },
    []
  );

  const axiosFunction = useCallback(
    (funcName, url, options) => {
      const axiosInstance = axios.create();
      axiosInstance.interceptors.request.use(onRequest);
      return axiosInstance[funcName](url, options);
    },
    [onRequest]
  );

  const get = useCallback((url, options) => axiosFunction('get', url, options), [axiosFunction]);

  const put = useCallback((url, options) => axiosFunction('put', url, options), [axiosFunction]);

  const post = useCallback((url, options) => axiosFunction('post', url, options), [axiosFunction]);

  const destroy = useCallback((url, options) => axiosFunction('delete', url, options), [
    axiosFunction,
  ]);

  const api = useMemo(
    () => ({
      get,
      put,
      post,
      delete: destroy,
    }),
    [get, put, post, destroy]
  );

  return api;
};

export default useApi;
