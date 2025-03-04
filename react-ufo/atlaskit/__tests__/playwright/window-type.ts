import { MultiHeatmapPayload } from '@atlaskit/react-ufo/common';

import { createPayloads } from '../../src/create-payload';
import { VCObserver } from '../../src/vc/vc-observer';

type ExtractPromise<T> = T extends Promise<infer U> ? U : never;

export type ReactUFOPayload = {
	attributes: {
		properties: ExtractPromise<
			ReturnType<typeof createPayloads>
		>[number]['attributes']['properties'] & {
			'ufo:vc:dom': Record<(typeof VCObserver.VCParts)[number], string[]>;
			'ufo:vc:updates': Array<{ time: number; vc: number; elements: string[] }>;
			'ufo:vc:updates:next': Array<{ time: number; vc: number; elements: string[] }>;
			'ufo:speedIndex'?: number;
			'ufo:next:speedIndex'?: number;
			'ufo:vc:rev'?: MultiHeatmapPayload;
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

	// Best way to found out when a DOM was "painted"
	// We are adding a IntersectionObserver inside the `./fixtures.ts`
	// using the `page.addInitScript`.
	// The observer is grouping the nodes based on the `data-testid` only
	__sectionVisibleAt: Map<string, DOMHighResTimeStamp>;
};
