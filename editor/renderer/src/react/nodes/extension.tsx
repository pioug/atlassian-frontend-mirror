import React from 'react';
import { type Mark as PMMark, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type RendererContext } from '../types';
import { type ExtensionLayout } from '@atlaskit/adf-schema';
import ExtensionRenderer from '../../ui/ExtensionRenderer';

import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { type ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { overflowShadow, WidthConsumer } from '@atlaskit/editor-common/ui';
import type { OverflowShadowProps } from '@atlaskit/editor-common/ui';
import { calcBreakoutWidth } from '@atlaskit/editor-common/utils';
import { RendererCssClassName } from '../../consts';
export interface Props {
	extensionHandlers?: ExtensionHandlers;
	providers: ProviderFactory;
	rendererContext: RendererContext;
	extensionType: string;
	extensionKey: string;
	path?: PMNode[];
	text?: string;
	parameters?: any;
	layout?: ExtensionLayout;
	localId?: string;
	marks?: PMMark[];
}

type AllOrNone<T> = T | { [K in keyof T]?: never };

type RenderExtensionOptions = {
	isTopLevel?: boolean;
} & AllOrNone<OverflowShadowProps>;

export const renderExtension = (
	content: any,
	layout: string,
	options: RenderExtensionOptions = {},
	removeOverflow?: boolean,
) => {
	const overflowContainerClass = !removeOverflow
		? RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER
		: '';

	// by default, we assume the extension is at top level, (direct child of doc node)
	const { isTopLevel = true } = options || {};
	const centerAlignClass =
		isTopLevel && ['wide', 'full-width'].includes(layout)
			? RendererCssClassName.EXTENSION_CENTER_ALIGN
			: '';

	return (
		<WidthConsumer>
			{({ width }) => (
				<div
					ref={options.handleRef}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={`${RendererCssClassName.EXTENSION} ${options.shadowClassNames} ${centerAlignClass}`}
					style={{
						width: isTopLevel ? calcBreakoutWidth(layout, width) : '100%',
					}}
					data-layout={layout}
				>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
					<div className={overflowContainerClass}>{content}</div>
				</div>
			)}
		</WidthConsumer>
	);
};

const Extension = (props: React.PropsWithChildren<Props & OverflowShadowProps>) => {
	const { text, layout = 'default', handleRef, shadowClassNames, path = [] } = props;

	return (
		<ExtensionRenderer {...props} type="extension">
			{({ result }) => {
				try {
					// Return the result directly if it's a valid JSX.Element
					if (result && React.isValidElement(result)) {
						return renderExtension(result, layout, {
							isTopLevel: path.length < 1,
							handleRef,
							shadowClassNames,
						});
					}
				} catch (e) {
					/** We don't want this error to block renderer */
					/** We keep rendering the default content */
				}

				// Always return default content if anything goes wrong
				return renderExtension(text || 'extension', layout, {
					isTopLevel: path.length < 1,
					handleRef,
					shadowClassNames,
				});
			}}
		</ExtensionRenderer>
	);
};

export default overflowShadow(Extension, {
	overflowSelector: `.${RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER}`,
});
