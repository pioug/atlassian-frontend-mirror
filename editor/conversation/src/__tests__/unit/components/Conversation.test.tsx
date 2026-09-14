import React from 'react';

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

import { mockConversation, MOCK_USERS } from '../../../../example-helpers/MockData';
import Conversation from '../../../components/Conversation';
import createStore from '../../../internal/store';

const objectId = 'ari:cloud:platform::conversation/demo';
const { comments } = mockConversation;
const [user] = MOCK_USERS;

describe('Conversation', () => {
	const createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn().mockReturnValue({
		update: () => {},
		fire() {},
		attributes: { foo: 'bar' },
	});
	const defaultProps = {
		createAnalyticsEvent,
		sendAnalyticsEvent: () => {},
	};
	const renderConversation = (props: Partial<React.ComponentProps<typeof Conversation>> = {}) =>
		render(
			<Provider store={createStore({ conversations: [] })}>
				<Conversation
					{...defaultProps}
					objectId={objectId}
					renderEditor={() => <div data-testid="conversation-editor" />}
					{...props}
				/>
			</Provider>,
		);

	describe('comments', () => {
		it('should render comments if any', () => {
			renderConversation({
				conversation: mockConversation,
				comments,
				user,
			});

			expect(screen.getByText('Hello World')).toBeVisible();
			expect(screen.getByText('Reply!')).toBeVisible();
		});
	});

	describe('editor', () => {
		it('should render if meta is not set', async () => {
			renderConversation({ user });

			expect(screen.getByTestId('chrome-collapsed')).toBeInTheDocument();
			await expect(document.body).toBeAccessible();
		});

		it('should not render if meta is set', () => {
			renderConversation({ meta: { test: 'testing' }, user });

			expect(screen.queryByTestId('chrome-collapsed')).not.toBeInTheDocument();
		});

		it('should render if isExpanded is true', () => {
			renderConversation({ meta: { test: 'testing' }, isExpanded: true, user });

			expect(screen.getByTestId('conversation-editor')).toBeInTheDocument();
		});

		describe('no user', () => {
			it('should not render if meta is not set', () => {
				renderConversation();

				expect(screen.queryByTestId('chrome-collapsed')).not.toBeInTheDocument();
			});

			it('should not render if meta is set', () => {
				renderConversation({ meta: { test: 'testing' } });

				expect(screen.queryByTestId('chrome-collapsed')).not.toBeInTheDocument();
			});

			it('should not render if isExpanded is true', () => {
				renderConversation({ meta: { test: 'testing' }, isExpanded: true });

				expect(screen.queryByTestId('conversation-editor')).not.toBeInTheDocument();
			});
		});
	});
});
