import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import TextArea from '@atlaskit/textarea';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

const minRows = 2;
const textAreaLineHeightFactor = 2.5;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ReadViewContainer = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: (gridSize() * textAreaLineHeightFactor) / fontSize(),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${gridSize() * textAreaLineHeightFactor * minRows}px`,
	padding: `${token('space.075', '6px')} ${token('space.075', '6px')}`,
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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '70%',
			}}
		>
			<InlineEdit
				defaultValue={editValue}
				label="Inline edit textarea + keep edit view open on blur"
				editView={({ errorMessage, ...fieldProps }, ref) => (
					// @ts-ignore - textarea does not currently correctly pass through ref as a prop
					<TextArea {...fieldProps} ref={ref} />
				)}
				readView={() => (
					<ReadViewContainer>{editValue || 'Click to enter value'}</ReadViewContainer>
				)}
				onConfirm={setEditValue}
				keepEditViewOpenOnBlur
				readViewFitContainerWidth
			/>
		</div>
	);
};

export default InlineEditExample;
