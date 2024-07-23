/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
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
});

const fontSize = getFontSize();
const gridSize = getGridSize();

/*
  As inline edit allows for a custom input component, styling of `ReadViewContainer` needs to be shipped with the component.
  This keeps `editView` and `readView` components aligned when switching between the two. In this particular case, these
  styles ensure `readView` is in sync with the TextField.
  */
const readViewContainerStyles = xcss({
	display: 'flex',
	maxWidth: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${(gridSize * 2.5) / fontSize}em`,
	paddingBlock: 'space.100',
	paddingInline: 'space.075',
	fontSize: `${fontSize}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: `${(gridSize * 2.5) / fontSize}`,
	wordBreak: 'break-word',
});

const InlineEditDefaultExample = () => {
	const [editValue, setEditValue] = useState('');

	return (
		<Box xcss={containerStyles}>
			<InlineEdit
				defaultValue={editValue}
				label="Team name"
				editView={({ errorMessage, ...fieldProps }) => <Textfield {...fieldProps} autoFocus />}
				readView={() => (
					<Box xcss={readViewContainerStyles} testId="read-view">
						{editValue || 'Enter your team name'}
					</Box>
				)}
				onConfirm={(value) => setEditValue(value)}
			/>
		</Box>
	);
};

export default InlineEditDefaultExample;
