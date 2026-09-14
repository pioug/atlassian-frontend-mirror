import React from 'react';

import ButtonItem from '@atlaskit/menu/button-item';
import Section from '@atlaskit/menu/section';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Content, LeftSidebar, Main, PageLayout, usePageLayoutResize } from '@atlaskit/page-layout';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Header } from '@atlaskit/side-navigation/header';
import { NavigationHeader } from '@atlaskit/side-navigation/navigation-header';
import { NestableNavigationContent } from '@atlaskit/side-navigation/nestable-navigation-content';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { ExpandLeftSidebarKeyboardShortcut, SlotLabel } from './common';

const SidebarControls = () => {
	const { collapseLeftSidebar } = usePageLayoutResize();
	return <ButtonItem onClick={collapseLeftSidebar}>Collapse</ButtonItem>;
};

const SidebarControllerExample = (): React.JSX.Element => {
	return (
		<PageLayout>
			<Content>
				<LeftSidebar
					width={450}
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
					<SideNavigation label="Project navigation">
						<NavigationHeader>
							<Header description="Sidebar header description">Sidebar Header</Header>
						</NavigationHeader>
						<NestableNavigationContent initialStack={[]}>
							<Section>
								<SidebarControls />
							</Section>
						</NestableNavigationContent>
					</SideNavigation>
					<ExpandLeftSidebarKeyboardShortcut />
				</LeftSidebar>
				<Main>
					<SlotLabel>Main Content</SlotLabel>
				</Main>
			</Content>
		</PageLayout>
	);
};

export default SidebarControllerExample;
