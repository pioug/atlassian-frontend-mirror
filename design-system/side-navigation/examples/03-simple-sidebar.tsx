import React from 'react';

import Button from '@atlaskit/button/new';
import SelectedIcon from '@atlaskit/icon/core/check-mark';
import ButtonIcon from '@atlaskit/icon/core/checkbox-indeterminate';
import CustomIcon from '@atlaskit/icon/core/compass';
import LinkIcon from '@atlaskit/icon/core/link';
import {
	ButtonItem,
	HeadingItem,
	LinkItem,
	NavigationContent,
	NavigationFooter,
	NavigationHeader,
	Section,
	SideNavigation,
} from '@atlaskit/side-navigation';

import AppFrame from './common/app-frame';
import SampleFooter from './common/sample-footer';
import SampleHeader from './common/sample-header';

const BasicExample = (): React.JSX.Element => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="project" testId="side-navigation">
				<NavigationHeader>
					<SampleHeader />
				</NavigationHeader>
				<NavigationContent>
					<Section>
						<HeadingItem>This is a simple flat sidebar</HeadingItem>
						<ButtonItem iconBefore={<ButtonIcon spacing="spacious" label="" />}>
							It can contain buttons
						</ButtonItem>
						{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid */}
						<LinkItem href="#" iconBefore={<LinkIcon spacing="spacious" label="" />}>
							Or anchor links
						</LinkItem>
						<ButtonItem isSelected iconBefore={<SelectedIcon spacing="spacious" label="" />}>
							Or selected items
						</ButtonItem>
					</Section>
					<Button iconBefore={CustomIcon} appearance="primary" shouldFitContainer>
						Or custom components
					</Button>
				</NavigationContent>
				<NavigationFooter>
					<SampleFooter />
				</NavigationFooter>
			</SideNavigation>
		</AppFrame>
	);
};

export default BasicExample;
