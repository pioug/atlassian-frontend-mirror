import React from 'react';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples -- Capture this package's own legacy component without adding consumption of its deprecated public entry point.
import FocusRing from '../../src/focus-ring';
export const previewOptions = { width: 'fit-content', scale: 1.5 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<FocusRing focus="on">
				<button type="button">Continue</button>
			</FocusRing>
		</div>
	);
}
