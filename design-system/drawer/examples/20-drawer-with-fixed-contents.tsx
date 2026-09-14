/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
	},
	menu: {
		position: 'fixed',
		insetInlineStart: 100,
		insetBlockStart: 200,
	},
});

export default function DrawerExample(): JSX.Element {
	const [isDrawerOpen, setIsDrawerOpen] = useState(true);

	return (
		<div css={styles.root}>
			<Drawer
				onClose={() => setIsDrawerOpen(false)}
				isOpen={isDrawerOpen}
				width="wide"
				label="Drawer with fixed contents"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<p id="paragraph">
						The drawer should not set a new stacking context by using a transform CSS property as
						this causes issues for fixed positioned elements such as @atlaskit/dropdown-menu.
					</p>
					<div css={styles.menu}>
						<DropdownMenu<HTMLButtonElement>
							shouldRenderToParent
							testId="dropdown"
							trigger={({ triggerRef, ...providedProps }) => (
								<Button id="trigger" ref={triggerRef} {...providedProps}>
									Choices
								</Button>
							)}
						>
							<DropdownItemGroup>
								<DropdownItem>Sydney</DropdownItem>
								<DropdownItem>Melbourne</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</div>
				</DrawerContent>
			</Drawer>
			<Button type="button" onClick={() => setIsDrawerOpen(true)}>
				Open drawer
			</Button>
		</div>
	);
}
