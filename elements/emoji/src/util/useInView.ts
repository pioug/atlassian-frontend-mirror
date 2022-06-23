import {
  IntersectionOptions,
  useInView as useInViewLib,
} from 'react-intersection-observer';
import { isIntersectionObserverSupported } from './browser-support';

type InViewHookNotSupportedResponse = [undefined, boolean];

export const useInView = (options?: IntersectionOptions | undefined) => {
  const hookResult = useInViewLib(options);
  if (!isIntersectionObserverSupported) {
    // Unsupported, return no `ref` and default `inView` true value
    return [undefined, true] as InViewHookNotSupportedResponse;
  }
  return hookResult;
};
