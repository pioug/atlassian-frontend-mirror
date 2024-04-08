import { MutableRefObject, useRef } from 'react';

export const useTrackedRef = <T>(value: T): MutableRefObject<T> => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
