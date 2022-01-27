import { useMemo, useState } from 'react';

function useFunctionUsageTracking<
  InputFunctionType extends (...any: any) => any
>(trackedFunction: InputFunctionType) {
  const [isUsed, setIsUsed] = useState(false);

  const trackingFunction = useMemo(
    () => () => {
      if (!isUsed) {
        setIsUsed(true);
      }
      return trackedFunction;
    },
    [trackedFunction, isUsed],
  );

  return { isUsed, trackingFunction };
}

export default useFunctionUsageTracking;
