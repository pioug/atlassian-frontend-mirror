/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import HomeIcon from '@atlaskit/icon/core/home';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { MenuListItem } from '@atlaskit/navigation-system/side-nav-items/menu-list-item';
import {
	Divider,
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';
import { token } from '@atlaskit/tokens';

const homeIcon = <HomeIcon label="" color="currentColor" spacing="spacious" />;

const styles = cssMap({
	root: {
		width: '300px',
	},
	blackBorder: {
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: 'black',
		borderRadius: token('border.radius.100', '3px'),
	},
});

export const DividerExample = () => (
	<div css={[styles.root, styles.blackBorder]}>
		<h2>Divider</h2>
		<Divider />
		<h3>lorem ipsum</h3>
	</div>
);

export const MenuSectionExample = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<MenuListItem>
					<MenuSection>
						<MenuSectionHeading>Starred</MenuSectionHeading>
						<MenuList>
							<ButtonMenuItem elemBefore={homeIcon}>Menu Item</ButtonMenuItem>
							<ButtonMenuItem elemBefore={homeIcon}>Menu Item 2</ButtonMenuItem>
						</MenuList>
						<Divider />
					</MenuSection>
				</MenuListItem>
				<MenuListItem>
					<MenuSection>
						<MenuSectionHeading>Recent</MenuSectionHeading>
						<MenuList>
							<ButtonMenuItem>Menu Item</ButtonMenuItem>
							<ButtonMenuItem>Menu Item 2</ButtonMenuItem>
						</MenuList>
						<Divider />
					</MenuSection>
				</MenuListItem>
				<MenuListItem>
					<MenuSection>
						<MenuList>
							<ButtonMenuItem elemBefore={homeIcon}>Menu Item</ButtonMenuItem>
							<ButtonMenuItem elemBefore={homeIcon}>Menu Item 2</ButtonMenuItem>
						</MenuList>
					</MenuSection>
				</MenuListItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export default MenuSectionExample;
