/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';

import { panelTextInput } from '@atlaskit/editor-common/ui';

export interface Props {
	boundariesElement?: HTMLElement;
	defaultValue?: string;
	mountPoint?: HTMLElement;
	onBlur?: (text: string) => void;
	onSubmit?: (text: string) => void;
	placeholder?: string;
}

export interface State {
	text: string;
}
export const Input = (props: Props): jsx.JSX.Element => {
	const { defaultValue, onBlur, onSubmit, placeholder } = props;
	const [text, setText] = useState(defaultValue || '');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit && onSubmit(text);
	};

	const handleBlur = (e: React.FocusEvent<Object>) => {
		e.preventDefault();
		onBlur && onBlur(text);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={panelTextInput}
				value={text}
				onChange={handleChange}
				placeholder={placeholder}
				onBlur={handleBlur}
			/>
		</form>
	);
};
