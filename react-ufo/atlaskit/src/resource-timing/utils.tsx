import { withProfiling } from '../self-measurements';

import { resourceTimingBuffer } from './common/utils/resource-timing-buffer';

export const startResourceTimingBuffer = withProfiling(function startResourceTimingBuffer() {
	resourceTimingBuffer.start();
});
