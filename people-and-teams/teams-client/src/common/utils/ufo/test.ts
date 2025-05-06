import { HttpError, SLOIgnoreError, SLOIgnoreHttpError } from '../error';

import { createErrorMetadata, isIgnoredError } from './utils';

describe('UFO utils', () => {
	describe('createErrorMetadata function', () => {
		it('should return metadata for a standard error', () => {
			const error = new Error('Test error');
			const metadata = createErrorMetadata(error);
			expect(metadata).toEqual({
				error: {
					name: error.name,
					message: error.message,
					stack: error.stack,
					traceId: undefined,
					status: undefined,
				},
			});
		});

		it('should return metadata for an HttpError', () => {
			const error = new HttpError({
				message: 'Test error',
				status: 404,
				traceId: 'trace-id',
			});
			const metadata = createErrorMetadata(error);
			expect(metadata).toEqual({
				error: {
					name: error.name,
					message: error.message,
					stack: error.stack,
					traceId: error.traceId,
					status: error.status,
				},
			});
		});
	});

	describe('isIgnoredError function', () => {
		it('should return false for a non-ignored error', () => {
			const error = new Error('Test error');
			expect(isIgnoredError(error)).toBe(false);
		});

		it('should return true for a SLOIgnoreHttpError error', () => {
			const error = new SLOIgnoreHttpError({
				message: 'Test error',
				status: 404,
				traceId: 'trace-id',
			});
			expect(isIgnoredError(error)).toBe(true);
		});

		it('should return true for a SLOIgnoreHttpError error', () => {
			const error = new SLOIgnoreError({ message: 'Test error' });
			expect(isIgnoredError(error)).toBe(true);
		});
	});
});
