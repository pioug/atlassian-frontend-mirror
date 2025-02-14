import { createPayloads } from '../../src/create-payload';
import { VCObserver } from '../../src/vc/vc-observer';

export type ReactUFOPayload = {
	attributes: {
		properties: ReturnType<typeof createPayloads>[number]['attributes']['properties'] & {
			'ufo:vc:dom': Record<(typeof VCObserver.VCParts)[number], string[]>;
			'ufo:vc:updates': Array<{ time: number; vc: number; elements: string[] }>;
			'ufo:vc:updates:next': Array<{ time: number; vc: number; elements: string[] }>;
			'ufo:speedIndex'?: number;
			'ufo:next:speedIndex'?: number;
		};
	};
};

export type WindowWithReactUFOTestGlobals = typeof window & {
	__websiteReactUfoShadowMode: Array<ReactUFOPayload>;
	__websiteReactUfo: Array<ReactUFOPayload>;
	// Best way to found out when a DOM was "rendered"
	// We are adding a Mutation Observer inside the `./fixtures.ts`
	// using the `page.addInitScript`.
	// The observer is grouping the nodes based on the `data-testid` only
	__sectionAddedAt: Map<string, DOMHighResTimeStamp>;
};
