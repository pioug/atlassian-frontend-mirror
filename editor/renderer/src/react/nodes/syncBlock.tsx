import React from 'react';

// For sync block to work, we are passing in a custom syncBlock renderer through nodeComponents
// However, we need define a basic component to render the sync block
export default function SyncBlock(
	props: React.PropsWithChildren<{ localId?: string; resourceId?: string }>,
): React.JSX.Element {
	return (
		<div data-sync-block data-local-id={props.localId} data-resource-id={props.resourceId}></div>
	);
}
