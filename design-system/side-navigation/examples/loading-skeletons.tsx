import React from 'react';

import CustomerIcon from '@atlaskit/icon/glyph/person';
import {
	ButtonItem,
	HeadingItem,
	NavigationContent,
	NavigationHeader,
	Section,
	SideNavigation,
	SkeletonHeadingItem,
	SkeletonItem,
} from '@atlaskit/side-navigation';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

const BasicExample = () => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="project" testId="side-navigation">
				<NavigationHeader>
					<SampleHeader />
				</NavigationHeader>
				<NavigationContent>
					<Section>
						<HeadingItem>Heading</HeadingItem>
						<SkeletonHeadingItem />
						<SkeletonItem hasAvatar />
						<SkeletonItem hasIcon />
						<ButtonItem iconBefore={<CustomerIcon label="" />}>Create</ButtonItem>
						<SkeletonItem width="100%" />
						<SkeletonItem />
						<SkeletonItem />

						<ButtonItem>Create</ButtonItem>
					</Section>
				</NavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default BasicExample;
