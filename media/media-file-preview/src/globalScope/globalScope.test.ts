import { type FileIdentifier, MediaStoreError } from '@atlaskit/media-client';

import { extractErrorInfo } from '../analytics';
import { MediaFilePreviewError } from '../errors';

import {
	getKey,
	getMediaCardSSR,
	getMediaGlobalScope,
	GLOBAL_MEDIA_CARD_SSR,
	GLOBAL_MEDIA_NAMESPACE,
	storeDataURI,
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

	describe('storeDataURI', () => {
		const identifier: FileIdentifier = {
			mediaItemType: 'file',
			id: 'some-id',
			collectionName: 'some-collection',
			occurrenceKey: 'some-occurrence',
		};
		it('should store in Media Card SSR Data the passed information', () => {
			const mediaCardSSR: Record<string, any> = {};
			const globalScope = {
				[GLOBAL_MEDIA_NAMESPACE]: { [GLOBAL_MEDIA_CARD_SSR]: mediaCardSSR },
			};
			const mode = 'crop';
			const key = getKey(identifier, mode);
			const dataURI = 'some-data-uri';
			const srcSet = 'some-src-set';
			const dimensions = { width: 3, height: 4 };
			const error = extractErrorInfo(
				new MediaFilePreviewError('ssr-server-uri', new MediaStoreError('missingInitialAuth')),
			);
			storeDataURI(key, dataURI, mode, srcSet, dimensions, error, {}, globalScope);

			expect(mediaCardSSR[key]).toEqual({ dataURI, dimensions, error });
		});
	});
});
