import { withProfiling } from '../../../../../self-measurements';
import { PerformanceObserverEntryTypes } from '../../const';

export class BufferWithMaxLength<T> {
	buffer: Array<T> = [];

	maxLength: number;

	full = false;

	constructor(maxLength = 1000) {
		this.maxLength = maxLength;
		this.push = withProfiling(this.push.bind(this));
		this.getAll = withProfiling(this.getAll.bind(this));
	}

	push(item: T) {
		if (this.full || this.maxLength === this.buffer.length) {
			this.full = true;
			this.buffer.shift();
		}
		this.buffer.push(item);
	}

	getAll() {
		return this.buffer;
	}
}

export type EntriesBufferType = {
	[key: string]: BufferWithMaxLength<PerformanceEntry>;
};
export type PerformanceEntryBuffer = BufferWithMaxLength<PerformanceEntry>;

export const EntriesBuffer: EntriesBufferType = {
	[PerformanceObserverEntryTypes.LongTask]: new BufferWithMaxLength<PerformanceEntry>(),
	[PerformanceObserverEntryTypes.LayoutShift]: new BufferWithMaxLength<PerformanceEntry>(),
};
