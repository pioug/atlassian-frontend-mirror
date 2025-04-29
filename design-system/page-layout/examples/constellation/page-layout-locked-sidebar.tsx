/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';
import { ButtonItem, LinkItem, PopupMenuGroup, Section } from '@atlaskit/menu';
import {
	Content,
	LeftSidebar,
	Main,
	PageLayout,
	RightSidebar,
	useLeftSidebarFlyoutLock,
} from '@atlaskit/page-layout';
import Popup from '@atlaskit/popup';
import {
	Header,
	NavigationHeader,
	NestableNavigationContent,
	SideNavigation,
} from '@atlaskit/side-navigation';

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

const App = () => {
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
