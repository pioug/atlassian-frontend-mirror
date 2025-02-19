import React, { Fragment } from 'react';

import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';
import __noop from '@atlaskit/ds-lib/noop';

import AvatarGroup from '../../avatar-group';

const generateData = ({
	avatarCount,
	href,
	onClick,
	disabledIndexes,
	label,
	borderColor,
}: {
	avatarCount: number;
	href?: string;
	onClick?: () => void;
	disabledIndexes?: number[];
	label?: string;
	borderColor?: string;
}) => {
	const data = [];
	for (let i = 0; i < avatarCount; i++) {
		data.push({
			name: `Name ${i}`,
			src: `#${i}`,
			size: 'medium' as SizeType,
			appearance: 'circle' as AppearanceType,
			isDisabled: disabledIndexes ? disabledIndexes.includes(i) : undefined,
			label: label ? `${label} ${i}` : undefined,
			href,
			onClick,
			borderColor,
		});
	}
	return data;
};

describe('<AvatarGroup />', () => {
	it('should override add clickable button beside the last overflowed avatar item', async () => {
		const user = userEvent.setup();
		const callback = jest.fn();
		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 2 })}
				maxCount={1}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={{
					AvatarGroupItem: {
						render: (Component, props, index) =>
							index === 1 ? (
								<Fragment key={index}>
									<Component {...props} />
									<button type="button" onClick={callback} data-testid="custom-button">
										hello world
									</button>
								</Fragment>
							) : (
								<Component {...props} key={index} />
							),
					},
				}}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));
		await user.click(screen.getByTestId('custom-button'));

		expect(callback).toHaveBeenCalled();
	});

	it('should display a single avatar', () => {
		render(
			<AvatarGroup testId="test" appearance="stack" data={generateData({ avatarCount: 1 })} />,
		);

		expect(screen.getByTestId('test--avatar-0')).toBeInTheDocument();
	});

	it('should not render overflow menu trigger when none avatars have been overflowed', () => {
		render(
			<AvatarGroup testId="test" appearance="stack" data={generateData({ avatarCount: 1 })} />,
		);

		expect(screen.queryByTestId('test--overflow-menu--trigger')).not.toBeInTheDocument();
	});

	it('should render the second avatar', () => {
		render(
			<AvatarGroup testId="test" appearance="stack" data={generateData({ avatarCount: 2 })} />,
		);

		expect(screen.getByTestId('test--avatar-1')).toBeInTheDocument();
	});

	it('should render the third avatar', () => {
		render(
			<AvatarGroup testId="test" appearance="stack" data={generateData({ avatarCount: 3 })} />,
		);

		expect(screen.getByTestId('test--avatar-2')).toBeInTheDocument();
	});

	it('should render the overflow menu trigger showing there are three avatars that have been overflowed', () => {
		render(
			<AvatarGroup
				testId="test"
				appearance="stack"
				data={generateData({ avatarCount: 5 })}
				// While max count is 3 - 3 items will be moved into the overflow menu
				// because the third item will now be the trigger itself!
				maxCount={3}
			/>,
		);

		expect(screen.getByText('+3')).toBeInTheDocument();
	});

	it('should set href to overflowed avatar dropdown item', async () => {
		const user = userEvent.setup();
		render(
			<AvatarGroup
				testId="test"
				appearance="stack"
				data={[
					{
						name: 'Name 0',
						src: '#0',
						size: 'medium',
						appearance: 'circle',
						href: '#',
					},
					{
						name: 'Name 1',
						src: '#1',
						size: 'medium',
						appearance: 'circle',
						href: '#',
					},
				]}
				maxCount={1}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));

		expect(screen.getByTestId('test--avatar-group-item-1')).toHaveAttribute('href', '#');
	});

	it('should set accessible name for avatar images when name prop is provided', async () => {
		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 5 })}
				// While max count is 4 - 2 items will be moved into the overflow menu
				// because the fourth item will now be the trigger itself!
				maxCount={4}
			/>,
		);

		// there are should be 3 avatar and 1 dropdown trigger button
		const avatarImgList = screen.getAllByRole('img');
		expect(avatarImgList).toHaveLength(3);
		avatarImgList.forEach((element, i) => {
			expect(element).toHaveAccessibleName(`Name ${i}`);
		});
	});

	it('should set accessible name for buttons when label prop AND onClick are provided', async () => {
		render(
			<AvatarGroup
				testId="test"
				data={generateData({
					avatarCount: 5,
					onClick: __noop,
					label: 'Label',
				})}
				// While max count is 4 - 2 items will be moved into the overflow menu
				// because the fourth item will now be the trigger itself!
				maxCount={4}
			/>,
		);

		const avatarLabelList = screen.getAllByRole('button', { name: /Label / });

		// there should be 3 interactive avatars (and 1 dropdown trigger button,
		// which will not be selected with the above query)
		expect(avatarLabelList).toHaveLength(3);
	});

	it('should set accessible name of _anchors_ when label prop AND href are provided', async () => {
		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 5, href: '#', label: 'Label' })}
				// While max count is 4 - 2 items will be moved into the overflow menu
				// because the fourth item will now be the trigger itself!
				maxCount={4}
			/>,
		);

		const avatarLabelList = screen.getAllByRole('link');
		// there are should be 3 avatar and 1 dropdown trigger button
		expect(avatarLabelList).toHaveLength(3);

		avatarLabelList.forEach((element, i) => {
			expect(element).toHaveAccessibleName(`Label ${i}`);
		});
	});

	it('should NOT set labels to dropdown avatar items', async () => {
		const user = userEvent.setup();
		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 5 })}
				// While max count is 3 - 3 items will be moved into the overflow menu
				// because the third item will now be the trigger itself!
				maxCount={3}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));
		const overflowMenu = screen.getByTestId('test--overflow-menu');

		const avatarsWithLabel = screen.queryAllByLabelText('Name', {
			exact: false,
		});
		expect(avatarsWithLabel).toHaveLength(2);

		const avatarsWithLabelInMenu = within(overflowMenu).queryAllByLabelText('Name', {
			exact: false,
		});
		expect(avatarsWithLabelInMenu).toHaveLength(0);
	});

	it('should ensure href is not set on the avatar inside the overflowed dropdown item', async () => {
		const user = userEvent.setup();
		render(
			<AvatarGroup
				testId="test"
				appearance="stack"
				data={generateData({ avatarCount: 2 })}
				maxCount={1}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));

		expect(screen.getByTestId('test--avatar-group-item-0--avatar')).not.toHaveAttribute('href');
	});

	it('should start overflow index from max count when passing index to override render function', async () => {
		const user = userEvent.setup();
		render(
			<AvatarGroup
				testId="test"
				appearance="stack"
				data={generateData({ avatarCount: 4 })}
				maxCount={3}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={{
					AvatarGroupItem: {
						render: (_, __, index) => (
							<div key={index} data-testid="avatar-overflow" data-index={index}>
								hello world
							</div>
						),
					},
				}}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));

		expect(screen.getAllByTestId('avatar-overflow')[0]).toHaveAttribute('data-index', '2');
	});

	it('should use the same index for visible avatar when passing index to override render function', () => {
		render(
			<AvatarGroup
				testId="test"
				appearance="stack"
				data={generateData({ avatarCount: 4 })}
				maxCount={3}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={{
					Avatar: {
						render: (_, __, index) => (
							<div key={index} data-testid="avatar" data-index={index}>
								hello world
							</div>
						),
					},
				}}
			/>,
		);

		expect(screen.getAllByTestId('avatar')[0]).toHaveAttribute('data-index', '0');
	});

	it('should open overflow dropdown if no override', async () => {
		const user = userEvent.setup();
		render(
			<AvatarGroup
				testId="test"
				appearance="stack"
				data={generateData({ avatarCount: 4 })}
				maxCount={3}
			/>,
		);

		expect(screen.queryByTestId('test--overflow-menu')).not.toBeInTheDocument();

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));

		expect(screen.getByTestId('test--overflow-menu')).toBeInTheDocument();
		expect(screen.getByTestId('test--avatar-group-item-2')).toBeInTheDocument();
		expect(screen.getByTestId('test--avatar-group-item-3')).toBeInTheDocument();
	});

	it('should open overflow dropdown if MoreIndicator has override', async () => {
		const user = userEvent.setup();
		render(
			<AvatarGroup
				testId="test"
				appearance="stack"
				data={generateData({ avatarCount: 4 })}
				maxCount={3}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={{
					MoreIndicator: {
						render: (_, { borderColor, isActive, buttonProps, testId, ...props }) => (
							<button type="button" {...buttonProps} {...props} data-testid={testId}>
								Test MoreIndicator
							</button>
						),
					},
				}}
			/>,
		);

		expect(screen.queryByTestId('test--overflow-menu')).not.toBeInTheDocument();

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));

		expect(screen.getByTestId('test--overflow-menu')).toBeInTheDocument();
		expect(screen.getByTestId('test--avatar-group-item-2')).toBeInTheDocument();
		expect(screen.getByTestId('test--avatar-group-item-3')).toBeInTheDocument();
	});

	it('should pass the index of the avatar when onAvatarClicked is fired from the more menu', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 4 })}
				maxCount={3}
				onAvatarClick={onClick}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));
		await user.click(screen.getByTestId('test--avatar-group-item-3--avatar--inner'));

		expect(onClick).toHaveBeenCalledWith(expect.anything(), undefined, 3);
	});

	it('onClick handlers provided via showMoreButtonProps should still open the dropdown', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 4 })}
				maxCount={3}
				showMoreButtonProps={{
					onClick,
				}}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));

		expect(screen.getByTestId('test--avatar-group-item-3--avatar--inner')).toBeInTheDocument();
		expect(onClick).toHaveBeenCalled();
	});

	it('onMoreClick should not open the dropdown', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 4 })}
				maxCount={3}
				onMoreClick={onClick}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));

		expect(
			screen.queryByTestId('test--avatar-group-item-3--avatar--inner'),
		).not.toBeInTheDocument();
		expect(onClick).toHaveBeenCalled();
	});

	it('should pass the index of the avatar when onAvatarClicked is fired', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		render(
			<AvatarGroup
				testId="test"
				data={[
					{
						name: 'Name 0',
						src: '#0',
						size: 'medium' as SizeType,
						appearance: 'circle' as AppearanceType,
					},
				]}
				onAvatarClick={onClick}
			/>,
		);

		await user.click(screen.getByTestId('test--avatar-0--inner'));

		expect(onClick).toHaveBeenCalledWith(expect.anything(), expect.anything(), 0);
	});

	it('should pass the index of the avatar when is fired', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		render(
			<AvatarGroup
				testId="test"
				data={[
					{
						name: 'Name 0',
						src: '#0',
						size: 'medium',
						appearance: 'circle',
						onClick,
					},
				]}
			/>,
		);

		await user.click(screen.getByTestId('test--avatar-0--inner'));

		expect(onClick).toHaveBeenCalledWith(expect.anything(), expect.anything(), 0);
	});

	it('should call onClick provided with avatar data on anchor elements in avatar group popup', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		const onAvatarClick = jest.fn();

		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 4, href: '#', onClick })}
				maxCount={3}
				onAvatarClick={onAvatarClick}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));
		await user.click(screen.getByTestId('test--avatar-group-item-3--avatar--inner'));

		// onClick should take precedence over onAvatarClick
		expect(onClick).toHaveBeenCalled();
		expect(onAvatarClick).not.toHaveBeenCalled();
	});

	it('should call onClick provided with avatar data on button elements in avatar group popup', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		const onAvatarClick = jest.fn();

		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 4, onClick })}
				maxCount={3}
				onAvatarClick={onAvatarClick}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));
		await user.click(screen.getByTestId('test--avatar-group-item-3--avatar--inner'));

		// onClick should take precedence over onAvatarClick
		expect(onClick).toHaveBeenCalled();
		expect(onAvatarClick).not.toHaveBeenCalled();
	});

	it('should call onAvatarClick on href elements in avatar group popup if onClick is not provided', async () => {
		const user = userEvent.setup();
		const onAvatarClick = jest.fn();

		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 4, href: '#' })}
				maxCount={3}
				onAvatarClick={onAvatarClick}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));
		await user.click(screen.getByTestId('test--avatar-group-item-3--avatar--inner'));

		expect(onAvatarClick).toHaveBeenCalled();
	});

	it('should call onAvatarClick on button elements in avatar group popup if onClick is not provided', async () => {
		const user = userEvent.setup();
		const onAvatarClick = jest.fn();

		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 4 })}
				maxCount={3}
				onAvatarClick={onAvatarClick}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));
		await user.click(screen.getByTestId('test--avatar-group-item-3--avatar--inner'));

		expect(onAvatarClick).toHaveBeenCalled();
	});

	it('container should be marked as unordered list', () => {
		const onAvatarClick = jest.fn();

		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 4 })}
				maxCount={3}
				onAvatarClick={onAvatarClick}
			/>,
		);

		const container = screen.getByTestId('test--avatar-group');

		expect(container!.tagName).toBe('UL');
	});

	it('avatar items should be marked as list items', () => {
		const onAvatarClick = jest.fn();

		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 3 })}
				maxCount={3}
				onAvatarClick={onAvatarClick}
			/>,
		);

		const container = screen.getByTestId('test--avatar-group');
		expect(container).toBeInTheDocument();

		const avatarsWithLabel = within(container).queryAllByRole('listitem');
		expect(avatarsWithLabel).toHaveLength(3);
	});

	it('should set received label as aria-label of avatar group list', () => {
		const onAvatarClick = jest.fn();

		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 3 })}
				maxCount={3}
				label="Contributors"
				onAvatarClick={onAvatarClick}
			/>,
		);

		const container = screen.getByTestId('test--avatar-group');
		expect(container).toHaveAttribute('aria-label', 'Contributors');
	});

	it('should not be wrapped into the Tooltip when disabled', () => {
		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 3, disabledIndexes: [1] })}
				maxCount={3}
			/>,
		);

		const [firstAvatar, secondAvatar, thirdAvatar] = [
			screen.queryByTestId('test--tooltip-0--container'),
			screen.queryByTestId('test--tooltip-1--container'),
			screen.queryByTestId('test--tooltip-2--container'),
		];

		expect(firstAvatar).not.toBeNull();
		expect(secondAvatar).toBeNull();
		expect(thirdAvatar).not.toBeNull();
	});
});

// FIXME: Jest 29 upgrade - this test suite is failing when running with flag IS_REACT_18
describe.skip('Accessibility', () => {
	it('Avatar Group items inside more should have role equal to button and get focus', async () => {
		const user = userEvent.setup();
		render(
			<AvatarGroup
				testId="test"
				data={generateData({ avatarCount: 7, disabledIndexes: [1] })}
				maxCount={3}
			/>,
		);

		await user.click(screen.getByTestId('test--overflow-menu--trigger'));
		const moreMenuContainer = screen.getByTestId('test--overflow-menu');
		moreMenuContainer.focus();

		const moreMenuItemOne = screen.getByRole('button', {
			name: 'Name 2',
		});

		await act(async () => {
			await user.tab();
		});
		expect(moreMenuContainer).toBeInTheDocument();
		expect(moreMenuItemOne).toBeInTheDocument();
		expect(moreMenuItemOne).toHaveFocus();
	});
});
