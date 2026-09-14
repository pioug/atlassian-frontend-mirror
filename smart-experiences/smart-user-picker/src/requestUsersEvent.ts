import type { SmartEventCreator } from './analytics';
import { createDefaultSmartPickerAttributes } from './createDefaultSmartPickerAttributes';
import { createSmartUserPickerEvent } from './createSmartUserPickerEvent';
import { type Props, type State } from './types';

export const requestUsersEvent: SmartEventCreator = (props: Props, state: State, attributes = {}) =>
	createSmartUserPickerEvent('requested', 'users', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});
