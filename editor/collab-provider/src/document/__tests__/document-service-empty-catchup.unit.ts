import { createMockService } from './document-service.mock';

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { collab } from '@atlaskit/prosemirror-collab';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { CatchupEventReason, EVENT_ACTION, EVENT_STATUS } from '../../helpers/const';

describe('reconnecting with no remote catch-up steps', () => {
	afterEach(() => jest.clearAllMocks());

	it('completes reconnection and applies metadata when the response omits steps', async () => {
		passGate('platform_editor_collab_empty_catchup_steps');
		const {
			service,
			fetchCatchupv2Mock,
			analyticsHelperMock,
			providerEmitCallbackMock,
			stepQueue,
		} = createMockService();
		const state = EditorState.create({ schema: defaultSchema, plugins: [collab({ version: 1 })] });
		service.setup({ getState: () => state, clientId: 'client' });
		fetchCatchupv2Mock.mockResolvedValue({ metadata: { title: 'Updated while offline' } });

		// @ts-expect-error - exercise the real reconnection catch-up entry point
		await service.catchupv2(CatchupEventReason.RECONNECTED, {
			unconfirmedStepsLength: 0,
			disconnectionPeriodSeconds: 60,
		});

		expect(fetchCatchupv2Mock).toHaveBeenCalledTimes(1);
		expect(analyticsHelperMock.sendErrorEvent).not.toHaveBeenCalled();
		expect(providerEmitCallbackMock).toHaveBeenCalledWith('metadata:changed', {
			title: 'Updated while offline',
		});
		expect(providerEmitCallbackMock).not.toHaveBeenCalledWith('data:conflict', expect.anything());
		expect(analyticsHelperMock.sendActionEvent).toHaveBeenCalledWith(
			EVENT_ACTION.RECONNECTION,
			EVENT_STATUS.INFO,
			{ unconfirmedStepsLength: 0, disconnectionPeriodSeconds: 60, remoteStepsLength: 0 },
		);
		expect(analyticsHelperMock.sendActionEvent).toHaveBeenCalledWith(
			EVENT_ACTION.CATCHUP,
			EVENT_STATUS.SUCCESS,
			{ latency: expect.any(Number), version: 1 },
		);
		expect(service.getCurrentPmVersion()).toBe(1);
		expect(stepQueue.isPaused()).toBe(false);
	});

	it('retains the legacy callback behavior when the rollout gate is disabled', async () => {
		failGate('platform_editor_collab_empty_catchup_steps');
		const {
			service,
			fetchCatchupv2Mock,
			analyticsHelperMock,
			providerEmitCallbackMock,
			stepQueue,
		} = createMockService();
		const state = EditorState.create({ schema: defaultSchema, plugins: [collab({ version: 1 })] });
		service.setup({ getState: () => state, clientId: 'client' });
		fetchCatchupv2Mock.mockResolvedValue({ metadata: { title: 'Updated while offline' } });

		// @ts-expect-error - exercise the real reconnection catch-up entry point
		await service.catchupv2(CatchupEventReason.RECONNECTED);

		expect(analyticsHelperMock.sendErrorEvent).toHaveBeenCalledWith(
			expect.any(TypeError),
			'Failed to apply catchupv2 result in the editor',
		);
		expect(providerEmitCallbackMock).not.toHaveBeenCalledWith(
			'metadata:changed',
			expect.anything(),
		);
		expect(stepQueue.isPaused()).toBe(false);
	});
});
