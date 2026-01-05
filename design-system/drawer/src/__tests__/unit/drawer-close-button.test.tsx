import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EmojiIcon from '@atlaskit/icon/core/emoji';

import { Drawer } from '../../drawer';
import { DrawerCloseButton } from '../../drawer-panel/drawer-close-button';
import { DrawerContent } from '../../drawer-panel/drawer-content';
import { DrawerSidebar } from '../../drawer-panel/drawer-sidebar';
import { type DrawerWidth } from '../../types';

describe('Drawer close button', () => {
	const commonProps = {
		testId: 'test',
		width: 'wide' as DrawerWidth,
		label: 'Default drawer',
		onClose: () => null,
		isOpen: true,
	};

	const content = <code data-testid="DrawerContents">Drawer contents</code>;

	const Icon = (props: { size: string }) => {
		return <span data-size={props.size}>Icon</span>;
	};

	it('should render given icon in large size', () => {
		render(
			<Drawer {...commonProps}>
				<DrawerSidebar>
					<DrawerCloseButton icon={Icon} />
				</DrawerSidebar>
				<DrawerContent>{content}</DrawerContent>
			</Drawer>,
		);

		expect(screen.getByText('Icon')).toHaveAttribute('data-size', 'large');
	});

	it('should not overwrite the accessible name when given an icon', () => {
		render(
			<Drawer {...commonProps}>
				<DrawerSidebar>
					<DrawerCloseButton icon={EmojiIcon} />
				</DrawerSidebar>
				<DrawerContent>{content}</DrawerContent>
			</Drawer>,
		);

		expect(screen.getByRole('button', { name: 'Close drawer' })).toBeInTheDocument();
	});

	it('should render default close icon when an icon is not provided', () => {
		render(
			<Drawer {...commonProps}>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>{content}</DrawerContent>
			</Drawer>,
		);

		expect(screen.getByRole('button', { name: 'Close drawer' })).toBeInTheDocument();
	});

	it('should render with custom label when provided', () => {
		const closeLabel = 'Go back';
		render(
			<Drawer {...commonProps}>
				<DrawerSidebar>
					<DrawerCloseButton label={closeLabel} />
				</DrawerSidebar>
				<DrawerContent>{content}</DrawerContent>
			</Drawer>,
		);

		expect(screen.getByRole('button', { name: closeLabel })).toBeInTheDocument();
	});

	it('should call onClose when the button is clicked', async () => {
		const onClose = jest.fn();

		render(
			<Drawer {...commonProps} onClose={onClose}>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>{content}</DrawerContent>
			</Drawer>,
		);

		expect(onClose).not.toHaveBeenCalled();

		await userEvent.click(screen.getByRole('button', { name: 'Close drawer' }));

		expect(onClose).toHaveBeenCalled();
	});
});
