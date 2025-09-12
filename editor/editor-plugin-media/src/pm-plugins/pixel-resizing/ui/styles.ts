// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH = 120;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pixelSizingWrapper = css`
	display: grid;
	grid-template-columns: 1fr 1em 1fr 0;
	grid-template-rows: auto;
	grid-template-areas: 'widthinput label heightinput submit';
	width: ${PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH}px;
	text-align: center;
	height: ${token('space.300', '24px')};

	/* Atlaskit fieldset does not allow style override */
	& > * {
		margin-top: 0 !important;
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pixelEntryForm: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	form: {
		width: '100%',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pixelSizingInput: SerializedStyles = css({
	width: '100%',
	height: token('space.300', '24px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& input': {
		textAlign: 'center',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pixelSizingWidthInput: SerializedStyles = css({
	gridArea: 'widthinput',
});
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pixelSizingHeightInput: SerializedStyles = css({
	gridArea: 'heightinput',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pixelEntryHiddenSubmit: SerializedStyles = css({
	gridArea: 'submit',
	visibility: 'hidden',
	width: 0,
	height: 0,
	// this is needed so that this button doesn't contribute to scroll width of media floating toolbar and display scroll buttons unnecessarily
	padding: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pixelSizingFullWidthLabelStyles: SerializedStyles = css({
	minWidth: `${PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH}px`,
	height: token('space.300', '24px'),
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});
