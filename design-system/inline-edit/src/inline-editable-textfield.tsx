/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import Textfield from '@atlaskit/textfield';
import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import InlineEdit from './inline-edit';
import { fontSize } from './internal/constants';
import { type InlineEditableTextfieldProps } from './types';

const errorIconContainerStyles = css({
	paddingInlineEnd: token('space.075', '6px'),
	lineHeight: '100%',
});

const readViewForTextFieldStyles = css({
	display: 'flex',
	maxWidth: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${(8 * 2.5) / fontSize}em`,
	padding: `${token('space.100', '8px')} ${token('space.075', '6px')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: fontSize,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: (8 * 2.5) / fontSize,
	wordBreak: 'break-word',
});

const compactStyles = css({
	padding: `${token('space.050', '4px')} ${token('space.075', '6px')}`,
});

const noop = () => {};

const InlineEditableTextfield = (props: InlineEditableTextfieldProps) => {
	const {
		isCompact = false,
		defaultValue,
		placeholder,
		testId,
		onCancel: providedOnCancel = noop,
	} = props;
	const textFieldRef = useRef<HTMLInputElement>();

	const onCancel = useCallback(() => {
		if (textFieldRef.current) {
			textFieldRef.current.value = defaultValue || '';
		}
		providedOnCancel();
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
								<div css={errorIconContainerStyles}>
									<ErrorIcon label="error" primaryColor={token('color.icon.danger', R400)} />
								</div>
							)
						}
						testId={testId}
						isCompact={isCompact}
						autoFocus
					/>
				</InlineDialog>
			)}
			readView={() => (
				<div
					css={[readViewForTextFieldStyles, isCompact && compactStyles]}
					data-compact={isCompact}
					data-testid={testId && `read-view-${testId}`}
				>
					{defaultValue || placeholder}
				</div>
			)}
		/>
	);
};

export default InlineEditableTextfield;
