import type { SmartEventCreator } from './analytics';
import { createDefaultSmartPickerAttributes } from './createDefaultSmartPickerAttributes';
import { createSmartUserPickerEvent } from './createSmartUserPickerEvent';
import { type Props, type State } from './types';

export const mountedWithPrefetchEvent: SmartEventCreator = (
	props: Props,
	state: State,
	attributes = {},
) =>
	createSmartUserPickerEvent('mounted', 'prefetch', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});
