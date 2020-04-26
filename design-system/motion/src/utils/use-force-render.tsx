import { useCallback, useState } from 'react';

export const useForceRender = () => {
  const [, updateState] = useState({});
  const forceRender = useCallback(() => updateState({}), []);
  return forceRender;
};
