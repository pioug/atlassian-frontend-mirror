import type { Metadata, StepJson } from '@atlaskit/editor-common/collab';
import { catchupv2, isOutOfSync } from '../catchupv2';
import type { Catchupv2Options, Catchupv2Response } from '../../types';
import AnalyticsHelper from '../../analytics/analytics-helper';
import { CatchupEventReason } from '../../helpers/const';

const step1 = {
	userId: 'ari:cloud:identity::user/123',
	clientId: 123,
	from: 1,
	to: 4,
	stepType: 'replace',
	slice: {
		content: { type: 'paragraph', content: [{ type: 'text', text: 'abc' }] },
	},
};

const step2 = {
	userId: 'ari:cloud:identity::user/123',
	clientId: 123,
	from: 1,
	to: 3,
	stepType: 'replace',
	slice: {
		content: [{ type: 'paragraph', content: [{ type: 'text', text: 'ab' }] }],
	},
};

describe('Catchupv2 ', () => {
	const metadata: Metadata = { prop: 'value' };
	const clientId = 'some-random-prosemirror-client-Id';

	const mockFetchCatchup = jest.fn<
		Promise<Catchupv2Response>,
		Parameters<Catchupv2Options['fetchCatchupv2']>
	>();

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Does not call onStepsAdded when catchupv2 returns no steps', async () => {
		const options: Catchupv2Options = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			fetchCatchupv2: mockFetchCatchup.mockResolvedValue({
				steps: [],
				metadata,
			}),
			updateMetadata: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId,
			onStepsAdded: jest.fn(),
			catchUpOutofSync: false,
			reason: CatchupEventReason.STEPS_ADDED,
		};

		const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');

		await catchupv2(options);
		expect(options.fetchCatchupv2).toHaveBeenCalledWith(
			1,
			clientId,
			false,
			CatchupEventReason.STEPS_ADDED,
		);
		expect(options.onStepsAdded).not.toHaveBeenCalled();
		expect(sendErrorEventSpy).not.toHaveBeenCalled();
	});

	it('Does not call onStepsAdded when catchupv2 returns undefined steps', async () => {
		const options: Catchupv2Options = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			fetchCatchupv2: mockFetchCatchup.mockResolvedValue({
				steps: undefined,
				metadata: undefined,
			}),
			updateMetadata: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId,
			onStepsAdded: jest.fn(),
			catchUpOutofSync: false,
			reason: CatchupEventReason.STEPS_ADDED,
		};

		const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');

		await catchupv2(options);
		expect(options.fetchCatchupv2).toHaveBeenCalledWith(
			1,
			clientId,
			false,
			CatchupEventReason.STEPS_ADDED,
		);
		expect(options.onStepsAdded).not.toHaveBeenCalled();
		expect(sendErrorEventSpy).not.toHaveBeenCalled();
	});

	it('Should add steps and update metadata', async () => {
		const options: Catchupv2Options = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			fetchCatchupv2: jest.fn().mockResolvedValue({
				steps: [step1, step2],
				metadata: { prop: 'value' },
			}),
			updateMetadata: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId,
			onStepsAdded: jest.fn(),
			catchUpOutofSync: false,
		};

		await catchupv2(options);
		expect(options.onStepsAdded).toHaveBeenCalledTimes(1);
		expect(options.onStepsAdded).toHaveBeenCalledWith({
			steps: [step1, step2],
			version: 3,
		});
		expect(options.updateMetadata).toHaveBeenCalledTimes(1);
		expect(options.updateMetadata).toHaveBeenCalledWith(metadata);
	});

	it('Should send error analytics event for fetchCatchupv2 failing', async () => {
		const error = new Error('fake error');
		const options: Catchupv2Options = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			fetchCatchupv2: mockFetchCatchup.mockRejectedValueOnce(error),
			updateMetadata: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId,
			onStepsAdded: jest.fn(),
			catchUpOutofSync: false,
		};

		const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');

		try {
			await catchupv2(options);
		} catch (err) {
			expect(options.fetchCatchupv2).toHaveBeenCalledWith(1, clientId, false, undefined);
			expect(sendErrorEventSpy).toHaveBeenCalledWith(
				error,
				'Error while fetching catchupv2 from server',
			);
		}
	});
});

describe('isOutOfSync', () => {
	const fromVersion = 10;
	const currentVersion = 11;
	const lowerVersion = 9;
	const clientId = 'noot';
	const emptySteps: StepJson[] = [];
	const foreignSteps: StepJson[] = [
		{
			userId: 'yeet',
			clientId: 'yoot',
		},
	];

	it('should detect out of sync when version number doesnt increase', () => {
		expect(isOutOfSync(fromVersion, fromVersion, foreignSteps, clientId)).toEqual(true);
	});

	it('should detect out of sync when current version is lower than fromVersion', () => {
		expect(isOutOfSync(fromVersion, lowerVersion, foreignSteps, clientId)).toEqual(true);
	});

	it('should detect when in sync', () => {
		expect(isOutOfSync(fromVersion, currentVersion, foreignSteps, clientId)).toEqual(false);
	});

	it('should be in sync when steps are missing and version doesnt increase', () => {
		expect(isOutOfSync(fromVersion, fromVersion, emptySteps, clientId)).toEqual(false);
	});

	// For now, we're always assumed to be in sync when steps are missing
	it('should be in sync when steps are missing and version increases', () => {
		expect(isOutOfSync(fromVersion, currentVersion, emptySteps, clientId)).toEqual(false);
	});

	// See this doc for a more in-depth analysis:
	// https://hello.atlassian.net/wiki/spaces/~63622829b0b6ef03564afd8d/pages/3645351555/Catchup+V2+Edge+Cases
	it('should be in sync when steps are missing and version decreases', () => {
		expect(isOutOfSync(fromVersion, lowerVersion, emptySteps, clientId)).toEqual(false);
	});
});
