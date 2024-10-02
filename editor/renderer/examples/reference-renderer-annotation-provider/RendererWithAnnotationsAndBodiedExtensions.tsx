/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';
import { type AnnotationMarkStates, type DocNode } from '@atlaskit/adf-schema';

import { RendererWithAnalytics, AnnotationsWrapper, ReactRenderer } from '../../src/';

import {
	ExampleAnnotationProductState,
	ExampleAnnotationProductStateContext,
	useExampleRendererAnnotationProvider,
} from './example-renderer-annotation-provider';
import { RendererActionsContext } from '../../src/actions';

function BodiedExtensionRenderer({
	localRef,
	document,
	annotationProvider,
}: {
	localRef: React.MutableRefObject<HTMLDivElement | null>;
	document: DocNode;
	annotationProvider: ReturnType<
		typeof useExampleRendererAnnotationProvider
	>['rendererAnnotationProvider'];
}) {
	const { viewComponent, selectionComponent, ...originalAnnotationProps } =
		annotationProvider.inlineComment;

	const extensionRendererAnnotationProvider = {
		inlineComment: {
			viewComponent: () => null,
			...originalAnnotationProps,
		},
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

const App = () => {
	const { document } = React.useContext(ExampleAnnotationProductStateContext);
	const { rendererAnnotationProvider, highlightsMountPoint } =
		useExampleRendererAnnotationProvider();
	const localRef = React.useRef<HTMLDivElement | null>(null);
	/**
	 * The renderer user selection tracking is only set up correctly if the renderer ref is assigned.
	 * This requires a second render to ensure this is setup.
	 */
	const [_, setInnerRefAssigned] = React.useState<boolean>(false);

	return (
		<React.Fragment>
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
			state: AnnotationMarkStates;
			comments: string[];
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
