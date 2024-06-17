/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, Text } from '@atlaskit/primitives';

import {
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
	useShouldNestedElementRender,
} from '../src';

import AppFrame from './common/app-frame';

const IncorrectCustomLeafNodeComponent = () => {
	return (
		<Box padding="space.100">
			<Text size="UNSAFE_small" weight="medium" align="center" as="p">
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
			<Text size="UNSAFE_small" weight="medium" align="center" as="p">
				<i>Only rendered when parent view is shown</i>
			</Text>
		</Box>
	);
};

const BasicExample = () => {
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
