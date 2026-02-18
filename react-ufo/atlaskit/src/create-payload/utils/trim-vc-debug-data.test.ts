import { trimVcDebugData, VC_DEBUG_TRIM_TRIMMED_FIELD_PATH } from './trim-vc-debug-data';

const MAX_PAYLOAD_SIZE_KB = 230;

function makePropertiesWithVcRev(
	vcDetails: Record<string, { t: number; e: string[] }>,
): Record<string, unknown> {
	return {
		'ufo:vc:rev': [
			{
				revision: 'fy26.04',
				clean: true,
				'metric:vc90': 4530,
				vcDetails: { ...vcDetails },
			},
		],
	};
}

describe('trimVcDebugData', () => {
	it('does not mutate when isEnabled is false', () => {
		const vcDetails = {
			'25': { t: 1000, e: ['div.foo'] },
			'90': { t: 2000, e: ['div.bar'] },
		};
		const properties = makePropertiesWithVcRev(vcDetails);

		trimVcDebugData(properties, 300, MAX_PAYLOAD_SIZE_KB, false);
		expect((properties['ufo:vc:rev'] as any)[0].vcDetails['25'].e).toEqual(['div.foo']);
		expect((properties['ufo:vc:rev'] as any)[0].vcDetails['90'].e).toEqual(['div.bar']);
		expect(properties['event:isTrimmed']).toBeUndefined();
	});

	it('does not mutate when currentPayloadSizeKb <= maxPayloadSizeKb', () => {
		const vcDetails = {
			'25': { t: 1000, e: ['div.foo'] },
			'90': { t: 2000, e: ['div.bar'] },
		};
		const properties = makePropertiesWithVcRev(vcDetails);

		trimVcDebugData(properties, 200, MAX_PAYLOAD_SIZE_KB, true);
		expect((properties['ufo:vc:rev'] as any)[0].vcDetails['25'].e).toEqual(['div.foo']);
		expect(properties['event:isTrimmed']).toBeUndefined();
	});

	it('does not throw when ufo:vc:rev is undefined', () => {
		const properties: Record<string, unknown> = {};
		expect(() => trimVcDebugData(properties, 300, MAX_PAYLOAD_SIZE_KB, true)).not.toThrow();
		expect(properties['event:isTrimmed']).toBeUndefined();
	});

	it('does not throw when ufo:vc:rev is empty array', () => {
		const properties: Record<string, unknown> = { 'ufo:vc:rev': [] };
		expect(() => trimVcDebugData(properties, 300, MAX_PAYLOAD_SIZE_KB, true)).not.toThrow();
		expect(properties['event:isTrimmed']).toBeUndefined();
	});

	it('clears e arrays for early checkpoints (25, 50, 75, 80, 85, 98, 99) and keeps 90, 95, 100', () => {
		const vcDetails: Record<string, { t: number; e: string[] }> = {
			'25': { t: 4530, e: ['div.a'] },
			'50': { t: 4530, e: ['div.b'] },
			'75': { t: 4530, e: ['div.c'] },
			'80': { t: 4530, e: ['div.d'] },
			'85': { t: 4530, e: ['div.e'] },
			'90': { t: 4530, e: ['div.f'] },
			'95': { t: 4530, e: ['div.g'] },
			'98': { t: 4530, e: ['div.h'] },
			'99': { t: 4530, e: ['div.i'] },
			'100': { t: 5773, e: ['img.emoji'] },
		};
		const properties = makePropertiesWithVcRev(vcDetails);

		trimVcDebugData(properties, 300, MAX_PAYLOAD_SIZE_KB, true);
		const rev = (properties['ufo:vc:rev'] as any)[0];
		expect(rev.vcDetails['25'].e).toEqual([]);
		expect(rev.vcDetails['50'].e).toEqual([]);
		expect(rev.vcDetails['75'].e).toEqual([]);

		expect(rev.vcDetails['80'].e).toEqual(['div.d']);
		expect(rev.vcDetails['85'].e).toEqual(['div.e']);
		expect(rev.vcDetails['90'].e).toEqual(['div.f']);
		expect(rev.vcDetails['95'].e).toEqual(['div.g']);
		expect(rev.vcDetails['98'].e).toEqual(['div.h']);
		expect(rev.vcDetails['99'].e).toEqual(['div.i']);
		expect(rev.vcDetails['100'].e).toEqual(['img.emoji']);

		expect(properties['event:isTrimmed']).toBe(true);
		expect(properties['event:trimmedFields']).toEqual([VC_DEBUG_TRIM_TRIMMED_FIELD_PATH]);
	});

	it('appends to existing event:trimmedFields when trim runs', () => {
		const properties = makePropertiesWithVcRev({
			'25': { t: 1000, e: ['sel'] },
			'90': { t: 2000, e: ['sel2'] },
		});
		(properties as Record<string, unknown>)['event:trimmedFields'] = ['interactionMetrics.requestInfo'];

		trimVcDebugData(properties, 300, MAX_PAYLOAD_SIZE_KB, true);
		const trimmedFields = ['interactionMetrics.requestInfo', VC_DEBUG_TRIM_TRIMMED_FIELD_PATH];
		expect(properties['event:trimmedFields']).toEqual(trimmedFields);
	});

});
