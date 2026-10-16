import React from 'react';

import { ExtensionContextBridgeClient } from '@atlaskit/rovo-triggers/extension-context-bridge/client';

type Props = {
	/** Supply a stable allowlist of the extension's published origins. */
	allowedOrigins: readonly string[];
};

export default function ExtensionContextBridgeClientExample({
	allowedOrigins,
}: Props): React.JSX.Element {
	return <ExtensionContextBridgeClient allowedOrigins={allowedOrigins} />;
}
