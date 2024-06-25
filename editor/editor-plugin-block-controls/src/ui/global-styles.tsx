/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, Global, jsx } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

const extendedHoverZone = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.block-ctrl-drag-preview [data-drag-handler-anchor-name]::after': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		display: 'none !important',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-drag-handler-anchor-name]::after': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: '-100%',
		width: '100%',
		height: '100%',
		background: 'transparent',
		cursor: 'default',
		zIndex: -1,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-blocks-decoration-container="true"] + *::after': {
		display: 'none',
	},
});

const globalStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.ProseMirror-widget:first-child + *': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: '0 !important',
	},
});

export const GlobalStylesWrapper = () => {
	return (
		<Global
			styles={[
				globalStyles,
				getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2') &&
					extendedHoverZone,
			]}
		/>
	);
};
