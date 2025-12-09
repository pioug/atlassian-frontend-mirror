import React, { useMemo } from 'react';
import type { Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { RendererContext, ExtensionViewportSize } from '../types';
import type { Serializer } from '../../serializer';
import type { ExtensionLayout } from '@atlaskit/adf-schema';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { renderExtension } from './extension';
import { ErrorBoundary } from '../../ui/Renderer/ErrorBoundary';
import ExtensionRenderer from '../../ui/ExtensionRenderer';
import { ACTION_SUBJECT } from '../../analytics/enums';
import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import { AnnotationsPositionContext } from '../../ui/annotations';
import { ValidationContextProvider } from '../../ui/Renderer/ValidationContext';

interface Props {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content?: any;
	extensionHandlers?: ExtensionHandlers;
	extensionKey: string;
	extensionType: string;
	extensionViewportSizes?: ExtensionViewportSize[];
	layout?: ExtensionLayout;
	localId?: string;
	marks?: PMMark[];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	originalContent?: any;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters?: any;
	path?: PMNode[];
	providers: ProviderFactory;
	rendererContext: RendererContext;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	serializer: Serializer<any>;
	startPos: number;
}

const BodiedExtension = (props: React.PropsWithChildren<Props>): React.JSX.Element => {
	const {
		children,
		layout = 'default',
		path = [],
		extensionKey,
		extensionType,
		parameters,
		extensionViewportSizes,
		localId,
	} = props;
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const removeOverflow = React.Children.toArray(children)
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.map((child) => (React.isValidElement<any>(child) ? child.props.nodeType === 'table' : false))
		.every(Boolean);

	const validationContextValue = useMemo<{ allowNestedTables: boolean }>(
		() => ({ allowNestedTables: true }),
		[],
	);
	return (
		<ErrorBoundary
			component={ACTION_SUBJECT.RENDERER}
			componentId={ACTION_SUBJECT_ID.EXTENSION_BODIED}
			createAnalyticsEvent={createAnalyticsEvent}
			additionalInfo={`${extensionType}: ${extensionKey} `}
		>
			{/**
			 * This allows nested renderers to have their positions reported in a way
			 * that the annotations positions can be calculated correctly.
			 */}
			<AnnotationsPositionContext.Provider value={{ startPos: props.startPos + 1 }}>
				<ValidationContextProvider value={validationContextValue}>
					<ExtensionRenderer
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...props}
						type="bodiedExtension"
					>
						{({ result }) => {
							try {
								if (result && React.isValidElement(result)) {
									// Return the content directly if it's a valid JSX.Element
									return renderExtension(
										result,
										layout,
										{
											isTopLevel: path.length < 1,
										},
										removeOverflow,
										parameters?.extensionId,
										extensionViewportSizes,
										undefined,
										localId,
									);
								}
							} catch (e) {
								/** We don't want this error to block renderer */
								/** We keep rendering the default content */
							}

							// Always return default content if anything goes wrong
							return renderExtension(
								children,
								layout,
								{
									isTopLevel: path.length < 1,
								},
								removeOverflow,
								parameters?.extensionId,
								extensionViewportSizes,
								undefined,
								localId,
							);
						}}
					</ExtensionRenderer>
				</ValidationContextProvider>
			</AnnotationsPositionContext.Provider>
		</ErrorBoundary>
	);
};

export default BodiedExtension;
