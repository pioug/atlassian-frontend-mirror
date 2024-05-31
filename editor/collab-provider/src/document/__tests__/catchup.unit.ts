import { catchup, rebaseSteps, removeConfirmedSteps } from '../catchup';
import type { CatchupOptions } from '../../types';
import { StepMap } from '@atlaskit/editor-prosemirror/transform';
import AnalyticsHelper from '../../analytics/analytics-helper';

describe('Catchup ', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Silently continues when catchup returns no document', async () => {
		const options: CatchupOptions = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			getUnconfirmedSteps: jest.fn().mockReturnValue(undefined),
			fetchCatchup: jest.fn().mockResolvedValue({
				doc: null,
				stepMaps: [
					{
						ranges: [0, 1, 2],
						inverted: false,
					},
				],
				version: 2,
			}),
			filterQueue: jest.fn(),
			updateDocument: jest.fn(),
			updateMetadata: jest.fn(),
			applyLocalSteps: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId: 'some-random-prosemirror-client-Id',
		};
		await catchup(options);
		expect(options.fetchCatchup).toBeCalledWith(1, 'some-random-prosemirror-client-Id');
	});

	it('Should replace local document and version', async () => {
		const exampleDoc = JSON.stringify({ a: 'example' });
		const options: CatchupOptions = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			getUnconfirmedSteps: jest.fn().mockReturnValue(undefined),
			fetchCatchup: jest.fn().mockResolvedValue({
				doc: exampleDoc,
				stepMaps: [
					{
						ranges: [0, 1, 2],
						inverted: false,
					},
				],
				version: 2,
			}),
			filterQueue: jest.fn(),
			applyLocalSteps: jest.fn(),
			updateDocument: jest.fn(),
			updateMetadata: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId: 'some-random-prosemirror-client-Id',
		};

		await catchup(options);
		expect(options.filterQueue).toHaveBeenCalledTimes(1);
		expect(options.filterQueue).toHaveBeenCalledWith(expect.any(Function));
		expect(options.updateDocument).toHaveBeenCalledTimes(1);
		expect(options.updateDocument).toBeCalledWith({
			doc: JSON.parse(exampleDoc),
			version: 2,
			metadata: undefined,
			reserveCursor: true,
		});
	});

	it('Should replace local document and version when client version is ahead', async () => {
		const exampleDoc = JSON.stringify({ a: 'example' });
		const options: CatchupOptions = {
			getCurrentPmVersion: jest.fn().mockReturnValue(50),
			getUnconfirmedSteps: jest.fn().mockReturnValue(['FakeStep']),
			fetchCatchup: jest.fn().mockResolvedValue({
				doc: exampleDoc,
				stepMaps: [
					{
						ranges: [0, 1, 2],
						inverted: false,
					},
				],
				version: 2,
			}),
			filterQueue: jest.fn(),
			updateDocument: jest.fn(),
			updateMetadata: jest.fn(),
			applyLocalSteps: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId: 'some-random-prosemirror-client-Id',
		};

		await catchup(options);
		expect(options.updateDocument).toHaveBeenCalledTimes(1);
		expect(options.updateDocument).toBeCalledWith({
			doc: JSON.parse(exampleDoc),
			version: 2,
			metadata: undefined,
			reserveCursor: true,
		});
		expect(options.applyLocalSteps).toBeCalledWith(['FakeStep']);
	});

	it('Should rebase and re-apply unconfirmed local steps on top of the new catchup version', async () => {
		const exampleDoc = JSON.stringify({ a: 'example' });
		const mockUnconfirmedSteps = [
			{ map: jest.fn().mockReturnValue('rebasedStep1') },
			{ map: jest.fn().mockReturnValue('rebasedStep2') },
		];
		const options: CatchupOptions = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			getUnconfirmedSteps: jest.fn().mockReturnValue(mockUnconfirmedSteps),
			fetchCatchup: jest.fn().mockResolvedValue({
				doc: exampleDoc,
				stepMaps: [
					{
						ranges: [0, 1, 2],
						inverted: false,
					},
				],
				version: 2,
			}),
			filterQueue: jest.fn(),
			updateDocument: jest.fn(),
			updateMetadata: jest.fn(),
			applyLocalSteps: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId: 'some-random-prosemirror-client-Id',
		};

		await catchup(options);

		expect(options.applyLocalSteps).toHaveBeenCalledWith(['rebasedStep1', 'rebasedStep2']);
		expect(mockUnconfirmedSteps[0].map).toBeCalled();
		expect(mockUnconfirmedSteps[1].map).toBeCalled();

		// Make sure document is still updated when we have unconfirmed steps
		expect(options.filterQueue).toHaveBeenCalledTimes(1);
		expect(options.filterQueue).toHaveBeenCalledWith(expect.any(Function));
		expect(options.updateDocument).toHaveBeenCalledTimes(1);
		expect(options.updateDocument).toBeCalledWith({
			doc: JSON.parse(exampleDoc),
			version: 2,
			metadata: undefined,
			reserveCursor: true,
		});
	});

	it('Should send error analytics event for fetchCatchup failing', async () => {
		const error = new Error('fake error');
		const options: CatchupOptions = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			getUnconfirmedSteps: jest.fn().mockReturnValue(undefined),
			fetchCatchup: jest.fn().mockRejectedValueOnce(error),
			filterQueue: jest.fn(),
			updateDocument: jest.fn(),
			updateMetadata: jest.fn(),
			applyLocalSteps: jest.fn(),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId: 'some-random-prosemirror-client-Id',
		};

		const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');

		try {
			await catchup(options);
		} catch (err) {
			expect(options.fetchCatchup).toBeCalledWith(1, 'some-random-prosemirror-client-Id');
			expect(sendErrorEventSpy).toBeCalledWith(error, 'Error while fetching catchup from server');
		}
	});

	it('Should send error analytics event for apply catchup steps failing', async () => {
		const exampleDoc = JSON.stringify({ a: 'example' });
		const mockUnconfirmedSteps = [
			{ map: jest.fn().mockReturnValue('rebasedStep1') },
			{ map: jest.fn().mockReturnValue('rebasedStep2') },
		];
		const error = new Error('fake error');

		const options: CatchupOptions = {
			getCurrentPmVersion: jest.fn().mockReturnValue(1),
			getUnconfirmedSteps: jest.fn().mockReturnValue(mockUnconfirmedSteps),
			fetchCatchup: jest.fn().mockResolvedValue({
				doc: exampleDoc,
				stepMaps: [
					{
						ranges: [0, 1, 2],
						inverted: false,
					},
				],
				version: 2,
			}),
			filterQueue: jest.fn(),
			updateDocument: jest.fn(),
			updateMetadata: jest.fn(),
			applyLocalSteps: jest.fn().mockImplementation(() => {
				throw error;
			}),
			analyticsHelper: new AnalyticsHelper('fake-document-ari'),
			clientId: 'some-random-prosemirror-client-Id',
		};

		const sendErrorEventSpy = jest.spyOn(AnalyticsHelper.prototype, 'sendErrorEvent');

		try {
			await catchup(options);
		} catch (err) {
			expect(options.fetchCatchup).toBeCalledWith(1, 'some-random-prosemirror-client-Id');
			expect(sendErrorEventSpy).toHaveBeenCalledWith(
				error,
				'Failed to apply catchup result in the editor',
			);
		}
	});

	describe('rebaseSteps', () => {
		it('Should rebase steps by calling their map function', () => {
			const mapping = new StepMap([0]);
			const steps = [
				{ map: jest.fn().mockReturnValue('rebasedStep1') },
				{ map: jest.fn().mockReturnValue('rebasedStep2') },
			];
			// @ts-ignore - mock steps
			const res = rebaseSteps(steps, mapping);
			expect(res).toEqual(['rebasedStep1', 'rebasedStep2']);
			expect(steps[0].map).toBeCalledWith(mapping);
			expect(steps[0].map).toBeCalledWith(mapping);
		});

		it('Should handle steps being dropped when mapping them', () => {
			const mapping = new StepMap([0]);
			const steps = [{ map: jest.fn().mockReturnValue(undefined) }];
			// @ts-ignore - mock steps
			const res = rebaseSteps(steps, mapping);
			expect(res).toHaveLength(0);
			expect(steps[0].map).toBeCalledWith(mapping);
		});
	});

	describe('removeConfirmedSteps', () => {
		it('Should return full array of unconfirmedSteps if clientIds not returned by server', () => {
			const unconfirmedSteps = ['step1', 'step2', 'step3', 'step4'];
			const serverStepMaps = [
				{ ranges: [0, 1, 2], inverted: false },
				{ ranges: [0, 1, 2], inverted: false },
				{ ranges: [0, 1, 2], inverted: false },
			];
			const clientId = 'my-client-Id';
			const slicedUnconfirmedSteps = removeConfirmedSteps(
				// @ts-ignore - mock steps
				unconfirmedSteps,
				serverStepMaps,
				clientId,
			);
			expect(slicedUnconfirmedSteps).toEqual(['step1', 'step2', 'step3', 'step4']);
		});

		it('Should return full array of unconfirmedSteps if no matches for clientId', () => {
			const unconfirmedSteps = ['step1', 'step2', 'step3', 'step4'];
			const serverStepMaps = [
				{ ranges: [0, 1, 2], inverted: false, clientId: '123' },
				{ ranges: [0, 1, 2], inverted: false, clientId: '456' },
				{ ranges: [0, 1, 2], inverted: false, clientId: '789' },
			];
			const clientId = 'my-client-Id';
			const slicedUnconfirmedSteps = removeConfirmedSteps(
				// @ts-ignore - mock steps
				unconfirmedSteps,
				serverStepMaps,
				clientId,
			);
			expect(slicedUnconfirmedSteps).toEqual(['step1', 'step2', 'step3', 'step4']);
		});

		it('Should return sliced array of unconfirmedSteps if clientId is returned by server', () => {
			const unconfirmedSteps = ['step1', 'step2', 'step3', 'step4'];
			const serverStepMaps = [
				{ ranges: [0, 1, 2], inverted: false, clientId: '123' },
				{ ranges: [0, 1, 2], inverted: false, clientId: 'my-client-Id' },
				{ ranges: [0, 1, 2], inverted: false, clientId: '456' },
				{ ranges: [0, 1, 2], inverted: false, clientId: 'my-client-Id' },
				{ ranges: [0, 1, 2], inverted: false, clientId: '123' },
			];
			const clientId = 'my-client-Id';
			const slicedUnconfirmedSteps = removeConfirmedSteps(
				// @ts-ignore - mock steps
				unconfirmedSteps,
				serverStepMaps,
				clientId,
			);
			// clientId appears 2 times, so we expect first 2 unconfirmedSteps to be dropped
			expect(slicedUnconfirmedSteps).toEqual(['step3', 'step4']);
		});
	});
});
