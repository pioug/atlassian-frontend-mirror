/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import type { Dispatch, SetStateAction } from 'react';
import CopyButton from './codeBlockCopyButton';
import CodeWrapButton from './codeBlockWrapButton';
import { token } from '@atlaskit/tokens';
import { N0, N20, N30, N700 } from '@atlaskit/theme/colors';

export interface CodeBlockButtonContainerProps {
	allowCopyToClipboard?: boolean;
	allowWrapCodeBlock?: boolean;
	setWrapLongLines: Dispatch<SetStateAction<boolean>>;
	text: string;
	wrapLongLines: boolean;
}

const codeBlockButtonsWrapper = css({
	position: 'sticky',
	top: '0px',
	background: `${token('elevation.surface', N20)}`,
});

const codeBlockButtonsStyle = css({
	display: 'flex',
	justifyContent: 'flex-end',
	position: 'absolute',
	height: '0',
	width: '100%',
	right: token('space.075', '6px'),
	top: token('space.050', '4px'),
	padding: token('space.025', '2px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		height: '32px',
		width: '32px',
		border: `2px solid ${token('color.border', N0)}`,
		borderRadius: '4px',
		marginLeft: token('space.050', '4px'),
		padding: token('space.025', '2px'),
		background: `${token('elevation.surface.overlay', N20)}`,
		color: `${token('color.icon', 'rgb(66, 82, 110)')}`,

		'&:hover': {
			borderWidth: '2px',
			backgroundColor: `${token('elevation.surface.overlay.hovered', N30)}`,
			height: '32px',
			width: '32px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&.clicked': {
			backgroundColor: `${token('color.background.neutral.bold.pressed', N700)}`,
			borderRadius: '4px',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			color: `${token('color.icon.inverse', N0)} !important`,
		},
	},
});

const CodeBlockButtonContainer = ({
	allowCopyToClipboard,
	allowWrapCodeBlock,
	setWrapLongLines,
	text,
	wrapLongLines,
}: CodeBlockButtonContainerProps) => {
	return (
		<div css={codeBlockButtonsWrapper}>
			<div css={codeBlockButtonsStyle}>
				{allowWrapCodeBlock && (
					<CodeWrapButton setWrapLongLines={setWrapLongLines} wrapLongLines={wrapLongLines} />
				)}
				{allowCopyToClipboard && <CopyButton content={text} />}
			</div>
		</div>
	);
};

export default CodeBlockButtonContainer;
