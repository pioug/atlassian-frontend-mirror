/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import ClockIcon from '@atlaskit/icon/core/clock';
import PersonAvatarIcon from '@atlaskit/icon/core/person-avatar';
import StarredUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav, SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { Divider } from '@atlaskit/navigation-system/side-nav-items/menu-section';
import { Stack } from '@atlaskit/primitives/compiled';
import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingBlock: token('space.100'),
	},
});

function AsyncContentItems({
	behavior,
}: {
	behavior: 'skeleton-shorter-than-content' | 'skeleton-longer-than-content';
}) {
	const [isLoading, setIsLoading] = useState(true);

	if (isLoading) {
		return (
			<Stack space="space.200" xcss={styles.root}>
				<Button onClick={() => setIsLoading(false)}>Load items</Button>
				{Array.from(
					{ length: behavior === 'skeleton-shorter-than-content' ? 3 : 30 },
					(_, index) => (
						<Skeleton key={index} width="100%" height={16} />
					),
				)}
			</Stack>
		);
	}

	return (
		<MenuList>
			{Array.from({ length: behavior === 'skeleton-shorter-than-content' ? 30 : 3 }, (_, index) => (
				<ButtonMenuItem
					key={index}
					elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}
				>
					Board #{index}
				</ButtonMenuItem>
			))}
			<Divider />
			<ButtonMenuItem elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}>
				View all starred items
			</ButtonMenuItem>
		</MenuList>
	);
}

export default function FlyoutMenuItemAsyncContentExample() {
	return (
		<Root>
			<TopNav>{null}</TopNav>

			<SideNav label="Side navigation">
				<SideNavContent>
					<MenuList>
						<LinkMenuItem href="#" elemBefore={<PersonAvatarIcon label="" color="currentColor" />}>
							Your work
						</LinkMenuItem>

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
								Recent
							</FlyoutMenuItemTrigger>
							<FlyoutMenuItemContent>
								<AsyncContentItems behavior="skeleton-shorter-than-content" />
							</FlyoutMenuItemContent>
						</FlyoutMenuItem>

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger
								elemBefore={<StarredUnstarredIcon label="" color="currentColor" />}
							>
								Starred
							</FlyoutMenuItemTrigger>
							<FlyoutMenuItemContent>
								<AsyncContentItems behavior="skeleton-longer-than-content" />
							</FlyoutMenuItemContent>
						</FlyoutMenuItem>
					</MenuList>
				</SideNavContent>
				<PanelSplitter label="Resize sidebar" />
			</SideNav>

			<Main id="main-container">{null}</Main>
		</Root>
	);
}
