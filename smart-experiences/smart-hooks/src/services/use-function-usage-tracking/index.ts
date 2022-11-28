import { useMemo, useState } from 'react';

import memoizeOne from 'memoize-one';

function useFunctionUsageTracking<
  InputFunctionType extends (...any: any) => any,
>(trackedFunction: InputFunctionType) {
  const [isUsed, setIsUsed] = useState(false);

  // trackingFunction needs to be stable for hook consumers...
  const trackingFunction = useMemo(
    () =>
      // ...and the function that the factory returns needs to be stable for hook consumers as well
      memoizeOne(() => {
        if (!isUsed) {
          setIsUsed(true);
        }
        return trackedFunction;
      }),
    // isUsed deliberately left out to avoid new tracking fn being generated
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trackedFunction],
  );

  return { isUsed, trackingFunction };
}

export default useFunctionUsageTracking;
