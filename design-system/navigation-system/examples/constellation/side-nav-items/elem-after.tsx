import React from 'react';

import Badge from '@atlaskit/badge';
import HomeIcon from '@atlaskit/icon/core/home';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import Lozenge from '@atlaskit/lozenge';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { Inline } from '@atlaskit/primitives/compiled';

import { MockSideNav } from './common/mock-side-nav';

const exampleHref = '#example-href';

export function ElemAfterExample() {
	return (
		<MockSideNav>
			<SideNavContent>
				<MenuList>
					<LinkMenuItem
						href={exampleHref}
						elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
						elemAfter={<Lozenge>New</Lozenge>}
					>
						Link menu item (lozenge)
					</LinkMenuItem>
					<LinkMenuItem
						href={exampleHref}
						elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
						elemAfter={<Badge>24</Badge>}
					>
						Link menu item (badge)
					</LinkMenuItem>
					<LinkMenuItem
						href={exampleHref}
						elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
						elemAfter={<LinkExternalIcon label="" size="small" />}
					>
						Link menu item (icon)
					</LinkMenuItem>
					<LinkMenuItem
						href={exampleHref}
						elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
						elemAfter={
							<Inline space="space.050" alignBlock="center">
								<Lozenge>New</Lozenge>
								<LinkExternalIcon label="" size="small" />
							</Inline>
						}
					>
						Link menu item (lozenge & icon)
					</LinkMenuItem>
				</MenuList>
			</SideNavContent>
		</MockSideNav>
	);
}

export default ElemAfterExample;
