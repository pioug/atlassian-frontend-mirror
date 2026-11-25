import React, { type ReactNode } from 'react';

import InlineEditor from './overlap-inline-editor';

/**
 * Shows the issue-table editor using the JavaScript positioning fallback.
 */
export default function InlineEditorFallback(): ReactNode {
	return <InlineEditor forceFallbackPositioning />;
}
