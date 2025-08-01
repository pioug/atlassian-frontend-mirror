/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		width: '300px',
		borderColor: token('color.border.accent.gray'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
	},
});

export function MenuListExample() {
	return (
		// Disabling this rule as this is a storybook, and the code is designed to swallow anchor-clicks
		// to avoid leaving storybook.
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
		<nav css={styles.root} onClick={(evt) => evt.preventDefault()}>
			<SideNavContent>
				<ButtonMenuItem>Text only</ButtonMenuItem>
				<ButtonMenuItem elemBefore={<Avatar />}>With avatar</ButtonMenuItem>
				<ButtonMenuItem description="A long description that should be truncated">
					With all options and long text
				</ButtonMenuItem>
				<LinkMenuItem href="#">Link Text only</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={<Avatar />}>
					Link With avatar
				</LinkMenuItem>
				<LinkMenuItem href="#" description="A long description that should be truncated">
					Link With all options and long text
				</LinkMenuItem>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem description="A long description that should be truncated">
							With all options and long text
						</ButtonMenuItem>
						<LinkMenuItem href="#" elemBefore={<Avatar />}>
							Link With avatar
						</LinkMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</SideNavContent>
		</nav>
	);
}

export default MenuListExample;
