import React, { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import TextField from '@atlaskit/textfield';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

interface Props {
	isCompact?: boolean;
}

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
const ReadViewContainer = styled.div<Props>((props) => ({
	display: 'flex',
	fontSize: `${fontSize()}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: (gridSize() * 2.5) / fontSize(),
	maxWidth: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${(gridSize() * 2.5) / fontSize()}em`,
	padding: `${
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		props.isCompact ? token('space.050', '4px') : token('space.100', '8px')
	} ${token('space.075', '6px')}`,
	wordBreak: 'break-word',
}));

const InlineEditExample = () => {
	const [editValue, setEditValue] = useState('Field Value');

	let validateValue = '';
	let validateTimeoutId: number | undefined;

	useEffect(() => {
		return () => {
			if (validateTimeoutId) {
				window.clearTimeout(validateTimeoutId);
			}
		};
	});

	const validate = (value: string) => {
		validateValue = value;
		return new Promise<{ value: string; error: string } | undefined>((resolve) => {
			validateTimeoutId = window.setTimeout(() => {
				if (value.length <= 6) {
					resolve({ value, error: 'Enter a value longer than 6 characters' });
				}
				resolve(undefined);
			}, 100);
		}).then((validateObject) => {
			if (validateObject && validateObject.value === validateValue) {
				return validateObject.error;
			}
			return undefined;
		});
	};

	const clearInlineEditContent = () => {
		setEditValue('');
	};

	return (
		<div
			style={{
				padding: `${token('space.100', '8px')} ${token('space.100', '8px')}`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '50%',
			}}
		>
			<button data-testid="clear-button" onClick={clearInlineEditContent}>
				Click to clear
			</button>
			<InlineEdit
				testId="validation"
				defaultValue={editValue}
				label="Inline edit validation"
				editView={({ errorMessage, ...fieldProps }) => (
					<InlineDialog
						isOpen={fieldProps.isInvalid}
						content={<div id="error-message">{errorMessage}</div>}
						placement="right"
					>
						<TextField
							testId="edit-view"
							{...fieldProps}
							elemAfterInput={
								fieldProps.isInvalid && (
									<div
										style={{
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
											paddingRight: token('space.075', '6px'),
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
											lineHeight: '100%',
										}}
									>
										<ErrorIcon label="error" primaryColor={token('color.icon.danger')} />
									</div>
								)
							}
							autoFocus
						/>
					</InlineDialog>
				)}
				readView={() => (
					<ReadViewContainer data-testid="read-view">
						{editValue || 'Click to enter value'}
					</ReadViewContainer>
				)}
				onConfirm={(value) => setEditValue(value)}
				validate={validate}
			/>
		</div>
	);
};

export default InlineEditExample;
