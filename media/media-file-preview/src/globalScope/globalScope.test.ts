import { type FileIdentifier } from '@atlaskit/media-client';

import { type MediaFilePreviewErrorInfo } from '../analytics';

import {
	generateScriptProps,
	getKey,
	getMediaCardSSR,
	getMediaGlobalScope,
	GLOBAL_MEDIA_CARD_SSR,
	GLOBAL_MEDIA_NAMESPACE,
} from './globalScope';

describe('Media Global Scope', () => {
	describe('getMediaGlobalScope', () => {
		it('should initialise and return Media Global Scope Object', () => {
			const globalScope = {};
			expect(getMediaGlobalScope(globalScope)).toEqual({});
		});

		it('should return Media Global Scope Object if already exists', () => {
			const mediaGlobal = { thisIs: 'media global object' };
			const globalScope = { [GLOBAL_MEDIA_NAMESPACE]: mediaGlobal };
			expect(getMediaGlobalScope(globalScope)).toBe(mediaGlobal);
		});
	});

	describe('getMediaCardSSR', () => {
		it('should initialise and return Media Card SSR Data from global scope', () => {
			const globalScope = { [GLOBAL_MEDIA_NAMESPACE]: {} };
			expect(getMediaCardSSR(globalScope)).toEqual({});
		});

		it('should return Media Card SSR Data if already exists', () => {
			const mediaCardSSR = { thisIs: 'media card ssr data' };
			const globalScope = {
				[GLOBAL_MEDIA_NAMESPACE]: { [GLOBAL_MEDIA_CARD_SSR]: mediaCardSSR },
			};
			expect(getMediaCardSSR(globalScope)).toBe(mediaCardSSR);
		});
	});

	describe('Stringified Script Execution', () => {
		const identifier: FileIdentifier = {
			mediaItemType: 'file',
			id: 'test-id',
			collectionName: 'test-collection',
			occurrenceKey: 'test-occurrence',
		};

		let container: HTMLDivElement;
		let img: HTMLImageElement;

		beforeEach(() => {
			// Create a real DOM environment using jsdom (already available in Jest)
			container = document.createElement('div');
			img = document.createElement('img');
			img.setAttribute('loading', 'lazy');
			container.appendChild(img);
			document.body.appendChild(container);

			// Clean up global scope
			delete (window as any)[GLOBAL_MEDIA_NAMESPACE];
		});

		afterEach(() => {
			// Clean up DOM
			document.body.removeChild(container);
		});

		const executeScript = (scriptHtml: string | TrustedHTML) => {
			// Create a real script element and inject it into the DOM
			const scriptElement = document.createElement('script');
			// scriptHtml is from dangerouslySetInnerHTML.__html which is TrustedHTML
			scriptElement.text = scriptHtml as string;
			container.appendChild(scriptElement);
			// The script executes immediately upon being added to the DOM
		};

		describe('without feature flags', () => {
			it('should store basic data in global scope', () => {
				const dataURI = 'data:image/png;base64,abc123';
				const dimensions = { width: 100, height: 200 };
				const mode = 'crop';

				const scriptProps = generateScriptProps(identifier, dataURI, mode, undefined, dimensions);
				const scriptHtml = scriptProps.dangerouslySetInnerHTML?.__html || '';

				executeScript(scriptHtml);

				const key = getKey(identifier, mode);
				const storedData = (window as any)[GLOBAL_MEDIA_NAMESPACE]?.mediaCardSsr?.[key];

				expect(storedData).toBeDefined();
				expect(storedData.dataURI).toBe(dataURI);
				expect(storedData.dimensions).toEqual(dimensions);
			});

			it('should store error information', () => {
				const error: MediaFilePreviewErrorInfo = {
					failReason: 'ssr-server-uri',
					error: 'nativeError',
					errorDetail: 'test-error-detail',
				};
				const mode = 'crop';

				const scriptProps = generateScriptProps(
					identifier,
					undefined,
					mode,
					undefined,
					undefined,
					error,
				);
				const scriptHtml = scriptProps.dangerouslySetInnerHTML?.__html || '';

				executeScript(scriptHtml);

				const key = getKey(identifier, mode);
				const storedData = (window as any)[GLOBAL_MEDIA_NAMESPACE]?.mediaCardSsr?.[key];

				expect(storedData.error).toEqual(error);
			});

			it('should handle multiple script executions', () => {
				const identifier1 = { ...identifier, id: 'id-1' };
				const identifier2 = { ...identifier, id: 'id-2' };
				const dataURI1 = 'data:image/png;base64,abc';
				const dataURI2 = 'data:image/png;base64,def';

				const scriptProps1 = generateScriptProps(identifier1, dataURI1);
				const scriptProps2 = generateScriptProps(identifier2, dataURI2);

				executeScript(scriptProps1.dangerouslySetInnerHTML?.__html || '');
				executeScript(scriptProps2.dangerouslySetInnerHTML?.__html || '');

				const key1 = getKey(identifier1);
				const key2 = getKey(identifier2);
				const mediaCardSsr = (window as any)[GLOBAL_MEDIA_NAMESPACE]?.mediaCardSsr;

				expect(mediaCardSsr[key1].dataURI).toBe(dataURI1);
				expect(mediaCardSsr[key2].dataURI).toBe(dataURI2);
			});
		});

		describe('with media-perf-uplift-mutation-fix flag', () => {
			const featureFlags = { 'media-perf-uplift-mutation-fix': true };

			it('should set img src and srcset when provided', () => {
				const dataURI = 'data:image/png;base64,abc123';
				const srcSet = 'image-1x.jpg 1x, image-2x.jpg 2x';
				const dimensions = { width: 100, height: 200 };

				const scriptProps = generateScriptProps(
					identifier,
					dataURI,
					'crop',
					srcSet,
					dimensions,
					undefined,
					featureFlags,
				);
				const scriptHtml = scriptProps.dangerouslySetInnerHTML?.__html || '';

				executeScript(scriptHtml);

				expect(img.src).toContain(dataURI);
				expect(img.srcset).toBe(srcSet);
			});

			it('should create a load promise', () => {
				const dataURI = 'data:image/png;base64,abc123';

				const scriptProps = generateScriptProps(
					identifier,
					dataURI,
					'crop',
					undefined,
					undefined,
					undefined,
					featureFlags,
				);
				const scriptHtml = scriptProps.dangerouslySetInnerHTML?.__html || '';

				executeScript(scriptHtml);

				const key = getKey(identifier, 'crop');
				const storedData = (window as any)[GLOBAL_MEDIA_NAMESPACE]?.mediaCardSsr?.[key];

				expect(storedData.loadPromise).toBeDefined();
				expect(storedData.loadPromise).toBeInstanceOf(Promise);
			});

			it('should preserve larger previous image', () => {
				const mode = 'crop';
				const key = getKey(identifier, mode);

				// First execution with larger image
				const largeDataURI = 'data:image/png;base64,large';
				const largeSrcSet = 'large-1x.jpg 1x, large-2x.jpg 2x';
				const largeDimensions = { width: 500, height: 500 };

				const scriptProps1 = generateScriptProps(
					identifier,
					largeDataURI,
					mode,
					largeSrcSet,
					largeDimensions,
					undefined,
					featureFlags,
				);
				executeScript(scriptProps1.dangerouslySetInnerHTML?.__html || '');

				// Second execution with smaller image
				const smallDataURI = 'data:image/png;base64,small';
				const smallSrcSet = 'small-1x.jpg 1x, small-2x.jpg 2x';
				const smallDimensions = { width: 100, height: 100 };

				const scriptProps2 = generateScriptProps(
					identifier,
					smallDataURI,
					mode,
					smallSrcSet,
					smallDimensions,
					undefined,
					featureFlags,
				);
				executeScript(scriptProps2.dangerouslySetInnerHTML?.__html || '');

				const storedData = (window as any)[GLOBAL_MEDIA_NAMESPACE]?.mediaCardSsr?.[key];

				// Should preserve the larger image data
				expect(storedData.dataURI).toBe(largeDataURI);
				expect(storedData.srcSet).toBe(largeSrcSet);
				expect(storedData.dimensions).toEqual(largeDimensions);
			});

			it('should replace with larger image when new image is bigger', () => {
				const mode = 'crop';
				const key = getKey(identifier, mode);

				// First execution with smaller image
				const smallDataURI = 'data:image/png;base64,small';
				const smallDimensions = { width: 100, height: 100 };

				const scriptProps1 = generateScriptProps(
					identifier,
					smallDataURI,
					mode,
					undefined,
					smallDimensions,
					undefined,
					featureFlags,
				);
				executeScript(scriptProps1.dangerouslySetInnerHTML?.__html || '');

				// Second execution with larger image
				const largeDataURI = 'data:image/png;base64,large';
				const largeDimensions = { width: 500, height: 500 };

				const scriptProps2 = generateScriptProps(
					identifier,
					largeDataURI,
					mode,
					undefined,
					largeDimensions,
					undefined,
					featureFlags,
				);
				executeScript(scriptProps2.dangerouslySetInnerHTML?.__html || '');

				const storedData = (window as any)[GLOBAL_MEDIA_NAMESPACE]?.mediaCardSsr?.[key];

				// Should use the larger image data
				expect(storedData.dataURI).toBe(largeDataURI);
				expect(storedData.dimensions).toEqual(largeDimensions);
			});

			it('should set loading to lazy by default', () => {
				const scriptProps = generateScriptProps(
					identifier,
					'data:image/png;base64,abc',
					'crop',
					undefined,
					{ width: 100, height: 100 },
					undefined,
					featureFlags,
				);
				executeScript(scriptProps.dangerouslySetInnerHTML?.__html || '');

				const key = getKey(identifier, 'crop');
				const storedData = (window as any)[GLOBAL_MEDIA_NAMESPACE]?.mediaCardSsr?.[key];

				expect(storedData.loading).toBe('lazy');
			});
		});

		describe('with media-perf-lazy-loading-optimisation flag', () => {
			const featureFlags = {
				'media-perf-uplift-mutation-fix': true,
				'media-perf-lazy-loading-optimisation': true,
			};

			it('should remove lazy loading for first 6 images', () => {
				for (let i = 0; i < 6; i++) {
					const testId = { ...identifier, id: `id-${i}` };
					const scriptProps = generateScriptProps(
						testId,
						`data:image/png;base64,${i}`,
						'crop',
						undefined,
						{ width: 100, height: 100 },
						undefined,
						featureFlags,
					);
					executeScript(scriptProps.dangerouslySetInnerHTML?.__html || '');

					const key = getKey(testId, 'crop');
					const storedData = (window as any)[GLOBAL_MEDIA_NAMESPACE]?.mediaCardSsr?.[key];

					expect(storedData.loading).toBe('');
					expect(img.hasAttribute('loading')).toBe(false);
				}
			});

			it('should keep lazy loading after 6 images', () => {
				// Load 6 images first
				for (let i = 0; i < 6; i++) {
					const testId = { ...identifier, id: `id-${i}` };
					const scriptProps = generateScriptProps(
						testId,
						`data:image/png;base64,${i}`,
						'crop',
						undefined,
						{ width: 100, height: 100 },
						undefined,
						featureFlags,
					);
					executeScript(scriptProps.dangerouslySetInnerHTML?.__html || '');
				}

				// 7th image should keep lazy loading
				// Reset the img loading attribute for this test
				img.setAttribute('loading', 'lazy');

				const testId = { ...identifier, id: 'id-7' };
				const scriptProps = generateScriptProps(
					testId,
					'data:image/png;base64,7',
					'crop',
					undefined,
					{ width: 100, height: 100 },
					undefined,
					featureFlags,
				);
				executeScript(scriptProps.dangerouslySetInnerHTML?.__html || '');

				const key = getKey(testId, 'crop');
				const storedData = (window as any)[GLOBAL_MEDIA_NAMESPACE]?.mediaCardSsr?.[key];

				expect(storedData.loading).toBe('lazy');
			});

			it('should increment media count correctly', () => {
				for (let i = 0; i < 3; i++) {
					const testId = { ...identifier, id: `id-${i}` };
					const scriptProps = generateScriptProps(
						testId,
						`data:image/png;base64,${i}`,
						'crop',
						undefined,
						{ width: 100, height: 100 },
						undefined,
						featureFlags,
					);
					executeScript(scriptProps.dangerouslySetInnerHTML?.__html || '');
				}

				const mediaCountSsr = (window as any)[GLOBAL_MEDIA_NAMESPACE]?.mediaCountSsr;
				expect(mediaCountSsr).toBe(3);
			});
		});

		describe('script cleanup', () => {
			it('should remove the script element after execution', () => {
				const scriptProps = generateScriptProps(identifier, 'data:image/png;base64,abc');
				const scriptHtml = scriptProps.dangerouslySetInnerHTML?.__html || '';

				executeScript(scriptHtml);

				// The script should have removed itself
				const scripts = container.querySelectorAll('script');
				expect(scripts.length).toBe(0);
			});
		});
	});
});
