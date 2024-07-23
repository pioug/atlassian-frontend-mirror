/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { PureComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { messages } from './messages';
import { inputStyle } from './styles';

export interface Props {
	text?: string;
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

class ChromeCollapsed extends PureComponent<Props & WrappedComponentProps, {}> {
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
			<input
				data-testid="chrome-collapsed"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={inputStyle}
				ref={this.handleInputRef}
				onFocus={this.focusHandler}
				placeholder={placeholder}
			/>
		);
	}
}

export default injectIntl(ChromeCollapsed);
