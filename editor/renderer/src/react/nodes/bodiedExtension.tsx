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
import { fg } from '@atlaskit/platform-feature-flags';

interface Props {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	serializer: Serializer<any>;
	extensionHandlers?: ExtensionHandlers;
	rendererContext: RendererContext;
	providers: ProviderFactory;
	extensionType: string;
	extensionKey: string;
	path?: PMNode[];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	originalContent?: any;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters?: any;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content?: any;
	layout?: ExtensionLayout;
	localId?: string;
	marks?: PMMark[];
	startPos: number;
	extensionViewportSizes?: ExtensionViewportSize[];
}

const ValidationContextWrapper = ({ children }: { children: React.ReactNode }) => {
	// We override validation of nested tables in nested renderers as invalid ADF (but valid Prosemirror)
	// may have been introduced in the parent renderer's render and subsequent transformations.
	// For example - nested tables which are transformed from an extension node in ADF
	// to native Prosemirror nested table nodes in and this is invalid ADF.
	const validationContextValue = useMemo<{ allowNestedTables: boolean }>(
		() => ({ allowNestedTables: true }),
		[],
	);

	if (!fg('platform_editor_nested_table_extension_comment_fix')) {
		return children;
	}

	return (
		<ValidationContextProvider value={validationContextValue}>{children}</ValidationContextProvider>
	);
};

const BodiedExtension = (props: React.PropsWithChildren<Props>) => {
	const {
		children,
		layout = 'default',
		path = [],
		extensionKey,
		extensionType,
		parameters,
		extensionViewportSizes,
	} = props;
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const removeOverflow = React.Children.toArray(children)
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.map((child) => (React.isValidElement<any>(child) ? child.props.nodeType === 'table' : false))
		.every(Boolean);

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
				<ValidationContextWrapper>
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
							);
						}}
					</ExtensionRenderer>
				</ValidationContextWrapper>
			</AnnotationsPositionContext.Provider>
		</ErrorBoundary>
	);
};

export default BodiedExtension;
