// eslint-disable-next-line @atlaskit/editor/warn-no-restricted-imports
import type { BlockTypeState } from '@atlaskit/editor-plugin-block-type';
import { toNativeBridge } from '../web-to-native';
import { useListener } from './useListener';

export const useBlockTypeListener = (
  blockTypeState: BlockTypeState | undefined,
) => {
  useListener(
    () => {
      if (typeof blockTypeState === 'undefined') {
        return;
      }

      /**
       * Currently `updateBlockState` is on different bridges in native land.
       * We have a ticket to align on the naming.
       * @see https://product-fabric.atlassian.net/browse/FM-1341
       */
      if (window.webkit) {
        // iOS
        toNativeBridge.call('blockFormatBridge', 'updateBlockState', {
          states: blockTypeState.currentBlockType.name,
        });
      } else {
        // Android
        toNativeBridge.call('textFormatBridge', 'updateBlockState', {
          states: blockTypeState.currentBlockType.name,
        });
      }
    },
    [blockTypeState],
    undefined,
  );
};
