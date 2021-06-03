import React, { Fragment, useCallback, useEffect, useState } from 'react';

import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

import Range from '../src';

function RateLimitedRange() {
  const [value, setValue] = useState(50);
  const [onChangeCallCount, setOnChangeCallCount] = useState(0);
  const [debouncedCallCount, setDebouncedCallCount] = useState(0);
  const [throttledCallCount, setThrottledCallCount] = useState(0);

  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounced = useCallback(
    debounce(() => {
      setDebouncedCallCount((current) => current + 1);
    }, 100),
    [],
  );

  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttled = useCallback(
    throttle(() => {
      setThrottledCallCount((current) => current + 1);
    }, 100),
    [],
  );

  // Ensure any pending debounces and throttles are cleared when
  // the component is removed
  useEffect(
    function mount() {
      return function unmount() {
        debounced.cancel();
        throttled.cancel();
      };
    },
    [debounced, throttled],
  );

  return (
    <Fragment>
      <Range
        step={1}
        value={value}
        onChange={(currentValue) => {
          setValue(currentValue);
          setOnChangeCallCount((current) => current + 1);
          debounced();
          throttled();
        }}
      />
      <p>The current value is: {value}</p>
      <p>onChange called: {onChangeCallCount}</p>
      <p>debounced called: {debouncedCallCount}</p>
      <p>throttled called: {throttledCallCount}</p>
    </Fragment>
  );
}

export default RateLimitedRange;
