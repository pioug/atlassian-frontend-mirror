/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
	Banner,
	Content,
	LeftSidebarWithoutResize,
	Main,
	PageLayout,
	RightPanel,
	TopNavigation,
} from '../src';

import { SlotLabel, SlotWrapper } from './common';

const BasicGrid = () => {
	return (
		<PageLayout>
			{
				<Banner testId="banner" id="banner" skipLinkTitle="Banner" height={60} isFixed={false}>
					<SlotWrapper borderColor={token('color.border.accent.yellow')}>
						<SlotLabel>Banner</SlotLabel>
					</SlotWrapper>
				</Banner>
			}
			{
				<TopNavigation
					testId="topNavigation"
					id="product-navigation"
					skipLinkTitle="Product Navigation"
					height={60}
					isFixed={false}
				>
					<SlotWrapper borderColor={token('color.border.accent.blue')}>
						<SlotLabel>Product Navigation</SlotLabel>
					</SlotWrapper>
				</TopNavigation>
			}
			<Content testId="content">
				{
					<LeftSidebarWithoutResize
						testId="leftSidebar"
						id="space-navigation"
						skipLinkTitle="Space Navigation"
						isFixed={false}
						width={125}
					>
						<SlotWrapper borderColor={token('color.border.accent.green')} hasExtraPadding>
							<SlotLabel isSmall>Space Navigation</SlotLabel>
						</SlotWrapper>
					</LeftSidebarWithoutResize>
				}
				{
					<Main testId="main" id="main" skipLinkTitle="Main Content">
						<SlotWrapper borderColor={token('color.border')} minHeight={400}>
							<SlotLabel isSmall>Main Content</SlotLabel>
							<p>Visit the first focusable element on the page to see the skip links menu</p>
						</SlotWrapper>
					</Main>
				}
			</Content>
			{
				<RightPanel
					testId="rightPanel"
					id="help-panel"
					skipLinkTitle="Help Panel"
					isFixed={false}
					width={125}
				>
					<SlotWrapper borderColor={token('color.border.accent.orange')}>
						<SlotLabel>Help Panel</SlotLabel>
					</SlotWrapper>
				</RightPanel>
			}
		</PageLayout>
	);
};

export default BasicGrid;
