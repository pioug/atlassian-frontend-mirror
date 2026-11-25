import React, { type ReactNode } from 'react';

import { type TPlacementAlign } from '@atlaskit/top-layer/resolve-placement';

import InlineEditor from './overlap-inline-editor';

/**
 * Leaves the editor's default alignment in effect for missing or unrecognised values.
 */
function readAlign(value: string | null): TPlacementAlign | undefined {
	return value === 'start' || value === 'center' || value === 'end' ? value : undefined;
}

/**
 * Configures the issue-table editor from the URL used by the browser tests.
 */
export default function TestingPopoverOverlap(): ReactNode {
	const params = new URLSearchParams(window.location.search);
	const nearEdge = params.get('nearEdge');

	return (
		<InlineEditor
			isWiderEditor={params.get('wide') === 'true'}
			hasEditorPadding={params.get('padding') !== 'false'}
			inlineAlign={readAlign(params.get('inlineAlign'))}
			blockAlign={readAlign(params.get('blockAlign'))}
			inlineOffset={params.get('inlineOffset') ?? undefined}
			blockOffset={params.get('blockOffset') ?? undefined}
			nearEdge={nearEdge === 'start' || nearEdge === 'end' ? nearEdge : undefined}
			direction={params.get('direction') === 'rtl' ? 'rtl' : 'ltr'}
			forceFallbackPositioning={params.get('forceFallback') === 'true'}
		/>
	);
}
