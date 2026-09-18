import { replaceRaf } from 'raf-stub';

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { Node } from '@atlaskit/editor-prosemirror/model';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';

import AnalyticsHelper from '../../analytics/analytics-helper';
import { Channel } from '../../channel';
import { CatchupEventReason } from '../../helpers/const';
import { createSocketIOCollabProvider } from '../../socket-io-provider';
import { getMaxGapSince } from '../sleep-detector';

replaceRaf();

jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

jest.mock('../commit-step');

jest.mock('../sleep-detector', () => ({
	acquireSleepDetector: jest.fn(() => jest.fn()),
	getMaxGapSince: jest.fn(() => 0),
	onSuspension: jest.fn(() => jest.fn()),
}));

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn().mockReturnValue(false),
}));

jest.mock('../../channel', () => {
	const events = new Map<string, (...args: any) => {}>();

	function Channel() {
		return {
			emit: (event: string, ...args: any[]) => {
				const handler = events.get(event);
				if (handler) {
					handler(...args);
				}
			},
			on: jest.fn().mockImplementation(function (this: any, eventName, callback) {
				events.set(eventName, callback);
				// Ignored via go/ees005
				// eslint-disable-next-line no-invalid-this
				return this;
			}),
			connect: jest.fn(),
			broadcast: () => jest.fn(),
			fetchCatchupv2: () => jest.fn(),
			sendMetadata: () => jest.fn(),
			fetchReconcile: () => jest.fn(),
			disconnect: jest.fn(),
			getConnected: () => true,
		};
	}
	return {
		Channel,
	};
});

const SLEEP_EXPERIMENT = 'collab_check_sleep_detection_experiment';
const OUT_OF_SYNC_PERIOD = 3000;
const SUSPENSION = 10 * 60 * 1000;

const testProviderConfig = {
	url: `http://provider-url:66661`,
	documentAri: 'ari:cloud:confluence:ABC:page/testpage',
};

const editorState: any = {
	plugins: [
		{
			key: 'collab$',
			spec: {
				config: {
					clientID: 'some-random-prosemirror-client-Id',
				},
			},
		},
	],
	collab: {
		steps: [],
		origins: [],
		version: 0,
	},
	doc: Node.fromJSON(defaultSchema, {
		type: 'doc',
		content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello, World!' }] }],
	}),
};

describe('sleep detection on reconnect', () => {
	let channel: any;
	let provider: ReturnType<typeof createSocketIOCollabProvider>;
	let catchup: jest.Mock;

	beforeEach(() => {
		channel = new Channel({} as any, new AnalyticsHelper(testProviderConfig.documentAri));
		provider = createSocketIOCollabProvider(testProviderConfig);
		provider.initialize(() => editorState);
		catchup = jest.fn();
		(provider as any).documentService.throttledCatchupv2 = catchup;
	});

	afterEach(() => {
		provider.destroy();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	const reportSleepDuration = (duration: number) => {
		(getMaxGapSince as jest.Mock).mockReturnValue(duration);
	};

	const disconnectFor = (duration: number) => {
		jest.spyOn(Date, 'now').mockReturnValueOnce(Date.now() - duration);
		channel.emit('disconnect', { reason: 'Testing' });
	};

	const reconnect = (initialized = true) => {
		channel.emit('connected', { sid: 'pweq3Q7NOPY4y88QAGyr', initialized });
		(requestAnimationFrame as any).step();
	};

	it('catches up when a suspension is detected but the disconnect looks brief', () => {
		mockExpEnabled(SLEEP_EXPERIMENT);
		reportSleepDuration(SUSPENSION);
		disconnectFor(300);
		reconnect();

		expect(catchup).toHaveBeenCalledWith(
			CatchupEventReason.RECONNECTED,
			expect.objectContaining({ disconnectionPeriodSeconds: SUSPENSION / 1000 }),
			expect.anything(),
		);
	});

	it('does not catch up on a suspension when the experiment is disabled', () => {
		mockExpDisabled(SLEEP_EXPERIMENT);
		reportSleepDuration(SUSPENSION);
		disconnectFor(300);
		reconnect();

		expect(catchup).not.toHaveBeenCalled();
	});

	it('does not catch up on a brief disconnect with no suspension', () => {
		mockExpEnabled(SLEEP_EXPERIMENT);
		reportSleepDuration(1000);
		disconnectFor(300);
		reconnect();

		expect(catchup).not.toHaveBeenCalled();
	});

	it('still catches up on a long disconnect', () => {
		mockExpEnabled(SLEEP_EXPERIMENT);
		reportSleepDuration(1000);
		disconnectFor(5000);
		reconnect();

		expect(catchup).toHaveBeenCalledWith(
			CatchupEventReason.RECONNECTED,
			expect.objectContaining({ disconnectionPeriodSeconds: 5 }),
			expect.anything(),
		);
	});

	it('advances its watermark once reconnected so a suspension is not counted twice', () => {
		mockExpEnabled(SLEEP_EXPERIMENT);
		reportSleepDuration(SUSPENSION);
		disconnectFor(300);
		reconnect();
		const watermarkAfterReconnect = Date.now();

		disconnectFor(300);
		reconnect();

		const lastWatermark = (getMaxGapSince as jest.Mock).mock.calls.at(-1)?.[0];
		expect(lastWatermark).toBeGreaterThanOrEqual(watermarkAfterReconnect);
	});

	describe('experiment exposure', () => {
		beforeEach(() => {
			mockExpEnabled(SLEEP_EXPERIMENT);
		});

		it('is not fired on an initial connection', () => {
			reportSleepDuration(SUSPENSION);
			reconnect(false);

			expect(wasExperimentExposed(SLEEP_EXPERIMENT)).toBe(false);
		});

		it('is not fired when there was no disconnect', () => {
			reportSleepDuration(SUSPENSION);
			reconnect();

			expect(wasExperimentExposed(SLEEP_EXPERIMENT)).toBe(false);
			expect(catchup).not.toHaveBeenCalled();
		});

		it('is not fired when the disconnect alone already exceeds the out of sync period', () => {
			reportSleepDuration(SUSPENSION);
			disconnectFor(OUT_OF_SYNC_PERIOD);
			reconnect();

			expect(wasExperimentExposed(SLEEP_EXPERIMENT)).toBe(false);
			expect(catchup).toHaveBeenCalled();
		});

		it('is not fired when no suspension was detected', () => {
			reportSleepDuration(OUT_OF_SYNC_PERIOD - 1);
			disconnectFor(300);
			reconnect();

			expect(wasExperimentExposed(SLEEP_EXPERIMENT)).toBe(false);
		});

		it('is fired when the suspension decides the outcome', () => {
			reportSleepDuration(SUSPENSION);
			disconnectFor(300);
			reconnect();

			expect(wasExperimentExposed(SLEEP_EXPERIMENT)).toBe(true);
		});
	});
});
