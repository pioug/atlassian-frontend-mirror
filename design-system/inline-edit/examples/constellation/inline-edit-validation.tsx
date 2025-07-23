import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import ErrorIcon from '@atlaskit/icon/core/migration/status-error--error';
import InlineDialog from '@atlaskit/inline-dialog';
import InlineEdit from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
	root: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.600'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		width: '50%' as any,
	},
});

const errorIconContainerStyles = cssMap({
	root: {
		paddingInlineEnd: token('space.075'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		lineHeight: '100%' as any,
	},
});

const readViewContainerStyles = cssMap({
	root: {
		display: 'flex',
		font: token('font.body'),
		maxWidth: '100%',
		paddingBlock: token('space.100'),
		paddingInline: token('space.075'),
		wordBreak: `break-word`,
	},
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
		<Box xcss={containerStyles.root}>
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
									<Box xcss={errorIconContainerStyles.root}>
										<ErrorIcon
											label="error"
											LEGACY_primaryColor={token('color.icon.danger')}
											color={token('color.icon.danger')}
										/>
									</Box>
								)
							}
							autoFocus
						/>
					</InlineDialog>
				)}
				readView={() => (
					<Box xcss={readViewContainerStyles.root} testId="read-view">
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
