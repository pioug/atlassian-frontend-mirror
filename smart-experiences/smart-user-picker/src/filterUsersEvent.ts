import type { SmartEventCreator } from './analytics';
import { createDefaultSmartPickerAttributes } from './createDefaultSmartPickerAttributes';
import { createSmartUserPickerEvent } from './createSmartUserPickerEvent';
import { type Props, type State } from './types';

export const filterUsersEvent: SmartEventCreator = (props: Props, state: State, attributes = {}) =>
	createSmartUserPickerEvent('filtered', 'users', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});
