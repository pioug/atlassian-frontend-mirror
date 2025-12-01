import type React from 'react';

import { type FileIdentifier } from '@atlaskit/media-client';
import { type NumericalCardDimensions } from '@atlaskit/media-common';

import { type MediaFilePreviewErrorInfo } from '../analytics';

import { printFunctionCall, printScript } from './printScript';
import { type MediaCardSsr, type MediaCardSsrData } from './types';

// ----- WARNING -----
// This is a very sensitive fraction of code.
// Any changes to this file must be tested directly in product before merging.
// The scripts printed here might differ from what we observe in our internal tests
// due to minimification, for example.

export const GLOBAL_MEDIA_CARD_SSR = 'mediaCardSsr';
export const GLOBAL_MEDIA_COUNT_SSR = 'mediaCountSsr';
export const GLOBAL_MEDIA_NAMESPACE = '__MEDIA_INTERNAL';

const MAX_EAGER_LOAD_COUNT = 6;

export type MediaGlobalScope = {
	[GLOBAL_MEDIA_CARD_SSR]?: MediaCardSsr;
	[GLOBAL_MEDIA_COUNT_SSR]?: number;
};

type MediaFeatureFlags = {
	'media-perf-uplift-mutation-fix'?: boolean;
	'media-perf-lazy-loading-optimisation'?: boolean;
};

export function getMediaGlobalScope(globalScope: any = window): MediaGlobalScope {
	// Must match GLOBAL_MEDIA_NAMESPACE. Can't reference the constant from here.
	const namespace = '__MEDIA_INTERNAL';
	if (!globalScope[namespace]) {
		globalScope[namespace] = {};
	}
	return globalScope[namespace];
}

export function getMediaCardSSR(globalScope: any = window): MediaCardSsr {
	const globalMedia = getMediaGlobalScope(globalScope);
	// Must match GLOBAL_MEDIA_CARD_SSR. Can't reference the constant from here.
	const key = 'mediaCardSsr';
	if (!globalMedia[key]) {
		globalMedia[key] = {};
	}
	return globalMedia[key] as MediaCardSsr;
}

export function getMediaCountSSR(globalScope: any = window): number {
	const globalMedia = getMediaGlobalScope(globalScope);
	// Must match GLOBAL_MEDIA_COUNT_SSR. Can't reference the constant from here.
	const key = 'mediaCountSsr';
	if (!globalMedia[key]) {
		globalMedia[key] = 0;
	}
	return globalMedia[key];
}

export function incrementMediaCountSSR(globalScope: any = window): void {
	const globalMedia = getMediaGlobalScope(globalScope);
	// Must match GLOBAL_MEDIA_COUNT_SSR. Can't reference the constant from here.
	const key = 'mediaCountSsr';
	if (!globalMedia[key]) {
		globalMedia[key] = 0;
	}
	globalMedia[key]++;
}

const dashed = (param?: string) => (param ? `-${param}` : '');

export const getKey = (
	{ id, collectionName, occurrenceKey }: FileIdentifier,
	resizeMode?: string,
) => `${id}${dashed(collectionName)}${dashed(occurrenceKey)}${dashed(resizeMode)}`;

declare const script: HTMLScriptElement;
export const storeDataURI = (
	key: string,
	paramDataURI?: string,
	paramMode?: string,
	paramSrcSet?: string,
	dimensions?: Partial<NumericalCardDimensions>,
	error?: MediaFilePreviewErrorInfo,
	featureFlags: MediaFeatureFlags = {},
	globalScope: any = window,
) => {
	const mediaCardSsr = getMediaCardSSR(globalScope);
	const mediaCountSsr = getMediaCountSSR(globalScope);

	if (featureFlags['media-perf-uplift-mutation-fix']) {
		const prevData = mediaCardSsr[key];
		const isPreviousImageLarger =
			prevData?.mode === paramMode &&
			prevData &&
			prevData.dimensions?.width &&
			dimensions?.width &&
			prevData.dimensions.width > dimensions.width;

		const srcSet = isPreviousImageLarger ? prevData?.srcSet : paramSrcSet;
		const dataURI = isPreviousImageLarger ? prevData?.dataURI : paramDataURI;

		const currData: MediaCardSsrData = { dataURI, dimensions, error, srcSet, loading: 'lazy' };

		const img = script?.parentElement?.querySelector('img');

		if (img && featureFlags['media-perf-lazy-loading-optimisation'] && mediaCountSsr < MAX_EAGER_LOAD_COUNT) {
			incrementMediaCountSSR(globalScope);
			if (img.getAttribute('loading') === 'lazy') {
				img.removeAttribute('loading');
			}
			currData.loading = '';
		}

		if (img && dataURI) {
			img.src = dataURI;
		}
		if (img && srcSet) {
			img.srcset = srcSet;
		}


		currData.loadPromise = new Promise<void>((resolve, reject) => {
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			img?.addEventListener('load', () => {
				resolve(void 0);
			});

			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			img?.addEventListener('error', () => {
				reject(new Error('Failed to load image'));
			});
		});

		mediaCardSsr[key] = isPreviousImageLarger
			? prevData
			: currData;
	} else {
		mediaCardSsr[key] = { dataURI: paramDataURI, dimensions, error };
	}
};

const generateScript = (
	identifier: FileIdentifier,
	dataURI?: string,
	mode?: string,
	srcSet?: string,
	dimensions?: Partial<NumericalCardDimensions>,
	error?: MediaFilePreviewErrorInfo,
	featureFlags: MediaFeatureFlags = {},
) => {
	const functionCall = printFunctionCall(
		storeDataURI,
		getKey(identifier, mode),
		dataURI,
		mode,
		srcSet,
		dimensions,
		error,
		featureFlags,
	);

	return printScript([getMediaCardSSR.toString(), getMediaGlobalScope.toString(), functionCall]);
};

export const generateScriptProps = (
	identifier: FileIdentifier,
	dataURI?: string,
	mode?: string,
	srcSet?: string,
	dimensions?: Partial<NumericalCardDimensions>,
	error?: MediaFilePreviewErrorInfo,
	featureFlags: MediaFeatureFlags = {},
): React.ScriptHTMLAttributes<HTMLScriptElement> => ({
	dangerouslySetInnerHTML: {
		__html: generateScript(identifier, dataURI, mode, srcSet, dimensions, error, featureFlags),
	},
});
