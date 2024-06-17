/** @jsx jsx */
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

const fontSize = getFontSize();
const gridSize = getGridSize();

const containerStyles = xcss({
	paddingBlockStart: 'space.100',
	paddingInlineEnd: 'space.100',
	paddingBlockEnd: 'space.600',
});

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

const InlineEditStatelessExample = () => {
	const [editValue, setEditValue] = useState('');
	const [isEditing, setEditing] = useState(true);

	return (
		<Box xcss={containerStyles}>
			<InlineEdit
				defaultValue={editValue}
				label="Description"
				isEditing={isEditing}
				editView={({ errorMessage, ...fieldProps }) => <Textfield {...fieldProps} autoFocus />}
				readView={() => (
					<Box xcss={readViewContainerStyles} testId="read-view">
						{editValue || 'Add a description'}
					</Box>
				)}
				onCancel={() => setEditing(false)}
				onConfirm={(value: string) => {
					setEditValue(value);
					setEditing(false);
				}}
				onEdit={() => setEditing(true)}
			/>
		</Box>
	);
};

export default InlineEditStatelessExample;
