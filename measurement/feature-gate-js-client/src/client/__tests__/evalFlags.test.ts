import { getEvalFlagsStatus } from '../fetcher/evalFlags/getEvalFlagsStatus';
import { hasNoUsableProvider } from '../fetcher/evalFlags/hasNoUsableProvider';
import { isEvalFlagsDegraded } from '../fetcher/evalFlags/isEvalFlagsDegraded';
import { toInitializeValues } from '../fetcher/evalFlags/toInitializeValues';
import { type EvalFlagsResponse } from '../fetcher/types';
import { type FfpInitializeValues } from '../types';

const STATSIG = {
	clientSdkKey: 'client-key',
	experimentValues: { feature_gates: {} },
	customAttributes: { fetched: true },
};
const FFP: FfpInitializeValues = { flags: {}, requestContext: { identifiers: {} } };
const REQUEST_ATTRIBUTES = { requested: true };

describe('evalFlags helpers', () => {
	describe('getEvalFlagsStatus', () => {
		test('uses the reported status', () => {
			expect(
				getEvalFlagsStatus({
					statsig: STATSIG,
					status: { statsig: 'UNAVAILABLE', ffp: 'DISABLED' },
				}),
			).toEqual({ statsig: 'UNAVAILABLE', ffp: 'DISABLED' });
		});

		// Outside the contract, but tolerated as the body is not validated
		test.each<[string, unknown, ReturnType<typeof getEvalFlagsStatus>]>([
			['both sections', { statsig: STATSIG, ffp: FFP }, { statsig: 'OK', ffp: 'OK' }],
			['no sections', {}, { statsig: 'DISABLED', ffp: 'DISABLED' }],
			[
				'null and empty sections',
				{ statsig: null, ffp: {} as FfpInitializeValues },
				{ statsig: 'DISABLED', ffp: 'DISABLED' },
			],
			[
				'unknown status values',
				{ statsig: STATSIG, status: { statsig: 'DEGRADED' } },
				{ statsig: 'OK', ffp: 'DISABLED' },
			],
		])('derives a missing or unknown status from the sections: %s', (_, response, expected) => {
			expect(getEvalFlagsStatus(response as EvalFlagsResponse)).toEqual(expected);
		});
	});

	describe('isEvalFlagsDegraded', () => {
		test.each([
			['OK', 'OK', false],
			['OK', 'DISABLED', false],
			['DISABLED', 'OK', false],
			['OK', 'UNAVAILABLE', true],
			['UNAVAILABLE', 'OK', true],
			['UNAVAILABLE', 'DISABLED', true],
			['DISABLED', 'DISABLED', true],
		] as const)('Statsig %s and FFP %s: %s', (statsig, ffp, expected) => {
			expect(isEvalFlagsDegraded({ statsig, ffp })).toBe(expected);
		});
	});

	describe('hasNoUsableProvider', () => {
		test.each([
			['OK', 'OK', false],
			['OK', 'DISABLED', false],
			['DISABLED', 'OK', false],
			['OK', 'UNAVAILABLE', false],
			['UNAVAILABLE', 'OK', false],
			['DISABLED', 'DISABLED', false],
			['UNAVAILABLE', 'DISABLED', true],
			['DISABLED', 'UNAVAILABLE', true],
			['UNAVAILABLE', 'UNAVAILABLE', true],
		] as const)('Statsig %s and FFP %s: %s', (statsig, ffp, expected) => {
			expect(hasNoUsableProvider({ statsig, ffp })).toBe(expected);
		});
	});

	describe('toInitializeValues', () => {
		test('uses both sections when both providers are OK', () => {
			expect(
				toInitializeValues(
					{ statsig: STATSIG, ffp: FFP, status: { statsig: 'OK', ffp: 'OK' } },
					REQUEST_ATTRIBUTES,
				),
			).toEqual({
				clientSdkKey: 'client-key',
				experimentValues: STATSIG.experimentValues,
				customAttributesFromFetch: STATSIG.customAttributes,
				ffp: FFP,
				status: { statsig: 'OK', ffp: 'OK' },
			});
		});

		test('ignores the sections of providers that are not OK', () => {
			expect(
				toInitializeValues(
					{ statsig: STATSIG, ffp: FFP, status: { statsig: 'UNAVAILABLE', ffp: 'DISABLED' } },
					REQUEST_ATTRIBUTES,
				),
			).toEqual({
				clientSdkKey: undefined,
				experimentValues: {},
				customAttributesFromFetch: REQUEST_ATTRIBUTES,
				ffp: undefined,
				status: { statsig: 'UNAVAILABLE', ffp: 'DISABLED' },
				// An unavailable provider keeps running, with code defaults; only a disabled one stops.
				disabledProviders: ['ffp'],
			});
		});

		test('lists every disabled provider', () => {
			expect(
				toInitializeValues(
					{ statsig: STATSIG, ffp: FFP, status: { statsig: 'DISABLED', ffp: 'DISABLED' } },
					REQUEST_ATTRIBUTES,
				).disabledProviders,
			).toEqual(['statsig', 'ffp']);
		});

		test('treats an empty section of an OK provider as having no values', () => {
			expect(
				toInitializeValues({ statsig: null, status: { statsig: 'OK', ffp: 'OK' } }, undefined),
			).toEqual({
				clientSdkKey: undefined,
				experimentValues: {},
				customAttributesFromFetch: undefined,
				ffp: undefined,
				status: { statsig: 'OK', ffp: 'OK' },
			});
		});
	});
});
