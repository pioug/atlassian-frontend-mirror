import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ButtonItem } from '@atlaskit/side-navigation/button-item';
import { NavigationContent } from '@atlaskit/side-navigation/navigation-content';
import { Section } from '@atlaskit/side-navigation/section';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';

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
