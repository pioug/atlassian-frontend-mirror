// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { akEditorGridLineZIndex } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const GRID_GUTTER = 12;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const gridStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.gridParent': {
		width: `calc(100% + ${GRID_GUTTER * 2}px)`,
		marginLeft: token('space.negative.150', '-12px'),
		marginRight: token('space.negative.150', '-12px'),
		transform: 'scale(1)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		zIndex: akEditorGridLineZIndex,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.gridContainer': {
		position: 'fixed',
		height: '100vh',
		width: '100%',
		pointerEvents: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.gridLine': {
		borderLeft: `1px solid ${token('color.border')}`,
		display: 'inline-block',
		boxSizing: 'border-box',
		height: '100%',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginLeft: '-1px',
		transition: 'border-color 0.15s linear',
		zIndex: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.highlight': {
		borderLeft: `1px solid ${token('color.border.focused')}`,
	},
});
