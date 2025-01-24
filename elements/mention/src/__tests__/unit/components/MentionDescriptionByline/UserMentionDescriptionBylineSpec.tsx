import React from 'react';
import UserMentionDescriptionByline from '../../../../components/MentionDescriptionByline';
import { userMention } from './_commonData';
import { screen, render } from '@testing-library/react';

describe('User mention description', () => {
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
