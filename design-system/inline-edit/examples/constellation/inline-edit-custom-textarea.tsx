/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import TextArea from '@atlaskit/textarea';
import {
	fontSize as getFontSize,
	// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
	gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import InlineEdit from '../../src';

const containerStyles = xcss({
	paddingBlockStart: 'space.100',
	paddingInlineEnd: 'space.100',
	paddingBlockEnd: 'space.600',
	width: '70%',
});

const fontSize = getFontSize();
const gridSize = getGridSize();
const minRows = 2;
const textAreaLineHeightFactor = 2.5;

const readViewContainerStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${gridSize * textAreaLineHeightFactor * minRows}px`,
	padding: 'space.075',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-latest-xcss-syntax-typography -- Ignored via go/DSP-18766
	lineHeight: `${(gridSize * textAreaLineHeightFactor) / fontSize}`,
	wordBreak: 'break-word',
});

const InlineEditCustomTextareaExample = () => {
	const initialValue = 'Tell us about your experience';
	const [editValue, setEditValue] = useState('');
	return (
		<Box xcss={containerStyles}>
			<InlineEdit
				defaultValue={editValue}
				label="Send feedback"
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage, ...fieldProps }, ref) => (
					// @ts-ignore - textarea does not pass through ref as a prop
					<TextArea {...fieldProps} ref={ref} />
				)}
				readView={() => <Box xcss={readViewContainerStyles}>{editValue || initialValue}</Box>}
				onConfirm={setEditValue}
				keepEditViewOpenOnBlur
				readViewFitContainerWidth
			/>
		</Box>
	);
};

export default InlineEditCustomTextareaExample;
