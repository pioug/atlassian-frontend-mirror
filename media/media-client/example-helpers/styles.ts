import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';
import { type FileStatus } from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const wrapperStyles: SerializedStyles = css({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const imagePreviewStyles: SerializedStyles = css({
	width: '300px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const previewWrapperStyles: SerializedStyles = css({
	flex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const metadataWrapperStyles: SerializedStyles = css({
	width: '400px',
	overflow: 'scroll',
	flex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const fileInputStyles: SerializedStyles = css({
	color: 'transparent',
});

export interface FilesWrapperProps {
	status: FileStatus;
	key: number;
}

const statusColorMap: { [key in FileStatus]: string } = {
	uploading: token('color.background.accent.blue.subtle'),
	processing: token('color.background.accent.orange.subtler'),
	processed: token('color.background.accent.green.subtle'),
	error: token('color.background.accent.red.subtle'),
	'failed-processing': token('color.background.accent.red.subtle'),
};

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const fileWrapperStyles = (status: FileStatus): SerializedStyles =>
	css({
		padding: '5px',
		margin: '10px',
		display: 'inline-block',
		width: '315px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: statusColorMap[status],
	});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const cardsWrapperStyles: SerializedStyles = css({
	width: '900px',
	padding: '10px',
	borderRight: `${token('border.width', '1px')} solid ${token('color.border')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h1: {
		textAlign: 'center',
		borderBottom: `${token('border.width', '1px')} solid ${token('color.border')}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		width: 'auto',
		display: 'inline-block',
		margin: '10px',
	},
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const headerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		margin: '5px',
	},
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const fileStateWrapperStyles: SerializedStyles = css({
	border: `${token('border.width', '1px')} solid ${token('color.border')}`,
	margin: '10px',
	padding: '10px',
	width: '500px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const uploadTouchWrapperStyles: SerializedStyles = css({
	height: '100%',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	flexWrap: 'nowrap',
	alignItems: 'center',
	justifyContent: 'center',
	alignContent: 'center',
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const rowStyles: SerializedStyles = css({
	flexDirection: 'row',
	justifyContent: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		marginRight: '10px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const responseStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontFamily: 'monospace',
	whiteSpace: 'pre',
});
