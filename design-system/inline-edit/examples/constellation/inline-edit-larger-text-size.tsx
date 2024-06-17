/** @jsx jsx */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import {
	fontSize as getFontSize,
	// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
	gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import InlineEdit from '../../src';

const wrapperStyles = xcss({
	padding: 'space.100',
	fontSize: '24px',
	fontWeight: 'bold',
	lineHeight: '24px',
});

const fontSize = getFontSize();
const gridSize = getGridSize();

const readViewContainerStyles = xcss({
	display: 'flex',
	maxWidth: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${(gridSize * 2.5) / fontSize}em`,
	paddingBlock: 'space.100',
	paddingInline: 'space.075',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: (gridSize * 2.5) / fontSize,
	wordBreak: 'break-word',
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

const InlineEditExample = () => {
	const [editValue, setEditValue] = useState('');

	return (
		<Box xcss={wrapperStyles}>
			<InlineEdit
				defaultValue={editValue}
				editView={({ errorMessage, ...fieldProps }) => (
					<Textfield {...fieldProps} autoFocus css={textFieldStyles} />
				)}
				readView={() => (
					<Box xcss={readViewContainerStyles} testId="read-view">
						{editValue || 'Click to enter text'}
					</Box>
				)}
				onConfirm={(value) => {
					setEditValue(value);
				}}
			/>
		</Box>
	);
};

export default InlineEditExample;
