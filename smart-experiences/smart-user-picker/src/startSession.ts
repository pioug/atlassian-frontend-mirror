import { v4 as uuid } from 'uuid'; // eslint-disable-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead

import type { UserPickerSession } from './analytics';

export const startSession = (): UserPickerSession => ({
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	id: uuid(),
	start: Date.now(),
	inputChangeTime: Date.now(),
	upCount: 0,
	downCount: 0,
	lastKey: undefined,
});
