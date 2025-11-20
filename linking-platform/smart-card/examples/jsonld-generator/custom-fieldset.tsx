import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Bleed, Grid, Text, xcss } from '@atlaskit/primitives';

const boxStyles = xcss({
	borderColor: 'color.border',
	borderStyle: 'dashed',
	borderRadius: 'radius.small',
	borderWidth: 'border.width',
	marginTop: 'space.150',
	padding: 'space.100',
});

const CustomFieldset = ({
	legend,
	children,
	templateColumns,
}: {
	children: React.ReactNode;
	legend: string;
	templateColumns?: string;
}): React.JSX.Element => (
	<Bleed all="space.100" xcss={boxStyles}>
		<Text weight="semibold">{legend}</Text>
		<Grid gap="space.100" templateColumns={templateColumns}>
			{children}
		</Grid>
	</Bleed>
);

export default CustomFieldset;
