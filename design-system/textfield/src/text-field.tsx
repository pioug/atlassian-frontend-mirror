/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import React, { forwardRef, useCallback, useMemo, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';

import { containerStyles as getContainerStyles, inputStyles as getInputStyles } from './styles';
import { type TextfieldProps } from './types';

const analyticsParams = {
	componentName: 'textField',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

/**
 * __Textfield__
 *
 * A text field is an input that allows a user to write or edit text.
 *
 * - [Examples](https://atlassian.design/components/textfield/examples)
 * - [Code](https://atlassian.design/components/textfield/code)
 * - [Usage](https://atlassian.design/components/textfield/usage)
 */
const Textfield = forwardRef((props: TextfieldProps, ref) => {
	const {
		appearance = 'standard',
		className,
		elemAfterInput,
		elemBeforeInput,
		isCompact = false,
		isDisabled = false,
		isInvalid = false,
		isMonospaced = false,
		isReadOnly = false,
		isRequired = false,
		name,
		onBlur,
		onChange,
		onFocus,
		onMouseDown,
		placeholder,
		testId,
		width,
		...spreadProps
	} = props;

	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleOnFocus = usePlatformLeafEventHandler({
		fn: (event: React.FocusEvent<HTMLInputElement>) => {
			onFocus && onFocus(event);
		},
		action: 'focused',
		...analyticsParams,
	});

	const handleOnBlur = usePlatformLeafEventHandler({
		fn: (event: React.FocusEvent<HTMLInputElement>) => {
			onBlur && onBlur(event);
		},
		action: 'blurred',
		...analyticsParams,
	});

	const handleOnMouseDown = useCallback(
		(event: React.MouseEvent<HTMLInputElement>) => {
			// Running e.preventDefault() on the INPUT prevents double click behaviour
			// Sadly we needed this cast as the target type is being correctly set
			const target: HTMLInputElement = event.target as HTMLInputElement;
			if (target.tagName !== 'INPUT') {
				event.preventDefault();
			}

			if (
				inputRef &&
				inputRef.current &&
				!isDisabled &&
				document.activeElement !== inputRef.current
			) {
				inputRef.current.focus();
			}

			onMouseDown && onMouseDown(event);
		},
		[onMouseDown, isDisabled],
	);

	const setInputRef = useCallback(
		(inputElement: HTMLInputElement | null) => {
			inputRef.current = inputElement;

			if (!ref) {
				return;
			}

			if (typeof ref === 'object') {
				ref.current = inputElement;
			}

			if (typeof ref === 'function') {
				ref(inputElement);
			}
		},
		[ref],
	);

	const containerStyles = useMemo(() => getContainerStyles(appearance, width), [appearance, width]);

	const inputStyle = getInputStyles();

	return (
		/**
		 * It is not normally acceptable to add click and key handlers to
		 * non-interactive elements as this is an accessibility anti-pattern.
		 * However, because this instance is to handle events on all children that
		 * should be associated with the input, we can add role="presentation" so
		 * that there are no negative impacts to assistive technologies.
		 */
		<div
			role="presentation"
			data-disabled={isDisabled ? isDisabled : undefined}
			data-invalid={isInvalid ? isInvalid : undefined}
			data-ds--text-field--container
			data-testid={testId && `${testId}-container`}
			onMouseDown={handleOnMouseDown}
			// TODO: When removing legacy theming fix this.
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			css={containerStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{elemBeforeInput}
			<input
				{...spreadProps}
				aria-invalid={isInvalid ? isInvalid : undefined}
				// TODO: When removing legacy theming fix this.
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				css={inputStyle}
				data-compact={isCompact ? isCompact : undefined}
				data-ds--text-field--input
				data-monospaced={isMonospaced ? isMonospaced : undefined}
				data-testid={testId}
				disabled={isDisabled}
				name={name}
				onBlur={handleOnBlur}
				onChange={onChange}
				onFocus={handleOnFocus}
				placeholder={placeholder}
				readOnly={isReadOnly}
				ref={setInputRef}
				required={isRequired}
			/>
			{elemAfterInput}
		</div>
	);
});

export default Textfield;
