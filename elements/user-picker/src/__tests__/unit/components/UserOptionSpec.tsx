import getAppearanceForAppType from '@atlaskit/avatar/get-appearance';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { UserOption } from '../../../components/UserOption';
import { type LozengeProps, type User } from '../../../types';

jest.mock('@atlaskit/avatar/get-appearance', () => ({
	...jest.requireActual('@atlaskit/avatar/get-appearance'),
	__esModule: true,
	default: jest.fn(),
}));

jest.mock('../../../components/SizeableAvatar', () => ({
	SizeableAvatar: ({
		appearance,
		avatarAppearanceShape,
		presence,
		src,
	}: {
		appearance: string;
		avatarAppearanceShape?: string;
		presence?: string;
		src?: string;
	}) => (
		<div
			data-testid="user-avatar"
			data-appearance={appearance}
			data-avatar-appearance-shape={avatarAppearanceShape}
			data-presence={presence}
			data-src={src}
		/>
	),
}));

jest.mock('../../../components/AvatarOrIcon', () => ({
	AvatarOrIcon: ({
		icon,
		iconColor,
		src,
	}: {
		icon: React.ReactNode;
		iconColor?: string;
		src?: string;
	}) => (
		<div data-testid="user-avatar-icon" data-src={src} style={{ color: iconColor }}>
			{icon}
		</div>
	),
}));

describe('User Option', () => {
	const user: User = {
		id: 'abc-123',
		name: 'Jace Beleren',
		publicName: 'jbeleren',
		avatarUrl: 'http://avatars.atlassian.com/jace.png',
		byline: 'Teammate',
		lozenge: 'WORKSPACE',
		type: 'user',
	};

	const renderUserOption = (userProps: Partial<User> = {}, isSelected = false) =>
		render(
			<UserOption user={{ ...user, ...userProps }} status="approved" isSelected={isSelected} />,
		);

	it('renders the name, public name, byline, lozenge, and avatar', async () => {
		renderUserOption();

		expect(screen.getByText(user.name)).toBeInTheDocument();
		expect(screen.getByText('(jbeleren)')).toBeInTheDocument();
		expect(screen.getByText(user.byline!)).toBeInTheDocument();
		expect(screen.getByText('WORKSPACE')).toBeInTheDocument();
		expect(screen.getByTestId('user-avatar')).toHaveAttribute('data-presence', 'approved');
		expect(screen.getByTestId('user-avatar')).toHaveAttribute('data-src', user.avatarUrl);
		await expect(document.body).toBeAccessible();
	});

	it('renders the same user information in selected state', () => {
		renderUserOption({}, true);

		expect(screen.getByText(user.name)).toBeInTheDocument();
		expect(screen.getByText('(jbeleren)')).toBeInTheDocument();
		expect(screen.getByText(user.byline!)).toBeInTheDocument();
		expect(screen.getByText('WORKSPACE')).toBeInTheDocument();
	});

	it('renders an object lozenge', () => {
		const lozenge: LozengeProps = { text: 'GUEST', appearance: 'new' };
		renderUserOption({ lozenge });

		expect(screen.getByText('GUEST')).toBeInTheDocument();
	});

	it('highlights the configured name and public name ranges', () => {
		const { container } = renderUserOption({
			highlight: {
				name: [{ start: 0, end: 2 }],
				publicName: [{ start: 2, end: 4 }],
			},
		});

		expect(Array.from(container.querySelectorAll('b')).map((part) => part.textContent)).toEqual([
			'Jac',
			'ele',
		]);
	});

	it('shows only the name when no public name is provided', () => {
		const { container } = renderUserOption({
			name: 'jbeleren',
			publicName: undefined,
			highlight: { name: [{ start: 2, end: 4 }], publicName: [] },
		});

		expect(container).toHaveTextContent('jbeleren');
		expect(container.querySelectorAll('span').length).toBeGreaterThan(0);
		expect(screen.queryByText('(jbeleren)')).not.toBeInTheDocument();
	});

	it('shows only the name when public name matches after trimming', () => {
		renderUserOption({ publicName: `  ${user.name}  ` });

		expect(screen.getAllByText(user.name)).toHaveLength(1);
	});

	it('renders a hexagon avatar for an agent', () => {
		(getAppearanceForAppType as jest.Mock).mockReturnValue('hexagon');
		renderUserOption({ appType: 'agent' });

		expect(getAppearanceForAppType).toHaveBeenCalledWith('agent');
		expect(screen.getByTestId('user-avatar')).toHaveAttribute(
			'data-avatar-appearance-shape',
			'hexagon',
		);
	});

	describe('icon support', () => {
		const mockIcon = <span data-testid="test-icon">Icon</span>;

		it('renders AvatarOrIcon when an icon is provided', () => {
			renderUserOption({ icon: mockIcon });

			expect(screen.getByTestId('user-avatar-icon')).toBeInTheDocument();
			expect(screen.getByTestId('test-icon')).toBeInTheDocument();
		});

		it('passes iconColor to AvatarOrIcon', () => {
			renderUserOption({ icon: mockIcon, iconColor: '#FF0000' });

			expect(screen.getByTestId('user-avatar-icon')).toHaveStyle({ color: '#FF0000' });
		});

		it('renders SizeableAvatar when no icon is provided', () => {
			renderUserOption();

			expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
		});
	});
});
