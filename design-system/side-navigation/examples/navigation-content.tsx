import React from 'react';

import { ButtonItem, NavigationContent, Section, SideNavigation } from '@atlaskit/side-navigation';

import AppFrame from './common/app-frame';

const Example = (): React.JSX.Element => {
	return (
		<AppFrame shouldHideAppBar shouldHideBorder>
			<SideNavigation label="project">
				<NavigationContent showTopScrollIndicator>
					<Section title="Money machine">
						<ButtonItem>Print money</ButtonItem>
					</Section>
				</NavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default Example;
