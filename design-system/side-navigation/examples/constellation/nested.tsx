import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ButtonItem } from '@atlaskit/side-navigation/button-item';
import { Header } from '@atlaskit/side-navigation/header';
import { NavigationHeader } from '@atlaskit/side-navigation/navigation-header';
import { NestableNavigationContent } from '@atlaskit/side-navigation/nestable-navigation-content';
import { NestingItem } from '@atlaskit/side-navigation/nesting-item';
import { Section } from '@atlaskit/side-navigation/section';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';

import AppFrame from '../common/app-frame';

const NestedExample = (): React.JSX.Element => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="project">
				<NavigationHeader>
					<Header>Designing web navigation</Header>
				</NavigationHeader>
				<NestableNavigationContent>
					<Section>
						<NestingItem id="component-menu" title="Navigation components">
							<Section>
								<ButtonItem>Side navigation</ButtonItem>
							</Section>
						</NestingItem>
					</Section>
				</NestableNavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default NestedExample;
