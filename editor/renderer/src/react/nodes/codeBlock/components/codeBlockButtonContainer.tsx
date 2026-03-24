/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import type { Dispatch, SetStateAction } from 'react';
import CopyButton from './codeBlockCopyButton';
import CodeWrapButton from './codeBlockWrapButton';
import { token } from '@atlaskit/tokens';

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
	background: `${token('elevation.surface')}`,
});

const codeBlockButtonsStyle = css({
	display: 'flex',
	justifyContent: 'flex-end',
	position: 'absolute',
	height: '0',
	width: '100%',
	right: token('space.075'),
	top: token('space.050'),
	padding: token('space.025'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		height: '32px',
		width: '32px',
		border: `${token('border.width.selected')} solid ${token('color.border')}`,
		borderRadius: token('radius.small'),
		marginLeft: token('space.050'),
		padding: token('space.025'),
		background: `${token('elevation.surface.overlay')}`,
		color: `${token('color.icon')}`,

		'&:hover': {
			borderWidth: token('border.width.selected'),
			backgroundColor: `${token('elevation.surface.overlay.hovered')}`,
			height: '32px',
			width: '32px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&.clicked': {
			backgroundColor: `${token('color.background.neutral.bold.pressed')}`,
			borderRadius: token('radius.small'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			color: `${token('color.icon.inverse')} !important`,
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
