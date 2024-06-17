/** @jsx jsx */
import type { FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Textfield from '@atlaskit/textfield';
import {
	fontSize as getFontSize,
	// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
	gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

const fontSize = getFontSize();
const gridSize = getGridSize();

const readViewContainerStyles = css({
	display: 'flex',
	maxWidth: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${(gridSize * 2.5) / fontSize}em`,
	padding: `${token('space.100', '8px')} ${token('space.075', '6px')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: (gridSize * 2.5) / fontSize,
	wordBreak: 'break-word',
});

const ReadViewContainer: FC<{ children: string }> = ({ children }) => (
	<div css={readViewContainerStyles}>{children}</div>
);

const wrapperStyles = css({
	padding: `${token('space.100', '8px')} ${token('space.100', '8px')}`,
	fontSize: token('font.size.400', '24px'),
	fontWeight: token('font.weight.bold', '700'),
	lineHeight: token('font.lineHeight.300', '24px'),
});

const textFieldStyles = css({
	fontSize: 'inherit',
	fontWeight: 'inherit',
	lineHeight: 'inherit',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--input]': {
		fontSize: 'inherit',
		fontWeight: 'inherit',
		lineHeight: 'inherit',
	},
});

const InlineEditExample = () => (
	<div css={wrapperStyles}>
		<InlineEdit
			defaultValue="Field value"
			onConfirm={() => {}}
			editView={(fieldProps) => <Textfield {...fieldProps} autoFocus css={textFieldStyles} />}
			readView={() => <ReadViewContainer>Field value</ReadViewContainer>}
		/>
	</div>
);
export default InlineEditExample;
