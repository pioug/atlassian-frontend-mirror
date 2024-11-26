import React from 'react';
import { mountWithIntlContext } from '@atlaskit/media-test-helpers';
import { PredefinedAvatarView } from '../../predefined-avatar-view';

describe('PredefinedAvatarView', () => {
	describe('header text', () => {
		it('should provide the correct description', () => {
			const component = mountWithIntlContext(
				<PredefinedAvatarView avatars={[]} onAvatarSelected={() => {}} />,
			);
			expect(component.find('h2').text()).toEqual('Default avatars');
		});

		it('should use different caption text when predefinedAvatarsText is passed', () => {
			const component = mountWithIntlContext(
				<PredefinedAvatarView
					avatars={[]}
					onAvatarSelected={() => {}}
					predefinedAvatarsText="default icons"
				/>,
			);
			expect(component.find('h2').text()).toEqual('default icons');
		});
	});
});
