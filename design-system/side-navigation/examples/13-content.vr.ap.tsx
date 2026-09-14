import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ButtonItem } from '@atlaskit/side-navigation/button-item';
import { Header } from '@atlaskit/side-navigation/header';
import { NavigationContent } from '@atlaskit/side-navigation/navigation-content';
import { NavigationHeader } from '@atlaskit/side-navigation/navigation-header';
import { Section } from '@atlaskit/side-navigation/section';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';

import AppFrame from './common/app-frame';

const ContentExample = (): React.JSX.Element => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="project">
				<NavigationHeader>
					<Header>Money machine</Header>
				</NavigationHeader>
				<NavigationContent showTopScrollIndicator>
					<Section>
						<ButtonItem>Print money</ButtonItem>
					</Section>
				</NavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default ContentExample;
