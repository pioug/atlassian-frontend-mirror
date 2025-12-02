import type React from 'react';

import { type FileIdentifier } from '@atlaskit/media-client';
import { type NumericalCardDimensions } from '@atlaskit/media-common';

import { type MediaFilePreviewErrorInfo } from '../analytics';

import { type MediaCardSsr } from './types';

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

const dashed = (param?: string) => (param ? `-${param}` : '');

export const getKey = (
	{ id, collectionName, occurrenceKey }: FileIdentifier,
	resizeMode?: string,
) => `${id}${dashed(collectionName)}${dashed(occurrenceKey)}${dashed(resizeMode)}`;

const generateScript = (
	identifier: FileIdentifier,
	dataURI?: string,
	mode?: string,
	srcSet?: string,
	dimensions?: Partial<NumericalCardDimensions>,
	error?: MediaFilePreviewErrorInfo,
	featureFlags: MediaFeatureFlags = {},
) => {
	const key = getKey(identifier, mode);

	// Serialize the parameters for injection into the script
	const params = {
		key,
		dataURI,
		mode,
		srcSet,
		dimensions,
		error,
		featureFlags,
		maxEagerLoadCount: MAX_EAGER_LOAD_COUNT,
	};

	// Read originalScriptCode.ts before making changes
	return `!function(){function e(){const e="__MEDIA_INTERNAL";return window[e]||(window[e]={}),window[e]}!function(n){var t;const i=document.currentScript,o=function(){const n=e(),t="mediaCardSsr";return n[t]||(n[t]={}),n[t]}(),r=function(){const n=e(),t="mediaCountSsr";return n[t]||(n[t]=0),n[t]}(),{key:d}=n,a=n.dataURI,s=n.mode,c=n.srcSet,{dimensions:m}=n,{error:u}=n,{featureFlags:l}=n;if(l["media-perf-uplift-mutation-fix"]){const t=o[d],f=t&&t.mode===s&&t.dimensions&&t.dimensions.width&&m&&m.width&&t.dimensions.width>m.width,w=f?t.srcSet:c,g=f?t.dataURI:a,p={dataURI:g,dimensions:m,error:u,srcSet:w,loading:"lazy",loadPromise:void 0,mode:s},S=i&&i.parentElement&&i.parentElement.querySelector("img");S&&l["media-perf-lazy-loading-optimisation"]&&r<n.maxEagerLoadCount&&(!function(){const n=e(),t="mediaCountSsr";n[t]||(n[t]=0),n[t]++}(),"lazy"===S.getAttribute("loading")&&S.removeAttribute("loading"),p.loading=""),S&&g&&(S.src=g),S&&w&&(S.srcset=w),p.loadPromise=new Promise((function(e,n){S&&(S.addEventListener("load",(function(){e(void 0)})),S.addEventListener("error",(function(){n(new Error("Failed to load image"))})))})),o[d]=f?t:p}else o[d]={dataURI:a,dimensions:m,error:u};null===(t=document.currentScript)||void 0===t||t.remove()}({replace:""})}();`
		.replace('{replace:""}', JSON.stringify(params));
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
