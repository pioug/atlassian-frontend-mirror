/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useRef, useState } from 'react';

import { syntaxHighlighting } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, gutters } from '@codemirror/view';
import { jsx, css } from '@compiled/react';

import type { ErrorFileState, FileState } from '@atlaskit/media-state/file-state';
import { token } from '@atlaskit/tokens';

import { useIsInsetViewer, useMediaFooterControls } from '../../../insetViewerContext';
import type { MediaViewerError } from '../../../MediaViewerError';
import { INSET_VIEWER_GUTTER_PX } from '../../../styleWrappers';
import { CodeViewerFooter } from '../CodeViewerFooter';
import { cmTheme, highlightStyle, insetViewerCmTheme } from './theme';

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
	backgroundColor: token('elevation.surface'),
	overflow: 'auto',
});

const insetViewerCodeViewWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- the gutter is a px constant because the image and video fit maths need it as a number, so it is imported to keep code files on the same gutter
	left: `${INSET_VIEWER_GUTTER_PX}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- the gutter is a px constant because the image and video fit maths need it as a number, so it is imported to keep code files on the same gutter
	right: `${INSET_VIEWER_GUTTER_PX}px`,
	borderRadius: token('radius.large', '8px'),
	// The editor scrolls, not the wrapper, so the scrollbar stays inside the rounded corners.
	overflow: 'hidden',
});

// Gives the editor a definite height to fill, so its own scroller scrolls.
const insetViewerEditorHostStyles = css({
	height: '100%',
});

const codeViewerHeaderBarStyles = css({
	height: '75px',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#1d2125',
});

export const CodeRendererAdvanced = (props: Props): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	const footerElement = useMediaFooterControls();
	// CodeMirror already splits the document into lines, so the footer gets the count for free.
	const [lineCount, setLineCount] = useState<number>();
	const extension = props.item.name.split('.').pop() ?? '';
	const language = languages.find((lang) => lang.extensions.includes(extension));
	const nodeRef = useRef<React.RefCallback<HTMLDivElement>>((elem) => {
		if (!elem) {
			return;
		}

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
				isInsetViewer ? insetViewerCmTheme : cmTheme,
				syntaxHighlighting(highlightStyle),
				languageCompartment.of([]),
			],
		});

		if (isInsetViewer) {
			setLineCount(view.state.doc.lines);
		}
		props.onSuccess?.();

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
		<div
			data-testid={props.testId}
			css={[codeViewWrapperStyles, isInsetViewer && insetViewerCodeViewWrapperStyles]}
		>
			{/* The inset viewer has its own header row, so there is nothing to clear. */}
			{!isInsetViewer && <div css={codeViewerHeaderBarStyles} />}
			<div ref={nodeRef.current} css={isInsetViewer && insetViewerEditorHostStyles}></div>
			{isInsetViewer && (
				<CodeViewerFooter
					lineCount={lineCount}
					languageName={language?.name}
					footerElement={footerElement}
				/>
			)}
		</div>
	);
};
