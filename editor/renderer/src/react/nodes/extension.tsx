import React from 'react';
import { type Mark as PMMark, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type RendererContext, type ExtensionViewportSize } from '../types';
import { type ExtensionLayout } from '@atlaskit/adf-schema';
import ExtensionRenderer from '../../ui/ExtensionRenderer';

import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { type ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { overflowShadow, WidthConsumer } from '@atlaskit/editor-common/ui';
import type { OverflowShadowProps } from '@atlaskit/editor-common/ui';
import { calcBreakoutWidth } from '@atlaskit/editor-common/utils';
import { RendererCssClassName } from '../../consts';

interface Props {
	extensionHandlers?: ExtensionHandlers;
	providers: ProviderFactory;
	rendererContext: RendererContext;
	extensionType: string;
	extensionKey: string;
	path?: PMNode[];
	text?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters?: any;
	layout?: ExtensionLayout;
	localId?: string;
	marks?: PMMark[];
	extensionViewportSizes?: ExtensionViewportSize[];
	nodeHeight?: string;
}

type AllOrNone<T> = T | { [K in keyof T]?: never };

type RenderExtensionOptions = {
	isTopLevel?: boolean;
} & AllOrNone<OverflowShadowProps>;

const viewportSizes = ['small', 'medium', 'default', 'large', 'xlarge'];
type ViewportSizeType = (typeof viewportSizes)[number];
type ViewportSizeObjectType = {
	[size in ViewportSizeType]: string;
};
// Mirrors sizes from https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/forge/xen-editor-provider/src/render/renderers/ForgeUIExtension.tsx
const macroHeights: ViewportSizeObjectType = {
	small: '112px',
	medium: '262px',
	default: '262px',
	large: '524px',
	xlarge: '1048px',
};

const getViewportSize = (
	extensionId?: string,
	extensionViewportSizes?: ExtensionViewportSize[],
) => {
	if (!Array.isArray(extensionViewportSizes) || !extensionId) {
		return;
	}
	const extension = extensionViewportSizes.find(
		(extension) => extension.extensionId === extensionId,
	);
	if (extension) {
		const viewportSize: ViewportSizeType =
			extension.viewportSize && viewportSizes.includes(extension.viewportSize)
				? extension.viewportSize
				: 'default';
		return macroHeights[viewportSize];
	}
};

export const renderExtension = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content: any,
	layout: string,
	options: RenderExtensionOptions = {},
	removeOverflow?: boolean,
	extensionId?: string,
	extensionViewportSizes?: ExtensionViewportSize[],
	nodeHeight?: string,
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
	/**
	 * To reduce cumulative layout shift, we check installed manifest values (viewportSize) for Forge and extension node parameters
	 * for Connect (legacy). As Connect is being phased out, we want Forge to also start to store its expected height
	 * in node parameters, especially for dynamic content macros. LegacyMacroStyledElements implements logic similar to here
	 * as the extension handler in CFE for legacy macros and Connect.
	 */
	const viewportSize = getViewportSize(extensionId, extensionViewportSizes);
	const extensionHeight = nodeHeight || viewportSize;
	return (
		<WidthConsumer>
			{({ width }) => (
				<div
					ref={options.handleRef}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={`${RendererCssClassName.EXTENSION} ${options.shadowClassNames} ${centerAlignClass}`}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						width: isTopLevel ? calcBreakoutWidth(layout, width) : '100%',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						minHeight: `${extensionHeight}px`,
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
	const {
		text,
		layout = 'default',
		handleRef,
		shadowClassNames,
		path = [],
		extensionViewportSizes,
		parameters,
		nodeHeight,
	} = props;

	return (
		<ExtensionRenderer
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			type="extension"
		>
			{({ result }) => {
				try {
					// Return the result directly if it's a valid JSX.Element
					if (result && React.isValidElement(result)) {
						return renderExtension(
							result,
							layout,
							{
								isTopLevel: path.length < 1,
								handleRef,
								shadowClassNames,
							},
							undefined,
							parameters?.extensionId,
							extensionViewportSizes,
							nodeHeight,
						);
					}
				} catch (e) {
					/** We don't want this error to block renderer */
					/** We keep rendering the default content */
				}
				// Always return default content if anything goes wrong
				return renderExtension(
					text || 'extension',
					layout,
					{
						isTopLevel: path.length < 1,
						handleRef,
						shadowClassNames,
					},
					undefined,
					parameters?.extensionId,
					extensionViewportSizes,
					nodeHeight,
				);
			}}
		</ExtensionRenderer>
	);
};

export default overflowShadow(Extension, {
	overflowSelector: `.${RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER}`,
});
