import { useCallback } from 'react';
import { InvokeAction } from './types';

const useInvoke = () => {
  return useCallback(async <T>(action: InvokeAction): Promise<T | void> => {
    // TODO: EDM-5746 and EDM-5782
    return await new Promise((resolve) => {
      resolve();
    });
  }, []);
};

export default useInvoke;
