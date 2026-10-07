import React, { PureComponent } from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { ChromeCollapsedCompiled } from './ChromeCollapsed-compiled';
import { messages } from './messages';

export interface Props {
	label?: string;
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	text?: string;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class ChromeCollapsed extends PureComponent<Props & WrappedComponentProps, Object> {
	private input?: HTMLElement;

	private focusHandler = (evt: React.FocusEvent<HTMLInputElement>) => {
		/**
		 * We need this magic for FireFox.
		 * The reason we need it is, when, in FireFox, we have focus inside input,
		 * and then we remove that input and move focus to another place programmatically,
		 * for whatever reason UP/DOWN arrows don't work until you blur and focus editor manually.
		 */
		if (this.input) {
			this.input.blur();
		}

		if (this.props.onFocus) {
			this.props.onFocus(evt);
		}
	};

	private handleInputRef = (ref: HTMLInputElement) => {
		this.input = ref;
	};

	render() {
		const placeholder =
			this.props.text || this.props.intl.formatMessage(messages.chromeCollapsedPlaceholder);

		return (
			<ChromeCollapsedCompiled
				data-testid="chrome-collapsed"
				ref={this.handleInputRef}
				onFocus={this.focusHandler}
				placeholder={placeholder}
				aria-label={this.props.label}
			/>
		);
	}
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types
const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(ChromeCollapsed);
export default _default_1;
