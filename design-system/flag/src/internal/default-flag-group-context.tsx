import noop from '@atlaskit/ds-lib/noop';

import type { FlagGroupAPI } from './flag-group-context';

export const defaultFlagGroupContext: FlagGroupAPI = {
	onDismissed: noop,
	isDismissAllowed: false,
};
