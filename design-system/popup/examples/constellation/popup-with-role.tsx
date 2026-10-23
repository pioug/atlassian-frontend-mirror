/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

const contentStyles = cssMap({
	root: {
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
	},
});

const PopupWithRoleExample = (): JSX.Element => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
	const closeMenu = () => {
		setIsMenuOpen(false);
		menuTriggerRef.current?.focus();
	};

	useEffect(() => {
		if (isMenuOpen) {
			menuItemRefs.current[0]?.focus();
		}
	}, [isMenuOpen]);

	const handleMenuItemKeyDown = (index: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
		const menuItemCount = menuItemRefs.current.length;
		let nextIndex: number | undefined;

		switch (event.key) {
			case 'ArrowDown':
				nextIndex = (index + 1) % menuItemCount;
				break;
			case 'ArrowUp':
				nextIndex = (index - 1 + menuItemCount) % menuItemCount;
				break;
			case 'Home':
				nextIndex = 0;
				break;
			case 'End':
				nextIndex = menuItemCount - 1;
				break;
		}

		if (nextIndex !== undefined) {
			event.preventDefault();
			menuItemRefs.current[nextIndex]?.focus();
		}
	};

	return (
		<Stack alignInline="start" space="space.200">
			<Popup
				shouldRenderToParent
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				placement="bottom-start"
				content={() => <Box xcss={contentStyles.root}>Content</Box>}
				role="dialog"
				label="Popup with role dialog example"
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						appearance="primary"
						isSelected={isDialogOpen}
						onClick={() => setIsDialogOpen(!isDialogOpen)}
					>
						{isDialogOpen ? 'Close' : 'Open'} dialog popup
					</Button>
				)}
			/>
			<Popup
				// Prefer DropdownMenu for menus. Use Popup only for more complex interactions,
				// and ensure it meets applicable accessibility guidelines and expected menu behavior to prevent regressions.
				autoFocus={false}
				shouldRenderToParent
				isOpen={isMenuOpen}
				onClose={(event) => {
					if (
						event?.type === 'keydown' &&
						'key' in event &&
						(event.key === 'Escape' || event.key === 'Esc')
					) {
						menuTriggerRef.current?.focus();
					}
					setIsMenuOpen(false);
				}}
				placement="bottom-start"
				content={() => (
					<Stack alignInline="start" space="space.0">
						{['Edit', 'Delete'].map((item, index) => (
							<Button
								key={item}
								ref={(element) => {
									menuItemRefs.current[index] = element;
								}}
								onClick={closeMenu}
								onKeyDown={handleMenuItemKeyDown(index)}
								role="menuitem"
							>
								{item}
							</Button>
						))}
					</Stack>
				)}
				role="menu"
				label="Popup with role menu example"
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						appearance="primary"
						isSelected={isMenuOpen}
						onClick={(event) => {
							menuTriggerRef.current = event.currentTarget;
							setIsMenuOpen(!isMenuOpen);
						}}
					>
						{isMenuOpen ? 'Close' : 'Open'} menu popup
					</Button>
				)}
			/>
		</Stack>
	);
};

export default PopupWithRoleExample;
