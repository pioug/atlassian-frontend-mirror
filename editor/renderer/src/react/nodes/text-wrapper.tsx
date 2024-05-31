import type { ReactNode } from 'react';
import React from 'react';
import { TextWithAnnotationDraft } from '../../ui/annotations';
import type { TextHighlighter } from '../types';
import type { Mark } from '@atlaskit/editor-prosemirror/model';

type Props = {
	startPos: number;
	endPos: number;
	children?: ReactNode | null;
	textHighlighter?: TextHighlighter;
	marks?: readonly Mark[];
};

const TextWrapper = (props: Props) => {
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
