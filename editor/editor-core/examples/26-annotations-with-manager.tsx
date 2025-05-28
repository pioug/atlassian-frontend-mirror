/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { getExamplesProviders } from '@af/editor-examples-helpers/utils';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { ButtonGroup } from '@atlaskit/button';
import Button, { IconButton } from '@atlaskit/button/new';
import { jsx, cssMap } from '@atlaskit/css';
import type {
	AnnotationDraftStartedData,
	AnnotationSelectedChangeData,
} from '@atlaskit/editor-common/annotation';
import type { EditorProps } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { codeBlockAdvancedPlugin } from '@atlaskit/editor-plugin-code-block-advanced';
import { selectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';
import type { AnnotationProviders } from '@atlaskit/editor-plugins/annotation';
import {
	AnnotationsProvider,
	CommentsContentProvider,
	useEditorAnnotationProviders,
	ModalWrapper,
	useAnnotationManager,
	useAnnotations,
	useAnnotationsDispatch,
	useCommentsContentState,
	useCommentsContentActions,
	useModalWrapperState,
	EditorCreateInlineComment,
	EditorViewInlineComment,
} from '@atlaskit/editor-test-helpers/annotation-example';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import DeleteIcon from '@atlaskit/icon/core/delete';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import { exampleDocumentWithComments } from '../example-helpers/example-doc-with-comments';
import enMessages from '../src/i18n/en';

const smartLinksProvider = new ConfluenceCardProvider('staging');
const smartCardClient = new ConfluenceCardClient('staging');

const EXAMPLE_NAME = 'annotations-with-manager';

const styles = cssMap({
	leftPanelStyle: {
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
	},
	rightPanelStyle: {
		flex: '80%',
	},
	singlePanelStyle: {
		flex: '100%',
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	annotationControlContainerStyle: {
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('border.radius'),
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
});

function getDefaultValue() {
	const doc = localStorage.getItem(`${EXAMPLE_NAME}-doc`);
	return doc ? JSON.parse(doc) : exampleDocumentWithComments;
}

const AnnotationControl = ({
	id,
	resolved,
	annotationProviders,
	hoveredAnnotationId,
	setHoveredAnnotationId,
	selectedAnnotationId,
}: {
	id: string;
	resolved: boolean;
	annotationProviders: AnnotationProviders;
	hoveredAnnotationId: string | null;
	setHoveredAnnotationId: React.Dispatch<React.SetStateAction<string | null>>;
	selectedAnnotationId: string | null;
}) => {
	const [resolvedSate, setResolvedState] = useState(resolved);
	// list the controls for the annotations like resolved state, hovered, selected, delete, etcs
	// const currentHoveredId = useRef<string | null>(null);

	const annotationManager = annotationProviders.annotationManager;
	const isSelected = selectedAnnotationId === id;
	const isHovered = hoveredAnnotationId === id;

	const onSelect = useCallback(
		(e: React.MouseEvent) => {
			if (annotationManager) {
				// If the current hovered id is the same as the one we are hovering, then we should unhover it,
				// otherwise we the current id to hovered
				const result = annotationManager.setIsAnnotationSelected?.(id, selectedAnnotationId !== id);
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
				// If the current hovered id is the same as the one we are hovering, then we should unhover it,
				// otherwise we the current id to hovered
				const result = annotationManager.clearAnnotation?.(id);
				console.log(`Delete Annotation with id: ${id}`, result);
			}
		},
		[id, annotationManager],
	);

	const onResolveToggle = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			// This is only added for backwards compatibility with the old API, this new API has not added support for
			// toggling resolved state, so we need to use the old API
			annotationProviders.inlineComment.updateSubscriber?.emit(
				resolvedSate ? 'unresolve' : 'resolve',
				id,
			);
			setResolvedState(!resolvedSate);
		},
		[id, annotationProviders, resolvedSate],
	);

	return (
		<Stack xcss={styles.annotationControlContainerStyle} space="space.100" alignBlock="center">
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
		</Stack>
	);
};

const EditorAnnotationComponents = React.memo(
	({ annotationProviders }: { annotationProviders: AnnotationProviders }) => {
		const annotationManager = useAnnotationManager();
		const { editorCreateProps, editorViewProps, isOffline } = useAnnotations();
		const { setEditorCreateProps, setEditorViewProps } = useAnnotationsDispatch();
		const { hasContentChanged } = useCommentsContentState();
		const { resetContentChanged } = useCommentsContentActions();
		const { isOpen, openModal, cancelModal, confirmModal } = useModalWrapperState();

		useEffect(() => {
			if (hasContentChanged) {
				annotationManager?.setPreemptiveGate(
					() =>
						new Promise((resolve) => {
							// Show discard changes confirmation prompt
							openModal({
								onConfirm: () => {
									resetContentChanged();
									setEditorCreateProps(null);
									setEditorViewProps(null);
									resolve(true);
								},
								onCancel: () => {
									resolve(false);
								},
							});
						}),
				);
			} else {
				annotationManager?.setPreemptiveGate(() => Promise.resolve(true));
			}
			return () => {
				annotationManager?.setPreemptiveGate(() => Promise.resolve(true));
			};
		}, [
			hasContentChanged,
			openModal,
			annotationManager,
			resetContentChanged,
			setEditorCreateProps,
			setEditorViewProps,
		]);

		// When either an annotation is selected or a draft is started we will want to show the create or view panels
		// previously this was handled by the editor rendering a "manager" component which would call setEditorCreateProps or view props
		// however this is not longer needed and insteasd we can just listen to the events from the annotation manager
		// and set the props directly.
		// This means the product can now control when to show/hide the create or view components
		useEffect(() => {
			if (annotationManager) {
				const draftStartedCb = (event: AnnotationDraftStartedData) => {
					setEditorViewProps(null);
					setEditorCreateProps({
						// There reason this onCreate is empty is because the EditorCreateInlineComment component
						// already adds hooks into the annotationManager to handle the apply and clear draft situtions.
						// We just pass an empty function here to demo the minimal required props.
						onCreate: (annotationId: string) => {},
						inlineNodeTypes: event.inlineNodeTypes,
						pageId: 'mock-page-id',
						dom: event.targetElement,
					});
				};

				const selectionChangedCb = (event: AnnotationSelectedChangeData) => {
					if (event.isSelected) {
						setEditorCreateProps(null);
						setEditorViewProps({
							annotations: [
								{
									id: event.annotationId,
									type: AnnotationTypes.INLINE_COMMENT,
								},
							],
							onResolve: (id: string) => {},
							onDelete: (id: string) => {
								const result = annotationManager.clearAnnotation(id);
								console.log(`Delete Annotation with id: ${id}`, result);
							},
							onClose: () => {
								const result = annotationManager.setIsAnnotationSelected?.(
									event.annotationId,
									false,
								);
								console.log(`Close Annotation with id: ${event.annotationId}`, result);
							},
							pageId: 'mock-page-id',
							getInlineNodeTypes: (id: string) => undefined,
							dom:
								document.querySelector<HTMLElement>(`[data-id="${event.annotationId}"]`) ??
								undefined,
						});
					}
				};

				annotationManager?.onDraftAnnotationStarted(draftStartedCb);
				annotationManager?.onAnnotationSelectionChange(selectionChangedCb);

				return () => {
					annotationManager?.offDraftAnnotationStarted(draftStartedCb);
					annotationManager?.offAnnotationSelectionChange(selectionChangedCb);
				};
			}
		}, [annotationManager, setEditorViewProps, setEditorCreateProps]);

		return (
			<React.Fragment>
				<ModalWrapper isOpen={isOpen} cancelModal={cancelModal} confirmModal={confirmModal} />
				{editorCreateProps && (
					<EditorCreateInlineComment
						onCreate={editorCreateProps.onCreate}
						onClose={editorCreateProps.onClose}
						dom={editorCreateProps.dom}
						inlineNodeTypes={editorCreateProps.inlineNodeTypes}
						isOpeningMediaCommentFromToolbar={editorCreateProps.isOpeningMediaCommentFromToolbar}
						textSelection={editorCreateProps.textSelection}
						isOffline={isOffline}
					/>
				)}
				{editorViewProps && (
					<EditorViewInlineComment
						annotationProviders={annotationProviders}
						annotations={editorViewProps.annotations}
						onResolve={editorViewProps.onResolve}
						onDelete={editorViewProps.onDelete}
						onClose={editorViewProps.onClose}
						getInlineNodeTypes={editorViewProps.getInlineNodeTypes}
						dom={editorViewProps.dom}
						textSelection={editorViewProps.textSelection}
						annotationsList={editorViewProps.annotationsList}
						isOpeningMediaCommentFromToolbar={editorViewProps.isOpeningMediaCommentFromToolbar}
						isOffline={isOffline}
					/>
				)}
			</React.Fragment>
		);
	},
);

function ComposableEditorPage(editorProps: Partial<EditorProps>) {
	const providers = getExamplesProviders({});

	const universalPreset = useUniversalPreset({
		props: {
			appearance: 'full-page',
			mentionProvider: Promise.resolve(mentionResourceProvider),
			allowBorderMark: true,
			allowStatus: true,
			allowTasksAndDecisions: true,
			allowAnalyticsGASV3: true,
			allowExpand: {
				allowInsertion: true,
				allowInteractiveExpand: true,
			},
			allowFragmentMark: true,
			allowExtension: {
				allowExtendFloatingToolbars: true,
			},
			allowBreakout: true,
			allowLayouts: { allowBreakout: true },
			allowTables: {
				advanced: true,
				stickyHeaders: true,
				allowTableAlignment: true,
				allowTableResizing: true,
				allowNestedTables: true,
			},
			allowDate: true,
			allowRule: true,
			allowPanel: { allowCustomPanel: true, allowCustomPanelEdit: true },
			allowFindReplace: true,
			// annotationProviders,
			media: {
				provider: providers.mediaProvider,
				allowMediaSingle: true,
				enableDownloadButton: true,
				allowResizing: true,
				allowLinking: true,
				allowResizingInTables: true,
				allowAltTextOnImages: true,
				allowCaptions: true,
				allowMediaInlineImages: true,
				allowImagePreview: true,
				featureFlags: {
					...exampleMediaFeatureFlags,
					mediaInline: true,
				},
			},
			elementBrowser: {
				showModal: true,
				replacePlusMenu: true,
			},
			linking: {
				smartLinks: {
					allowBlockCards: true,
					allowEmbeds: true,
					allowResizing: true,
					provider: Promise.resolve(smartLinksProvider),
				},
			},
			__livePage: true,
			defaultValue: getDefaultValue(),
			featureFlags: {
				'nested-expand-in-expand-ex': true,
				'table-drag-and-drop': true,
			},
			allowTemplatePlaceholders: true,
			...editorProps,
		},

		initialPluginConfiguration: {
			tasksAndDecisionsPlugin: {
				hasEditPermission: false,
			},
		},
	});

	// Memoise the preset otherwise we will re-render the editor too often
	const { preset } = usePreset(() => {
		return universalPreset.add(selectionMarkerPlugin).add(codeBlockAdvancedPlugin);

		// The only things that cause a re-creation of the preset is something in the
		// universal preset to be consistent with current behaviour (ie. this could
		// be a page width change via the `appearance` prop).
	}, [universalPreset]);

	// @typescript-eslint/no-explicit-any
	const onDocumentChanged = (adf: any) => {
		if (adf?.state?.doc) {
			localStorage.setItem(`${EXAMPLE_NAME}-doc`, JSON.stringify(adf?.state?.doc));
		}
	};

	return (
		<SmartCardProvider client={smartCardClient}>
			<IntlProvider locale={'en'} messages={enMessages}>
				<ComposableEditor
					appearance="full-page"
					preset={preset}
					defaultValue={getDefaultValue()}
					onChange={(adf) => onDocumentChanged(adf)}
					mentionProvider={Promise.resolve(mentionResourceProvider)}
					__livePage={true}
				/>
			</IntlProvider>
		</SmartCardProvider>
	);
}

export function ComposableEditorWrapper() {
	const annotationProviders = useEditorAnnotationProviders();
	const [annotationStates, setAnnotationStates] = useState<{ id: string; resolved: boolean }[]>([]);

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
				// avaialable annotations in the editor.
				// If a selection changed and it's not in the state then we will regen the states, adding the new id.
				if (!annotationStates.some(({ id }) => id === event.annotationId)) {
					setAnnotationStates(annotationStates.concat({ id: event.annotationId, resolved: false }));
				}
			};
			annotationProviders.annotationManager.onAnnotationSelectionChange(callback);
			return () => {
				annotationProviders.annotationManager?.offAnnotationSelectionChange(callback);
			};
		}
	}, [annotationProviders.annotationManager, annotationStates]);

	// This hooks into the initial loading of the annotations, so that we can get a list of the ids and their resolved state
	// and then we can use that to render the list of annotations in the left panel.
	const getState = useCallback(
		async (annotationsIds: string[]) => {
			const states = await annotationProviders.inlineComment.getState(annotationsIds);
			setAnnotationStates(
				states.map((value) => ({
					id: value.id,
					resolved: value.state.resolved,
				})),
			);
			return states;
		},
		[annotationProviders],
	);

	//
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ display: 'flex', height: '100%' }}>
			{!annotationProviders.annotationManager && (
				<div css={styles.singlePanelStyle}>
					<SectionMessage title="Example Unavailable" appearance="warning">
						<p>
							This example is only compatible with the new Annotation Manager. You may need to
							enabled some feature gates to use this example.
						</p>
					</SectionMessage>
				</div>
			)}

			{!!annotationProviders.annotationManager && (
				<React.Fragment>
					<div css={styles.leftPanelStyle}>
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
					<div css={styles.rightPanelStyle}>
						<EditorAnnotationComponents
							key="editorAnnotationComponents"
							annotationProviders={annotationProviders}
						/>

						<ComposableEditorPage
							// contentComponents={contentComponents}
							annotationProviders={{
								...annotationProviders,
								inlineComment: {
									...annotationProviders.inlineComment,
									getState,
									// NOTE: This is nuking the manager components which normally would be passed in
									// to determine when to show the create or view components.
									// This logic has been reimplemented above in the EditorAnnotationComponents
									// to demonstrate the new API doesn't require the manager components to be passed in anymore.
									createComponent: () => null,
									viewComponent: () => null,
								},
							}}
						/>
					</div>
				</React.Fragment>
			)}
		</div>
	);
}

export default function ExampleAnnotationWithManager() {
	return (
		<EditorContext>
			<CommentsContentProvider>
				<AnnotationsProvider>
					<ComposableEditorWrapper />
				</AnnotationsProvider>
			</CommentsContentProvider>
		</EditorContext>
	);
}
