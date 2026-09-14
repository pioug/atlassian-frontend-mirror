import type { SmartEventCreator } from './analytics';
import { createDefaultSmartPickerAttributes } from './createDefaultSmartPickerAttributes';
import { createSmartUserPickerEvent } from './createSmartUserPickerEvent';
import { type Props, type State } from './types';

export const failedRequestUsersEvent: SmartEventCreator = (
	props: Props,
	state: State,
	attributes = {},
) =>
	createSmartUserPickerEvent('failed', 'usersRequest', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});
