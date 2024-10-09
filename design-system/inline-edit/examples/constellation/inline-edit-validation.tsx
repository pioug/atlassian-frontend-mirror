import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import { Box, xcss } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../../src';

const containerStyles = xcss({
	paddingBlockStart: 'space.100',
	paddingInlineEnd: 'space.100',
	paddingBlockEnd: 'space.600',
	width: '50%',
});

const errorIconContainerStyles = xcss({
	paddingInlineEnd: 'space.075',
	lineHeight: '100%',
});

const readViewContainerStyles = xcss({
	display: 'flex',
	font: 'font.body',
	maxWidth: '100%',
	paddingBlock: 'space.100',
	paddingInline: 'space.075',
	wordBreak: `break-word`,
});

const InlineEditValidationExample = () => {
	const initialValue = 'Initial description value';
	const [editValue, setEditValue] = useState('Default description value');

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
					resolve({
						value,
						error: 'Enter a description greater than 6 characters',
					});
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
		<Box xcss={containerStyles}>
			<Button testId="clear-button" onClick={clearInlineEditContent}>
				Clear field
			</Button>
			<InlineEdit
				defaultValue={editValue}
				label="Description"
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage, ...fieldProps }) => (
					<InlineDialog
						isOpen={fieldProps.isInvalid}
						content={<Box id="error-message">{errorMessage}</Box>}
						placement="right"
					>
						<TextField
							testId="edit-view"
							{...fieldProps}
							elemAfterInput={
								fieldProps.isInvalid && (
									<Box xcss={errorIconContainerStyles}>
										<ErrorIcon label="error" primaryColor={token('color.icon.danger')} />
									</Box>
								)
							}
							autoFocus
						/>
					</InlineDialog>
				)}
				readView={() => (
					<Box xcss={readViewContainerStyles} testId="read-view">
						{editValue}
					</Box>
				)}
				onConfirm={(value) => setEditValue(value)}
				validate={validate}
			/>
		</Box>
	);
};

export default InlineEditValidationExample;
