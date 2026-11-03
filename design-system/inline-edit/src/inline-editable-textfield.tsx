/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useRef } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import InlineDialog from '@atlaskit/inline-dialog/inline-dialog';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled/box';
import Textfield from '@atlaskit/textfield/text-field';
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

const validationPopupStyles = cssMap({
	content: {
		maxWidth: '448px',
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
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

const InlineEditableTextfield = (props: InlineEditableTextfieldProps): React.JSX.Element => {
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
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
			onCancel={onCancel}
			defaultValue={defaultValue}
			editView={({ errorMessage, isInvalid, ...props }) => {
				const field = (
					<Textfield
						{...props}
						ref={textFieldRef}
						elemAfterInput={
							isInvalid && (
								<Box xcss={errorIconContainerStyles.root}>
									<ErrorIcon label="error" color={token('color.icon.danger')} size="small" />
								</Box>
							)
						}
						testId={testId}
						isCompact={isCompact}
						autoFocus
					/>
				);
				if (fg('platform-dst-top-layer')) {
					return (
						<Popup
							isOpen={isInvalid}
							placement="right"
							// Validation follows field state without stealing focus or light-dismissing.
							mode="manual"
							role="none"
							trigger={({ ref }) => <div ref={ref}>{field}</div>}
							content={() => (
								<div css={validationPopupStyles.content} id={`${props.id}-error`}>
									{errorMessage}
								</div>
							)}
						/>
					);
				}
				return (
					<InlineDialog
						isOpen={isInvalid}
						content={<div id="error-message">{errorMessage}</div>}
						placement="right"
					>
						{field}
					</InlineDialog>
				);
			}}
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
