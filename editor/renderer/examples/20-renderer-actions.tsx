/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';
import type { DocNode } from '@atlaskit/adf-schema';
import { generateUuid } from '@atlaskit/adf-schema';
import { Y75, Y200 } from '@atlaskit/theme/colors';

import RendererDemo from './helper/RendererDemo';
import { validDocument as storyDataDocument } from './helper/story-data';
import { RendererActionsContext } from '../src/ui/RendererActionsContext';
import { WithRendererActions } from '../src/ui/RendererActionsContext/WithRendererActions';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
import { AnnotationsWrapper } from '../src';
import { useAnnotationsProvider } from './21-annotations';

const transformer = new JSONTransformer();

function AnnotationSelect({ doc, onDelete }: { doc?: Node; onDelete: (id: string) => void }) {
	const [selectedId, setSelected] = useState<string | null>(null);

	if (!doc) {
		return null;
	}
	let options: any[] = [];
	const ids: string[] = [];
	doc.descendants((node) => {
		node.marks.forEach((mark) => {
			if (mark.type.name === 'annotation' && !ids.includes(mark.attrs.id)) {
				ids.push(mark.attrs.id);
			}
		});
		return true;
	});

	if (ids.length) {
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-key
		options = ids.map((id) => <option value={id}>{id}</option>);
	}

	if (!options.length) {
		return null;
	}

	return (
		<span>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-select */}
			<select
				onChange={(e) => {
					setSelected(e.target.value);
				}}
			>
				<option>-- Select annotation to delete --</option>
				{options}
			</select>
			<button
				onClick={() => {
					if (selectedId) {
						onDelete(selectedId);
					}
				}}
			>
				Delete annotation
			</button>
		</span>
	);
}

const wrapperStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"[data-mark-type='annotation']": {
		backgroundColor: token('color.background.accent.yellow.subtler', Y75),
		borderBottom: `2px solid ${token('color.border.accent.yellow', Y200)}`,
	},
});

export default function Example() {
	const [document, setDocument] = useState<any>(storyDataDocument);
	const [selectionValid, setSelectionValidity] = useState(false);
	const localRef = React.useRef<HTMLDivElement>(null);

	const annotationInlineCommentProvider = useAnnotationsProvider(setDocument);
	const annotationProvider = React.useMemo(() => {
		return {
			inlineComment: annotationInlineCommentProvider,
		};
	}, [annotationInlineCommentProvider]);

	return (
		<SmartCardProvider client={new CardClient('stg')}>
			<RendererActionsContext>
				<WithRendererActions
					render={(actions) => {
						return (
							<div css={wrapperStyle}>
								<AnnotationsWrapper
									rendererRef={localRef}
									adfDocument={document as DocNode}
									annotationProvider={annotationProvider}
									isNestedRender={false}
								>
									<RendererDemo
										serializer="react"
										document={document}
										allowColumnSorting={true}
										allowAnnotations={true}
										actionButtons={[
											// Ignored via go/ees005
											// eslint-disable-next-line react/jsx-key
											<button
												onClick={() => {
													const selection = window.getSelection();
													if (!selection || selection.isCollapsed) {
														return;
													}

													const result = actions.annotate(
														selection.getRangeAt(0),
														generateUuid(),
														'inlineComment',
													);

													if (result) {
														selection.removeAllRanges();
														// @ts-ignore
														setDocument(result.doc);
													}
												}}
											>
												Add annotation
											</button>,
											// Ignored via go/ees005
											// eslint-disable-next-line react/jsx-key
											<span>
												<button
													onClick={() => {
														const selection = window.getSelection();
														if (!selection || selection.isCollapsed) {
															return;
														}

														const valid = actions.isValidAnnotationRange(selection.getRangeAt(0));

														if (valid !== selectionValid) {
															setSelectionValidity(valid);
														}
													}}
												>
													Validate selection
												</button>{' '}
												Selection valid: {`${selectionValid}`}{' '}
											</span>,
											// Ignored via go/ees005
											// eslint-disable-next-line react/jsx-key
											<AnnotationSelect
												doc={transformer.parse(document)}
												onDelete={(annotationId) => {
													const result = actions.deleteAnnotation(annotationId, 'inlineComment');

													if (result) {
														// @ts-ignore
														setDocument(result.doc);
													}
												}}
											/>,
										]}
									/>
								</AnnotationsWrapper>
							</div>
						);
					}}
				/>
			</RendererActionsContext>
		</SmartCardProvider>
	);
}
