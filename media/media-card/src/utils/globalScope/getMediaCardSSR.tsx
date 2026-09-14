import { getMediaGlobalScope } from './getMediaGlobalScope';
import { type MediaCardSsr } from './types';

export function getMediaCardSSR(globalScope: any = window): MediaCardSsr {
	const globalMedia = getMediaGlobalScope(globalScope);
	// Must match GLOBAL_MEDIA_CARD_SSR. Can't reference the constant from here.
	const key = 'mediaCardSsr';
	if (!globalMedia[key]) {
		globalMedia[key] = {};
	}
	return globalMedia[key] as MediaCardSsr;
}
