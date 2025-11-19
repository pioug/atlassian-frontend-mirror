import { PerformanceObserverEntryTypes } from '../../const';

export class BufferWithMaxLength<T> {
	buffer: Array<T> = [];

	maxLength: number;

	full = false;

	constructor(maxLength = 1000) {
		this.maxLength = maxLength;
	}

	push(item: T): void {
		if (this.full || this.maxLength === this.buffer.length) {
			this.full = true;
			this.buffer.shift();
		}
		this.buffer.push(item);
	}

	getAll(): T[] {
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
