import React from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

// For sync block to work, we need to pass in a custom syncBlock renderer
// However, we need define a basic component to render the sync block
export default function SyncBlock(
	props: React.PropsWithChildren<{ content?: PMNode[]; localId?: string }>,
) {
	return <div data-sync-block data-local-id={props.localId}></div>;
}
