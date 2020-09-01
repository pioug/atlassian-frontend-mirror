import { useEffect } from 'react';
import { toNativeBridge } from '../web-to-native/implementation';

export function useRendererDestroyed() {
  useEffect(() => {
    return () => {
      toNativeBridge.call('lifecycleBridge', 'rendererDestroyed');
    };
  }, []);
}
