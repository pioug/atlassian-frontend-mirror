import React from 'react';
import type { Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { RendererContext } from '../types';
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

interface Props {
	serializer: Serializer<any>;
	extensionHandlers?: ExtensionHandlers;
	rendererContext: RendererContext;
	providers: ProviderFactory;
	extensionType: string;
	extensionKey: string;
	path?: PMNode[];
	originalContent?: any;
	parameters?: any;
	content?: any;
	layout?: ExtensionLayout;
	localId?: string;
	marks?: PMMark[];
	startPos: number;
}

const BodiedExtension = (props: React.PropsWithChildren<Props>) => {
	const { children, layout = 'default', path = [], extensionKey, extensionType } = props;
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const removeOverflow = React.Children.toArray(children)
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
				<ExtensionRenderer {...props} type="bodiedExtension">
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
						);
					}}
				</ExtensionRenderer>
			</AnnotationsPositionContext.Provider>
		</ErrorBoundary>
	);
};

export default BodiedExtension;
