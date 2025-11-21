import React, { useEffect, useState } from 'react';

import {
	AtlassianNavigation,
	Create,
	PrimaryButton,
	type PrimaryButtonProps,
	useOverflowStatus,
} from '@atlaskit/atlassian-navigation';
import Button from '@atlaskit/button/new';
import { ButtonItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

const ResponsivePrimaryButton = (props: PrimaryButtonProps) => {
	const overflowStatus = useOverflowStatus();

	return overflowStatus.isVisible ? (
		<PrimaryButton>{props.children}</PrimaryButton>
	) : (
		<ButtonItem>{props.children}</ButtonItem>
	);
};

const sizes = ['100%', '75%', '50%', '25%'];

export default (): React.JSX.Element => {
	const [size, setSize] = useState(0);
	const [items, setItems] = useState<JSX.Element[]>([]);
	const sizeIndex = size % sizes.length;
	useEffect(() => {
		setItems([
			<ResponsivePrimaryButton>Explore</ResponsivePrimaryButton>,
			<ResponsivePrimaryButton>Projects</ResponsivePrimaryButton>,
			<ResponsivePrimaryButton>Dashboards</ResponsivePrimaryButton>,
			<ResponsivePrimaryButton>Apps</ResponsivePrimaryButton>,
			<ResponsivePrimaryButton>Plans</ResponsivePrimaryButton>,
		]);
	}, []);

	return (
		<>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ width: sizes[sizeIndex], minWidth: 180 }}>
				<AtlassianNavigation
					label="site"
					renderProductHome={() => null}
					renderCreate={() => <Create onClick={console.log} text="Create" />}
					primaryItems={items}
					moreLabel="More"
				/>
			</div>

			<div
				style={{
					// TODO Delete this comment after verifying space token -> previous value `'20px'`
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginTop: token('space.250', '20px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					textAlign: 'center',
				}}
			>
				<Button onClick={() => setSize((prev) => prev + 1)}>
					Set width to {sizes[(sizeIndex + 1) % sizes.length]}
				</Button>
			</div>
		</>
	);
};
