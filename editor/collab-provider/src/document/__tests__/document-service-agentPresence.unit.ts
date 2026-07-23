import type { StepJson } from '@atlaskit/editor-common/collab';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

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

	beforeEach(() => {
		jest.useFakeTimers();
		const mocks = createMockService();
		service = mocks.service;
		participantsServiceMock = mocks.participantsServiceMock;
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	return {
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
			).toHaveBeenCalledWith('agent:712020:abc');
		});

		it('falls back to the agent type as the id when agentId is absent', () => {
			ctx.processSteps([buildStep({ agentType: 'twg' })]);

			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).toHaveBeenCalledWith('agent:twg');
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
			).toHaveBeenCalledWith('agent:712020:abc');
			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).toHaveBeenCalledWith('agent:twg');
		});

		it('does nothing for steps without agent attribution', () => {
			ctx.processSteps([buildStep()]);

			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).not.toHaveBeenCalled();
		});
	});

// OFF-path guard on a shared collab-provider hot path — remove when the experiment is cleaned up.
eeTest
	.describe('platform_editor_agent_be_streaming', 'document-service: agent edit presence detection')
	.variant(false, () => {
		const ctx = withService();

		it('does nothing (shared collab-provider safety)', () => {
			ctx.processSteps([buildStep({ agentType: 'mcp', agentId: '712020:abc' })]);

			expect(
				ctx.getParticipantsServiceMock().upsertAIProviderParticipantLocally,
			).not.toHaveBeenCalled();
		});
	});
