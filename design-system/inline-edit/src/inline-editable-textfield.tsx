import React, { useCallback, useRef } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import { Box } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import InlineEdit from './inline-edit';
import { type InlineEditableTextfieldProps } from './types';

const errorIconContainerStyles = cssMap({
	root: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-tokens-typography
		lineHeight: '100%' as any,
		paddingInlineEnd: token('space.075'),
	},
});

const readViewForTextFieldStyles = cssMap({
	root: {
		display: 'flex',
		font: token('font.body'),
		maxWidth: '100%',
		paddingBlock: token('space.100'),
		paddingInline: token('space.075'),
		wordBreak: 'break-word',
	},
});

const compactStyles = cssMap({
	root: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.075'),
	},
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
								<Box xcss={errorIconContainerStyles.root}>
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
					xcss={cx(readViewForTextFieldStyles.root, isCompact && compactStyles.root)}
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
