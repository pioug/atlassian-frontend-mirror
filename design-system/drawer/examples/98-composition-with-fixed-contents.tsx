/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer/compiled';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingTop: token('space.400'),
		paddingRight: token('space.400'),
		paddingBottom: token('space.400'),
		paddingLeft: token('space.400'),
	},
	menu: {
		position: 'fixed',
		insetInlineStart: 100,
		insetBlockStart: 200,
	},
});

export default function DrawerExample() {
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
