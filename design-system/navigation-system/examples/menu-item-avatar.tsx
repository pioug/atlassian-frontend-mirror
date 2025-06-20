/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { ContainerAvatar } from '@atlaskit/navigation-system/side-nav-items/container-avatar';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import {
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';

import koalaProjectIcon from './images/koala.png';

const styles = cssMap({
	root: {
		width: '300px',
	},
});

export const MenuItemAvatarExample = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<MenuSection isMenuListItem>
					<MenuSectionHeading>Projects</MenuSectionHeading>
					<MenuList>
						<ButtonMenuItem elemBefore={<ContainerAvatar src={koalaProjectIcon} />}>
							With container avatar
						</ButtonMenuItem>
					</MenuList>
				</MenuSection>
			</MenuList>
		</SideNavContent>
	</div>
);

export default MenuItemAvatarExample;
