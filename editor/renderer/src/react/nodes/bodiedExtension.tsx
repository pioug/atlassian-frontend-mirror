import React, { useMemo } from 'react';

import type { Layout as ExtensionLayout } from '@atlaskit/adf-schema/extensions';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics/types/enums';
import type {
	ExtensionHandlers,
	ExtensionParams,
} from '@atlaskit/editor-common/extensions/extension-handler';
import type { Parameters } from '@atlaskit/editor-common/extensions/extension-parameters';
import type ProviderFactory from '@atlaskit/editor-common/provider-factory/provider-factory';
import type { Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';

import { ACTION_SUBJECT } from '../../analytics/enums';
import type { AnalyticsEventPayload } from '../../analytics/events';
import type { Serializer } from '../../serializer';
import { AnnotationsPositionContext } from '../../ui/annotations';
import ExtensionRenderer from '../../ui/ExtensionRenderer';
import { ErrorBoundary } from '../../ui/Renderer/ErrorBoundary';
import type { RendererAppearance } from '../../ui/Renderer/types';
import { ValidationContextProvider } from '../../ui/Renderer/ValidationContext';
import type { RendererContext, ExtensionViewportSize } from '../types';
import { renderExtension } from './extension';
import ForgeBodiedExtensionHandoff from './ForgeBodiedExtensionHandoff';
import { FORGE_BODIED_EXTENSION_HANDOFF_KEYS } from './forgeBodiedExtensionHandoffConfig';

interface Props {
	extensionHandlers?: ExtensionHandlers;
	extensionKey: string;
	extensionType: string;
	extensionViewportSizes?: ExtensionViewportSize[];
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getContent?: () => any;
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
	rendererAppearance?: RendererAppearance;
	rendererContext: RendererContext;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	serializer: Serializer<any>;
	shouldDisplayExtensionAsInline?: (extensionParams?: ExtensionParams<Parameters>) => boolean;
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
		shouldDisplayExtensionAsInline,
		fireAnalyticsEvent,
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
			{/* eslint-disable-next-line @atlassian/perf-linting/no-inline-context-value, @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed) */}
			<AnnotationsPositionContext.Provider value={{ startPos: props.startPos + 1 }}>
				<ValidationContextProvider value={validationContextValue}>
					<ExtensionRenderer
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...props}
						type="bodiedExtension"
					>
						{({ node, result }) => {
							if (
								localId &&
								extensionType === 'com.atlassian.ecosystem' &&
								FORGE_BODIED_EXTENSION_HANDOFF_KEYS.has(extensionKey) &&
								!shouldDisplayExtensionAsInline?.(node) &&
								expVal('cc_aura_table_filter_cls', 'isEnabled', false)
							) {
								return renderExtension(
									<ForgeBodiedExtensionHandoff
										key={localId}
										localId={localId}
										fallback={children}
										result={React.isValidElement(result) ? result : null}
									/>,
									layout,
									{
										isTopLevel: path.length < 1,
										rendererAppearance: props.rendererAppearance,
										fireAnalyticsEvent,
									},
									removeOverflow,
									parameters?.extensionId,
									extensionViewportSizes,
									undefined,
									localId,
									shouldDisplayExtensionAsInline,
									node,
								);
							}
							try {
								if (result && React.isValidElement(result)) {
									// Return the content directly if it's a valid JSX.Element
									return renderExtension(
										result,
										layout,
										{
											isTopLevel: path.length < 1,
											rendererAppearance: props.rendererAppearance,
											fireAnalyticsEvent,
										},
										removeOverflow,
										parameters?.extensionId,
										extensionViewportSizes,
										undefined,
										localId,
										shouldDisplayExtensionAsInline,
										node,
									);
								}
							} catch {
								/** We don't want this error to block renderer */
								/** We keep rendering the default content */
							}

							// Always return default content if anything goes wrong
							return renderExtension(
								children,
								layout,
								{
									isTopLevel: path.length < 1,
									rendererAppearance: props.rendererAppearance,
									fireAnalyticsEvent,
								},
								removeOverflow,
								parameters?.extensionId,
								extensionViewportSizes,
								undefined,
								localId,
								shouldDisplayExtensionAsInline,
								node,
							);
						}}
					</ExtensionRenderer>
				</ValidationContextProvider>
			</AnnotationsPositionContext.Provider>
		</ErrorBoundary>
	);
};

export default BodiedExtension;
