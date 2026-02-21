import React from 'react';

import CustomerIcon from '@atlaskit/icon/core/person';
import {
	ButtonItem,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
	SkeletonHeadingItem,
	SkeletonItem,
} from '@atlaskit/side-navigation';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

const BasicExample = (): React.JSX.Element => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="project" testId="side-navigation">
				<NavigationHeader>
					<SampleHeader />
				</NavigationHeader>
				<NestableNavigationContent stack={['nested']}>
					<NestingItem id="nested" title="Nested">
						<Section title="Heading">
							<SkeletonHeadingItem />
							<SkeletonItem hasAvatar />
							<SkeletonItem hasIcon />
							<ButtonItem iconBefore={<CustomerIcon spacing="spacious" label="" />}>
								Create
							</ButtonItem>
							<SkeletonItem width="100%" />
							<SkeletonItem />
							<SkeletonItem />
							<ButtonItem>Create</ButtonItem>
						</Section>
					</NestingItem>
				</NestableNavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default BasicExample;
