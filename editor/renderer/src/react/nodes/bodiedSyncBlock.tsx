import React from 'react';

interface Props {
	children: React.ReactNode;
	localId: string;
	resourceId: string;
}

export default function BodiedSyncBlock(props: Props) {
	const { children, localId, resourceId } = props;
	return (
		<div data-bodied-sync-block data-local-id={localId} data-resource-id={resourceId}>
			{children}
		</div>
	);
}
