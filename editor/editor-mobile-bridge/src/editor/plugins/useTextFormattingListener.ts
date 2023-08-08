import type { TextFormattingState } from '@atlaskit/editor-common/types';
import { toNativeBridge } from '../web-to-native';
import { useListener } from './useListener';
import { valueOf as valueOfMarkState } from '../web-to-native/markState';

export const useTextFormattingListener = (
  textFormattingState: TextFormattingState | undefined,
) => {
  useListener(() => {
    if (typeof textFormattingState === 'undefined') {
      return;
    }

    toNativeBridge.call('textFormatBridge', 'updateTextFormat', {
      states: JSON.stringify(valueOfMarkState(textFormattingState)),
    });
  }, [textFormattingState]);
};
