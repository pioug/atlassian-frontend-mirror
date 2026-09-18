import React from 'react';

import { BodiedSyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';

interface Props {
	children: React.ReactNode;
	localId: string;
	resourceId: string;
}

export default function BodiedSyncBlock(props: Props): React.JSX.Element {
	const { children, localId, resourceId } = props;
	return (
		<div
			data-bodied-sync-block
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={BodiedSyncBlockSharedCssClassName.renderer}
			data-local-id={localId}
			data-resource-id={resourceId}
		>
			{children}
		</div>
	);
}
