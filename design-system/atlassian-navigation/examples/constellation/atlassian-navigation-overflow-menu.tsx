import React from 'react';

import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
import { ButtonItem } from '@atlaskit/menu';

import {
	AtlassianNavigation,
	Create,
	PrimaryButton,
	type PrimaryButtonProps,
	PrimaryDropdownButton,
	type PrimaryDropdownButtonProps,
	useOverflowStatus,
} from '../../src';

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
		<ButtonItem iconAfter={<ChevronDownIcon label="" size="small" spacing="spacious" />}>
			{props.children}
		</ButtonItem>
	);
};

const OverflowMenuExample = () => {
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
