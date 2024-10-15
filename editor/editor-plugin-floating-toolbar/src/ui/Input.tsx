/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Component, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { panelTextInput } from '@atlaskit/editor-common/ui';

export interface Props {
	mountPoint?: HTMLElement;
	boundariesElement?: HTMLElement;
	defaultValue?: string;
	placeholder?: string;
	onBlur?: (text: string) => void;
	onSubmit?: (text: string) => void;
}

export interface State {
	text: string;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class InputOld extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			text: props.defaultValue || '',
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps: Props) {
		if (this.state.text !== nextProps.defaultValue) {
			this.setState({
				text: nextProps.defaultValue || '',
			});
		}
	}

	handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ text: e.target.value });
	};

	handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (this.props.onSubmit) {
			this.props.onSubmit(this.state.text);
		}
	};

	handleBlur = (e: React.FocusEvent<{}>) => {
		e.preventDefault();
		if (this.props.onBlur) {
			this.props.onBlur(this.state.text);
		}
	};

	render() {
		const { placeholder } = this.props;
		return (
			<form onSubmit={this.handleSubmit}>
				<input
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					css={panelTextInput}
					value={this.state.text}
					onChange={this.handleChange}
					placeholder={placeholder}
					onBlur={this.handleBlur}
				/>
			</form>
		);
	}
}

export const InputNew = (props: Props) => {
	const { defaultValue, onBlur, onSubmit, placeholder } = props;
	const [text, setText] = useState(defaultValue || '');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit && onSubmit(text);
	};

	const handleBlur = (e: React.FocusEvent<{}>) => {
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
