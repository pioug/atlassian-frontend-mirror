import { catchupv2, isOutOfSync } from '../catchupv2';
import type { Catchupv2Options, StepJson } from '../../types';
import AnalyticsHelper from '../../analytics/analytics-helper';

const newMetadata = 'new-metadata';

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
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Does not call onStepsAdded when catchupv2 returns no steps', async () => {
		const options: Catchupv2Options = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			fetchCatchupv2: jest.fn().mockResolvedValue({
				steps: [],
				metadata: newMetadata,
			}),
			updateMetadata: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId: 'some-random-prosemirror-client-Id',
			onStepsAdded: jest.fn(),
			catchUpOutofSync: false,
		};

		const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');

		await catchupv2(options);
		expect(options.fetchCatchupv2).toBeCalledWith(1, 'some-random-prosemirror-client-Id', false);
		expect(options.onStepsAdded).not.toBeCalled();
		expect(sendErrorEventSpy).not.toBeCalled();
	});

	it('Does not call onStepsAdded when catchupv2 returns undefined steps', async () => {
		const options: Catchupv2Options = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			fetchCatchupv2: jest.fn().mockResolvedValue({
				steps: undefined,
				metadata: undefined,
			}),
			updateMetadata: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId: 'some-random-prosemirror-client-Id',
			onStepsAdded: jest.fn(),
			catchUpOutofSync: false,
		};

		const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');

		await catchupv2(options);
		expect(options.fetchCatchupv2).toBeCalledWith(1, 'some-random-prosemirror-client-Id', false);
		expect(options.onStepsAdded).not.toBeCalled();
		expect(sendErrorEventSpy).not.toBeCalled();
	});

	it('Should add steps and update metadata', async () => {
		const options: Catchupv2Options = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			fetchCatchupv2: jest.fn().mockResolvedValue({
				steps: [step1, step2],
				metadata: newMetadata,
			}),
			updateMetadata: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId: 'some-random-prosemirror-client-Id',
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
		expect(options.updateMetadata).toBeCalledWith(newMetadata);
	});

	it('Should send error analytics event for fetchCatchupv2 failing', async () => {
		const error = new Error('fake error');
		const options: Catchupv2Options = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			fetchCatchupv2: jest.fn().mockRejectedValueOnce(error),
			updateMetadata: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId: 'some-random-prosemirror-client-Id',
			onStepsAdded: jest.fn(),
			catchUpOutofSync: false,
		};

		const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');

		try {
			await catchupv2(options);
		} catch (err) {
			expect(options.fetchCatchupv2).toBeCalledWith(1, 'some-random-prosemirror-client-Id', false);
			expect(sendErrorEventSpy).toBeCalledWith(error, 'Error while fetching catchupv2 from server');
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
