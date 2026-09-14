import type { SmartEventCreator } from './analytics';
import { createDefaultSmartPickerAttributes } from './createDefaultSmartPickerAttributes';
import { createSmartUserPickerEvent } from './createSmartUserPickerEvent';
import { type Props, type State } from './types';

export const successfulRequestUsersEvent: SmartEventCreator = (
	props: Props,
	state: State,
	attributes = {},
) =>
	createSmartUserPickerEvent('successful', 'usersRequest', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});
