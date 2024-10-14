import { type FrontendExperimentsResponse } from '@atlaskit/feature-gate-fetcher';
import { FeatureGateEnvironment } from '@atlaskit/feature-gate-js-client';

import { getFrontendExperimentsResult, getValidatedPollingInterval } from '../utils';

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
		test('all fields', () => {
			const response: FrontendExperimentsResponse = {
				experimentValues: {
					test: {
						value: '1',
					},
				},
				customAttributes: {
					attribute: 'something',
				},
				clientSdkKey: 'key',
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
				clientSdkKey: 'key',
			});
		});

		test('missing sdk key', () => {
			const response: FrontendExperimentsResponse = {
				experimentValues: {
					test: {
						value: '1',
					},
				},
				customAttributes: {
					attribute: 'something',
				},
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
			});
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
