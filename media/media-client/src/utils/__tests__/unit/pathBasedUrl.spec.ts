import {
	isPathBasedEnabled,
	mapToPathBasedUrl,
	mapRetryUrlToPathBasedUrl,
} from '../../pathBasedUrl';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import getDocument from '../../getDocument';

jest.mock('../../getDocument');

const mockGetDocument = getDocument as jest.MockedFunction<typeof getDocument>;

describe('pathBasedUrl', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('isPathBasedEnabled', () => {
		ffTest.off(
			'platform_media_path_based_route',
			'when platform_media_path_based_route is disabled',
			() => {
				it('should return false when feature flag is disabled', () => {
					expect(isPathBasedEnabled()).toBe(false);
				});
			},
		);

		ffTest.on(
			'platform_media_path_based_route',
			'when platform_media_path_based_route is enabled',
			() => {
				describe('when hostname is localhost', () => {
					it('should return false when hostname is localhost', () => {
						mockGetDocument.mockReturnValue({
							location: {
								hostname: 'localhost',
							},
						} as any);
						expect(isPathBasedEnabled()).toBe(false);
					});
				});

				describe('when hostname is not localhost', () => {
					it('should return true for non-localhost domains', () => {
						mockGetDocument.mockReturnValue({
							location: {
								hostname: 'mycompany.atlassian.net',
							},
						} as any);
						expect(isPathBasedEnabled()).toBe(true);
					});
				});

				describe('when document is undefined', () => {
					beforeEach(() => {
						mockGetDocument.mockReturnValue(undefined);
					});

					it('should return true when document is undefined (assumes not localhost)', () => {
						expect(isPathBasedEnabled()).toBe(true);
					});
				});
			},
		);
	});

	ffTest.off(
		'platform_media_path_based_route',
		'when platform_media_path_based_route is disabled',
		() => {
			it('should return the original URL unchanged', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
				expect(mapToPathBasedUrl(originalUrl)).toBe(originalUrl);
			});

			it('should return the original URL with query params unchanged', () => {
				const originalUrl =
					'https://api.media.atlassian.com/path/to/resource?param1=value1&param2=value2';
				expect(mapToPathBasedUrl(originalUrl)).toBe(originalUrl);
			});

			it('should return the original URL with hash unchanged', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/to/resource#section';
				expect(mapToPathBasedUrl(originalUrl)).toBe(originalUrl);
			});
		},
	);

	ffTest.on(
		'platform_media_path_based_route',
		'when platform_media_path_based_route is enabled',
		() => {
			describe('when document is available', () => {
				beforeEach(() => {
					mockGetDocument.mockReturnValue({
						location: {
							host: 'current.atlassian.net',
						},
					} as any);
				});

				it('should replace the host with document location host', () => {
					const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'https://current.atlassian.net/media-api/path/to/resource',
					);
				});

				it('should preserve the path, query params, and hash', () => {
					const originalUrl =
						'https://api.media.atlassian.com/path/to/resource?param1=value1&param2=value2#section';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'https://current.atlassian.net/media-api/path/to/resource?param1=value1&param2=value2#section',
					);
				});

				it('should preserve the protocol', () => {
					const originalUrl = 'http://api.media.atlassian.com/path/to/resource';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'http://current.atlassian.net/media-api/path/to/resource',
					);
				});

				it('should preserve the port if specified in original URL', () => {
					const originalUrl = 'https://api.media.atlassian.com:8080/path/to/resource';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'https://current.atlassian.net:8080/media-api/path/to/resource',
					);
				});

				it('should handle URLs with no path', () => {
					const originalUrl = 'https://api.media.atlassian.com';
					expect(mapToPathBasedUrl(originalUrl)).toBe('https://current.atlassian.net/media-api/');
				});

				it('should handle URLs with just a slash', () => {
					const originalUrl = 'https://api.media.atlassian.com/';
					expect(mapToPathBasedUrl(originalUrl)).toBe('https://current.atlassian.net/media-api/');
				});

				it('should handle different hosts correctly', () => {
					const originalUrl = 'https://media.staging.atl-paas.net/file/123456';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'https://current.atlassian.net/media-api/file/123456',
					);
				});

				it('should not double-prepend /media-api when already present in path', () => {
					const originalUrl = 'https://api.media.atlassian.com/media-api/path/to/resource';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'https://current.atlassian.net/media-api/path/to/resource',
					);
				});

				it('should not double-prepend when pathname is exactly /media-api', () => {
					const originalUrl = 'https://api.media.atlassian.com/media-api';
					expect(mapToPathBasedUrl(originalUrl)).toBe('https://current.atlassian.net/media-api');
				});
			});

			describe('when document is undefined', () => {
				beforeEach(() => {
					mockGetDocument.mockReturnValue(undefined);
				});

				it('should return relative URL when document is undefined', () => {
					const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
					expect(mapToPathBasedUrl(originalUrl)).toBe('/media-api/path/to/resource');
				});

				it('should not double-prepend when document is undefined and pathname already includes /media-api', () => {
					const originalUrl =
						'https://api.media.atlassian.com/media-api/path/to/resource?param=value#hash';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'/media-api/path/to/resource?param=value#hash',
					);
				});
			});

			describe('when document.location is undefined', () => {
				beforeEach(() => {
					mockGetDocument.mockReturnValue({} as any);
				});

				it('should return relative URL when document.location is undefined', () => {
					const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
					expect(mapToPathBasedUrl(originalUrl)).toBe('/media-api/path/to/resource');
				});
			});

			describe('when document.location.host is undefined', () => {
				beforeEach(() => {
					mockGetDocument.mockReturnValue({
						location: {},
					} as any);
				});

				it('should use undefined host when document.location.host is undefined', () => {
					const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'https://undefined/media-api/path/to/resource',
					);
				});
			});

			describe('edge cases', () => {
				beforeEach(() => {
					mockGetDocument.mockReturnValue({
						location: {
							host: 'current.atlassian.net',
						},
					} as any);
				});

				it('should handle URLs with special characters in path', () => {
					const originalUrl =
						'https://api.media.atlassian.com/path/with%20spaces/and-special_chars.ext';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'https://current.atlassian.net/media-api/path/with%20spaces/and-special_chars.ext',
					);
				});

				it('should handle URLs with complex query parameters', () => {
					const originalUrl =
						'https://api.media.atlassian.com/path?array[0]=value1&array[1]=value2&encoded=%20space';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'https://current.atlassian.net/media-api/path?array[0]=value1&array[1]=value2&encoded=%20space',
					);
				});

				it('should handle URLs with fragment identifiers', () => {
					const originalUrl =
						'https://api.media.atlassian.com/path/to/resource#section-with-dashes_and_underscores';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'https://current.atlassian.net/media-api/path/to/resource#section-with-dashes_and_underscores',
					);
				});

				it('should handle URLs with subdomain', () => {
					const originalUrl = 'https://subdomain.api.media.atlassian.com/path/to/resource';
					expect(mapToPathBasedUrl(originalUrl)).toBe(
						'https://current.atlassian.net/media-api/path/to/resource',
					);
				});
			});
		},
	);

	describe('mapRetryUrlToPathBasedUrl', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		describe('when document is available', () => {
			beforeEach(() => {
				mockGetDocument.mockReturnValue({
					location: {
						host: 'current.atlassian.net',
					},
				} as any);
			});

			it('should return path-based URL with media-api prefix', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://current.atlassian.net/media-api/path/to/resource',
				);
			});

			it('should remove /cdn suffix and return path-based URL', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/to/resource/cdn';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://current.atlassian.net/media-api/path/to/resource',
				);
			});

			it('should remove /cdn suffix and preserve query params and hash', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/to/resource/cdn?param=value#hash';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://current.atlassian.net/media-api/path/to/resource?param=value#hash',
				);
			});

			it('should return path-based URL without /cdn suffix when not present', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/to/resource';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://current.atlassian.net/media-api/path/to/resource',
				);
			});

			it('should not double-prepend /media-api when already present in path', () => {
				const originalUrl = 'https://api.media.atlassian.com/media-api/path/to/resource';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://current.atlassian.net/media-api/path/to/resource',
				);
			});

			it('should return path-based URL with /cdn in middle of path unchanged', () => {
				const originalUrl = 'https://api.media.atlassian.com/cdn/path/to/resource';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://current.atlassian.net/media-api/cdn/path/to/resource',
				);
			});

			it('should remove first occurrence of /cdn when ends with /cdn', () => {
				const originalUrl = 'https://api.media.atlassian.com/cdn/path/cdn';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://current.atlassian.net/media-api/path/cdn',
				);
			});
		});

		describe('when document is undefined', () => {
			beforeEach(() => {
				mockGetDocument.mockReturnValue(undefined);
			});

			it('should use original host when document is undefined', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/to/resource/cdn';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://api.media.atlassian.com/media-api/path/to/resource',
				);
			});
		});

		describe('when document.location is undefined', () => {
			beforeEach(() => {
				mockGetDocument.mockReturnValue({} as any);
			});

			it('should throw an error when document.location is undefined', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/to/resource/cdn';
				expect(() => mapRetryUrlToPathBasedUrl(originalUrl)).toThrow();
			});
		});

		describe('when document.location.host is undefined', () => {
			beforeEach(() => {
				mockGetDocument.mockReturnValue({
					location: {},
				} as any);
			});

			it('should use original host when document.location.host is undefined', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/to/resource/cdn';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://api.media.atlassian.com/media-api/path/to/resource',
				);
			});
		});

		describe('edge cases', () => {
			beforeEach(() => {
				mockGetDocument.mockReturnValue({
					location: {
						host: 'current.atlassian.net',
					},
				} as any);
			});

			it('should remove /cdn suffix and handle special characters', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/with%20spaces/cdn';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://current.atlassian.net/media-api/path/with%20spaces',
				);
			});

			it('should not remove case-sensitive /CDN (only lowercase /cdn)', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/to/CDN';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://current.atlassian.net/media-api/path/to/CDN',
				);
			});

			it('should not remove /cdn/ when not at end of path', () => {
				const originalUrl = 'https://api.media.atlassian.com/path/cdn/resource';
				expect(mapRetryUrlToPathBasedUrl(originalUrl).toString()).toBe(
					'https://current.atlassian.net/media-api/path/cdn/resource',
				);
			});
		});

		// NOTE: The implementation correctly returns a URL object (parsedUrl).
		// Tests have been updated to expect parsedUrl.toString() results.
	});
});
