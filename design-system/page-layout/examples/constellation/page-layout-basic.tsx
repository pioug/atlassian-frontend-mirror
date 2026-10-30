/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';

import { Banner } from '@atlaskit/page-layout/banner-slot';
import { Content } from '@atlaskit/page-layout/content';
import { LeftSidebarWithoutResize } from '@atlaskit/page-layout/left-sidebar-without-resize';
import { Main } from '@atlaskit/page-layout/main';
import { PageLayout } from '@atlaskit/page-layout/page-layout';
import { RightPanel } from '@atlaskit/page-layout/right-panel';
import { TopNavigation } from '@atlaskit/page-layout/top-navigation';
import { token } from '@atlaskit/tokens';

import { SlotLabel, SlotWrapper } from '../common';

const BasicGrid = (): jsx.JSX.Element => {
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
					id="app-navigation"
					skipLinkTitle="App Navigation"
					height={60}
					isFixed={false}
				>
					<SlotWrapper borderColor={token('color.border.accent.blue')}>
						<SlotLabel>App Navigation</SlotLabel>
					</SlotWrapper>
				</TopNavigation>
			}
			<Content testId="content">
				{
					<LeftSidebarWithoutResize
						testId="leftSidebar"
						id="space-navigation"
						skipLinkTitle="Project Navigation"
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
