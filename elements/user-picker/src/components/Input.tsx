import React, { type AriaAttributes } from 'react';
import { components, type OptionType, type SelectProps } from '@atlaskit/select';
import { type AriaAttributesType } from '../types';

export type Props = {
	selectProps?: SelectProps<OptionType, boolean>;
	innerRef: (ref: React.Ref<HTMLInputElement>) => void;
	ariaDescribedBy?: AriaAttributesType;
};

export class Input extends React.Component<Props & AriaAttributes> {
	// onKeyPress is used instead as
	// react-select is using onKeyDown for capturing keyboard input
	handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
		if (this.props.selectProps?.disableInput) {
			e.preventDefault();
		}
	};

	/**
	 * Overrides the default behaviour of react-select lib
	 *
	 * The getter is a workaround for original behaviour of the react-select lib.
	 * Placeholder and Input are linked not via label, aria-label or aria-labeledby, but through aria-describedby.
	 * Basically in the getter we reassign Placeholder ID from aria-describedby to aria-labelledby
	 * {@link https://github.com/JedWatson/react-select/issues/5651#issue-1731353197 GitHub}
	 */
	get ariaLabelledBy(): AriaAttributesType {
		return this.props['aria-labelledby'] ?? this.props['aria-describedby'];
	}

	get ariaDescribedBy(): AriaAttributesType {
		return this.props.selectProps?.['aria-describedby'] ?? this.props['aria-describedby'];
	}

	render() {
		return (
			<components.Input
				{...(this.props as any)}
				aria-labelledby={this.ariaLabelledBy}
				aria-describedby={this.ariaDescribedBy}
				innerRef={this.props.innerRef}
				onKeyPress={this.handleKeyPress}
			/>
		);
	}
}
