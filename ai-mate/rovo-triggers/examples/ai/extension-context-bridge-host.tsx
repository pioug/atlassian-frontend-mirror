import React from 'react';

import { ExtensionContextBridgeHost } from '@atlaskit/rovo-triggers/extension-context-bridge/host';

type Props = {
	/** Resolve the current product page's content identifier when context is relayed. */
	getContentId: () => string | undefined;
	/** Pass the viewer's actual Rovo entitlement from the product. */
	isAiEnabled: boolean;
};

export default function ExtensionContextBridgeHostExample({
	getContentId,
	isAiEnabled,
}: Props): React.JSX.Element {
	return <ExtensionContextBridgeHost getContentId={getContentId} isAiEnabled={isAiEnabled} />;
}
