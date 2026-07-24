// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead

import { roundPerfNow } from '../../utils/round-perf-now';

export const perfNowOrTimestamp = (timestamp?: number): number => {
	if (timestamp !== undefined) {
		return ~~timestamp;
	}
	return roundPerfNow();
};
