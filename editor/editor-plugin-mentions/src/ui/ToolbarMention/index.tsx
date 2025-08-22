import React, { PureComponent } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { mentionMessages as messages } from '@atlaskit/editor-common/messages';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import MentionIcon from '@atlaskit/icon/core/migration/mention--editor-mention';

interface Props {
	editorView?: EditorView;
	isDisabled?: boolean;
	onInsertMention: () => void;
	testId?: string;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class ToolbarMention extends PureComponent<Props & WrappedComponentProps> {
	render() {
		const mentionStringTranslated = this.props.intl.formatMessage(messages.mentionsIconLabel);

		return (
			<ToolbarButton
				testId={this.props.testId}
				buttonId={TOOLBAR_BUTTON.MENTION}
				spacing="none"
				onClick={this.handleInsertMention}
				disabled={this.props.isDisabled}
				title={mentionStringTranslated + '@'}
				iconBefore={<MentionIcon label={mentionStringTranslated} />}
			/>
		);
	}

	private handleInsertMention = (): boolean => {
		if (!this.props.editorView) {
			return false;
		}

		this.props.onInsertMention();
		return true;
	};
}

export default injectIntl(ToolbarMention);
