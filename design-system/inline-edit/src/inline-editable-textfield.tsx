import React, { useCallback, useRef } from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import InlineEdit from './inline-edit';
import { type InlineEditableTextfieldProps } from './types';

const errorIconContainerStyles = xcss({
	lineHeight: '100%',
	paddingInlineEnd: 'space.075',
});

const readViewForTextFieldStyles = xcss({
	display: 'flex',
	font: 'font.body',
	maxWidth: '100%',
	paddingBlock: 'space.100',
	paddingInline: 'space.075',
	wordBreak: 'break-word',
});

const compactStyles = xcss({
	paddingBlock: 'space.050',
	paddingInline: 'space.075',
});

const InlineEditableTextfield = (props: InlineEditableTextfieldProps) => {
	const {
		isCompact = false,
		defaultValue,
		placeholder,
		testId,
		onCancel: providedOnCancel,
	} = props;
	const textFieldRef = useRef<HTMLInputElement>();

	const onCancel = useCallback(() => {
		if (textFieldRef.current) {
			textFieldRef.current.value = defaultValue || '';
		}
		providedOnCancel?.();
	}, [defaultValue, providedOnCancel]);

	return (
		<InlineEdit
			{...props}
			onCancel={onCancel}
			defaultValue={defaultValue}
			editView={({ errorMessage, isInvalid, ...props }) => (
				<InlineDialog
					isOpen={isInvalid}
					content={<div id="error-message">{errorMessage}</div>}
					placement="right"
				>
					<Textfield
						{...props}
						ref={textFieldRef}
						elemAfterInput={
							isInvalid && (
								<Box xcss={errorIconContainerStyles}>
									<ErrorIcon label="error" primaryColor={token('color.icon.danger', R400)} />
								</Box>
							)
						}
						testId={testId}
						isCompact={isCompact}
						autoFocus
					/>
				</InlineDialog>
			)}
			readView={() => (
				<Box
					xcss={[readViewForTextFieldStyles, isCompact && compactStyles]}
					data-compact={isCompact}
					testId={testId && `read-view-${testId}`}
				>
					{defaultValue || placeholder}
				</Box>
			)}
		/>
	);
};

export default InlineEditableTextfield;
