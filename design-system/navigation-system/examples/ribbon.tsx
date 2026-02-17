/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useCallback, useLayoutEffect, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { createPortal } from 'react-dom';

import HomeIcon from '@atlaskit/icon/core/home';
import { CustomerServiceManagementIcon } from '@atlaskit/logo';
import { UNSAFE_Ribbon as Ribbon } from '@atlaskit/navigation-system/experimental/ribbon';
import {
	Main,
	UNSAFE_MAIN_BLOCK_START_FOR_LEGACY_PAGES_ONLY,
	UNSAFE_MAIN_INLINE_START_FOR_LEGACY_PAGES_ONLY,
} from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Help,
	Profile,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Show, Text, UNSAFE_useMediaQuery } from '@atlaskit/primitives/compiled';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockRibbon } from './utils/mock-ribbon';
import { MockSearch } from './utils/mock-search';

const fixedHeaderStyles = cssMap({
	root: {
		position: 'fixed',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: UNSAFE_MAIN_BLOCK_START_FOR_LEGACY_PAGES_ONLY,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetInlineStart: UNSAFE_MAIN_INLINE_START_FOR_LEGACY_PAGES_ONLY,
		insetInlineEnd: 0,
		height: 64,
		borderBlockEndColor: token('color.border'),
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		backgroundColor: token('elevation.surface'),
		display: 'flex',
		alignItems: 'center',
		paddingInline: token('space.200'),
		color: token('color.text.subtle'),
		gap: token('space.075'),
		boxSizing: 'border-box',
	},
});

const sideNavStyles = cssMap({
	root: {
		display: 'flex',
		height: '100%',
	},
});

const MaybePortal = ({
	children,
	target,
	isSideNavExpandedOnDesktop,
}: {
	children: React.ReactNode;
	target: HTMLElement | null;
	isSideNavExpandedOnDesktop: boolean;
}) => {
	const [isDesktop, setIsDesktop] = useState(true);

	UNSAFE_useMediaQuery('above.md', (event) => {
		setIsDesktop(event.matches);
	});

	useLayoutEffect(() => {
		setIsDesktop(window.matchMedia('(min-width: 64rem)').matches);
	}, []);

	if (!target) {
		return children;
	}

	if (isDesktop && isSideNavExpandedOnDesktop) {
		return children;
	}

	return createPortal(children, target);
};

function MockRibbonWithPortal({
	sideNavPortalTarget,
	isSideNavExpandedOnDesktop,
}: {
	sideNavPortalTarget: HTMLElement | null;
	isSideNavExpandedOnDesktop: boolean;
}) {
	return (
		<MaybePortal
			target={sideNavPortalTarget}
			isSideNavExpandedOnDesktop={isSideNavExpandedOnDesktop}
		>
			<MockRibbon />
		</MaybePortal>
	);
}

export default function RibbonExample(): React.JSX.Element {
	const [sideNavPortalTarget, setSideNavPortalTarget] = useState<HTMLDivElement | null>(null);

	const [ribbonWidth, setRibbonWidth] = useState('4rem');

	const [isSideNavExpandedOnDesktop, setIsSideNavExpandedOnDesktop] = useState(true);

	const onSideNavCollapse = useCallback(({ screen }: { screen: 'mobile' | 'desktop' }) => {
		if (screen === 'desktop') {
			setRibbonWidth('0px');
			setIsSideNavExpandedOnDesktop(false);
		}
	}, []);

	const onSideNavExpand = useCallback(({ screen }: { screen: 'mobile' | 'desktop' }) => {
		if (screen === 'desktop') {
			setRibbonWidth('4rem');
			setIsSideNavExpandedOnDesktop(true);
		}
	}, []);

	return (
		<WithResponsiveViewport>
			<Root UNSAFE_dangerouslyHoistSlotSizes defaultSideNavCollapsed={!isSideNavExpandedOnDesktop}>
				<Ribbon width={ribbonWidth}>
					<MockRibbonWithPortal
						isSideNavExpandedOnDesktop={isSideNavExpandedOnDesktop}
						sideNavPortalTarget={sideNavPortalTarget}
					/>
				</Ribbon>
				<TopNav>
					<TopNavStart
						sideNavToggleButton={
							<SideNavToggleButton
								testId="side-nav-toggle-button"
								collapseLabel="Collapse sidebar"
								expandLabel="Expand sidebar"
							/>
						}
					>
						<Show below="md">
							<AppSwitcher label="Switch apps" />
						</Show>
						<AppLogo
							href=""
							icon={CustomerServiceManagementIcon}
							name="Customer Service Management"
							label="Home page"
						/>
					</TopNavStart>
					<TopNavMiddle>
						<MockSearch />
						<CreateButton>Create</CreateButton>
					</TopNavMiddle>
					<TopNavEnd>
						<Help label="Help" />
						<Settings label="Settings" />
						<Profile label="Profile" />
					</TopNavEnd>
				</TopNav>
				<SideNav onExpand={onSideNavExpand} onCollapse={onSideNavCollapse}>
					<div css={sideNavStyles.root}>
						{/**
						 * Allows the ribbon to be rendered in the side nav when:
						 * - on mobile
						 * - the side nav is collapsed on desktop
						 */}
						<div ref={setSideNavPortalTarget} />
						<SideNavContent>
							<MenuList>
								<ButtonMenuItem elemBefore={<HomeIcon label="Home" />}>Hello world</ButtonMenuItem>
							</MenuList>
						</SideNavContent>
					</div>
				</SideNav>
				<Main>
					<div css={fixedHeaderStyles.root}>
						<Text size="medium" weight="medium">
							Header using legacy CSS variables for fixed positioning
						</Text>
					</div>
				</Main>
			</Root>
		</WithResponsiveViewport>
	);
}
