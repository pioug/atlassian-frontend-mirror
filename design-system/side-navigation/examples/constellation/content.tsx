import React from 'react';

import {
	ButtonItem,
	Header,
	NavigationContent,
	NavigationHeader,
	Section,
	SideNavigation,
} from '../../src';
import AppFrame from '../common/app-frame';

const ContentExample = () => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="project">
				<NavigationHeader>
					<Header>Design System Project</Header>
				</NavigationHeader>
				<NavigationContent showTopScrollIndicator>
					<Section>
						<ButtonItem>Tasks</ButtonItem>
					</Section>
				</NavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default ContentExample;
