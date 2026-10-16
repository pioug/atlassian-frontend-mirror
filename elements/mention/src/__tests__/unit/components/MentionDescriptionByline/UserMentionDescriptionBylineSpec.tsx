import React from 'react';

import { screen, render } from '@testing-library/react';

import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import UserMentionDescriptionByline from '../../../../components/MentionDescriptionByline';
import { userMention } from './_commonData';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('User mention description', () => {
	it.each(['Test User', '', undefined])(
		'shows email when there is no existing byline (nickname: %s)',
		(nickname) => {
			mockExpEnabled('platform_editor_mentions_email_search');
			render(
				<UserMentionDescriptionByline
					mention={{ ...userMention, name: 'Test User', nickname, email: 'test@example.com' }}
				/>,
			);
			expect(screen.getByText('test@example.com')).toBeInTheDocument();
			expect(screen.getByText('test@example.com')).toHaveStyle({
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
			});
			expect(screen.queryByText('@Test User')).not.toBeInTheDocument();
		},
	);

	it('preserves the existing nickname byline when email search is enabled', () => {
		mockExpEnabled('platform_editor_mentions_email_search');
		render(
			<UserMentionDescriptionByline
				mention={{ ...userMention, name: 'Test User Full Name', email: 'test@example.com' }}
			/>,
		);
		expect(screen.getByText('@Test User')).toBeInTheDocument();
		expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
	});

	it('does not add an email byline when email search is disabled', () => {
		mockExpDisabled('platform_editor_mentions_email_search');
		render(
			<UserMentionDescriptionByline
				mention={{ ...userMention, name: 'Test User', email: 'test@example.com' }}
			/>,
		);
		expect(screen.queryByText('@Test User')).not.toBeInTheDocument();
		expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
	});

	it('should render User Mention description component', () => {
		render(<UserMentionDescriptionByline mention={userMention} />);
		expect(screen.getByText('@Test User')).toBeInTheDocument();
	});

	it('should not show anything if name and nickname match', () => {
		const mention = {
			id: '12345',
			avatarUrl: 'www.example.com/image.png',
			name: 'Nickname',
			nickname: 'Nickname',
		};
		render(<UserMentionDescriptionByline mention={mention} />);

		const nickname = screen.queryByText('Nickname');
		expect(nickname).toBeNull();
	});

	it('should show if name and nickname are different', () => {
		const mention = {
			id: '12345',
			avatarUrl: 'www.example.com/image.png',
			name: 'Different full name',
			nickname: 'Nickname',
		};
		render(<UserMentionDescriptionByline mention={mention} />);
		// The regex allows us to ignore the newlines, but preserve case
		expect(screen.getByText(/Nickname/)).toBeInTheDocument();
	});

	it('should show if name and nickname have non-matching case', () => {
		const mention = {
			id: '12345',
			avatarUrl: 'www.example.com/image.png',
			name: 'Nickname',
			nickname: 'nickname',
		};
		render(<UserMentionDescriptionByline mention={mention} />);
		// The regex allows us to ignore the newlines, but preserve case
		expect(screen.getByText(/nickname/)).toBeInTheDocument();
	});

	it('should show if name and nickname vary in whitespace', () => {
		const mention = {
			id: '12345',
			avatarUrl: 'www.example.com/image.png',
			name: 'Nick name',
			nickname: 'Nickname',
		};
		render(<UserMentionDescriptionByline mention={mention} />);
		// The regex allows us to ignore the newlines, but preserve case
		expect(screen.getByText(/Nickname/)).toBeInTheDocument();
	});
});
