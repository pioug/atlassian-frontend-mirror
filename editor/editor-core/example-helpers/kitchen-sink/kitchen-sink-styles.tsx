/* eslint-disable @atlaskit/design-system/no-exported-css */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { css } from '@emotion/react';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N0, N30, N50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { createEditorContentStyle } from '../../src/ui/ContentStyles';

export const container = ({ vertical, root }: { vertical?: boolean; root?: boolean }) =>
	css({
		display: 'flex',
		position: root ? 'relative' : 'static',
		marginTop: root ? '0' : '0.5em',
		flexDirection: vertical ? 'column' : 'row',
	});

export const controls = css({
	userSelect: 'none',
	borderBottom: `1px dashed ${token('color.border.input', N50)}`,
	padding: '1em',
	h5: {
		marginBottom: '0.5em',
	},
	'.theme-select': {
		marginLeft: '1em',
		width: '140px',
	},
});

export const kitchenSinkControl = css({
	display: 'inline-block',
	verticalAlign: 'middle',
	marginTop: '0.25em',
	marginBottom: '0.25em',
	marginRight: '0.5em',
});

export const appearanceControl = css({
	width: '240px',
});

export const column = ({ narrow }: { narrow?: boolean }) =>
	css({
		flex: 1,
		marginRight: narrow ? '360px' : '0',
	});

export const rail = () =>
	css({
		position: 'absolute',
		height: '100%',
		top: 0,
		right: 0,
		bottom: 0,
		background: token('elevation.surface', N0),
	});

export const editorColumn = ({ vertical, narrow }: { vertical: boolean; narrow: boolean }) =>
	css(
		{
			flex: 1,
			marginRight: narrow ? '360px' : '0',
		},
		!vertical
			? `border-right: 1px solid ${token(
					'color.border',
					N30,
				)}; min-height: 85vh; resize: horizontal;`
			: `border-bottom: 1px solid ${token('color.border', N30)}; resize: vertical;`,
	);

export const popupWrapper = css({
	position: 'relative',
	height: '100%',
});

/** Without ContentStyles some SVGs in floating toolbar are missing .hyperlink-open-link styles */
export const PopUps = createEditorContentStyle(
	css({
		zIndex: 9999,
	}),
);

export const inputPadding = css({
	height: '100%',
});

export const inputForm = css({
	height: '100%',
});

export const textareaStyle = css({
	boxSizing: 'border-box',
	border: '1px solid lightgray',
	fontFamily: 'monospace',
	fontSize: relativeFontSizeToBase16(14),
	padding: '1em',
	width: '100%',
	height: '80%',
});

export const rendererPadding = (hasPadding: boolean) =>
	css({
		padding: `0 ${token('space.400', '32px')}`,
		paddingTop: hasPadding ? '132px' : '0',
	});
