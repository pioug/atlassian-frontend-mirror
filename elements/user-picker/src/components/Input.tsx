/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type AriaAttributes } from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { components, type OptionType, type SelectProps } from '@atlaskit/select';
import { type AriaAttributesType } from '../types';
import { token } from '@atlaskit/tokens';
import { cssMap, jsx } from '@compiled/react';

export type Props = {
	ariaDescribedBy?: AriaAttributesType;
	innerRef: (ref: React.Ref<HTMLInputElement>) => void;
	selectProps?: SelectProps<OptionType, boolean>;
};

const inputStyles = cssMap({
	root: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& input::placeholder': {
			/* Chrome, Firefox, Opera, Safari 10.1+ */
			color: token('color.text.subtlest'),
			opacity: 1 /* Firefox */,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'& input:-ms-input-placeholder': {
			/* Internet Explorer 10-11 */
			color: token('color.text.subtlest'),
		},
	},
});

export class Input extends React.Component<Props & AriaAttributes> {
	// onKeyPress is used instead as
	// react-select is using onKeyDown for capturing keyboard input
	handleKeyPress = (e: KeyboardEvent): void => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
		//@ts-ignore react-select unsupported props
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
	 *
	 * This reassignment should only apply when the input has no other accessible name.
	 */
	get ariaLabelledBy(): AriaAttributesType {
		if (fg('platform_user_picker_fix_redundant_labelledby')) {
			// A11Y-37267: An explicit aria-labelledby is a deliberate association with a visible label
			// element and is the field's true accessible name (WCAG 2.5.3 Label in Name), so it always
			// wins. Otherwise we promote aria-describedby -> aria-labelledby to work around
			// react-select's placeholder linkage bug, but skip that promotion when the input already
			// has an accessible name via aria-label so the description is announced via
			// aria-describedby instead.
			if (this.props['aria-labelledby']) {
				return this.props['aria-labelledby'];
			}
			if (this.props['aria-label']) {
				return undefined;
			}
			return this.props['aria-describedby'];
		}
		return this.props['aria-labelledby'] ?? this.props['aria-describedby'];
	}

	get ariaDescribedBy(): AriaAttributesType {
		return this.props.selectProps?.['aria-describedby'] ?? this.props['aria-describedby'];
	}

	render(): JSX.Element {
		return (
			<components.Input
				{...(this.props as any)}
				aria-labelledby={this.ariaLabelledBy}
				aria-describedby={this.ariaDescribedBy}
				innerRef={this.props.innerRef}
				onKeyPress={this.handleKeyPress}
				xcss={inputStyles.root}
			/>
		);
	}
}
