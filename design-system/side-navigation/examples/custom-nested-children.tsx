import React from 'react';

import { Box, Text } from '@atlaskit/primitives/compiled';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { NestableNavigationContent } from '@atlaskit/side-navigation/nestable-navigation-content';
import { NestingItem } from '@atlaskit/side-navigation/nesting-item';
import { Section } from '@atlaskit/side-navigation/section';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';
import { useShouldNestedElementRender } from '@atlaskit/side-navigation/use-should-nested-element-render';

import AppFrame from './common/app-frame';

const IncorrectCustomLeafNodeComponent = () => {
	return (
		<Box padding="space.100">
			<Text size="small" weight="medium" align="center" as="p">
				<i>Always rendered</i>
			</Text>
		</Box>
	);
};

const CorrectCustomLeafNodeComponent = () => {
	const { shouldRender } = useShouldNestedElementRender();
	if (!shouldRender) {
		return null;
	}

	return (
		<Box padding="space.100">
			<Text size="small" weight="medium" align="center" as="p">
				<i>Only rendered when parent view is shown</i>
			</Text>
		</Box>
	);
};

const BasicExample = (): React.JSX.Element => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="project" testId="side-navigation">
				<NestableNavigationContent>
					<Section>
						<IncorrectCustomLeafNodeComponent />
						<NestingItem id="1" title="Go inside">
							<CorrectCustomLeafNodeComponent />
						</NestingItem>
					</Section>
				</NestableNavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default BasicExample;
