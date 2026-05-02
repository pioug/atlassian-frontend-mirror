// Intent-time preload for the LazyCardWithUrlContent chunk; chunk name mirrors `view/CardWithUrl/loader.tsx`.
export const preloadLazyCardWithUrlContent = (): Promise<unknown> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_smartcard-urlcardcontent" */ './view/CardWithUrl/component-lazy/index'
	);
