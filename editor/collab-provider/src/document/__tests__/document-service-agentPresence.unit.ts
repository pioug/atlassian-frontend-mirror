import type { StepJson } from '@atlaskit/editor-common/collab';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';
import { EVENT_ACTION, EVENT_STATUS } from '../../helpers/const';
import type { StepsPayload } from '../../types';
import type { DocumentService } from '../document-service';

import { createMockService } from './document-service.mock';

/**
 * Agent edit presence: the document-service detects agent-authored steps in a received batch
 * (behind a default-OFF experiment) and registers each distinct agent as a local participant.
 */
const buildStep = (extra: Partial<StepJson> = {}): StepJson =>
	({
		stepType: 'replace',
		clientId: '111',
		userId: '712020:human',
		from: 1,
		to: 1,
		...extra,
	}) as unknown as StepJson;

// Registers the shared service setup for a describe block and returns accessors scoped to it.
const withService = () => {
	let service: DocumentService;
	let participantsServiceMock: ReturnType<typeof createMockService>['participantsServiceMock'];
	let analyticsHelperMock: ReturnType<typeof createMockService>['analyticsHelperMock'];

	beforeEach(() => {
		jest.useFakeTimers();
		const mocks = createMockService();
		service = mocks.service;
		participantsServiceMock = mocks.participantsServiceMock;
		analyticsHelperMock = mocks.analyticsHelperMock;
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	return {
		getAnalyticsHelperMock: () => analyticsHelperMock,
		getParticipantsServiceMock: () => participantsServiceMock,
		processSteps: (steps: StepJson[]) =>
			// processSteps is private; call it directly to exercise the detection path.
			(service as unknown as { processSteps: (d: StepsPayload) => void }).processSteps({
				version: 2,
				steps,
			} as StepsPayload),
	};
};

eeTest
	.describe('platform_editor_agent_be_streaming', 'document-service: agent edit presence detection')
	.variant(true, () => {
		const ctx = withService();

		it('registers a participant for an agent-authored step', () => {
			ctx.processSteps([buildStep({ agentType: 'mcp', agentId: '712020:abc' })]);

			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).toHaveBeenCalledTimes(1);
			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).toHaveBeenCalledWith('agent:712020:abc', 'mcp');
		});

		it('preserves agent type when agentId is absent', () => {
			ctx.processSteps([buildStep({ agentType: 'convo-ai' })]);

			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).toHaveBeenCalledWith('agent:convo-ai', 'convo-ai');
		});

		it('falls back to the agent type as the id when agentId is absent', () => {
			ctx.processSteps([buildStep({ agentType: 'twg' })]);

			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).toHaveBeenCalledWith('agent:twg', 'twg');
		});

		it('adds each distinct agent once for a mixed batch', () => {
			ctx.processSteps([
				buildStep({ agentType: 'mcp', agentId: '712020:abc' }),
				buildStep({ agentType: 'mcp', agentId: '712020:abc' }), // duplicate agent
				buildStep({ agentType: 'twg' }),
				buildStep(), // human step, no agentType
			]);

			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).toHaveBeenCalledTimes(2);
			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).toHaveBeenCalledWith('agent:712020:abc', 'mcp');
			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).toHaveBeenCalledWith('agent:twg', 'twg');
		});

		it('does nothing for steps without agent attribution', () => {
			ctx.processSteps([buildStep()]);

			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).not.toHaveBeenCalled();
		});

		it('fires the agentEditReceived event once per batch with non-PII counts, types and ids', () => {
			ctx.processSteps([
				buildStep({ agentType: 'mcp', agentId: '712020:abc' }),
				buildStep({ agentType: 'mcp', agentId: '712020:abc' }), // duplicate agent
				buildStep({ agentType: 'twg' }), // agent with no id
				buildStep(), // human step
			]);

			// The document-service also fires PROCESS_STEPS, so assert on the agentEditReceived calls only.
			const receivedCalls = (
				ctx.getAnalyticsHelperMock().sendActionEvent as jest.Mock
			).mock.calls.filter((call: unknown[]) => call[0] === EVENT_ACTION.AGENT_EDIT_RECEIVED);
			expect(receivedCalls).toHaveLength(1);
			expect(ctx.getAnalyticsHelperMock().sendActionEvent).toHaveBeenCalledWith(
				EVENT_ACTION.AGENT_EDIT_RECEIVED,
				EVENT_STATUS.SUCCESS,
				{
					agentIds: ['712020:abc'],
					agentCount: 2,
					agentTypes: ['mcp', 'twg'],
					agentStepCount: 3,
					totalStepCount: 4,
				},
			);
		});

		it('does not fire the agentEditReceived event when there are no agent steps', () => {
			ctx.processSteps([buildStep()]);

			expect(ctx.getAnalyticsHelperMock().sendActionEvent).not.toHaveBeenCalledWith(
				EVENT_ACTION.AGENT_EDIT_RECEIVED,
				expect.anything(),
				expect.anything(),
			);
		});
	});

// OFF-path guard on a shared collab-provider hot path — remove when the experiments are cleaned up.
// The frontend streaming UX milestone enables agent presence independently of backend streaming: it
// attributes its own local steps, which are echoed back to this client, so it needs the facepile
// without the backend streaming visuals.
eeTest
	.describe('platform_editor_agent_be_streaming', 'document-service: agent edit presence detection')
	.variant(false, () => {
		const ctx = withService();

		it('does nothing (shared collab-provider safety)', () => {
			mockExpDisabled('platform_editor_ai_streaming_ux_experience_m1');

			ctx.processSteps([buildStep({ agentType: 'mcp', agentId: '712020:abc' })]);

			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).not.toHaveBeenCalled();
			expect(ctx.getAnalyticsHelperMock().sendActionEvent).not.toHaveBeenCalledWith(
				EVENT_ACTION.AGENT_EDIT_RECEIVED,
				expect.anything(),
				expect.anything(),
			);
		});

		it('registers a participant when the streaming UX milestone is enabled', () => {
			mockExpEnabled('platform_editor_ai_streaming_ux_experience_m1');

			ctx.processSteps([buildStep({ agentType: 'convo-ai' })]);

			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).toHaveBeenCalledWith('agent:convo-ai', 'convo-ai');
			expect(ctx.getAnalyticsHelperMock().sendActionEvent).toHaveBeenCalledWith(
				EVENT_ACTION.AGENT_EDIT_RECEIVED,
				EVENT_STATUS.SUCCESS,
				expect.objectContaining({ agentTypes: ['convo-ai'] }),
			);
		});

		it('does not log an exposure for the streaming UX milestone on this hot path', () => {
			mockExpEnabled('platform_editor_ai_streaming_ux_experience_m1');

			ctx.processSteps([buildStep({ agentType: 'convo-ai' })]);

			expect(wasExperimentExposed('platform_editor_ai_streaming_ux_experience_m1')).toBe(false);
		});
	});
