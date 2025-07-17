import React from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import { ExpandableNavButton, LinkNavButton, BackNavButton } from '../src/ui/NavigationButton';

const innerBoxContainerStyles = xcss({
	backgroundColor: 'elevation.surface.overlay',
	boxShadow: 'elevation.shadow.overlay',
});

const outerBoxContainerStyles = xcss({
	width: '800px',
	margin: 'auto',
	paddingTop: 'space.200',
});

const columnStyles = xcss({ width: '320px' });
const backColumnStyles = xcss({ width: '60px' });

const expandableItems = [
	{
		exampleTitle: 'Normal',
		id: 'media',
		label: 'Media',
	},
	{
		exampleTitle: 'Normal 2',
		id: 'collaborate',
		label: 'Collaborate',
	},
	{
		exampleTitle: 'With NEW Label',
		id: 'data_tables',
		label: 'Data Tables With a Really Long Label',
		attributes: { new: true },
	},
	{
		exampleTitle: 'Expanded',
		id: 'data',
		label: 'Data',
		isExpanded: true,
	},
	{
		exampleTitle: 'Disabled',
		id: 'structure',
		label: 'Structure',
		isDisabled: true,
	},
];

const navItems = [
	{
		exampleTitle: 'Normal',
		id: 'media',
		label: 'Media',
	},
	{
		exampleTitle: 'Normal 2',
		id: 'collaborate',
		label: 'Collaborate',
	},
	{
		exampleTitle: 'With NEW Label',
		id: 'data_tables',
		label: 'Data Tables With a Really Long Label',
		attributes: { new: true },
	},
	{
		exampleTitle: 'Selected',
		id: 'data',
		label: 'Data',
		isSelected: true,
	},
	{
		exampleTitle: 'Disabled',
		id: 'structure',
		label: 'Structure',
		isDisabled: true,
	},
];

export default function CategoryNavButtonExample() {
	return (
		<Box xcss={outerBoxContainerStyles}>
			<Inline space="space.200">
				<Stack space="space.200" xcss={columnStyles}>
					<Heading size="small">Expandable</Heading>
					{expandableItems.map((item) => (
						<Stack space="space.100" alignBlock="center" key={item.id}>
							<Heading size="xsmall">{item.exampleTitle}</Heading>
							<Box xcss={innerBoxContainerStyles}>
								<ExpandableNavButton
									id={item.id}
									label={item.label}
									isDisabled={item.isDisabled}
									isExpanded={item.isExpanded}
									attributes={item.attributes}
									onClick={(id) => console.log('onClick', id)}
								/>
							</Box>
						</Stack>
					))}
				</Stack>
				<Stack space="space.200" xcss={columnStyles}>
					<Heading size="small">Link (Side Navigation)</Heading>
					{navItems.map((item) => (
						<Stack space="space.100" alignBlock="center" key={item.id}>
							<Heading size="xsmall">{item.exampleTitle}</Heading>
							<Box xcss={innerBoxContainerStyles}>
								<LinkNavButton
									id={item.id}
									label={item.label}
									isSelected={item.isSelected}
									isDisabled={item.isDisabled}
									attributes={item.attributes}
									onClick={(id) => console.log('onClick', id)}
								/>
							</Box>
						</Stack>
					))}
				</Stack>
				<Stack space="space.200" xcss={backColumnStyles}>
					<Heading size="small">Back</Heading>
					<Stack space="space.100" alignBlock="center" alignInline="center">
						<Box xcss={innerBoxContainerStyles}>
							<BackNavButton label="Back" onClick={() => console.log('onClick back')} />
						</Box>
					</Stack>
				</Stack>
			</Inline>
		</Box>
	);
}
