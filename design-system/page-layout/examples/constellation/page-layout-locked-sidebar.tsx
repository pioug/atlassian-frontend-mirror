/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';

import IconButton from '@atlaskit/button/icon/button';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import ButtonItem from '@atlaskit/menu/button-item';
import LinkItem from '@atlaskit/menu/link-item';
import PopupMenuGroup from '@atlaskit/menu/popup-menu-group';
import Section from '@atlaskit/menu/section';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import {
	Content,
	LeftSidebar,
	Main,
	PageLayout,
	RightSidebar,
	useLeftSidebarFlyoutLock,
} from '@atlaskit/page-layout';
import { Popup } from '@atlaskit/popup/popup';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Header } from '@atlaskit/side-navigation/header';
import { NavigationHeader } from '@atlaskit/side-navigation/navigation-header';
import { NestableNavigationContent } from '@atlaskit/side-navigation/nestable-navigation-content';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';

import { SlotLabel } from '../common';

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
					icon={ShowMoreHorizontalIcon}
					label="more"
				/>
			)}
		/>
	);
};

const App = (): jsx.JSX.Element => {
	return (
		<PageLayout>
			<Content>
				<LeftSidebar width={450} testId="left-sidebar">
					<SideNavigation label="Project navigation" testId="side-navigation">
						<NavigationHeader>
							<Header description="Sidebar header description">Sidebar Header</Header>
						</NavigationHeader>
						<NestableNavigationContent initialStack={[]}>
							<Section>
								<LinkItem iconAfter={<Menu />} href="http://www.atlassian.com">
									Atlassian
								</LinkItem>
							</Section>
						</NestableNavigationContent>
					</SideNavigation>
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
