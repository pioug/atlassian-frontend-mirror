import React, { PureComponent } from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { ChromeCollapsedCompiled } from './ChromeCollapsed-compiled';
import { ChromeCollapsedEmotion } from './ChromeCollapsed-emotion';
import { messages } from './messages';

const InputMigration = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	ChromeCollapsedCompiled,
	ChromeCollapsedEmotion,
);

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
			<InputMigration
				data-testid="chrome-collapsed"
				ref={this.handleInputRef}
				onFocus={this.focusHandler}
				placeholder={placeholder}
				aria-label={this.props.label}
			/>
		);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(ChromeCollapsed);
export default _default_1;
