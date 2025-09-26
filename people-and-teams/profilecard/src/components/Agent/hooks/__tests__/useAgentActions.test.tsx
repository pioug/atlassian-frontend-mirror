import { renderHook } from '@testing-library/react-hooks';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { useRovoPostMessageToPubsub } from '@atlaskit/rovo-triggers';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { fireEvent } from '../../../../util/analytics';
import { encodeParamsToUrl } from '../../../../util/url';
import { useAgentUrlActions } from '../useAgentActions';

const mockFireEvent = jest.fn();
jest.mock('@atlaskit/rovo-triggers');
jest.mock('@atlaskit/analytics-next');
jest.mock('@atlaskit/teams-app-config/navigation');
jest.mock('../../../../util/analytics');
jest.mock('../../../../util/url');

jest.mock('@atlaskit/teams-app-internal-analytics', () => ({
	...jest.requireActual('@atlaskit/teams-app-internal-analytics'),
	useAnalyticsEvents: jest.fn().mockImplementation(() => ({
		fireEvent: mockFireEvent,
	})),
}));

const useRovoPostMessageToPubsubMock = useRovoPostMessageToPubsub as jest.MockedFunction<
	typeof useRovoPostMessageToPubsub
>;

const useAnalyticsEventsMock = useAnalyticsEvents as jest.MockedFunction<typeof useAnalyticsEvents>;

const navigateToTeamsAppMock = navigateToTeamsApp as jest.MockedFunction<typeof navigateToTeamsApp>;

const fireEventMock = fireEvent as jest.MockedFunction<typeof fireEvent>;

const encodeParamsToUrlMock = encodeParamsToUrl as jest.MockedFunction<typeof encodeParamsToUrl>;

describe('useAgentUrlActions', () => {
	const cloudId = 'cloudId';
	const source = 'source';

	const publishWithPostMessageMock = jest.fn();
	const createAnalyticsEventMock = jest.fn();
	const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
	const writeTextSpy = jest.fn();
	const onNavigateMock = jest.fn();

	const editAgentAnalyticsEvent = {
		action: 'clicked',
		actionSubject: 'button',
		actionSubjectId: 'editAgentButton',
		attributes: { agentId: 'test-agent-id', source },
	};

	const duplicateAgentAnalyticsEvent = {
		action: 'clicked',
		actionSubject: 'button',
		actionSubjectId: 'duplicateAgentButton',
		attributes: { agentId: 'test-agent-id', source },
	};

	const copyAgentAnalyticsEvent = {
		action: 'clicked',
		actionSubject: 'button',
		actionSubjectId: 'copyAgentLinkButton',
		attributes: { agentId: 'test-agent-id', source },
	};
	const viewAgentFullProfileAnalyticsEvent = {
		action: 'clicked',
		actionSubject: 'button',
		actionSubjectId: 'viewAgentFullProfileButton',
		attributes: { agentId: 'test-agent-id', source },
	};

	beforeEach(() => {
		jest.clearAllMocks();
		useRovoPostMessageToPubsubMock.mockReturnValue({
			publishWithPostMessage: publishWithPostMessageMock,
			isWaitingForAck: false,
		});
		useAnalyticsEventsMock.mockReturnValue({
			createAnalyticsEvent: createAnalyticsEventMock,
		});
		navigateToTeamsAppMock.mockReturnValue({
			onNavigate: onNavigateMock,
			href: 'https://example.com/agent/test-agent-id',
			target: '_blank',
		});
		encodeParamsToUrlMock.mockImplementation((url, params) => `${url}?encoded=params`);

		// Mock clipboard API
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: writeTextSpy,
			},
			writable: true,
		});
	});

	describe('onConversationStarter', () => {
		it('should call publishWithPostMessage', () => {
			const { result } = renderHook(() => useAgentUrlActions({ cloudId, source }));
			const { onConversationStarter } = result.current;

			const agentId = 'agentId';
			const prompt = 'This is an example prompt';
			onConversationStarter({ agentId, prompt });

			expect(publishWithPostMessageMock).toHaveBeenCalledWith({
				targetWindow: window,
				payload: {
					type: 'chat-new',
					source: 'AgentProfileCard',
					data: {
						prompt,
						dialogues: [],
						name: 'This is an example prompt',
						agentId,
					},
				},
				onAcknowledgeTimeout: expect.any(Function),
			});
		});
	});

	describe('onOpenChat', () => {
		it('should call publishWithPostMessage', () => {
			const { result } = renderHook(() => useAgentUrlActions({ cloudId, source }));
			const { onOpenChat } = result.current;

			const agentId = 'agentId';
			const agentName = 'agentName';
			onOpenChat(agentId, agentName);

			expect(publishWithPostMessageMock).toHaveBeenCalledWith({
				targetWindow: window,
				payload: {
					type: 'chat-new',
					source: 'AgentProfileCard',
					data: {
						name: `Chat with ${agentName}`,
						dialogues: [],
						agentId,
					},
				},
				onAcknowledgeTimeout: expect.any(Function),
			});
		});
	});

	ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
		describe('onEditAgent', () => {
			it('should open the correct URL and fire analytics event', () => {
				const { result } = renderHook(() => useAgentUrlActions({ cloudId, source }));
				const { onEditAgent } = result.current;

				const agentId = 'test-agent-id';
				onEditAgent(agentId);

				expect(encodeParamsToUrlMock).toHaveBeenCalledWith(
					'http://home.atlassian.com/chat/agents/test-agent-id/edit',
					{
						cloudId: 'cloudId',
						rovoChatCloudId: 'cloudId',
					},
				);
				expect(windowOpenSpy).toHaveBeenCalledWith(
					'http://home.atlassian.com/chat/agents/test-agent-id/edit?encoded=params',
					'_blank',
					'noopener, noreferrer',
				);
				expect(fireEventMock).toHaveBeenCalledWith(
					createAnalyticsEventMock,
					editAgentAnalyticsEvent,
				);
			});
		});

		describe('onDuplicateAgent', () => {
			it('should open the correct URL and fire analytics event', () => {
				const { result } = renderHook(() => useAgentUrlActions({ cloudId, source }));
				const { onDuplicateAgent } = result.current;

				const agentId = 'test-agent-id';
				onDuplicateAgent(agentId);

				expect(encodeParamsToUrlMock).toHaveBeenCalledWith(
					'http://home.atlassian.com/chat/agents/new',
					{
						cloudId: 'cloudId',
						rovoChatCloudId: 'cloudId',
						rovoChatAgentId: 'test-agent-id',
						rovoChatPathway: 'agents-create',
					},
				);
				expect(windowOpenSpy).toHaveBeenCalledWith(
					'http://home.atlassian.com/chat/agents/new?encoded=params',
					'_blank',
					'noopener, noreferrer',
				);
				expect(fireEventMock).toHaveBeenCalledWith(
					createAnalyticsEventMock,
					duplicateAgentAnalyticsEvent,
				);
			});
		});

		describe('onCopyAgent', () => {
			it('should copy agent URL to clipboard and fire analytics event', () => {
				const { result } = renderHook(() => useAgentUrlActions({ cloudId, source }));
				const { onCopyAgent } = result.current;

				const agentId = 'test-agent-id';
				onCopyAgent(agentId);

				expect(writeTextSpy).toHaveBeenCalledWith(
					`${window.location.origin}/people/agent/test-agent-id`,
				);
				expect(fireEventMock).toHaveBeenCalledWith(
					createAnalyticsEventMock,
					copyAgentAnalyticsEvent,
				);
			});
		});

		describe('onViewFullProfile', () => {
			it('should navigate to agent profile and fire analytics event', () => {
				const { result } = renderHook(() => useAgentUrlActions({ cloudId, source }));
				const { onViewFullProfile } = result.current;

				const agentId = 'test-agent-id';
				onViewFullProfile(agentId);

				expect(navigateToTeamsAppMock).toHaveBeenCalledWith({
					type: 'AGENT',
					payload: {
						agentId,
					},
					cloudId: 'cloudId',
					shouldOpenInSameTab: false,
				});
				expect(fireEventMock).toHaveBeenCalledWith(
					createAnalyticsEventMock,
					viewAgentFullProfileAnalyticsEvent,
				);
			});
		});
	});

	ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
		describe('onEditAgent', () => {
			it('should open the correct URL and fire analytics event', () => {
				const { result } = renderHook(() => useAgentUrlActions({ cloudId, source }));
				const { onEditAgent } = result.current;

				const agentId = 'test-agent-id';
				onEditAgent(agentId);

				expect(encodeParamsToUrlMock).toHaveBeenCalledWith(
					'http://home.atlassian.com/chat/agents/test-agent-id/edit',
					{
						cloudId: 'cloudId',
						rovoChatCloudId: 'cloudId',
					},
				);
				expect(windowOpenSpy).toHaveBeenCalledWith(
					'http://home.atlassian.com/chat/agents/test-agent-id/edit?encoded=params',
					'_blank',
					'noopener, noreferrer',
				);
				expect(mockFireEvent).toHaveBeenCalledWith(
					`ui.${editAgentAnalyticsEvent.actionSubject}.${editAgentAnalyticsEvent.action}.${editAgentAnalyticsEvent.actionSubjectId}`,
					editAgentAnalyticsEvent.attributes,
				);
			});
		});

		describe('onDuplicateAgent', () => {
			it('should open the correct URL and fire analytics event', () => {
				const { result } = renderHook(() => useAgentUrlActions({ cloudId, source }));
				const { onDuplicateAgent } = result.current;

				const agentId = 'test-agent-id';
				onDuplicateAgent(agentId);

				expect(encodeParamsToUrlMock).toHaveBeenCalledWith(
					'http://home.atlassian.com/chat/agents/new',
					{
						cloudId: 'cloudId',
						rovoChatCloudId: 'cloudId',
						rovoChatAgentId: 'test-agent-id',
						rovoChatPathway: 'agents-create',
					},
				);
				expect(windowOpenSpy).toHaveBeenCalledWith(
					'http://home.atlassian.com/chat/agents/new?encoded=params',
					'_blank',
					'noopener, noreferrer',
				);
				expect(mockFireEvent).toHaveBeenCalledWith(
					`ui.${duplicateAgentAnalyticsEvent.actionSubject}.${duplicateAgentAnalyticsEvent.action}.${duplicateAgentAnalyticsEvent.actionSubjectId}`,
					duplicateAgentAnalyticsEvent.attributes,
				);
			});
		});

		describe('onCopyAgent', () => {
			it('should copy agent URL to clipboard and fire analytics event', () => {
				const { result } = renderHook(() => useAgentUrlActions({ cloudId, source }));
				const { onCopyAgent } = result.current;

				const agentId = 'test-agent-id';
				onCopyAgent(agentId);

				expect(writeTextSpy).toHaveBeenCalledWith(
					`${window.location.origin}/people/agent/test-agent-id`,
				);
				expect(mockFireEvent).toHaveBeenCalledWith(
					`ui.${copyAgentAnalyticsEvent.actionSubject}.${copyAgentAnalyticsEvent.action}.${copyAgentAnalyticsEvent.actionSubjectId}`,
					copyAgentAnalyticsEvent.attributes,
				);
			});
		});

		describe('onViewFullProfile', () => {
			it('should navigate to agent profile and fire analytics event', () => {
				const { result } = renderHook(() => useAgentUrlActions({ cloudId, source }));
				const { onViewFullProfile } = result.current;

				const agentId = 'test-agent-id';
				onViewFullProfile(agentId);

				expect(navigateToTeamsAppMock).toHaveBeenCalledWith({
					type: 'AGENT',
					payload: {
						agentId,
					},
					cloudId: 'cloudId',
					shouldOpenInSameTab: false,
				});
				expect(mockFireEvent).toHaveBeenCalledWith(
					`ui.${viewAgentFullProfileAnalyticsEvent.actionSubject}.${viewAgentFullProfileAnalyticsEvent.action}.${viewAgentFullProfileAnalyticsEvent.actionSubjectId}`,
					viewAgentFullProfileAnalyticsEvent.attributes,
				);
			});
		});
	});
});
