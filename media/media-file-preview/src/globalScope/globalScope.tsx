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
export const GLOBAL_MEDIA_PERFORMANCE_ENTRIES = 'performanceEntries';
export const GLOBAL_MEDIA_NAMESPACE = '__MEDIA_INTERNAL';

const MAX_EAGER_LOAD_COUNT = 6;

export type MediaGlobalScope = {
	[GLOBAL_MEDIA_CARD_SSR]?: MediaCardSsr;
	[GLOBAL_MEDIA_COUNT_SSR]?: number;
	[GLOBAL_MEDIA_PERFORMANCE_ENTRIES]?: PerformanceEntry[];
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
	return `!function(e){var r=document.currentScript,i=window.__MEDIA_INTERNAL=window.__MEDIA_INTERNAL||{},n=i.mediaCardSsr=i.mediaCardSsr||{},o=e.key,t=e.dataURI,d=e.mode,a=e.srcSet,s=e.dimensions,m=e.error,l=e.featureFlags;if(l["media-perf-uplift-mutation-fix"]){var u,c,f=n[o],v=f&&f.mode===d&&(null===(u=f.dimensions)||void 0===u?void 0:u.width)&&(null==s?void 0:s.width)&&f.dimensions.width>s.width,E=v?f.srcSet:a,p=v?f.dataURI:t,w={dataURI:p,dimensions:s,error:m,srcSet:E,loading:"lazy",loadPromise:void 0,mode:d},S=null==r||null===(c=r.parentElement)||void 0===c?void 0:c.querySelector("img");if(i.mediaCountSsr=i.mediaCountSsr||0,S){if(l["media-perf-lazy-loading-optimisation"]&&i.mediaCountSsr<e.maxEagerLoadCount){i.mediaCountSsr++,S.removeAttribute("loading"),w.loading="";var g=new PerformanceObserver((function(e){e.getEntries().forEach((function(e){E.includes(e.name)&&(i.performanceEntries=i.performanceEntries||[],i.performanceEntries.push(e),g.disconnect())}))}));g.observe({type:"resource"})}p&&(S.src=p),E&&(S.srcset=E),w.loadPromise=new Promise((function(e,r){S.addEventListener("load",(function(){return e()})),S.addEventListener("error",(function(){return r(new Error("Failed to load image"))}))}))}n[o]=v?f:w}else n[o]={dataURI:t,dimensions:s,error:m};null==r||r.remove()}({replace:""});`.replace(
		'{replace:""}',
		JSON.stringify(params),
	);
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
