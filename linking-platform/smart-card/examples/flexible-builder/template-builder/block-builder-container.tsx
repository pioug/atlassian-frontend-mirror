import React, { type PropsWithChildren, useCallback, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import Button from '@atlaskit/button/standard-button';
import DragHandleVerticalIcon from '@atlaskit/icon/core/migration/drag-handle-vertical--drag-handler';
import Lozenge from '@atlaskit/lozenge';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Grid, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { type BlockName } from '../constants';

import ChevronIcon from './chevron-icon';

const containerStyles = xcss({
	borderRadius: token('radius.small'),
	boxShadow: 'elevation.shadow.raised',
});

const contentStyles = xcss({
	borderTop: `${token('border.width')} solid ${token('color.border')}`,
	marginTop: 'space.100',
	padding: 'space.050',
});

const BlockBuilderContainer = ({
	children,
	internal = false,
	name,
	onRemove,
	position,
	removable = true,
}: PropsWithChildren<{
	internal?: boolean;
	name: BlockName;
	onRemove: (position: number) => void;
	position: number;
	removable: boolean;
}>): React.JSX.Element => {
	const [open, setOpen] = useState<boolean>(false);
	const handleExpand = useCallback(() => setOpen(!open), [open]);
	const handleOnRemove = useCallback(() => onRemove(position), [onRemove, position]);

	return (
		<Box padding="space.100" xcss={containerStyles}>
			<Grid alignItems="center" columnGap="space.025" templateColumns="24px 1fr 24px">
				<DragHandleVerticalIcon
					label=""
					spacing="spacious"
					color={token('color.icon', '#44546F')}
				/>
				<Text weight="medium">
					{name} {internal && <Lozenge>INTERNAL</Lozenge>}
				</Text>
				<IconButton
					onClick={handleExpand}
					spacing="compact"
					icon={() => <ChevronIcon open={open} />}
					label=""
				/>
			</Grid>
			{open && (
				<Grid rowGap="space.100" xcss={contentStyles}>
					{children}
					{removable && (
						<Button shouldFitContainer appearance="danger" onClick={handleOnRemove}>
							Delete
						</Button>
					)}
				</Grid>
			)}
		</Box>
	);
};
export default BlockBuilderContainer;
