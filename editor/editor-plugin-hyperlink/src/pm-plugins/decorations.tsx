import React from 'react';

import { render } from 'react-dom';
import { IntlProvider, type IntlShape } from 'react-intl-next';

import { OverlayButton } from '@atlaskit/editor-common/link';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

export const ButtonWrapper = ({
	editorView,
	pos,
	intl,
}: {
	editorView: EditorView;
	pos?: number;
	intl: IntlShape;
}) => {
	const wrapper = document.createElement('span');
	wrapper.style.position = 'relative';
	const nonBreakingCharacter = '\u2060';

	render(
		<IntlProvider locale={intl.locale || 'en'} messages={intl.messages} formats={intl.formats}>
			<OverlayButton targetElementPos={pos} editorView={editorView} />
			{nonBreakingCharacter}
		</IntlProvider>,
		wrapper,
	);

	return wrapper;
};
