import type { EvalFlagsResponse } from '@atlaskit/feature-gate-fetcher/types';
import { FeatureGateEnvironment } from '@atlaskit/feature-gate-js-client/types';

import {
	getFrontendExperimentsResult,
	getValidatedPollingInterval,
	withLastOkSections,
} from '../utils';

type ValidatedPollingIntervalTestCase = {
	inputInterval: number;
	environment: FeatureGateEnvironment;
	logInfo: boolean;
	expectedInterval: number;
	infoTimesCalled: number;
	infoMessage: string | undefined;
};

describe('utils', () => {
	describe('getFrontendExperimentsResult', () => {
		const ffp = {
			requestContext: { identifiers: { stableID: 'stable-abc' }, attributes: {} },
			flags: {},
		};

		test('all fields', () => {
			const response: EvalFlagsResponse = {
				statsig: {
					experimentValues: {
						test: {
							value: '1',
						},
					},
					customAttributes: {
						attribute: 'something',
					},
					clientSdkKey: 'key',
				},
				ffp,
				status: { statsig: 'OK', ffp: 'OK' },
			};

			expect(getFrontendExperimentsResult(response, { request: 'attribute' })).toStrictEqual({
				experimentValues: {
					test: {
						value: '1',
					},
				},
				customAttributesFromFetch: {
					attribute: 'something',
				},
				clientSdkKey: 'key',
				ffp,
			});
		});

		test('missing sdk key and ffp', () => {
			const response: EvalFlagsResponse = {
				statsig: {
					experimentValues: {
						test: {
							value: '1',
						},
					},
					customAttributes: {
						attribute: 'something',
					},
				},
				status: { statsig: 'OK', ffp: 'DISABLED' },
			};

			expect(getFrontendExperimentsResult(response)).toStrictEqual({
				experimentValues: {
					test: {
						value: '1',
					},
				},
				customAttributesFromFetch: {
					attribute: 'something',
				},
				clientSdkKey: undefined,
				ffp: undefined,
				disabledProviders: ['ffp'],
			});
		});

		test('missing statsig uses empty values and the request attributes', () => {
			expect(
				getFrontendExperimentsResult(
					{ ffp, status: { statsig: 'DISABLED', ffp: 'OK' } },
					{ request: 'attribute' },
				),
			).toStrictEqual({
				experimentValues: {},
				customAttributesFromFetch: { request: 'attribute' },
				clientSdkKey: undefined,
				ffp,
				disabledProviders: ['statsig'],
			});
		});
	});

	describe('withLastOkSections', () => {
		const statsig = { experimentValues: { gate: true }, customAttributes: {} };
		const ffp = {
			requestContext: { identifiers: { stableID: 'stable-abc' }, attributes: {} },
			flags: {},
		};
		const previous: EvalFlagsResponse = { statsig, ffp, status: { statsig: 'OK', ffp: 'OK' } };

		test('returns the next response without a previous one', () => {
			const next: EvalFlagsResponse = { status: { statsig: 'UNAVAILABLE', ffp: 'UNAVAILABLE' } };
			expect(withLastOkSections(next, undefined)).toBe(next);
		});

		test('returns the next response when no provider is unavailable', () => {
			const next: EvalFlagsResponse = { statsig, status: { statsig: 'OK', ffp: 'DISABLED' } };
			expect(withLastOkSections(next, previous)).toBe(next);
		});

		test('keeps the last OK section of each unavailable provider', () => {
			expect(
				withLastOkSections({ status: { statsig: 'UNAVAILABLE', ffp: 'UNAVAILABLE' } }, previous),
			).toEqual({ statsig, ffp, status: { statsig: 'OK', ffp: 'OK' } });
		});

		test('does not keep a section the previous response did not have as OK', () => {
			const next: EvalFlagsResponse = { statsig, status: { statsig: 'OK', ffp: 'UNAVAILABLE' } };
			expect(
				withLastOkSections(next, { statsig, status: { statsig: 'OK', ffp: 'UNAVAILABLE' } }),
			).toBe(next);
		});
	});

	describe('getFrontendExperimentsResult status', () => {
		test('only includes the status that is passed in', () => {
			const response: EvalFlagsResponse = { status: { statsig: 'UNAVAILABLE', ffp: 'OK' } };
			expect(getFrontendExperimentsResult(response)).not.toHaveProperty('status');
			expect(
				getFrontendExperimentsResult(response, undefined, { statsig: 'UNAVAILABLE', ffp: 'OK' })
					.status,
			).toEqual({ statsig: 'UNAVAILABLE', ffp: 'OK' });
		});
	});

	describe('getValidatedPollingInterval', () => {
		beforeEach(() => {
			// eslint-disable-next-line no-console
			console.info = jest.fn();
		});

		test.each`
			inputInterval | environment                           | logInfo  | expectedInterval | infoMessage
			${60_001}     | ${FeatureGateEnvironment.Production}  | ${true}  | ${60_001}        | ${undefined}
			${59_999}     | ${FeatureGateEnvironment.Production}  | ${true}  | ${60_000}        | ${'options.pollingInterval needs to be greater than 60000, interval has been set to minimum'}
			${60_000}     | ${FeatureGateEnvironment.Production}  | ${true}  | ${60_000}        | ${undefined}
			${60_001}     | ${FeatureGateEnvironment.Production}  | ${false} | ${60_001}        | ${undefined}
			${59_999}     | ${FeatureGateEnvironment.Production}  | ${false} | ${60_000}        | ${undefined}
			${60_000}     | ${FeatureGateEnvironment.Production}  | ${false} | ${60_000}        | ${undefined}
			${1_001}      | ${FeatureGateEnvironment.Staging}     | ${true}  | ${1_001}         | ${'options.pollingInterval needs to be greater than 60000 in Production'}
			${1_000}      | ${FeatureGateEnvironment.Staging}     | ${true}  | ${1_000}         | ${'options.pollingInterval needs to be greater than 60000 in Production'}
			${999}        | ${FeatureGateEnvironment.Staging}     | ${true}  | ${1_000}         | ${'options.pollingInterval needs to be greater than 1000, interval has been set to minimum'}
			${1_001}      | ${FeatureGateEnvironment.Staging}     | ${false} | ${1_001}         | ${undefined}
			${1_000}      | ${FeatureGateEnvironment.Staging}     | ${false} | ${1_000}         | ${undefined}
			${999}        | ${FeatureGateEnvironment.Staging}     | ${false} | ${1_000}         | ${undefined}
			${1_001}      | ${FeatureGateEnvironment.Development} | ${true}  | ${1_001}         | ${'options.pollingInterval needs to be greater than 60000 in Production'}
			${1_000}      | ${FeatureGateEnvironment.Development} | ${true}  | ${1_000}         | ${'options.pollingInterval needs to be greater than 60000 in Production'}
			${999}        | ${FeatureGateEnvironment.Development} | ${true}  | ${1_000}         | ${'options.pollingInterval needs to be greater than 1000, interval has been set to minimum'}
			${1_001}      | ${FeatureGateEnvironment.Development} | ${false} | ${1_001}         | ${undefined}
			${1_000}      | ${FeatureGateEnvironment.Development} | ${false} | ${1_000}         | ${undefined}
			${999}        | ${FeatureGateEnvironment.Development} | ${false} | ${1_000}         | ${undefined}
		`(
			'With inputInterval $inputInterval for env $environment and logInfo $logInfo, expectedInterval is $expectedInterval',
			({
				inputInterval,
				environment,
				logInfo,
				expectedInterval,
				infoMessage,
			}: ValidatedPollingIntervalTestCase) => {
				expect(getValidatedPollingInterval(inputInterval, environment, logInfo)).toEqual(
					expectedInterval,
				);

				if (infoMessage) {
					// eslint-disable-next-line no-console
					expect(console.info).toHaveBeenCalledWith(infoMessage);
				} else {
					// eslint-disable-next-line no-console
					expect(console.info).toHaveBeenCalledTimes(0);
				}
			},
		);
	});
});
