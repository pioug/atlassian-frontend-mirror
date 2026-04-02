import React from 'react';

import { cssMap } from '@atlaskit/css';
import CustomerIcon from '@atlaskit/icon/core/person';
import { Flex } from '@atlaskit/primitives/compiled';
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
import { token } from '@atlaskit/tokens';


import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const BasicExample = (): React.JSX.Element => {
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
						<ButtonItem
							iconBefore={
								<Flex xcss={iconSpacingStyles.space050}>
									<CustomerIcon label="" />
								</Flex>
							}
						>
							Create
						</ButtonItem>
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
