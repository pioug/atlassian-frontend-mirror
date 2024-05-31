import type { TextFormattingState } from '@atlaskit/editor-common/types';
import { toNativeBridge } from '../web-to-native';
import { useListener } from './useListener';
import { valueOf as valueOfMarkState } from '../web-to-native/markState';
import type WebBridgeImpl from '../native-to-web';

export const useTextFormattingListener = (
	textFormattingState: TextFormattingState | undefined,
	bridge: WebBridgeImpl,
) => {
	useListener(
		() => {
			if (typeof textFormattingState === 'undefined') {
				return;
			}

			toNativeBridge.call('textFormatBridge', 'updateTextFormat', {
				states: JSON.stringify(valueOfMarkState(textFormattingState)),
			});
		},
		[textFormattingState],
		{
			bridge,
			key: 'textFormatBridgeState',
			state: textFormattingState ?? null,
		},
	);
};
