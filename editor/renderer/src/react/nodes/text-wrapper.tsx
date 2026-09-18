import type { ReactNode } from 'react';
import React from 'react';

import type { Mark } from '@atlaskit/editor-prosemirror/model';

import { TextWithAnnotationDraft } from '../../ui/annotations/draft/component';
import type { TextHighlighter } from '../types';

type Props = {
	children?: ReactNode | null;
	endPos: number;
	marks?: readonly Mark[];
	startPos: number;
	textHighlighter?: TextHighlighter;
};

const TextWrapper = (props: Props): React.JSX.Element | null => {
	const { startPos, endPos } = props;
	const { children } = props;

	if (!children) {
		return null;
	}

	return (
		<TextWithAnnotationDraft
			startPos={startPos}
			endPos={endPos}
			textHighlighter={props.textHighlighter}
			marks={props.marks}
		>
			{children}
		</TextWithAnnotationDraft>
	);
};

export default TextWrapper;
