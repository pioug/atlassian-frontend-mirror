import React, { type MouseEvent } from 'react';

import { render } from 'react-dom';
import { IntlProvider, type IntlShape } from 'react-intl-next';

import { type HyperlinkState, LinkAction, OverlayButton } from '@atlaskit/editor-common/link';
import { type PluginKey } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

export const ButtonWrapper = ({
	editorView,
	pos,
	stateKey,
	intl,
	onOpenLinkClick,
}: {
	editorView: EditorView;
	intl: IntlShape;
	/** Callback fired when the Open Link dropdown item is clicked */
	onOpenLinkClick: (event: MouseEvent<HTMLAnchorElement>) => void;
	pos?: number;
	stateKey: PluginKey<HyperlinkState>;
}) => {
	const wrapper = document.createElement('span');
	wrapper.style.position = 'relative';
	const nonBreakingCharacter = '\u2060';

	const onDropdownChange = (isOpen: boolean) => {
		editorView.dispatch(
			editorView.state.tr.setMeta(stateKey, {
				type: LinkAction.SET_CONFIGURE_DROPDOWN_OPEN,
				isOpen,
			}),
		);
	};

	render(
		<IntlProvider locale={intl.locale || 'en'} messages={intl.messages} formats={intl.formats}>
			<OverlayButton
				targetElementPos={pos}
				editorView={editorView}
				onDropdownChange={onDropdownChange}
				onOpenLinkClick={onOpenLinkClick}
			/>
			{nonBreakingCharacter}
		</IntlProvider>,
		wrapper,
	);

	return wrapper;
};
