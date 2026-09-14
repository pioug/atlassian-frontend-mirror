import type { MediaGlobalScope } from './globalScope';

export function getMediaGlobalScope(globalScope: any = window): MediaGlobalScope {
	// Must match GLOBAL_MEDIA_NAMESPACE. Can't reference the constant from here.
	const namespace = '__MEDIA_INTERNAL';
	if (!globalScope[namespace]) {
		globalScope[namespace] = {};
	}
	return globalScope[namespace];
}
