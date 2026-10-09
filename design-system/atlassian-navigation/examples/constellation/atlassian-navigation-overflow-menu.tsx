import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Create } from '@atlaskit/atlassian-navigation/create';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { useOverflowStatus } from '@atlaskit/atlassian-navigation/overflow';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { PrimaryButton } from '@atlaskit/atlassian-navigation/primary-button';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import type { PrimaryButtonProps } from '@atlaskit/atlassian-navigation/primary-button/types';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { PrimaryDropdownButton } from '@atlaskit/atlassian-navigation/primary-dropdown-button';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import type { PrimaryDropdownButtonProps } from '@atlaskit/atlassian-navigation/primary-dropdown-button/types';
import { cssMap } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ButtonItem from '@atlaskit/menu/button-item';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space075: {
		paddingBlock: token('space.075'),
		paddingInline: token('space.075'),
	},
});

const ResponsivePrimaryButton = (props: PrimaryButtonProps) => {
	const overflowStatus = useOverflowStatus();

	return overflowStatus.isVisible ? (
		<PrimaryButton>{props.children}</PrimaryButton>
	) : (
		<ButtonItem>{props.children}</ButtonItem>
	);
};

const ResponsivePrimaryDropdownButton = (props: PrimaryDropdownButtonProps) => {
	const overflowStatus = useOverflowStatus();

	return overflowStatus.isVisible ? (
		<PrimaryDropdownButton>{props.children}</PrimaryDropdownButton>
	) : (
		<ButtonItem
			iconAfter={
				<Flex xcss={iconSpacingStyles.space075}>
					<ChevronDownIcon label="" size="small" />
				</Flex>
			}
		>
			{props.children}
		</ButtonItem>
	);
};

const OverflowMenuExample = (): React.JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ width: '50%', minWidth: 180 }}>
			<AtlassianNavigation
				label="site"
				renderProductHome={() => null}
				renderCreate={() => <Create onClick={console.log} text="Create" />}
				primaryItems={[
					<ResponsivePrimaryButton>Explore</ResponsivePrimaryButton>,
					<ResponsivePrimaryButton>Projects</ResponsivePrimaryButton>,
					<ResponsivePrimaryButton>Dashboards</ResponsivePrimaryButton>,
					<ResponsivePrimaryDropdownButton>Favorites</ResponsivePrimaryDropdownButton>,
				]}
			/>
		</div>
	);
};

export default OverflowMenuExample;
