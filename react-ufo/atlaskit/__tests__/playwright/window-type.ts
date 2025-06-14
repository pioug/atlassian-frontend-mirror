import type {
	PostInteractionLogPayload,
	ReactUFOPayload,
} from '../../src/common/react-ufo-payload-schema';

export type WindowWithReactUFOTestGlobals = typeof window & {
	__websiteReactUfoShadowMode: Array<ReactUFOPayload>;
	__websiteReactUfoPostInteraction: Array<PostInteractionLogPayload>;
	__websiteReactUfo: Array<ReactUFOPayload>;
	// Best way to found out when a DOM was "rendered"
	// We are adding a Mutation Observer inside the `./fixtures.ts`
	// using the `page.addInitScript`.
	// The observer is grouping the nodes based on the `data-testid` only
	__sectionAddedAt: Map<string, DOMHighResTimeStamp>;

	// Best way to found out when a DOM was "painted"
	// We are adding a IntersectionObserver inside the `./fixtures.ts`
	// using the `page.addInitScript`.
	// The observer is grouping the nodes based on the `data-testid` only
	__sectionVisibleAt: Map<string, DOMHighResTimeStamp>;

	// Best way to found out when a DOM was "rendered"
	// We are adding a Mutation Observer inside the `./fixtures.ts`
	// using the `page.addInitScript`.
	// The observer is grouping the nodes based on the `data-testid` only
	__sectionAttributeChanges: Map<string, DOMHighResTimeStamp[]>;
};
