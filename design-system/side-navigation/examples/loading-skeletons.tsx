import React from 'react';

import { cssMap } from '@atlaskit/css';
import CustomerIcon from '@atlaskit/icon/core/person';
import { Flex } from '@atlaskit/primitives/compiled';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ButtonItem } from '@atlaskit/side-navigation/button-item';
import { HeadingItem } from '@atlaskit/side-navigation/heading-item';
import { NavigationContent } from '@atlaskit/side-navigation/navigation-content';
import { NavigationHeader } from '@atlaskit/side-navigation/navigation-header';
import { Section } from '@atlaskit/side-navigation/section';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';
import { SkeletonHeadingItem } from '@atlaskit/side-navigation/skeleton-heading-item';
import { SkeletonItem } from '@atlaskit/side-navigation/skeleton-item';
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
