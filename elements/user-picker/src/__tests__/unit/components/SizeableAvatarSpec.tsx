import React from 'react';

import { render, screen } from '@testing-library/react';

import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { type Props, SizeableAvatar } from '../../../components/SizeableAvatar';

jest.mock('@atlaskit/avatar/avatar', () => ({
	...jest.requireActual('@atlaskit/avatar/avatar'),
	__esModule: true,
	default: (props: {
		appearance?: string;
		hasInnerBorder?: boolean;
		presence?: string;
		size: string;
	}) => (
		<div
			data-testid="avatar"
			data-appearance={props.appearance}
			data-inner-border={String(Boolean(props.hasInnerBorder))}
			data-presence={props.presence}
			data-size={props.size}
		/>
	),
}));

describe('SizeableAvatar', () => {
	const renderSizeableAvatar = (props: Partial<Props> = {}) =>
		render(<SizeableAvatar appearance="normal" {...props} />);

	const expectAvatarSize = (appearance: Props['appearance'], size: string) => {
		renderSizeableAvatar({ appearance });
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', size);
	};

	it('renders an Avatar', async () => {
		renderSizeableAvatar();

		expect(screen.getByTestId('avatar')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('renders a small Avatar with normal appearance', () => {
		expectAvatarSize('normal', 'small');
	});

	it('renders a small Avatar with compact appearance', () => {
		expectAvatarSize('compact', 'small');
	});

	it('renders a medium Avatar with big appearance', () => {
		expectAvatarSize('big', 'medium');
	});

	it('renders an xxsmall Avatar with multi appearance', () => {
		expectAvatarSize('multi', 'xxsmall');
	});

	it('passes presence through to Avatar', () => {
		renderSizeableAvatar({ presence: 'online' });

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-presence', 'online');
	});

	it('adds the inner border to hexagons when the experiment is enabled', () => {
		mockExpEnabled('platform_user_picker_agent_avatar_hexagon');
		renderSizeableAvatar({ avatarAppearanceShape: 'hexagon' });
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-appearance', 'hexagon');
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-inner-border', 'true');
	});

	it('does not add the inner border when the experiment is disabled', () => {
		mockExpDisabled('platform_user_picker_agent_avatar_hexagon');
		renderSizeableAvatar({ avatarAppearanceShape: 'hexagon' });
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-inner-border', 'false');
	});

	it('does not add the inner border to people', () => {
		mockExpEnabled('platform_user_picker_agent_avatar_hexagon');
		renderSizeableAvatar({ avatarAppearanceShape: 'circle' });
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-inner-border', 'false');
	});
});
