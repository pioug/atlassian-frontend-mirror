import { useEffect, useState } from 'react';

const useIsSubsequentRender = () => {
  const [isSubsequentRender, setIsSubsequentRender] = useState(false);

  useEffect(() => {
    setIsSubsequentRender(true);
  }, []);

  return isSubsequentRender;
};
export default useIsSubsequentRender;
