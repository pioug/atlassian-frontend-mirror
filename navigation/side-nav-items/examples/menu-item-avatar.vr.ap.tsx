/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { SideNavBody } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import { ContainerAvatar } from '@atlaskit/side-nav-items/container-avatar';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { MenuSection, MenuSectionHeading } from '@atlaskit/side-nav-items/menu-section';

import koalaProjectIcon from './images/koala.png';

const styles = cssMap({
	root: {
		width: '300px',
	},
});

export const MenuItemAvatarExample = (): JSX.Element => (
	<div css={styles.root}>
		<SideNavBody>
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
		</SideNavBody>
	</div>
);

export default MenuItemAvatarExample;
