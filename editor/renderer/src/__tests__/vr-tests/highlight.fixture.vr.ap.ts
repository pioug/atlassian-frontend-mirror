import React, { type ComponentType } from 'react';

import RendererWithAnnotationSelection, {
	Renderer,
	RendererFunctionalComponent,
	RendererWithAnalytics,
} from '../../entry-points/renderer';
import { ReactRenderer, RendererWithAnalytics as RootRendererWithAnalytics } from '../../index';
import { AnnotationsWrapper } from '../../ui/annotations';
import type { RendererProps } from '../../ui/renderer-props';
import { RendererActionsContext } from '../../ui/RendererActionsContext';
import * as highlightCustomColorsAdf from '../__fixtures__/highlight-custom-colors.adf.json';
import * as highlightOverlappedAdf from '../__fixtures__/highlight-overlapped.adf.json';
import * as highlightAdf from '../__fixtures__/highlight.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import { annotationInlineCommentProvider } from '../__helpers/rendererWithAnnotations.vr.ap';

export const BackgroundColorDefinedColors: ComponentType<any> = generateRendererComponent({
	document: highlightAdf,
	appearance: 'comment',
});

const backgroundColorOverlappedProps: Omit<RendererProps, 'document'> & {
	document: RendererProps['document'] | Record<string, unknown>;
} = {
	document: highlightOverlappedAdf,
	appearance: 'comment',
	allowAnnotations: true,
	annotationProvider: {
		inlineComment: annotationInlineCommentProvider,
	},
};

const withAnnotations = (
	renderer: React.ReactElement,
	{
		rendererRef,
		renderProps,
	}: { rendererRef: React.RefObject<HTMLDivElement>; renderProps: RendererProps },
): React.ReactNode =>
	React.createElement(
		RendererActionsContext,
		null,
		React.createElement(
			AnnotationsWrapper,
			{
				rendererRef,
				adfDocument: renderProps.document,
				annotationProvider: renderProps.annotationProvider,
				isNestedRender: true,
			},
			renderer,
		),
	);

export const BackgroundColorOverlapped: ComponentType<any> = generateRendererComponent(
	backgroundColorOverlappedProps,
	{ rendererWrapper: withAnnotations },
);

// Fixtures for the legacy endpoint migration tests; remove after migration (projected end Dec 2026).
const generateLegacyBackgroundColorOverlapped = (
	rendererComponent: ComponentType<RendererProps>,
): ComponentType<any> =>
	generateRendererComponent(backgroundColorOverlappedProps, { rendererComponent });

export const BackgroundColorOverlappedReactRenderer: ComponentType<any> =
	generateLegacyBackgroundColorOverlapped(ReactRenderer);
export const BackgroundColorOverlappedRootRendererWithAnalytics: ComponentType<any> =
	generateLegacyBackgroundColorOverlapped(RootRendererWithAnalytics);
export const BackgroundColorOverlappedRendererWithAnnotationSelection: ComponentType<any> =
	generateLegacyBackgroundColorOverlapped(RendererWithAnnotationSelection);
export const BackgroundColorOverlappedRenderer: ComponentType<any> =
	generateLegacyBackgroundColorOverlapped(Renderer);
export const BackgroundColorOverlappedRendererFunctionalComponent: ComponentType<any> =
	generateLegacyBackgroundColorOverlapped(RendererFunctionalComponent);
export const BackgroundColorOverlappedRendererWithAnalytics: ComponentType<any> =
	generateLegacyBackgroundColorOverlapped(RendererWithAnalytics);

export const BackgroundColorCustomColors: ComponentType<any> = generateRendererComponent({
	document: highlightCustomColorsAdf,
	appearance: 'comment',
});
