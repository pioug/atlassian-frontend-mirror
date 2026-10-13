import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { DragHandle } from '@atlaskit/side-nav-items/drag-and-drop/drag-handle';
import { DragPreview } from '@atlaskit/side-nav-items/drag-and-drop/drag-preview';
import { DropIndicator } from '@atlaskit/side-nav-items/drag-and-drop/drop-indicator';
import { GroupDropIndicator } from '@atlaskit/side-nav-items/drag-and-drop/group-drop-indicator';

/**
 * These are the visual pieces for a host drag-and-drop interaction. Wire them to the
 * corresponding Pragmatic drag and drop source and target; rendering these alone does not
 * make rows draggable or persist a reorder.
 */
export function DragAndDropVisuals(): React.JSX.Element {
	return (
		<Stack space="space.150">
			<div>
				<DragHandle /> Saved filters
			</div>
			<DragPreview>Saved filters</DragPreview>
			<DropIndicator
				instruction={{ operation: 'reorder-before', axis: 'vertical', blocked: false }}
			/>
			<GroupDropIndicator isActive>
				<Text>Drop into this group</Text>
			</GroupDropIndicator>
		</Stack>
	);
}

export default DragAndDropVisuals;
