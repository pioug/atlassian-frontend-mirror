import { resourceTimingBuffer } from './common/utils/resource-timing-buffer';

export function startResourceTimingBuffer(): void {
	resourceTimingBuffer.start();
}
