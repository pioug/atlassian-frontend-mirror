/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	type ChangeEvent,
	useCallback,
	useContext,
	useState,
	useEffect,
	useRef,
} from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { jsx, css } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';
import { type AnnotationMarkStates, type DocNode } from '@atlaskit/adf-schema';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { token } from '@atlaskit/tokens';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

import { RendererWithAnalytics, AnnotationsWrapper, ReactRenderer } from '../../src/';

import {
	ExampleAnnotationProductState,
	ExampleAnnotationProductStateContext,
	useExampleRendererAnnotationProvider,
} from './example-renderer-annotation-provider';
import { RendererActionsContext } from '../../src/actions';

const toolbarStyle = css({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: token('space.100', '8px'),
	paddingTop: token('space.050', '4px'),
	paddingRight: token('space.050', '4px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
	borderBottom: `1px solid ${token('color.border')}`,
});

const toolbarSection = css({
	display: 'flex',
	gap: token('space.025', '2px'),
});

function BodiedExtensionRenderer({
	localRef,
	document,
	annotationProvider,
}: {
	annotationProvider: ReturnType<
		typeof useExampleRendererAnnotationProvider
	>['rendererAnnotationProvider'];
	document: DocNode;
	localRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
	const { viewComponent, selectionComponent, ...originalAnnotationProps } =
		annotationProvider.inlineComment;

	const extensionRendererAnnotationProvider = {
		inlineComment: {
			viewComponent: () => null,
			...originalAnnotationProps,
		},
		annotationManagaer: annotationProvider.annotationManager,
	};
	return (
		<AnnotationsWrapper
			rendererRef={localRef}
			adfDocument={document}
			annotationProvider={extensionRendererAnnotationProvider}
			isNestedRender={true}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
			<div style={{ border: '1px blue dashed', padding: '10px' }}>
				<ReactRenderer
					adfStage="stage0"
					document={document}
					allowAnnotations={true}
					annotationProvider={extensionRendererAnnotationProvider}
				/>
			</div>
		</AnnotationsWrapper>
	);
}

const AppHeader = ({
	annotationProvider,
}: {
	annotationProvider: ReturnType<
		typeof useExampleRendererAnnotationProvider
	>['rendererAnnotationProvider'];
}) => {
	const [modalProps, setModalProps] = useState<
		{ onCancel: () => void; onConfirm: () => void } | undefined
	>(undefined);
	const [unsavedChanges, setUnsavedChanges] = useState(false);
	const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setUnsavedChanges((current) => !current);
	}, []);
	const openModal = useCallback((endProps: { onCancel: () => void; onConfirm: () => void }) => {
		setModalProps(endProps);
	}, []);

	const cancelModal = useCallback(() => {
		modalProps?.onCancel();
		setModalProps(undefined);
	}, [modalProps]);

	const discardModal = useCallback(() => {
		modalProps?.onConfirm();
		setModalProps(undefined);
	}, [modalProps]);

	useEffect(() => {
		if (unsavedChanges) {
			annotationProvider.annotationManager?.setPreemptiveGate(
				() =>
					new Promise((resolve) => {
						// Show discard changes confirmation prompt
						openModal({
							onConfirm: () => {
								resolve(true);
							},
							onCancel: () => {
								resolve(false);
							},
						});
					}),
			);
		} else {
			annotationProvider.annotationManager?.setPreemptiveGate(() => Promise.resolve(true));
		}
		return () => {
			annotationProvider.annotationManager?.setPreemptiveGate(() => Promise.resolve(true));
		};
	}, [unsavedChanges, openModal, annotationProvider.annotationManager]);

	return (
		<React.Fragment>
			<div css={toolbarStyle}>
				<div css={toolbarSection}>
					<Checkbox label="Mock Unsaved Changes" onChange={onChange} isChecked={unsavedChanges} />
				</div>
			</div>

			<ModalTransition>
				{!!modalProps && (
					<Modal onClose={cancelModal}>
						<ModalHeader hasCloseButton>
							<ModalTitle appearance="warning">Discard Changes</ModalTitle>
						</ModalHeader>
						<ModalBody>You have unsaved changes. Are you sure you want to discard them?</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={cancelModal}>
								Cancel
							</Button>
							<Button appearance="warning" onClick={discardModal}>
								Discard
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</React.Fragment>
	);
};

const App = () => {
	const { document } = useContext(ExampleAnnotationProductStateContext);
	const { rendererAnnotationProvider, highlightsMountPoint } =
		useExampleRendererAnnotationProvider();
	const localRef = useRef<HTMLDivElement | null>(null);
	/**
	 * The renderer user selection tracking is only set up correctly if the renderer ref is assigned.
	 * This requires a second render to ensure this is setup.
	 */
	const [_, setInnerRefAssigned] = useState<boolean>(false);

	return (
		<React.Fragment>
			<AppHeader annotationProvider={rendererAnnotationProvider} />
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
			<div style={{ height: '3rem' }}></div>
			{highlightsMountPoint}
			<RendererActionsContext>
				<AnnotationsWrapper
					rendererRef={localRef}
					adfDocument={document}
					annotationProvider={rendererAnnotationProvider}
					isNestedRender={false}
				>
					{/* This is used instead of the ReactRenderer, as the ReactRenderer overwrites any RendererActionsContext */}
					<RendererWithAnalytics
						useSpecBasedValidator={true}
						extensionHandlers={{
							'com.atlassian.confluence.macro.core': (ext, doc, actions) => {
								return (
									<BodiedExtensionRenderer
										localRef={localRef}
										document={{ type: 'doc', version: 1, content: ext.content as any }}
										annotationProvider={rendererAnnotationProvider}
									/>
								);
							},
						}}
						adfStage="stage0"
						appearance="full-page"
						allowAnnotations
						document={document}
						annotationProvider={rendererAnnotationProvider}
						// @ts-ignore - Type '(ref: any) => void' is not assignable to type 'RefObject<HTMLDivElement>'.ts(2322)
						innerRef={(ref) => {
							// This is required to ensure the annotations wrapper gets a second render following the rendererRef
							// being set (which is required to set up the user selection tracking correctly)
							localRef.current = ref;
							setInnerRefAssigned(true);
						}}
					/>
				</AnnotationsWrapper>
			</RendererActionsContext>
		</React.Fragment>
	);
};

export function RendererWithAnnotationsAndBodiedExtensions({
	initialData,
	initialDoc,
}: {
	initialData: {
		[annotationId: string]: {
			comments: string[];
			state: AnnotationMarkStates;
		};
	};
	initialDoc: DocNode;
}) {
	return (
		<IntlProvider locale="en">
			<ExampleAnnotationProductState initialAnnotationState={initialData} initialDoc={initialDoc}>
				<App />
			</ExampleAnnotationProductState>
		</IntlProvider>
	);
}
