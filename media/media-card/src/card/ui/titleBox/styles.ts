import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { token } from '@atlaskit/tokens';

export const infoStyles: any = `white-space: nowrap;overflow: hidden;`;

export const iconOverlapStyles: any = `padding-right: 10px;`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const titleBoxIconStyles: SerializedStyles = css({
	position: 'absolute',
	right: token('space.050'),
	bottom: '0px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const newTitleBoxIconStyles: SerializedStyles = css({
	position: 'absolute',
	right: token('space.050'),
	bottom: token('space.050'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const errorMessageWrapperStyles: SerializedStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-start',
	paddingInlineStart: token('space.025'),
	gap: token('space.025'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		verticalAlign: 'middle',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		':nth-child(2)': {
			marginLeft: token('space.050'),
			marginRight: token('space.050'),
		},
	},
});
