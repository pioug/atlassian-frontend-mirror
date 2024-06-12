import React from 'react';

import { ButtonItem, Section } from '@atlaskit/menu';
import {
	Header,
	NavigationHeader,
	NestableNavigationContent,
	SideNavigation,
} from '@atlaskit/side-navigation';
import Tooltip from '@atlaskit/tooltip';

import { Content, LeftSidebar, Main, PageLayout, usePageLayoutResize } from '../src';

import { ExpandLeftSidebarKeyboardShortcut, SlotLabel } from './common';

const SidebarControls = () => {
	const { collapseLeftSidebar } = usePageLayoutResize();
	return <ButtonItem onClick={collapseLeftSidebar}>Collapse</ButtonItem>;
};

const SidebarControllerExample = () => {
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
