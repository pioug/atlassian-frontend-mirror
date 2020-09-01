import React, { useRef, useCallback, useEffect } from 'react';
import { toNativeBridge } from '../web-to-native/implementation';

/**
 * I am using content renderer at least once, as a renderer ready definition.
 */
export function useRendererReady(
  rendererDomElement: React.RefObject<HTMLElement | undefined>,
) {
  const loadedOnce = useRef(false);

  const onLoadedOnce = useCallback(
    (cb: () => void) => {
      if (loadedOnce.current) {
        return;
      }
      loadedOnce.current = true;
      cb();
    },
    [loadedOnce],
  );

  // Using the Renderer DOM ref to check existence because onComplete get called before the render ends
  useEffect(() => {
    if (!rendererDomElement.current) {
      return;
    }
    onLoadedOnce(() => toNativeBridge.call('lifecycleBridge', 'rendererReady'));
  });
}
