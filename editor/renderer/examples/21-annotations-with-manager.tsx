/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IntlProvider } from 'react-intl-next';

import { css, jsx } from '@atlaskit/css';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import type { AnnotationSelectedChangeData } from '@atlaskit/editor-common/annotation';
import { type AnnotationProviders, AnnotationUpdateEvent } from '@atlaskit/editor-common/types';
import {
	AnnotationsProvider,
	CommentsContentProvider,
	RendererAnnotationComponents,
	useRendererAnnotationProviders,
} from '@atlaskit/editor-test-helpers/annotation-example';
import {
	useUpdateDocument,
	UpdateDocumentProvider,
	type UpdateDocument,
} from '@atlaskit/editor-test-helpers/update-document-context';
import { getExampleExtensionProviders } from '@atlaskit/editor-test-helpers/example-helpers';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';
import { getExamplesProviders } from '@af/editor-examples-helpers/utils';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { AnnotationsWrapper, RendererWithAnalytics } from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions';
import { token } from '@atlaskit/tokens';
import { Inline } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';
import { ButtonGroup } from '@atlaskit/button';
import Button, { IconButton } from '@atlaskit/button/new';
import DeleteIcon from '@atlaskit/icon/core/delete';
import SectionMessage from '@atlaskit/section-message';

import { exampleDocumentWithComments } from './helper/annotations/example-doc-with-comments';

const leftPanelStyle = css({
	flex: '20%',
	backgroundColor: token('color.background.neutral.subtle'),
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
	borderRightColor: token('color.border'),
	borderRightStyle: 'solid',
	borderRightWidth: token('border.width'),
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.100'),
});

const rightPanelStyle = css({
	flex: '80%',
});

const singlePanelStyle = css({
	flex: '100%',
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
});

const annotationControlContainerStyle = css({
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.100'),
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: token('color.border'),
	borderRadius: token('border.radius'),
	paddingTop: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	paddingRight: token('space.100'),
});

const AnnotationControl = React.memo(
	({
		id,
		resolved,
		annotationProviders,
		hoveredAnnotationId,
		setHoveredAnnotationId,
		selectedAnnotationId,
	}: {
		annotationProviders: AnnotationProviders;
		hoveredAnnotationId: string | null;
		id: string;
		resolved: boolean;
		selectedAnnotationId: string | null;
		setHoveredAnnotationId: React.Dispatch<React.SetStateAction<string | null>>;
	}) => {
		const { updateDocument } = useUpdateDocument();
		const [resolvedSate, setResolvedState] = useState(resolved);
		// list the controls for the annotations like resolved state, hovered, selected, delete, etc
		// const currentHoveredId = useRef<string | null>(null);

		const annotationManager = annotationProviders.annotationManager;
		const isSelected = selectedAnnotationId === id;
		const isHovered = hoveredAnnotationId === id;

		const onSelect = useCallback(
			(e: React.MouseEvent) => {
				if (annotationManager) {
					// If the current selected id is the same as the one we are selecting, then we should unselect it,
					// otherwise we the current id to selected
					const result = annotationManager.setIsAnnotationSelected?.(
						id,
						selectedAnnotationId !== id,
					);
					console.log(`Select Annotation with id: ${id}`, result);
					// selectedAnnotationId = selectedAnnotationId !== id ? id : null;
				}
			},
			[id, annotationManager, selectedAnnotationId],
		);

		const onHovered = useCallback(
			(e: React.MouseEvent) => {
				if (annotationManager) {
					// If the current hovered id is the same as the one we are hovering, then we should unhover it,
					// otherwise we the current id to hovered
					const result = annotationManager.setIsAnnotationHovered?.(id, hoveredAnnotationId !== id);
					console.log(`Hover Annotation with id: ${id}`, result);
					setHoveredAnnotationId((prev) => {
						return prev !== id ? id : null;
					});
				}
			},
			[id, annotationManager, hoveredAnnotationId, setHoveredAnnotationId],
		);

		const onDelete = useCallback(
			(e: React.MouseEvent) => {
				if (annotationManager) {
					const result = annotationManager.clearAnnotation?.(id);
					console.log(`Delete Annotation with id: ${id}`, result);
					if (result.success && result.actionResult) {
						updateDocument?.(result.actionResult);
					}
				}
			},
			[id, annotationManager, updateDocument],
		);

		const onResolveToggle = useCallback(
			(e: ChangeEvent<HTMLInputElement>) => {
				// This is only added for backwards compatibility with the old API, this new API has not added support for
				// toggling resolved state, so we need to use the old API
				annotationProviders.inlineComment.updateSubscriber?.emit(
					AnnotationUpdateEvent.SET_ANNOTATION_STATE,
					{
						[id]: {
							id,
							annotationType: AnnotationTypes.INLINE_COMMENT,
							state: resolvedSate ? AnnotationMarkStates.ACTIVE : AnnotationMarkStates.RESOLVED,
						},
					},
				);
				setResolvedState(!resolvedSate);
			},
			[id, annotationProviders, resolvedSate],
		);

		return (
			<div css={annotationControlContainerStyle}>
				<strong>{id}</strong>
				<Inline alignBlock="center" space="space.100">
					<Inline alignBlock="center">
						<Toggle
							id="toggle-resolved"
							onChange={onResolveToggle}
							isChecked={resolvedSate}
							label="Resolved"
							size="large"
						/>
						<label htmlFor="toggle-resolved">Resolved</label>
					</Inline>

					<ButtonGroup label="Default button group">
						<Button onClick={onSelect} appearance={isSelected ? 'discovery' : 'subtle'}>
							Select
						</Button>

						<Button onClick={onHovered} appearance={isHovered ? 'discovery' : 'subtle'}>
							Hover
						</Button>
						<IconButton
							icon={DeleteIcon}
							appearance="subtle"
							onClick={onDelete}
							label="Delete Annotation"
						/>
					</ButtonGroup>
				</Inline>
			</div>
		);
	},
);

interface ExampleAnnotationsWithManagerRendererProps {
	adf: JSONDocNode;
}

const ExampleAnnotationsWithManagerRenderer = React.memo(
	(props: ExampleAnnotationsWithManagerRendererProps) => {
		const { adf } = props;
		const smartCardClient = useMemo(() => new CardClient('stg'), []);
		const rendererRef = useRef<HTMLDivElement>(null);

		const _annotationProviders = useRendererAnnotationProviders();
		const [annotationStates, setAnnotationStates] = useState<{ id: string; resolved: boolean }[]>(
			[],
		);

		const annotationProviders: AnnotationProviders = useMemo(() => {
			// This hooks into the initial loading of the annotations, so that we can get a list of the ids and their resolved state
			// and then we can use that to render the list of annotations in the left panel.
			const getState = async (annotationsIds: string[]) => {
				const states = await _annotationProviders.inlineComment.getState(annotationsIds, false);
				setAnnotationStates(
					states.map((value) => ({
						id: value.id,
						resolved: value.state === 'resolved',
					})),
				);
				return states;
			};

			return {
				..._annotationProviders,
				inlineComment: {
					..._annotationProviders.inlineComment,
					getState,
					// NOTE: This is nuking the manager components which normally would be passed in
					// to determine when to show the create or view components.
					// This logic has been reimplemented above in the RendererAnnotationComponents
					// to demonstrate the new API doesn't require the manager components to be passed in anymore.
					// but we still need selectionComponent, because the selection range is passed to it
					// selectionComponent: () => null,
					viewComponent: () => null,
					hoverComponent: () => null,
				},
			};
		}, [_annotationProviders]);

		const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
		const [hoveredAnnotationId, setHoveredAnnotationId] = useState<string | null>(null);

		useEffect(() => {
			if (annotationProviders.annotationManager) {
				const callback = (event: AnnotationSelectedChangeData) => {
					setSelectedAnnotationId((prev) => {
						if (prev === event.annotationId && !event.isSelected) {
							return null;
						}

						if (prev !== event.annotationId && event.isSelected) {
							return event.annotationId;
						}

						return prev;
					});

					// This is a special case for the example were we need to keep the left panel in sync with the
					// available annotations in the renderer.
					// If a selection changed and it's not in the state then we will regen the states, adding the new id.
					if (!annotationStates.some(({ id }) => id === event.annotationId)) {
						setAnnotationStates(
							annotationStates.concat({ id: event.annotationId, resolved: false }),
						);
					}
				};
				annotationProviders.annotationManager.onAnnotationSelectionChange(callback);
				return () => {
					annotationProviders.annotationManager?.offAnnotationSelectionChange(callback);
				};
			}
		}, [annotationProviders.annotationManager, annotationStates]);

		if (!annotationProviders.annotationManager) {
			return (
				<div css={singlePanelStyle}>
					<SectionMessage title="Example Unavailable" appearance="warning">
						<p>
							This example is only compatible with the new Annotation Manager. You may need to
							enabled some feature gates to use this example.
						</p>
					</SectionMessage>
				</div>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ display: 'flex', height: '100%' }}>
				<div css={leftPanelStyle}>
					<h3>Annotations</h3>

					{!!annotationStates.length &&
						annotationStates.map((annotation) => (
							<AnnotationControl
								key={annotation.id}
								id={annotation.id}
								resolved={annotation.resolved}
								annotationProviders={annotationProviders}
								hoveredAnnotationId={hoveredAnnotationId}
								setHoveredAnnotationId={setHoveredAnnotationId}
								selectedAnnotationId={selectedAnnotationId}
							/>
						))}

					{!annotationStates.length && (
						<p>It looks like there are no annotations in this document.</p>
					)}
				</div>
				<div css={rightPanelStyle}>
					<SmartCardProvider client={smartCardClient}>
						<RendererActionsContext>
							<AnnotationsWrapper
								rendererRef={rendererRef}
								adfDocument={adf}
								annotationProvider={annotationProviders}
								isNestedRender={false}
							>
								<RendererAnnotationComponents annotationProviders={annotationProviders} />
								<RendererWithAnalytics
									innerRef={rendererRef}
									allowAnnotations
									annotationProvider={annotationProviders}
									allowHeadingAnchorLinks={{
										allowNestedHeaderLinks: true,
									}}
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									document={adf as any}
									adfStage="stage0"
									dataProviders={ProviderFactory.create({
										...getExamplesProviders({}),
										extensionProvider: Promise.resolve(getExampleExtensionProviders(undefined)),
									})}
									allowColumnSorting={true}
									shouldOpenMediaViewer={true}
									appearance="full-page"
									allowAltTextOnImages={true}
									extensionHandlers={extensionHandlers}
									media={{
										featureFlags: { ...exampleMediaFeatureFlags },
										allowLinking: true,
										allowCaptions: true,
										enableDownloadButton: true,
									}}
									allowCopyToClipboard={true}
									allowWrapCodeBlock={true}
									useSpecBasedValidator={true}
									allowSelectAllTrap
									// featureFlags={props.featureFlags}
									allowCustomPanels={true}
								/>
							</AnnotationsWrapper>
						</RendererActionsContext>
					</SmartCardProvider>
				</div>
			</div>
		);
	},
);
ExampleAnnotationsWithManagerRenderer.displayName = 'ExampleAnnotationsWithManagerRenderer';

// eslint-disable-next-line jsdoc/require-jsdoc
export default function ExampleAnnotationsWithManager() {
	const [adf, setAdf] = useState<JSONDocNode>(exampleDocumentWithComments);

	// this will be called when the renderer changes the document such as adding/deleting annotations
	const updateDocument = useCallback<UpdateDocument>((result): void => {
		setAdf(result.doc);
	}, []);

	return (
		<IntlProvider locale="en-US" onError={() => {}}>
			<UpdateDocumentProvider updateDocument={updateDocument}>
				<AnnotationsProvider>
					<CommentsContentProvider>
						<ExampleAnnotationsWithManagerRenderer adf={adf} />
					</CommentsContentProvider>
				</AnnotationsProvider>
			</UpdateDocumentProvider>
		</IntlProvider>
	);
}
ExampleAnnotationsWithManager.displayName = 'ExampleAnnotationsWithManager';
