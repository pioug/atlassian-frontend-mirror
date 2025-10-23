import React from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

// For sync block to work, we are passing in a custom syncBlock renderer through nodeComponents
// However, we need define a basic component to render the sync block
export default function SyncBlock(
	props: React.PropsWithChildren<{ content?: PMNode[]; localId?: string; resourceId?: string }>,
) {
	return (
		<div data-sync-block data-local-id={props.localId} data-resource-id={props.resourceId}></div>
	);
}
