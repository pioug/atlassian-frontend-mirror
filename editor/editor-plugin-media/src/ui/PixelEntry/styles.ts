import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH = 120;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
export const pixelSizingWrapper = css`
	display: grid;
	grid-template-columns: 1fr 1em 1fr 0;
	grid-template-rows: auto;
	grid-template-areas: 'widthinput label heightinput submit';
	width: ${PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH}px;
	text-align: center;
	height: ${token('space.300', '24px')};

	// Atlaskit fieldset does not allow style override
	& > * {
		margin-top: 0 !important;
	}
`;
export const pixelEntryForm = css({
	form: {
		width: '100%',
	},
});

export const pixelSizingInput = css({
	width: '100%',
	height: token('space.300', '24px'),
	'& input': {
		textAlign: 'center',
	},
});
export const pixelSizingLabel = css({
	gridArea: 'label',
	lineHeight: token('space.300', '24px'),
});
export const pixelSizingWidthInput = css({
	gridArea: 'widthinput',
});
export const pixelSizingHeightInput = css({
	gridArea: 'heightinput',
});

export const pixelEntryHiddenSubmit = css({
	gridArea: 'submit',
	visibility: 'hidden',
	width: 0,
	height: 0,
});

export const pixelSizingFullWidthLabelStyles = css({
	minWidth: `${PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH}px`,
	height: token('space.300', '24px'),
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});
