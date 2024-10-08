/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import CustomerIcon from '@atlaskit/icon/glyph/person';

import {
	ButtonItem,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
	SkeletonHeadingItem,
	SkeletonItem,
} from '../src';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

const BasicExample = () => {
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
							<ButtonItem iconBefore={<CustomerIcon label="" />}>Create</ButtonItem>
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
