import React from 'react';

import { SideNavBody } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { MenuListItem } from '@atlaskit/side-nav-items/menu-list-item';
import { Divider, MenuSection, MenuSectionHeading } from '@atlaskit/side-nav-items/menu-section';
import { TopLevelSpacer } from '@atlaskit/side-nav-items/top-level-spacer';

/**
 * Place this body inside the product's Navigation System SideNav. The application router should
 * provide real destinations and derive the selected state from its current route.
 */
export function SectionedNavigation(): React.JSX.Element {
	const [notice, setNotice] = React.useState('');

	return (
		<>
			<SideNavBody>
				<MenuList>
					<MenuSection isMenuListItem>
						<MenuSectionHeading>Workspace</MenuSectionHeading>
						<LinkMenuItem href="/workspace/overview" isSelected>
							Overview
						</LinkMenuItem>
						<LinkMenuItem href="/workspace/projects">Projects</LinkMenuItem>
					</MenuSection>
					<MenuListItem>
						<p role="status">3 projects updated today</p>
					</MenuListItem>
					<Divider />
					<MenuSection isMenuListItem>
						<MenuSectionHeading>Shortcuts</MenuSectionHeading>
						<LinkMenuItem href="/workspace/recent" description="Items you opened recently">
							Recent
						</LinkMenuItem>
					</MenuSection>
					<TopLevelSpacer />
					<ButtonMenuItem onClick={() => setNotice('Create project action selected')}>
						Create project
					</ButtonMenuItem>
				</MenuList>
			</SideNavBody>
			{notice && <p role="status">{notice}</p>}
		</>
	);
}

export default SectionedNavigation;
