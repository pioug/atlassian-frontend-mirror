import { render, screen } from '@testing-library/react';
import React from 'react';
import { type Props, SizeableAvatar } from '../../../components/SizeableAvatar';

jest.mock('@atlaskit/avatar/avatar', () => ({
	...jest.requireActual('@atlaskit/avatar/avatar'),
	__esModule: true,
	default: (props: { presence?: string; size: string }) => (
		<div data-testid="avatar" data-presence={props.presence} data-size={props.size} />
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
});
