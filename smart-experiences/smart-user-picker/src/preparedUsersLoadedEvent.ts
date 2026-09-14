import type { SmartEventCreator } from './analytics';
import { createDefaultSmartPickerAttributes } from './createDefaultSmartPickerAttributes';
import { createSmartUserPickerEvent } from './createSmartUserPickerEvent';
import { type Props, type State } from './types';

export const preparedUsersLoadedEvent: SmartEventCreator = (
	props: Props,
	state: State,
	attributes = {},
) =>
	createSmartUserPickerEvent('loaded', 'preparedUsers', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});
