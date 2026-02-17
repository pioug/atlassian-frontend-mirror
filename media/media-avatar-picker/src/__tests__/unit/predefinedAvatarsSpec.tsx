import React from 'react';
import { renderWithIntl } from '@atlaskit/media-test-helpers';
import { screen } from '@testing-library/react';
import { PredefinedAvatarView } from '../../predefined-avatar-view';

describe('PredefinedAvatarView', () => {
	describe('header text', () => {
		it('should provide the correct description', () => {
			renderWithIntl(
				<PredefinedAvatarView avatars={[]} onAvatarSelected={() => {}} />,
			);
			expect(screen.getByRole('heading', { level: 2 }).textContent).toEqual(
				'Default avatars',
			);
		});

		it('should use different caption text when predefinedAvatarsText is passed', () => {
			renderWithIntl(
				<PredefinedAvatarView
					avatars={[]}
					onAvatarSelected={() => {}}
					predefinedAvatarsText="default icons"
				/>,
			);
			expect(screen.getByRole('heading', { level: 2 }).textContent).toEqual(
				'default icons',
			);
		});
	});
});
