import React, { Fragment, useCallback, useEffect, useState } from 'react';

import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

import Range from '../src';

function RateLimitedRange() {
  const [value, setValue] = useState(50);
  const [onChangeCallCount, setOnChangeCallCount] = useState(0);
  const [debouncedCallCount, setDebouncedCallCount] = useState(0);
  const [throttledCallCount, setThrottledCallCount] = useState(0);

  const debounced = useCallback(
    debounce(() => {
      setDebouncedCallCount(current => current + 1);
    }, 100),
    [],
  );

  const throttled = useCallback(
    throttle(() => {
      setThrottledCallCount(current => current + 1);
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
        onChange={currentValue => {
          setValue(currentValue);
          setOnChangeCallCount(current => current + 1);
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
