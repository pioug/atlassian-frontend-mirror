/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Content, LeftSidebar, Main, PageLayout } from '@atlaskit/page-layout';
import { Header, NavigationHeader, SideNavigation } from '@atlaskit/side-navigation';

import { ExpandLeftSidebarKeyboardShortcut, SlotLabel } from '../common';

export default () => {
	return (
		<PageLayout>
			<Content>
				<LeftSidebar width={450} testId="left-sidebar">
					<ExpandLeftSidebarKeyboardShortcut />

					<SideNavigation label="Project navigation" testId="side-navigation">
						<NavigationHeader>
							<Header description="Sidebar header description">Sidebar Header</Header>
						</NavigationHeader>
					</SideNavigation>
				</LeftSidebar>

				<Main>
					<SlotLabel>Main Content</SlotLabel>
				</Main>
			</Content>
		</PageLayout>
	);
};
