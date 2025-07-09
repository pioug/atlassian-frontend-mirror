/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import React, { useRef } from 'react';
import { type ErrorFileState, type FileState } from '@atlaskit/media-client';
import { EditorView, lineNumbers, gutters } from '@codemirror/view';
import { Compartment, EditorState } from '@codemirror/state';
import { languages } from '@codemirror/language-data';
import { syntaxHighlighting } from '@codemirror/language';
import { token } from '@atlaskit/tokens';
import { cmTheme, highlightStyle } from './theme';

import { type MediaViewerError } from '../../../errors';

export type Props = {
	item: Exclude<FileState, ErrorFileState>;
	src: string;
	testId?: string;
	onClose?: () => void;
	onSuccess?: () => void;
	onError?: (error: MediaViewerError) => void;
};

const codeViewWrapperStyles = css({
	position: 'absolute',
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
	backgroundColor: token('elevation.surface', '#F4F5F7'),
	overflow: 'auto',
});

const codeViewerHeaderBarStyles = css({
	height: '75px',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#1d2125',
});

export const CodeRendererAdvanced = (props: Props) => {
	const nodeRef = useRef<React.RefCallback<HTMLDivElement>>((elem) => {
		if (!elem) {
			return;
		}

		const extension = props.item.name.split('.').pop() ?? '';

		const languageCompartment = new Compartment();

		const view = new EditorView({
			doc: props.src,
			parent: elem,
			extensions: [
				lineNumbers(),
				gutters(),
				EditorState.readOnly.of(true),
				EditorView.editable.of(false),
				EditorView.lineWrapping,
				cmTheme,
				syntaxHighlighting(highlightStyle),
				languageCompartment.of([]),
			],
		});

		props.onSuccess?.();

		const language = languages.find((lang) => lang.extensions.includes(extension));
		language?.load().then((val) => {
			view.dispatch({
				effects: languageCompartment.reconfigure(val),
			});
		});

		return () => {
			view.destroy();
		};
	});

	return (
		<div data-testid={props.testId} css={codeViewWrapperStyles}>
			<div css={codeViewerHeaderBarStyles} />
			<div ref={nodeRef.current}></div>
		</div>
	);
};
