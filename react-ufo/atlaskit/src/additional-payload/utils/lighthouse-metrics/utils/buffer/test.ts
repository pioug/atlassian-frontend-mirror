import { BufferWithMaxLength } from './index';

describe('buffer', () => {
	let buffer: BufferWithMaxLength<number>;
	beforeEach(() => {
		buffer = new BufferWithMaxLength<number>(3);
	});

	test('should keep adding new items', () => {
		buffer.push(1);
		expect(buffer.getAll()).toHaveLength(1);
	});

	test('should contain max number of elements with newest at the end', () => {
		buffer.push(1);
		buffer.push(2);
		buffer.push(3);
		buffer.push(4);
		expect(buffer.getAll()).toEqual([2, 3, 4]);
	});
});
