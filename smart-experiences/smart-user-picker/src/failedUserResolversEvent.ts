import type { SmartEventCreator } from './analytics';
import { createDefaultSmartPickerAttributes } from './createDefaultSmartPickerAttributes';
import { createSmartUserPickerEvent } from './createSmartUserPickerEvent';
import { type Props, type State } from './types';

export const failedUserResolversEvent: SmartEventCreator = (
	props: Props,
	state: State,
	attributes = {},
) =>
	createSmartUserPickerEvent('failed', 'userResolversRequest', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});
