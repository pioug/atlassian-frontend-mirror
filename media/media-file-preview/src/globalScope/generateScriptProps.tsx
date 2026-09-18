import type React from 'react';

import { type FileIdentifier } from '@atlaskit/media-client';
import { type NumericalCardDimensions } from '@atlaskit/media-common';

import { type MediaFilePreviewErrorInfo } from '../analytics';
import { getKey } from './getKey';
import { MAX_EAGER_LOAD_COUNT } from './globalScope';

type MediaFeatureFlags = {
	'media-perf-uplift-mutation-fix'?: boolean;
	'media-perf-lazy-loading-optimisation'?: boolean;
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
