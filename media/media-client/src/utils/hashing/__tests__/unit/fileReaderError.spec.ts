import { FILE_READER_FALLBACK_ERROR_NAME } from '../../../../constants';
import { toFileReaderError } from '../../fileReaderError';

describe('toFileReaderError', () => {
	it('preserves the DOMException name as a real Error', () => {
		const domException = new DOMException('cannot read', 'NotReadableError');
		const result = toFileReaderError(domException);
		expect(result).toBeInstanceOf(Error);
		expect(result.name).toBe('NotReadableError');
		expect(result.message).toBe('NotReadableError');
	});

	it('retains the original DOMException as a non-enumerable cause', () => {
		const domException = new DOMException('cannot read', 'NotReadableError');
		const result = toFileReaderError(domException);
		expect((result as Error & { cause?: unknown }).cause).toBe(domException);
		// Non-enumerable so it stays out of analytics / JSON.stringify output.
		expect(Object.prototype.propertyIsEnumerable.call(result, 'cause')).toBe(false);
		expect(JSON.stringify(result)).not.toContain('cause');
	});

	it('does not set a cause when no DOMException is provided', () => {
		const result = toFileReaderError(null);
		expect((result as Error & { cause?: unknown }).cause).toBeUndefined();
	});

	it('falls back to the sentinel name when no DOMException is provided', () => {
		const result = toFileReaderError(null);
		expect(result).toBeInstanceOf(Error);
		expect(result.name).toBe(FILE_READER_FALLBACK_ERROR_NAME);
		expect(result.message).toBe(FILE_READER_FALLBACK_ERROR_NAME);
	});

	it('falls back to the sentinel name when the DOMException has an empty name', () => {
		const result = toFileReaderError({ name: '' } as DOMException);
		expect(result.name).toBe(FILE_READER_FALLBACK_ERROR_NAME);
	});

	it('falls back to the sentinel name when the DOMException name is whitespace only', () => {
		const result = toFileReaderError({ name: '   ' } as DOMException);
		expect(result.name).toBe(FILE_READER_FALLBACK_ERROR_NAME);
	});
});
