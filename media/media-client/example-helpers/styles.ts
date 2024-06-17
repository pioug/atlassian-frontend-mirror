import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { type FileStatus } from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const wrapperStyles = css({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const imagePreviewStyles = css({
	width: '300px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const previewWrapperStyles = css({
	flex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const metadataWrapperStyles = css({
	width: '400px',
	overflow: 'scroll',
	flex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const fileInputStyles = css({
	color: 'transparent',
});

export interface FilesWrapperProps {
	status: FileStatus;
	key: number;
}

const statusColorMap: { [key in FileStatus]: string } = {
	uploading: token('color.background.accent.blue.subtle', 'cornflowerblue'),
	processing: token('color.background.accent.orange.subtler', 'peachpuff'),
	processed: token('color.background.accent.green.subtle', 'darkseagreen'),
	error: token('color.background.accent.red.subtle', 'indianred'),
	'failed-processing': token('color.background.accent.red.subtle', 'indianred'),
};

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const fileWrapperStyles = (status: FileStatus) =>
	css({
		padding: '5px',
		margin: '10px',
		display: 'inline-block',
		width: '315px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: statusColorMap[status],
	});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const cardsWrapperStyles = css({
	width: '900px',
	padding: '10px',
	borderRight: `1px solid ${token('color.border', '#ccc')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h1: {
		textAlign: 'center',
		borderBottom: `1px solid ${token('color.border', '#ccc')}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		width: 'auto',
		display: 'inline-block',
		margin: '10px',
	},
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const headerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		margin: '5px',
	},
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const fileStateWrapperStyles = css({
	border: `1px solid ${token('color.border', '#ccc')}`,
	margin: '10px',
	padding: '10px',
	width: '500px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const uploadTouchWrapperStyles = css({
	height: '100%',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	flexWrap: 'nowrap',
	alignItems: 'center',
	justifyContent: 'center',
	alignContent: 'center',
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const rowStyles = css({
	flexDirection: 'row',
	justifyContent: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		marginRight: '10px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const responseStyles = css({
	fontFamily: 'monospace',
	whiteSpace: 'pre',
});
