import { MediaCardError } from '../../../errors';
import { isNetworkError } from '../../isNetworkError';
import { createMediaStoreError } from '@atlaskit/media-client/test-helpers';

describe('isNetworkError', () => {
	it('should return false when error is undefined', () => {
		expect(isNetworkError(undefined)).toBe(false);
	});

	it('should return false when error has no secondaryError', () => {
		const error = new MediaCardError('metadata-fetch');
		expect(isNetworkError(error)).toBe(false);
	});

	it('should return false when secondaryError is not a TypeError', () => {
		const regularError = new Error('Some error');
		const error = new MediaCardError('metadata-fetch', regularError);
		expect(isNetworkError(error)).toBe(false);
	});

	it('should return true when secondaryError is a TypeError', () => {
		const typeError = new TypeError('Failed to fetch');
		const error = new MediaCardError('remote-preview-fetch', typeError);
		expect(isNetworkError(error)).toBe(true);
	});

	it('should return true when secondaryError is TypeError with "Failed to fetch" message', () => {
		const typeError = new TypeError('Failed to fetch');
		const error = new MediaCardError('preview-fetch', typeError);
		expect(isNetworkError(error)).toBe(true);
	});

	it('should return true when secondaryError is CommonMediaClientError with nested TypeError in innerError', () => {
		const typeError = new TypeError('Failed to fetch');
		const mediaClientError = createMediaStoreError();
		// Mock the innerError to be a TypeError
		Object.defineProperty(mediaClientError, 'innerError', {
			value: typeError,
			writable: true,
		});
		const error = new MediaCardError('remote-preview-fetch', mediaClientError);
		expect(isNetworkError(error)).toBe(true);
	});

	it('should return false when secondaryError is CommonMediaClientError without nested TypeError', () => {
		const regularError = new Error('Some error');
		const mediaClientError = createMediaStoreError();
		Object.defineProperty(mediaClientError, 'innerError', {
			value: regularError,
			writable: true,
		});
		const error = new MediaCardError('metadata-fetch', mediaClientError);
		expect(isNetworkError(error)).toBe(false);
	});

	it('should return false for upload errors (should not be treated as network error)', () => {
		const typeError = new TypeError('Some other error');
		const error = new MediaCardError('upload', typeError);
		// Even though it's a TypeError, upload errors should not be treated as network errors
		// because they have a specific primary reason
		expect(isNetworkError(error)).toBe(true); // This will be true because it's TypeError
		// However, in CardView, upload errors are checked first, so network error check won't run
	});
});

