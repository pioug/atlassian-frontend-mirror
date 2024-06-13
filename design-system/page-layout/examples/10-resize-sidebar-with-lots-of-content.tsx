/** @jsx jsx */
import { type CSSProperties, Fragment, type ReactElement, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import {
	Banner,
	Content,
	LeftPanel,
	LeftSidebar,
	type LeftSidebarState,
	Main,
	PageLayout,
	RightPanel,
	RightSidebar,
	TopNavigation,
} from '../src';

import {
	ExpandLeftSidebarKeyboardShortcut,
	ScrollableContent,
	SlotLabel,
	SlotWrapper,
	Toggle,
	ToggleBox,
} from './common';

type SlotName =
	| 'Banner'
	| 'TopNavigation'
	| 'LeftPanel'
	| 'LeftSidebar'
	| 'Main'
	| 'RightSidebar'
	| 'RightPanel'
	| 'PageLayout';

const initialState = {
	isBannerShown: false,
	isTopNavigationShown: true,
	isLeftPanelShown: false,
	isLeftSidebarShown: true,
	isMainShown: true,
	isRightSidebarShown: false,
	isRightPanelShown: false,
	isBannerFixed: true,
	isTopNavigationFixed: true,
	isLeftPanelFixed: false,
	isLeftPanelScrollable: false,
	isLeftSidebarFixed: true,
	isLeftSidebarScrollable: false,
	isMainScrollable: false,
	isMainExtraWide: false,
	isRightSidebarFixed: false,
	isRightSidebarScrollable: false,
	isRightPanelFixed: false,
	isRightPanelScrollable: false,
	isPageLayoutShown: true,
};

const elementStyles = css({
	display: 'inline-block',
	minWidth: token('space.1000', '0'),
	minHeight: token('space.1000', '0'),
	margin: token('space.025', '0'),
	padding: token('space.100', '0'),
	backgroundColor: 'var(--local-color)',
	font: token('font.heading.small'),
});

const colors = [
	token('color.background.accent.blue.subtler'),
	token('color.background.accent.green.subtler'),
	token('color.background.accent.red.subtler'),
	token('color.background.accent.purple.subtler'),
	token('color.background.accent.green.subtler'),
];

function getElements(): ReactElement[] {
	return Array.from({ length: 20000 }, (_, i) => {
		if (i % 50 === 0) {
			return <h2>Group {i / 50 + 1}</h2>;
		}
		return (
			<span
				css={elementStyles}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				style={{ '--local-color': colors[i % colors.length] } as CSSProperties}
			>
				{i}
			</span>
		);
	});
}

const BasicGrid = () => {
	const [gridState, setGridState] = useState(initialState);

	const ToggleFixed = useCallback(
		({ slotName }: { slotName: SlotName }) => {
			const gridKey = `is${slotName}Fixed` as keyof typeof gridState;
			return (
				<Toggle
					id={`${slotName}--fixed`}
					isChecked={gridState[gridKey]}
					onChange={() => setGridState({ ...gridState, [gridKey]: !gridState[gridKey] })}
				>
					Toggle fixed
				</Toggle>
			);
		},
		[gridState],
	);

	const ToggleScrollable = useCallback(
		({ slotName }: { slotName: SlotName }) => {
			const gridKey = `is${slotName}Scrollable` as keyof typeof gridState;
			return (
				<Fragment>
					<Toggle
						data-toggle-scrollable
						id={`${slotName}--scrollable`}
						isChecked={gridState[gridKey]}
						onChange={() => setGridState({ ...gridState, [gridKey]: !gridState[gridKey] })}
					>
						Toggle scrollable content
					</Toggle>
					{gridState[gridKey] && <ScrollableContent />}
				</Fragment>
			);
		},
		[gridState],
	);

	const ToggleShown = useCallback(
		({ slotName }: { slotName: SlotName }) => {
			const gridKey = `is${slotName}Shown` as keyof typeof gridState;
			return (
				<Toggle
					id={`${slotName}--shown`}
					onChange={() => setGridState({ ...gridState, [gridKey]: !gridState[gridKey] })}
					isChecked={gridState[gridKey] !== initialState[gridKey]}
				>{`${gridState[gridKey] ? 'Unmount' : 'Mount'} ${slotName}`}</Toggle>
			);
		},
		[gridState],
	);

	return (
		<Fragment>
			{gridState.isPageLayoutShown && (
				<PageLayout
					onLeftSidebarExpand={(state: LeftSidebarState) => console.log('onExpand', state)}
					onLeftSidebarCollapse={(state: LeftSidebarState) => console.log('onCollapse', state)}
				>
					{gridState.isBannerShown && (
						<Banner height={60} isFixed={gridState.isBannerFixed}>
							<SlotWrapper borderColor={token('color.border.accent.yellow')}>
								<SlotLabel>Banner</SlotLabel>
								<ToggleFixed slotName="Banner" />
							</SlotWrapper>
						</Banner>
					)}
					{gridState.isTopNavigationShown && (
						<TopNavigation height={60} isFixed={gridState.isTopNavigationFixed}>
							<SlotWrapper borderColor={token('color.border.accent.blue')}>
								<SlotLabel>TopNavigation</SlotLabel>
								<ToggleFixed slotName="TopNavigation" />
							</SlotWrapper>
						</TopNavigation>
					)}
					{gridState.isLeftPanelShown && (
						<LeftPanel isFixed={gridState.isLeftPanelFixed} width={200}>
							<SlotWrapper borderColor={token('color.border.accent.orange')}>
								<SlotLabel>LeftPanel</SlotLabel>
								<ToggleFixed slotName="LeftPanel" />
								<ToggleScrollable slotName="LeftPanel" />
							</SlotWrapper>
						</LeftPanel>
					)}
					<Content testId="content">
						{gridState.isLeftSidebarShown && (
							<LeftSidebar
								testId="left-sidebar"
								id="left-sidebar"
								skipLinkTitle="Current project sidebar"
								isFixed={gridState.isLeftSidebarFixed}
								onResizeStart={(state: LeftSidebarState) => console.log('onResizeStart', state)}
								onResizeEnd={(state: LeftSidebarState) => console.log('onResizeEnd', state)}
								onFlyoutExpand={() => console.log('onFlyoutExpand')}
								onFlyoutCollapse={() => console.log('onFlyoutCollapse')}
								// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
								overrides={{
									ResizeButton: {
										render: (Component, props) => (
											<Tooltip
												content={'Use [ to show or hide the sidebar'}
												hideTooltipOnClick
												position="right"
												testId="tooltip"
											>
												<Component {...props} />
											</Tooltip>
										),
									},
								}}
							>
								<SlotWrapper hasExtraPadding hasHorizontalScrollbar={false}>
									<SlotLabel>LeftSidebar</SlotLabel>
									<ToggleFixed slotName="LeftSidebar" />
									<ToggleScrollable slotName="LeftSidebar" />
								</SlotWrapper>
								<ExpandLeftSidebarKeyboardShortcut />
							</LeftSidebar>
						)}
						{gridState.isMainShown && (
							<Main id="main" skipLinkTitle="Main">
								{getElements()}
							</Main>
						)}
						{gridState.isRightSidebarShown && (
							<RightSidebar isFixed={gridState.isRightSidebarFixed} width={200}>
								<SlotWrapper borderColor={token('color.border.accent.green')}>
									<SlotLabel>RightSidebar</SlotLabel>
									<ToggleFixed slotName="RightSidebar" />
									<ToggleScrollable slotName="RightSidebar" />
								</SlotWrapper>
							</RightSidebar>
						)}
					</Content>
					{gridState.isRightPanelShown && (
						<RightPanel isFixed={gridState.isRightPanelFixed} width={200}>
							<SlotWrapper borderColor={token('color.border.accent.orange')}>
								<SlotLabel>RightPanel</SlotLabel>
								<ToggleFixed slotName="RightPanel" />
								<ToggleScrollable slotName="RightPanel" />
							</SlotWrapper>
						</RightPanel>
					)}
				</PageLayout>
			)}
			<ToggleBox>
				<ToggleShown slotName="Banner" />
				<ToggleShown slotName="TopNavigation" />
				<ToggleShown slotName="LeftPanel" />
				<ToggleShown slotName="LeftSidebar" />
				<ToggleShown slotName="Main" />
				<ToggleShown slotName="RightSidebar" />
				<ToggleShown slotName="RightPanel" />
				<ToggleShown slotName="PageLayout" />
			</ToggleBox>
		</Fragment>
	);
};
export default BasicGrid;
