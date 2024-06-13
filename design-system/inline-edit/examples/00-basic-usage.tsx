import React, { useState } from 'react';

import styled from '@emotion/styled';

import Textfield from '@atlaskit/textfield';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ReadViewContainer = styled.div({
	display: 'flex',
	fontSize: `${fontSize()}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: (gridSize() * 2.5) / fontSize(),
	maxWidth: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${(gridSize() * 2.5) / fontSize()}em`,
	padding: `${token('space.100', '8px')} ${token('space.075', '6px')}`,
	wordBreak: 'break-word',
});

const InlineEditExample = () => {
	const [editValue, setEditValue] = useState('Field value');

	return (
		<div
			style={{
				padding: `${token('space.100', '8px')} ${token(
					'space.100',
					'8px',
				)} ${token('space.600', '48px')}`,
			}}
		>
			<InlineEdit
				testId="inline-edit"
				defaultValue={editValue}
				label="Inline edit"
				editView={({ errorMessage, ...fieldProps }) => <Textfield {...fieldProps} autoFocus />}
				readView={() => (
					<ReadViewContainer data-testid="read-view">
						{editValue || 'Click to enter value'}
					</ReadViewContainer>
				)}
				onConfirm={(value) => setEditValue(value)}
			/>
		</div>
	);
};

export default InlineEditExample;
