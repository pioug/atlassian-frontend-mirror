import { useRef, useLayoutEffect } from 'react';
import { RendererContext } from '@atlaskit/renderer';
import RendererBridgeImplementation from '../native-to-web/implementation';

const containerAri = 'MOCK-containerAri';
const objectAri = 'MOCK-objectAri';

export function useRendererContext(
  rendererBridge: RendererBridgeImplementation,
): RendererContext {
  useLayoutEffect(() => {
    rendererBridge.containerAri = containerAri;
    rendererBridge.objectAri = objectAri;
    return () => {
      rendererBridge.containerAri = undefined;
      rendererBridge.objectAri = undefined;
    };
  }, [rendererBridge]);

  const { current: rendererContext } = useRef({
    // These will need to come from the native side.
    objectAri,
    containerAri,
  });

  return rendererContext;
}
