import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/migration/chevron-right';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	borderColor: 'color.border',
	borderStyle: 'solid',
	borderRadius: 'radius.small',
	borderWidth: 'border.width',
	marginTop: 'space.150',
});

const contentStyles = xcss({
	padding: 'space.200',
	paddingBlockStart: 'space.0',
});

const CollapsibleSection = (props: { children: any; title: string }) => {
	const [isSectionOpen, setIsSectionOpen] = useState(false);
	return (
		<Box xcss={containerStyles}>
			<Button
				iconBefore={(iconProps) =>
					isSectionOpen ? (
						<ChevronDownIcon {...iconProps} size="small" />
					) : (
						<ChevronRightIcon {...iconProps} size="small" />
					)
				}
				onClick={() => setIsSectionOpen(!isSectionOpen)}
				shouldFitContainer
			>
				{props.title}
			</Button>
			<Box xcss={contentStyles} style={{ display: isSectionOpen ? 'block' : 'none' }}>
				{props.children}
			</Box>
		</Box>
	);
};

export default CollapsibleSection;
