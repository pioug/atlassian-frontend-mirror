/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo, useReducer } from 'react';

import { cssMap, jsx } from '@compiled/react';

import AKBanner from '@atlaskit/banner';
import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import HomeIcon from '@atlaskit/icon/core/home';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import BoardIcon from '@atlaskit/icon/glyph/board';
import { MenuList } from '@atlaskit/navigation-system';
import { Aside } from '@atlaskit/navigation-system/layout/aside';
import { Banner } from '@atlaskit/navigation-system/layout/banner';
import {
	Main,
	MainStickyHeader,
	UNSAFE_MAIN_BLOCK_START_FOR_LEGACY_PAGES_ONLY,
	UNSAFE_MAIN_INLINE_END_FOR_LEGACY_PAGES_ONLY,
	UNSAFE_MAIN_INLINE_START_FOR_LEGACY_PAGES_ONLY,
} from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavEnd, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuListItem } from '@atlaskit/navigation-system/side-nav-items/menu-list-item';
import { Help } from '@atlaskit/navigation-system/top-nav-items';
import {
	BANNER_HEIGHT,
	LEFT_PANEL_WIDTH,
	LEFT_SIDEBAR_WIDTH,
	RIGHT_PANEL_WIDTH,
	RIGHT_SIDEBAR_WIDTH,
	TOP_NAVIGATION_HEIGHT,
} from '@atlaskit/page-layout';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline } from '@atlaskit/primitives';
import { Hide } from '@atlaskit/primitives/responsive';
import { token, useThemeObserver } from '@atlaskit/tokens';

const styles = cssMap({
	debugSlots: {
		// We use these styling standard unsafe styles to debug the page layout slots and ensure
		// none of them are overlapping each other, as well as they take up the expected space.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> * > *': {
			opacity: 0.7,
		},
	},
	root: {
		height: '100rem',
	},
	sticky: {
		position: 'sticky',
		insetBlockStart: token('space.150', '12px'),
	},
	legacyPositionedSibling: {
		position: 'absolute',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		insetBlockStart: `calc(${BANNER_HEIGHT} + ${TOP_NAVIGATION_HEIGHT})`,
		insetBlockEnd: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		insetInlineStart: `calc(${LEFT_PANEL_WIDTH} + ${LEFT_SIDEBAR_WIDTH})`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		insetInlineEnd: `calc(${RIGHT_PANEL_WIDTH} + ${RIGHT_SIDEBAR_WIDTH})`,
		backgroundColor: token('color.background.neutral', ''),
		overflow: 'auto',
	},
	dangerouslyPositionedSibling: {
		position: 'absolute',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		insetBlockStart: UNSAFE_MAIN_BLOCK_START_FOR_LEGACY_PAGES_ONLY,
		insetBlockEnd: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		insetInlineStart: UNSAFE_MAIN_INLINE_START_FOR_LEGACY_PAGES_ONLY,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		insetInlineEnd: UNSAFE_MAIN_INLINE_END_FOR_LEGACY_PAGES_ONLY,
		backgroundColor: token('color.background.neutral', ''),
		overflow: 'auto',
	},
	main: {
		backgroundColor: token('color.background.accent.blue.subtle', ''),
	},
	aside: {
		backgroundColor: token('color.background.accent.orange.subtle', ''),
	},
	banner: {
		backgroundColor: token('color.background.accent.lime.subtle', ''),
	},
	panel: {
		backgroundColor: token('elevation.surface'),
	},
	topBar: {
		backgroundColor: token('color.background.accent.purple.subtle', ''),
	},
	wide: {
		width: '1000px',
	},
	noShrink: {
		whiteSpace: 'nowrap',
	},
});

function ScrollableContent({ children }: { children: React.ReactNode }) {
	return (
		<Box
			xcss={styles.root}
			/**
			 * Resolves a11y scanner warnings about scrollable region not being focusable.
			 * Realistic usage would have real focusable content, such as in the composition examples.
			 * Taking a shortcut here because these examples are for VRs and not meant to be realistic content.
			 */
			tabIndex={0}
		>
			{children}
		</Box>
	);
}

function BoardMenuItem() {
	return (
		<Inline space="space.050" alignBlock="center">
			<BoardIcon label="" />
			<span>Boards</span>
		</Inline>
	);
}

function BannerToggleAction({
	isSelected,
	onClick,
	label,
}: {
	isSelected?: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	label?: string;
}) {
	return (
		<Hide below="sm">
			<MenuListItem>
				<IconButton
					icon={StatusWarningIcon}
					label={label}
					onClick={onClick}
					isSelected={isSelected}
				/>
			</MenuListItem>
		</Hide>
	);
}

export const AllSlots = () => {
	const [bannerShown, toggleBanner] = useReducer((state) => !state, true);
	const [panelShown, togglePanel] = useReducer((state) => !state, true);

	return (
		<div css={styles.debugSlots}>
			<Root>
				{bannerShown && (
					<Banner xcss={styles.banner}>
						<AKBanner appearance="announcement">Great news! A new layout system.</AKBanner>
					</Banner>
				)}
				<TopNav xcss={styles.topBar}>
					<TopNavStart>
						<SideNavToggleButton
							defaultCollapsed
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
						/>
						<span css={styles.noShrink}>top nav</span>
					</TopNavStart>
					<TopNavEnd>
						<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
						<BannerToggleAction
							onClick={toggleBanner}
							isSelected={bannerShown}
							label="Toggle banner"
						/>
					</TopNavEnd>
				</TopNav>
				<SideNav defaultCollapsed>
					<SideNavContent>
						<BoardMenuItem />
					</SideNavContent>
					<PanelSplitter label="Resize side nav" />
				</SideNav>
				<Main xcss={styles.main}>main content</Main>
				<Aside xcss={styles.aside}>
					aside
					<PanelSplitter label="Resize aside" />
				</Aside>
				{panelShown && (
					<Panel xcss={styles.panel}>
						panel
						<PanelSplitter label="Resize panel" />
					</Panel>
				)}
			</Root>
		</div>
	);
};

export const AllSlotsScrollable = () => {
	const [bannerShown, toggleBanner] = useReducer((state) => !state, true);
	const [panelShown, togglePanel] = useReducer((state) => !state, false);

	return (
		<Root>
			{bannerShown && (
				<Banner xcss={styles.banner}>
					<AKBanner appearance="announcement">Great news! A new layout system.</AKBanner>
				</Banner>
			)}
			<TopNav xcss={styles.topBar}>
				<TopNavStart>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					<span css={styles.noShrink}>top nav</span>
				</TopNavStart>
				<TopNavEnd>
					<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
					<BannerToggleAction
						onClick={toggleBanner}
						isSelected={bannerShown}
						label="Toggle banner"
					/>
				</TopNavEnd>
			</TopNav>
			<SideNav>
				<SideNavContent>
					<ScrollableContent>
						<div css={styles.sticky}>sticky in sticky</div>
						<BoardMenuItem />
						<BoardMenuItem />
						<BoardMenuItem />
						<BoardMenuItem />
					</ScrollableContent>
				</SideNavContent>
				<PanelSplitter label="Resize side nav" />
			</SideNav>
			<Main xcss={styles.main} testId="main">
				<MainStickyHeader>sticky header</MainStickyHeader>
				<ScrollableContent>main content</ScrollableContent>
			</Main>
			<Aside xcss={styles.aside} testId="aside">
				<ScrollableContent>
					aside
					<div css={styles.sticky}>sticky in sticky</div>
				</ScrollableContent>
				<PanelSplitter label="Resize aside" />
			</Aside>
			{panelShown && (
				<Panel xcss={styles.panel}>
					<ScrollableContent>panel</ScrollableContent>
					<PanelSplitter label="Resize panel" />
				</Panel>
			)}
		</Root>
	);
};

export const AllSlotsRTL = () => {
	const [panelShown, togglePanel] = useReducer((state) => !state, false);

	return (
		<div dir="rtl">
			<Root>
				<Banner xcss={styles.banner}>
					<AKBanner appearance="error">An error occurred</AKBanner>
				</Banner>
				<TopNav xcss={styles.topBar}>
					<TopNavStart>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						<span css={styles.noShrink}>top nav</span>
					</TopNavStart>
					<TopNavEnd>
						<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
					</TopNavEnd>
				</TopNav>
				<SideNav>
					<SideNavContent>side nav</SideNavContent>
				</SideNav>
				<Main xcss={styles.main}>main content</Main>
				<Aside xcss={styles.aside}>aside</Aside>
				{panelShown && <Panel xcss={styles.panel}>panel</Panel>}
			</Root>
		</div>
	);
};

export const TopBarSideNavMainAside = () => (
	<Root>
		<TopNav xcss={styles.topBar}>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				<span css={styles.noShrink}>top nav</span>
			</TopNavStart>
		</TopNav>
		<SideNav>
			<SideNavContent>side nav</SideNavContent>
		</SideNav>
		<Main xcss={styles.main}>main content</Main>
		<Aside xcss={styles.aside}>aside</Aside>
	</Root>
);

export const TopBarSideNavMainAsideScrollable = () => (
	<Root>
		<TopNav xcss={styles.topBar}>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				<span css={styles.noShrink}>top nav</span>
			</TopNavStart>
		</TopNav>
		<SideNav>
			<SideNavContent>
				<ScrollableContent>side nav</ScrollableContent>
			</SideNavContent>
		</SideNav>
		<Main xcss={styles.main}>
			<ScrollableContent>main content</ScrollableContent>
		</Main>
		<Aside xcss={styles.aside}>
			<ScrollableContent>aside</ScrollableContent>
		</Aside>
	</Root>
);

export const TopBarSideNavMain = () => (
	<Root>
		<TopNav xcss={styles.topBar}>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				<span css={styles.noShrink}>top nav</span>
			</TopNavStart>
		</TopNav>
		<SideNav>
			<SideNavContent>side nav</SideNavContent>
		</SideNav>
		<Main xcss={styles.main}>main content</Main>
	</Root>
);

export const TopBarSideNavMainScrollable = () => (
	<Root>
		<TopNav xcss={styles.topBar}>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				<span css={styles.noShrink}>top nav</span>
			</TopNavStart>
		</TopNav>
		<SideNav>
			<SideNavContent>
				<ScrollableContent>side nav</ScrollableContent>
			</SideNavContent>
		</SideNav>
		<Main xcss={styles.main}>
			<ScrollableContent>main content</ScrollableContent>
		</Main>
	</Root>
);

export const SideNavMainAside = () => (
	<Root>
		<SideNav>
			<SideNavContent>side nav</SideNavContent>
		</SideNav>
		<Main xcss={styles.main}>main content</Main>
		<Aside xcss={styles.aside}>aside</Aside>
	</Root>
);

export const SideNavMainAsideScrollable = () => (
	<Root>
		<SideNav>
			<SideNavContent>
				<ScrollableContent>side nav</ScrollableContent>
			</SideNavContent>
		</SideNav>
		<Main xcss={styles.main}>
			<ScrollableContent>main content</ScrollableContent>
		</Main>
		<Aside xcss={styles.aside}>
			<ScrollableContent>aside</ScrollableContent>
		</Aside>
	</Root>
);

export const MainAside = () => (
	<Root>
		<Main xcss={styles.main}>main content</Main>
		<Aside xcss={styles.aside}>aside</Aside>
	</Root>
);

export const MainAsideScrollable = () => (
	<Root>
		<Main xcss={styles.main}>
			<ScrollableContent>main content</ScrollableContent>
		</Main>
		<Aside xcss={styles.aside}>
			<ScrollableContent>aside</ScrollableContent>
		</Aside>
	</Root>
);

export const Resizable = () => (
	<Root>
		<TopNav xcss={styles.topBar}>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				<span css={styles.noShrink}>top nav</span>
			</TopNavStart>
		</TopNav>
		<SideNav>
			<SideNavContent>
				side nav
				<PanelSplitter label="Resize side nav" />
			</SideNavContent>
		</SideNav>
		<Main xcss={styles.main}>main content</Main>
	</Root>
);

export const ResizableRTL = () => (
	<div dir="rtl">
		<Root>
			<TopNav xcss={styles.topBar}>
				<TopNavStart>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					<span css={styles.noShrink}>top nav</span>
				</TopNavStart>
			</TopNav>
			<SideNav>
				<SideNavContent>
					side nav
					<PanelSplitter label="Resize side nav" />
				</SideNavContent>
			</SideNav>
			<Main xcss={styles.main}>main content</Main>
			<Aside xcss={styles.aside}>
				aside
				<PanelSplitter label="Resize aside" />
			</Aside>
		</Root>
	</div>
);

export const SideNavCustomWidthGreaterThanMaxWidth = () => (
	<Root>
		<TopNav xcss={styles.topBar}>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				<span css={styles.noShrink}>top nav</span>
			</TopNavStart>
		</TopNav>
		<SideNav defaultWidth={1800}>
			side nav
			<PanelSplitter label="Resize side nav" />
		</SideNav>
		<Main xcss={styles.main}>main content</Main>
	</Root>
);

export const SideNavCustomWidthSmallerThanMinWidth = () => (
	<Root>
		<TopNav xcss={styles.topBar}>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				<span css={styles.noShrink}>top nav</span>
			</TopNavStart>
		</TopNav>
		<SideNav defaultWidth={2}>
			side nav
			<PanelSplitter label="Resize side nav" />
		</SideNav>
		<Main xcss={styles.main}>main content</Main>
	</Root>
);

export const SideNavOverflowingChildren = () => (
	<Root>
		<TopNav xcss={styles.topBar}>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				<span css={styles.noShrink}>top nav</span>
			</TopNavStart>
		</TopNav>
		<SideNav>
			<SideNavContent>
				<div
					css={styles.wide}
					/**
					 * Resolves a11y scanner warnings about scrollable region not being focusable.
					 * Realistic usage would have real focusable content, such as in the composition examples.
					 * Taking a shortcut here because these examples are for VRs and not meant to be realistic content.
					 */
					// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
					tabIndex={0}
				>
					side nav
				</div>
				<PanelSplitter label="Resize side nav" />
			</SideNavContent>
		</SideNav>
		<Main xcss={styles.main}>main content</Main>
	</Root>
);

export const EdgeCaseSiblingAbsolutePositioned = () => {
	const [panelShown, togglePanel] = useReducer((state) => !state, false);

	return (
		<div css={styles.debugSlots}>
			<Root UNSAFE_dangerouslyHoistSlotSizes>
				<TopNav xcss={styles.topBar}>
					<TopNavStart>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						<span css={styles.noShrink}>top nav</span>
					</TopNavStart>
					<TopNavEnd>
						<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
					</TopNavEnd>
				</TopNav>
				<SideNav>
					<SideNavContent>side nav</SideNavContent>
				</SideNav>
				<Aside xcss={styles.aside}>aside</Aside>
				{panelShown && <Panel xcss={styles.panel}>panel</Panel>}
			</Root>
			<div css={[styles.dangerouslyPositionedSibling, styles.main]}>
				<MainStickyHeader>sticky content</MainStickyHeader>
				<ScrollableContent>Sibling element for the Confluence monolith use case</ScrollableContent>
			</div>
		</div>
	);
};

export const EdgeCaseSiblingAbsolutePositionedCollapsed = () => (
	<div css={styles.debugSlots}>
		<Root UNSAFE_dangerouslyHoistSlotSizes>
			<Banner xcss={styles.banner}>banner</Banner>
			<TopNav xcss={styles.topBar}>
				<TopNavStart>
					<SideNavToggleButton
						collapseLabel="Collapse sidebar"
						expandLabel="Expand sidebar"
						defaultCollapsed
					/>
					<span css={styles.noShrink}>top nav</span>
				</TopNavStart>
			</TopNav>
			<SideNav defaultCollapsed>
				<SideNavContent>side nav</SideNavContent>
			</SideNav>
			<Aside xcss={styles.aside}>aside</Aside>
		</Root>
		<div css={[styles.dangerouslyPositionedSibling, styles.main]}>
			<ScrollableContent>Sibling element for the Confluence monolith use case</ScrollableContent>
		</div>
	</div>
);

export const EdgeCaseSiblingAbsolutePositionedPanelVisible = () => {
	const [panelShown, togglePanel] = useReducer((state) => !state, true);

	return (
		<div css={styles.debugSlots}>
			<Root UNSAFE_dangerouslyHoistSlotSizes>
				<TopNav xcss={styles.topBar}>
					<TopNavStart>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						<span css={styles.noShrink}>top nav</span>
					</TopNavStart>
					<TopNavEnd>
						<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
					</TopNavEnd>
				</TopNav>
				<SideNav>
					<SideNavContent>side nav</SideNavContent>
				</SideNav>
				<Aside xcss={styles.aside}>aside</Aside>
				{panelShown && <Panel xcss={styles.panel}>panel</Panel>}
			</Root>
			<div css={[styles.dangerouslyPositionedSibling, styles.main]}>
				<ScrollableContent>Sibling element for the Confluence monolith use case</ScrollableContent>
			</div>
		</div>
	);
};

export const EdgeCaseUsingLegacyVars = () => {
	const [panelShown, togglePanel] = useReducer((state) => !state, false);

	return (
		<div css={styles.debugSlots}>
			<Root UNSAFE_dangerouslyHoistSlotSizes>
				<Banner xcss={styles.banner}>banner</Banner>
				<TopNav xcss={styles.topBar}>
					<TopNavStart>
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							defaultCollapsed
						/>
						<span css={styles.noShrink}>top nav</span>
					</TopNavStart>
					<TopNavEnd>
						<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
					</TopNavEnd>
				</TopNav>
				<SideNav defaultCollapsed>
					<SideNavContent>side nav</SideNavContent>
				</SideNav>
				<Aside xcss={styles.aside}>aside</Aside>
				{panelShown && <Panel xcss={styles.panel}>panel</Panel>}
			</Root>
			<div css={[styles.legacyPositionedSibling, styles.main]}>
				<ScrollableContent>Sibling element for the Confluence monolith use case</ScrollableContent>
			</div>
		</div>
	);
};

export const EdgeCaseSiblingAbsolutePositionedResizable = () => {
	const [panelShown, togglePanel] = useReducer((state) => !state, false);

	return (
		<div css={styles.debugSlots}>
			<Root UNSAFE_dangerouslyHoistSlotSizes>
				<TopNav xcss={styles.topBar}>
					<TopNavStart>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						<span css={styles.noShrink}>top nav</span>
					</TopNavStart>
					<TopNavEnd>
						<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
					</TopNavEnd>
				</TopNav>
				<SideNav>
					<SideNavContent>
						side nav
						<PanelSplitter label="Resize side nav" />
					</SideNavContent>
				</SideNav>
				<Aside xcss={styles.aside}>
					aside
					<PanelSplitter label="Resize aside" />
				</Aside>
				{panelShown && (
					<Panel>
						panel
						<PanelSplitter label="Resize panel" />
					</Panel>
				)}
			</Root>
			<div css={[styles.dangerouslyPositionedSibling, styles.main]}>
				<ScrollableContent>Sibling element for the Confluence monolith use case</ScrollableContent>
			</div>
		</div>
	);
};

const iframeStyles = cssMap({
	root: {
		height: '100%',
		width: '100%',
	},
});

export const ResizableWithIframeContent = () => {
	const [panelShown, togglePanel] = useReducer((state) => !state, false);
	const theme = useThemeObserver();
	const iframeSrc: string = useMemo(() => {
		if (typeof window === 'undefined') {
			return '';
		}

		const url = new URL('/examples.html', window.location.origin);
		url.searchParams.set('groupId', 'design-system');
		url.searchParams.set('packageId', 'navigation-system');
		url.searchParams.set('exampleId', 'stand-alone-iframe');
		if (theme.colorMode) {
			url.searchParams.set('mode', theme.colorMode);
		}

		return url.href;
	}, [theme.colorMode]);

	return (
		<div css={styles.debugSlots}>
			<Root UNSAFE_dangerouslyHoistSlotSizes>
				<TopNav xcss={styles.topBar}>
					<TopNavStart>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						<span css={styles.noShrink}>top nav</span>
					</TopNavStart>
					<TopNavEnd>
						<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
					</TopNavEnd>
				</TopNav>
				<SideNav>
					{/* Not using <SideNavContent> so the iframe can take up the full size */}
					<Box xcss={iframeStyles.root} as="iframe" title="iframe" src={iframeSrc} />
					<PanelSplitter label="Resize side nav" />
				</SideNav>
				<Main xcss={styles.main}>
					<Box xcss={iframeStyles.root} as="iframe" title="iframe" src={iframeSrc} />
				</Main>
				<Aside xcss={styles.aside}>
					<Box xcss={iframeStyles.root} as="iframe" title="iframe" src={iframeSrc} />
					<PanelSplitter label="Resize aside" />
				</Aside>
				{panelShown && (
					<Panel>
						panel
						<PanelSplitter label="Resize panel" />
					</Panel>
				)}
			</Root>
		</div>
	);
};

export const AllSlotsBannerHeightZero = () => {
	const [bannerShown, toggleBanner] = useReducer((state) => !state, true);
	const [panelShown, togglePanel] = useReducer((state) => !state, true);

	return (
		<Root>
			{bannerShown && (
				<Banner xcss={styles.banner} height={0}>
					<AKBanner appearance="announcement">Great news! A new layout system.</AKBanner>
				</Banner>
			)}
			<TopNav xcss={styles.topBar}>
				<TopNavStart>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					<span css={styles.noShrink}>top nav</span>
				</TopNavStart>
				<TopNavEnd>
					<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
					<BannerToggleAction
						onClick={toggleBanner}
						isSelected={bannerShown}
						label="Toggle banner"
					/>
				</TopNavEnd>
			</TopNav>
			<SideNav>
				<SideNavContent>
					<ScrollableContent>
						<div css={styles.sticky}>sticky in sticky</div>
						<BoardMenuItem />
						<BoardMenuItem />
						<BoardMenuItem />
						<BoardMenuItem />
					</ScrollableContent>
				</SideNavContent>
			</SideNav>
			<Main xcss={styles.main}>
				<ScrollableContent>main content</ScrollableContent>
			</Main>
			<Aside xcss={styles.aside}>
				<ScrollableContent>
					aside
					<div css={styles.sticky}>sticky in sticky</div>
				</ScrollableContent>
			</Aside>
			{panelShown && (
				<Panel xcss={styles.panel}>
					<ScrollableContent>panel</ScrollableContent>
				</Panel>
			)}
		</Root>
	);
};

export const AllSlotsCustomSizes = () => {
	const [bannerShown, toggleBanner] = useReducer((state) => !state, true);
	const [panelShown, togglePanel] = useReducer((state) => !state, true);

	return (
		<Root>
			{bannerShown && (
				<Banner xcss={styles.banner} height={90}>
					<AKBanner appearance="announcement">Great news! A new layout system.</AKBanner>
				</Banner>
			)}
			<TopNav xcss={styles.topBar} height={40}>
				<TopNavStart>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					<span css={styles.noShrink}>top nav</span>
				</TopNavStart>
				<TopNavEnd>
					<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
					<BannerToggleAction
						onClick={toggleBanner}
						isSelected={bannerShown}
						label="Toggle banner"
					/>
				</TopNavEnd>
			</TopNav>
			<SideNav defaultWidth={250}>
				<SideNavContent>
					<ScrollableContent>
						<div css={styles.sticky}>sticky in sticky</div>
						<BoardMenuItem />
						<BoardMenuItem />
						<BoardMenuItem />
						<BoardMenuItem />
					</ScrollableContent>
				</SideNavContent>
			</SideNav>
			<Main xcss={styles.main}>
				<ScrollableContent>main content</ScrollableContent>
			</Main>
			<Aside xcss={styles.aside} defaultWidth={195}>
				<ScrollableContent>
					aside
					<div css={styles.sticky}>sticky in sticky</div>
				</ScrollableContent>
			</Aside>
			{panelShown && (
				<Panel xcss={styles.panel} defaultWidth={140}>
					<ScrollableContent>panel</ScrollableContent>
				</Panel>
			)}
		</Root>
	);
};

export const EdgeCaseSiblingAbsolutePositionedCustomSizes = () => {
	const [bannerShown, toggleBanner] = useReducer((state) => !state, true);
	const [panelShown, togglePanel] = useReducer((state) => !state, true);

	return (
		<div css={styles.debugSlots}>
			<Root UNSAFE_dangerouslyHoistSlotSizes>
				{bannerShown && (
					<Banner xcss={styles.banner} height={90}>
						<AKBanner appearance="announcement">Great news! A new layout system.</AKBanner>
					</Banner>
				)}
				<TopNav xcss={styles.topBar} height={40}>
					<TopNavStart>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						<span css={styles.noShrink}>top nav</span>
					</TopNavStart>
					<TopNavEnd>
						<Help isSelected={panelShown} onClick={togglePanel} label="Help" />
						<BannerToggleAction
							onClick={toggleBanner}
							isSelected={bannerShown}
							label="Toggle banner"
						/>
					</TopNavEnd>
				</TopNav>
				<SideNav defaultWidth={250}>
					<SideNavContent>side nav</SideNavContent>
				</SideNav>
				<Aside xcss={styles.aside} defaultWidth={195}>
					aside
				</Aside>
				{panelShown && (
					<Panel xcss={styles.panel} defaultWidth={140}>
						panel
					</Panel>
				)}
			</Root>
			<div css={[styles.dangerouslyPositionedSibling, styles.main]}>
				<ScrollableContent>Sibling element for the Confluence monolith use case</ScrollableContent>
			</div>
		</div>
	);
};

const actions = [
	<IconButton
		key="add"
		label="Add"
		icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
		appearance="subtle"
		spacing="compact"
	/>,
	<IconButton
		key="more"
		label="More"
		icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
		appearance="subtle"
		spacing="compact"
	/>,
];
const homeIcon = <HomeIcon label="" color="currentColor" spacing="spacious" />;

export const SideNavWithMenuItems = () => (
	<Root>
		<TopNav xcss={styles.topBar}>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				<span css={styles.noShrink}>top nav</span>
			</TopNavStart>
		</TopNav>
		<SideNav>
			<SideNavContent>
				<MenuList>
					<ButtonMenuItem elemBefore={homeIcon} actions={actions}>
						Button menu item
					</ButtonMenuItem>
					<LinkMenuItem href="#" elemBefore={homeIcon} actionsOnHover={actions}>
						Link menu item
					</LinkMenuItem>
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Flyout Menu Item</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Menu Button 1</ButtonMenuItem>
							<ButtonMenuItem>Menu Button 2</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				</MenuList>
			</SideNavContent>
		</SideNav>
		<Main xcss={styles.main}>main content</Main>
	</Root>
);
