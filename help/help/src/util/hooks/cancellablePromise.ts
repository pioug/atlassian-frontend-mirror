import { useRef, useEffect } from 'react';

interface CancellablePromise {
  promise: Promise<unknown>;
  cancel(): void;
}

export function makeCancelable(promise: Promise<any>) {
  let isCanceled: boolean = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then((val: any) =>
        isCanceled ? reject(new Error('Promise is canceled')) : resolve(val),
      )
      .catch((error) =>
        isCanceled ? reject(new Error('Promise is canceled')) : reject(error),
      );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
}

export default function useCancellablePromise(cancelable = makeCancelable) {
  const emptyPromise = Promise.resolve(true);

  // check if the input argument is a cancelable promise generator
  if (cancelable(emptyPromise).cancel === undefined) {
    throw new Error(
      'promise wrapper argument must provide a cancel() function',
    );
  }

  const promises = useRef<CancellablePromise[]>([]);

  useEffect(() => {
    promises.current = promises.current;
    return function cancel() {
      promises.current.forEach((p) => p.cancel());
      promises.current = [];
    };
  }, []);

  const cancellablePromise: (p: Promise<any>) => Promise<any> = (p) => {
    const cPromise: CancellablePromise = cancelable(p);
    promises.current.push(cPromise);
    return cPromise.promise;
  };

  return { cancellablePromise };
}
