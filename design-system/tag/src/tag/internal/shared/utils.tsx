import { Ref } from 'react';

export function mergeRefs<T>(...refs: Array<Ref<T>>) {
  return (ref: T): void => {
    refs.forEach((resolvableRef) => {
      if (!resolvableRef) {
        return;
      }
      if (typeof resolvableRef === 'function') {
        resolvableRef(ref);
      } else {
        (resolvableRef as any).current = ref;
      }
    });
  };
}
