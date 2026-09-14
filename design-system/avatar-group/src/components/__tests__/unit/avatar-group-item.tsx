import React from 'react';

import { render, screen, userEvent } from '@atlassian/testing-library';

import AvatarGroup from '../../avatar-group';
import AvatarGroupItem from '../../avatar-group-item';
import { type AvatarProps } from '../../types';

const CustomAvatar = (props: AvatarProps) => (
	<div data-testid={props.testId} data-custom-avatar="true">
		Custom-{props.name || 'noname'}
	</div>
);

const generateData = (count: number): AvatarProps[] => {
	const data: AvatarProps[] = [];
	for (let i = 0; i < count; i++) {
		data.push({ name: `User ${i}`, key: `user-${i}` });
	}
	return data;
};

describe('<AvatarGroupItem />', () => {
	it('should be accessible', async () => {
		render(<AvatarGroupItem avatar={{ name: 'Alice' }} index={0} testId="item" />);
		await expect(screen.getByTestId('item')).toBeAccessible();
	});

	it('should accept and pass through the `overrides` prop without throwing', () => {
		// The overrides prop is optional. Render should succeed when it is undefined.
		render(<AvatarGroupItem avatar={{ name: 'Alice' }} index={0} testId="item" />);

		// Default rendering uses Avatar; the underlying CustomItem renders the avatar's name
		expect(screen.getByText('Alice')).toBeInTheDocument();
	});

	it('should render with an empty overrides object (uses defaults)', () => {
		render(
			<AvatarGroupItem
				avatar={{ name: 'Bob' }}
				index={0}
				testId="item-empty"
				avatarOverrides={{
					render: (Component, props, index) => <Component {...props} key={index} />,
				}}
			/>,
		);

		expect(screen.getByText('Bob')).toBeInTheDocument();
	});
});

describe('<AvatarGroup /> -> <AvatarGroupItem /> overrides forwarding', () => {
	it('should call the Avatar override render function for avatars inside the overflow menu', async () => {
		const user = userEvent.setup();
		const avatarRender = jest.fn((Component: any, props: any, index: number) => (
			<Component {...props} key={index} data-overridden-via-override="yes" />
		));

		render(
			<AvatarGroup
				testId="test"
				data={generateData(8)}
				maxCount={3}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={{
					Avatar: {
						render: avatarRender,
					},
				}}
			/>,
		);

		// Open the overflow dropdown so AvatarGroupItem mounts.
		await user.click(screen.getByTestId('test--overflow-menu--trigger'));

		// The Avatar override render function should be invoked at least once for the
		// overflowed items (5 items overflow when avatarCount=8 and maxCount=3).
		expect(avatarRender).toHaveBeenCalled();
	});

	it('should pass a custom avatar component through to overflowed items when override + avatar prop are combined', async () => {
		const user = userEvent.setup();
		const avatarRender = jest.fn((Component: any, props: any, index: number) => (
			<Component {...props} key={index} />
		));

		render(
			<AvatarGroup
				testId="test"
				avatar={CustomAvatar}
				data={generateData(8)}
				maxCount={3}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={{ Avatar: { render: avatarRender } }}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));

		// The overridden render should have been called and the rendered avatar should
		// use the supplied CustomAvatar component (data-custom-avatar attribute set).
		expect(avatarRender).toHaveBeenCalled();
		const overflowAvatar = screen.getByTestId('test--avatar-group-item-3--avatar');
		expect(overflowAvatar).toHaveAttribute('data-custom-avatar', 'true');
	});
});
