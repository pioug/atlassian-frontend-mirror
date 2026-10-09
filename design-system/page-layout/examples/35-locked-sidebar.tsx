/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import IconButton from '@atlaskit/button/icon/button';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import ButtonItem from '@atlaskit/menu/button-item';
import CustomItem from '@atlaskit/menu/custom-item';
import PopupMenuGroup from '@atlaskit/menu/popup-menu-group';
import Section from '@atlaskit/menu/section';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Content } from '@atlaskit/page-layout/content';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { LeftSidebar } from '@atlaskit/page-layout/left-sidebar';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Main } from '@atlaskit/page-layout/main';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { PageLayout } from '@atlaskit/page-layout/page-layout';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { RightSidebar } from '@atlaskit/page-layout/right-sidebar';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { useLeftSidebarFlyoutLock } from '@atlaskit/page-layout/sidebar-resize-context';
import { Popup } from '@atlaskit/popup/popup';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Header } from '@atlaskit/side-navigation/header';
import { NavigationHeader } from '@atlaskit/side-navigation/navigation-header';
import { NestableNavigationContent } from '@atlaskit/side-navigation/nestable-navigation-content';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { ExpandLeftSidebarKeyboardShortcut, SlotLabel } from './common';

const PopupMenu = ({ closePopupMenu }: { closePopupMenu: () => void }) => {
	useLeftSidebarFlyoutLock();
	return (
		<PopupMenuGroup>
			<Section title="Starred">
				<ButtonItem onClick={closePopupMenu}>Navigation System</ButtonItem>
			</Section>
			<Section hasSeparator>
				<ButtonItem onClick={closePopupMenu}>Create project</ButtonItem>
			</Section>
		</PopupMenuGroup>
	);
};

const Menu = () => {
	const [isOpen, setIsOpen] = useState(false);

	const closePopupMenu = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);

	return (
		<Popup
			shouldRenderToParent
			placement="bottom-start"
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <PopupMenu closePopupMenu={closePopupMenu} />}
			trigger={(triggerProps) => (
				<IconButton
					{...triggerProps}
					testId="popup-trigger"
					isSelected={isOpen}
					onClick={(e) => {
						e.stopPropagation();
						setIsOpen(!isOpen);
					}}
					icon={MoreIcon}
					label="more"
				/>
			)}
		/>
	);
};

const App = (): React.JSX.Element => {
	return (
		<PageLayout>
			<Content>
				<LeftSidebar
					width={450}
					testId="left-sidebar"
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
					<SideNavigation label="Project navigation" testId="side-navigation">
						<NavigationHeader>
							<Header description="Sidebar header description">Sidebar Header</Header>
						</NavigationHeader>
						<NestableNavigationContent initialStack={[]}>
							<Section>
								<CustomItem
									iconAfter={<Menu />}
									component={({ children }) => <div>{children}</div>}
								>
									Popup
								</CustomItem>
							</Section>
						</NestableNavigationContent>
					</SideNavigation>
					<ExpandLeftSidebarKeyboardShortcut />
				</LeftSidebar>
				<Main>
					<SlotLabel>Main Content</SlotLabel>
				</Main>
				<RightSidebar testId="right-sidebar">
					<SideNavigation label="Aside">
						<NavigationHeader>
							<Header>Hello world</Header>
						</NavigationHeader>
					</SideNavigation>
				</RightSidebar>
			</Content>
		</PageLayout>
	);
};

export default App;
