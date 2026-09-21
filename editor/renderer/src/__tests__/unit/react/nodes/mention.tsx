import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { IntlProvider } from 'react-intl';

import type { MentionNodeDataProvider } from '@atlaskit/editor-common/mention';
import type { EventHandlers, MentionEventHandler } from '@atlaskit/editor-common/ui';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { resetAllExperiments } from '@atlassian/experiment-test-utils/reset-all-experiments';

import MentionNode from '../../../../react/nodes/mention';

const mentionId = 'abcd-abcd-abcd';

describe('Renderer - React/Nodes/Mention', () => {
	afterEach(() => {
		resetAllExperiments();
	});

	it('should render UI mention component', () => {
		renderWithIntl(<MentionNode id={mentionId} text="@Oscar Wallhult" />);

		expect(screen.getByTestId(`mention-${mentionId}`)).toHaveTextContent('@Oscar Wallhult');
	});

	it('should render with access level if prop exists', () => {
		renderWithIntl(<MentionNode id={mentionId} text="@Oscar Wallhult" accessLevel="APPLICATION" />);

		expect(screen.getByTestId(`mention-${mentionId}`).closest('[data-mention-id]')).toHaveAttribute(
			'data-access-level',
			'APPLICATION',
		);
	});

	it('should pass event handlers into resourced mention', async () => {
		const onClick: MentionEventHandler = jest.fn();
		const eventHandlers: EventHandlers = {
			mention: {
				onClick,
				onMouseEnter: () => {},
				onMouseLeave: () => {},
			},
		};

		renderWithIntl(
			<MentionNode id={mentionId} text="@Oscar Wallhult" eventHandlers={eventHandlers} />,
		);

		await userEvent.click(screen.getByTestId(`mention-${mentionId}`));

		expect(onClick).toHaveBeenCalledWith(
			mentionId,
			'@Oscar Wallhult',
			expect.anything(),
			expect.anything(),
		);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(<MentionNode id={mentionId} text="@Oscar Wallhult" />);

		await expect(container).toBeAccessible();
	});

	it('should pass the client mention data provider into the mention UI', async () => {
		mockExpEnabled('platform_editor_mention_node_avatar');
		const mentionNodeDataProvider: MentionNodeDataProvider = {
			getMentionData: jest.fn((_mention, callback) =>
				callback({ data: { avatarUrl: 'https://example.com/avatar.png' } }),
			),
			getMentionDataFromCache: jest.fn(),
		};

		renderWithIntl(
			<MentionNode
				id="abcd-abcd-abcd"
				text="@Oscar Wallhult"
				mentionNodeDataProvider={mentionNodeDataProvider}
			/>,
		);

		expect(await screen.findByTestId('mention-avatar')).toBeInTheDocument();
		expect(mentionNodeDataProvider.getMentionData).toHaveBeenCalledWith(
			{ id: 'abcd-abcd-abcd', userType: undefined },
			expect.any(Function),
		);
	});

	it('should pass the client mention data provider when the GraphQL provider experiment is enabled', async () => {
		mockExpDisabled('platform_editor_mention_node_avatar');
		mockExpEnabled('platform_editor_mention_node_graphql_provider');
		const mentionNodeDataProvider: MentionNodeDataProvider = {
			getMentionData: jest.fn((_mention, callback) =>
				callback({ data: { avatarUrl: 'https://example.com/avatar.png' } }),
			),
			getMentionDataFromCache: jest.fn(),
		};

		renderWithIntl(
			<MentionNode
				id="abcd-abcd-abcd"
				text="@Oscar Wallhult"
				mentionNodeDataProvider={mentionNodeDataProvider}
			/>,
		);

		expect(await screen.findByTestId('mention-avatar')).toBeInTheDocument();
		expect(mentionNodeDataProvider.getMentionData).toHaveBeenCalledWith(
			{ id: 'abcd-abcd-abcd', userType: undefined },
			expect.any(Function),
		);
	});

	it('should not resolve mention avatar data when the experiment is disabled', () => {
		mockExpDisabled('platform_editor_mention_node_avatar');
		mockExpDisabled('platform_editor_mention_node_graphql_provider');
		const mentionNodeDataProvider: MentionNodeDataProvider = {
			getMentionData: jest.fn(),
			getMentionDataFromCache: jest.fn(),
		};

		renderWithIntl(
			<MentionNode
				id={mentionId}
				text="@Oscar Wallhult"
				mentionNodeDataProvider={mentionNodeDataProvider}
			/>,
		);

		expect(screen.getByTestId(`mention-${mentionId}`)).toHaveTextContent('@Oscar Wallhult');
		expect(mentionNodeDataProvider.getMentionDataFromCache).not.toHaveBeenCalled();
		expect(mentionNodeDataProvider.getMentionData).not.toHaveBeenCalled();
	});

	it('should preserve the provider-less render path when the experiment is disabled', () => {
		mockExpDisabled('platform_editor_mention_node_avatar');
		mockExpDisabled('platform_editor_mention_node_graphql_provider');
		const mentionNodeDataProvider: MentionNodeDataProvider = {
			getMentionData: jest.fn(),
			getMentionDataFromCache: jest.fn(),
		};
		const renderMention = (provider?: MentionNodeDataProvider) =>
			renderToString(
				<IntlProvider locale="en">
					<MentionNode id={mentionId} text="@Oscar Wallhult" mentionNodeDataProvider={provider} />
				</IntlProvider>,
			);

		expect(renderMention(mentionNodeDataProvider)).toBe(renderMention());
		expect(mentionNodeDataProvider.getMentionDataFromCache).not.toHaveBeenCalled();
		expect(mentionNodeDataProvider.getMentionData).not.toHaveBeenCalled();
	});

	it.each(['HipChat', 'all', 'here'])(
		'should preserve the at-sign and skip avatar resolution for generic mention %s',
		(id) => {
			mockExpEnabled('platform_editor_mention_node_avatar');
			const mentionNodeDataProvider: MentionNodeDataProvider = {
				getMentionData: jest.fn(),
				getMentionDataFromCache: jest.fn(),
			};

			renderWithIntl(
				<MentionNode id={id} text={`@${id}`} mentionNodeDataProvider={mentionNodeDataProvider} />,
			);

			expect(screen.getByTestId(`mention-${id}`)).toHaveTextContent(`@${id}`);
			expect(screen.queryByTestId('mention-avatar-slot')).not.toBeInTheDocument();
			expect(mentionNodeDataProvider.getMentionDataFromCache).not.toHaveBeenCalled();
			expect(mentionNodeDataProvider.getMentionData).not.toHaveBeenCalled();
		},
	);

	it('should synchronously render deterministic avatar data on the server', () => {
		mockExpEnabled('platform_editor_mention_node_avatar');
		const mentionNodeDataProvider: MentionNodeDataProvider = {
			getMentionData: jest.fn(),
			getMentionDataFromCache: jest.fn(() => ({
				appType: 'agent',
				avatarUrl: '/wiki/aa-avatar/agent-1',
			})),
		};

		const html = renderToString(
			<IntlProvider locale="en">
				<MentionNode
					id="agent-1"
					text="@Agent"
					userType="APP"
					mentionNodeDataProvider={mentionNodeDataProvider}
				/>
			</IntlProvider>,
		);

		expect(mentionNodeDataProvider.getMentionDataFromCache).toHaveBeenCalledWith({
			id: 'agent-1',
			userType: 'APP',
		});
		expect(mentionNodeDataProvider.getMentionData).not.toHaveBeenCalled();
		expect(html).toContain('mention-avatar-slot');
		expect(html).toContain('/wiki/aa-avatar/agent-1');
		expect(html).toContain('Agent');
		expect(html).not.toContain('@Agent');
	});
});
