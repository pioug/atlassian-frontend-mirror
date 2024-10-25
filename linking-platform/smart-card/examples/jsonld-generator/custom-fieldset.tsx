import React from 'react';

import { Bleed, Grid, Text, xcss } from '@atlaskit/primitives';

const boxStyles = xcss({
	borderColor: 'color.border',
	borderStyle: 'dashed',
	borderRadius: '3px',
	borderWidth: 'border.width',
	marginTop: 'space.150',
	padding: 'space.100',
});

const CustomFieldset = ({
	legend,
	children,
	templateColumns,
}: {
	legend: string;
	children: React.ReactNode;
	templateColumns?: string;
}) => (
	<Bleed all="space.100" xcss={boxStyles}>
		<Text weight="semibold">{legend}</Text>
		<Grid gap="space.100" templateColumns={templateColumns}>
			{children}
		</Grid>
	</Bleed>
);

export default CustomFieldset;
