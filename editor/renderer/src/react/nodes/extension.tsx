/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import type { Layout as ExtensionLayout } from '@atlaskit/adf-schema/extensions';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type {
	ExtensionHandlers,
	ExtensionParams,
	Parameters,
} from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { overflowShadow, WidthConsumer } from '@atlaskit/editor-common/ui';
import type { OverflowShadowProps, OverflowShadowState } from '@atlaskit/editor-common/ui';
import { calcBreakoutWidth } from '@atlaskit/editor-common/utils';
import type { Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { AnalyticsEventPayload } from '../../analytics/events';
import { RendererCssClassName } from '../../consts';
import ExtensionRenderer from '../../ui/ExtensionRenderer';
import type { RendererAppearance } from '../../ui/Renderer/types';
import type { RendererContext, ExtensionViewportSize } from '../types';
import { calcBreakoutWidthCss } from '../utils/breakout';

interface Props {
	extensionHandlers?: ExtensionHandlers;
	extensionKey: string;
	extensionType: string;
	extensionViewportSizes?: ExtensionViewportSize[];
	/**
	 * Extension keys that should render nothing (instead of the default placeholder
	 * text) while their extension provider promise is still pending. This lets the
	 * product opt specific extensions out of showing default content before their
	 * handler has resolved. When omitted, behaviour is unchanged.
	 */
	hideExtensionKeysWhilePending?: string[];
	isInsideOfInlineExtension?: boolean;
	layout?: ExtensionLayout;
	localId?: string;
	marks?: PMMark[];
	nodeHeight?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters?: any;
	path?: PMNode[];
	providers: ProviderFactory;
	rendererAppearance?: RendererAppearance;
	rendererContext: RendererContext;
	shouldDisplayExtensionAsInline?: (extensionParams?: ExtensionParams<Parameters>) => boolean;
	text?: string;
}

type AllOrNone<T> = T | { [K in keyof T]?: never };

type RenderExtensionOptions = {
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	isInsideOfTable?: boolean;
	isTopLevel?: boolean;
	rendererAppearance?: RendererAppearance;
} & AllOrNone<OverflowShadowProps>;

const FORGE_EXTENSION_TYPE = 'com.atlassian.ecosystem';
/**
 * Mirrors `FORGE_INLINE_BODIED_PARAM` in `@atlassian/xen-editor-provider`. Duplicated rather than
 * imported: the renderer must not depend on a Forge package, and this is a stored parameter name,
 * so it is part of the document contract rather than that package's API.
 */
const FORGE_INLINE_BODIED_PARAM = 'atlassianForgeInlineBodied';

const viewportSizes = ['small', 'medium', 'default', 'large', 'xlarge'];
type ViewportSizeType = (typeof viewportSizes)[number];
type ViewportSizeObjectType = {
	[size in ViewportSizeType]: string;
};
// Mirrors sizes from https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/forge/xen-editor-provider/src/render/renderers/ForgeUIExtension.tsx
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

const containerStyle = css({
	containerType: 'inline-size',
});

type FireExtensionAsInlineAnalyticsProps = {
	fireAnalyticsEvent: NonNullable<RenderExtensionOptions['fireAnalyticsEvent']>;
	node: ExtensionParams<Parameters>;
};

/**
 * Fires an analytics event once on mount when a bodied extension is rendered as an inline element.
 * The node is stored in a ref to avoid re-firing if the node reference changes.
 */
const FireExtensionAsInlineAnalytics = ({
	fireAnalyticsEvent,
	node,
}: FireExtensionAsInlineAnalyticsProps) => {
	const nodeRef = useRef(node);
	useEffect(() => {
		fireAnalyticsEvent({
			action: ACTION.RENDERED,
			actionSubject: ACTION_SUBJECT.EXTENSION_AS_INLINE,
			actionSubjectId: ACTION_SUBJECT_ID.EXTENSION_BODIED,
			attributes: {
				extensionKey: nodeRef.current.extensionKey,
				extensionType: nodeRef.current.extensionType,
			},
			eventType: EVENT_TYPE.OPERATIONAL,
		});
	}, [fireAnalyticsEvent]);
	return null;
};

export const renderExtension = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content: any,
	layout: ExtensionLayout,
	options: RenderExtensionOptions = {},
	removeOverflow?: boolean,
	extensionId?: string,
	extensionViewportSizes?: ExtensionViewportSize[],
	nodeHeight?: string,
	localId?: string,
	shouldDisplayExtensionAsInline?: (extensionParams?: ExtensionParams<Parameters>) => boolean,
	node?: ExtensionParams<Parameters>,
	isInsideOfInlineExtension?: boolean,
): React.JSX.Element => {
	const overflowContainerClass = !removeOverflow
		? RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER
		: '';

	// by default, we assume the extension is at top level, (direct child of doc node)
	const {
		isInsideOfTable = false,
		isTopLevel = true,
		rendererAppearance,
		fireAnalyticsEvent,
	} = options || {};

	// we should only use custom layout for full-page appearance
	const canUseCustomLayout = expValEquals(
		'platform_editor_remove_important_in_render_ext',
		'isEnabled',
		true,
	)
		? rendererAppearance === 'full-page'
		: true;
	const isCustomLayout =
		isTopLevel && ['wide', 'full-width'].includes(layout) && canUseCustomLayout;
	const centerAlignClass = isCustomLayout ? RendererCssClassName.EXTENSION_CENTER_ALIGN : '';
	/**
	 * To reduce cumulative layout shift, we check installed manifest values (viewportSize) for Forge and extension node parameters
	 * for Connect (legacy). As Connect is being phased out, we want Forge to also start to store its expected height
	 * in node parameters, especially for dynamic content macros. LegacyMacroStyledElements implements logic similar to here
	 * as the extension handler in CFE for legacy macros and Connect.
	 */
	const viewportSize = getViewportSize(extensionId, extensionViewportSizes);
	const extensionHeight = nodeHeight || viewportSize;
	/**
	 * Scoped to nodes inserted by an app declaring `layout: inline-bodied`, which is what writes
	 * `atlassianForgeInlineBodied`. The output-type marker alone would also match migrated Connect
	 * content — it carries the same marker, and after an upgrade plus a storage round trip in the
	 * same shape — so keying on it would change how existing content renders. The renderer only
	 * ever sees the stored node, never the manifest, so a parameter this code writes is the only
	 * available signal.
	 *
	 * Evaluated once and shared with `isNativeForgeInline` below, so the gate is read a single time
	 * per render, and the cheap checks stay in front of it so anything ineligible short-circuits
	 * without firing an exposure it can never act on.
	 */
	const hasForgeInlineBodiedMarker = Boolean(
		node?.extensionType === FORGE_EXTENSION_TYPE &&
		node?.content &&
		node?.parameters?.guestParams?.[FORGE_INLINE_BODIED_PARAM] === 'true',
	);
	const isForgeInlineBodiedEnabled =
		hasForgeInlineBodiedMarker && fg('platform_forge_inline_bodied_macro');
	const isInlineBodiedLayoutEnabled =
		node?.extensionType === FORGE_EXTENSION_TYPE &&
		node?.type === 'bodiedExtension' &&
		node?.parameters?.layout === 'inline-bodied' &&
		fg('platform_forge_inline_bodied_layout_switch') &&
		fg('platform_forge_inline_bodied_macro');
	/**
	 * The pass that marks the sibling textblocks around an inline extension resolves their
	 * positions without a depth term, so it only ever matches at the top level. Inlining a nested
	 * container without joining its neighbours leaves a shrink-wrapped box alone on its own line,
	 * which is worse than leaving it a block — so keep nested inline-bodied Forge macros as
	 * blocks until the sibling marking works at depth.
	 */
	const isNestedForgeInlineBodied =
		!isTopLevel && (isForgeInlineBodiedEnabled || isInlineBodiedLayoutEnabled);
	const isInline =
		shouldDisplayExtensionAsInline?.(node) &&
		expValEquals('platform_editor_render_bodied_extension_as_inline', 'isEnabled', true) &&
		!isNestedForgeInlineBodied;
	const inlineClassName = isInline ? RendererCssClassName.EXTENSION_AS_INLINE : '';
	/**
	 * A native Forge macro does not have its body rendered by the product — the body ADF is
	 * sent to the app over the bridge and the app renders it with its own nested renderer.
	 * The inline styling above stops at the outer wrapper, so mark these nodes to let the
	 * nested document's block spacing be collapsed too.
	 */
	const isNativeForgeInline = Boolean(isInline && isForgeInlineBodiedEnabled);
	/**
	 * Migrated inline-bodied macros intentionally do not receive the native Forge marker. Mark the
	 * rendered wrapper instead so the stylesheet can fix only the surrounding text flow without
	 * applying the native nested-renderer, overflow or sizing rules to migrated content.
	 * Custom UI also uses this outer text-flow treatment, without styling inside its iframe.
	 */
	const isMigratedInlineBodied = Boolean(
		isInline &&
		node?.content &&
		!hasForgeInlineBodiedMarker &&
		fg('platform_forge_inline_bodied_macro'),
	);

	const asInlineAnalytics =
		isInline && fireAnalyticsEvent && node ? (
			<FireExtensionAsInlineAnalytics fireAnalyticsEvent={fireAnalyticsEvent} node={node} />
		) : null;

	if (expValEquals('platform_editor_renderer_extension_width_fix', 'isEnabled', true)) {
		const extensionDiv = (
			<div
				ref={options.handleRef}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={`${RendererCssClassName.EXTENSION} ${inlineClassName} ${options.shadowClassNames} ${centerAlignClass}`}
				style={{
					width: isInline
						? undefined
						: (
									expValEquals('platform_editor_remove_important_in_render_ext', 'isEnabled', true)
										? isCustomLayout
										: isTopLevel
							  )
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								calcBreakoutWidthCss(layout as ExtensionLayout)
							: expValEquals('platform_editor_remove_important_in_render_ext', 'isEnabled', true)
								? undefined
								: '100%',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					minHeight: isInline ? undefined : extensionHeight && `${extensionHeight}px`,
				}}
				data-layout={layout}
				data-local-id={localId}
				data-testid="extension--wrapper"
				data-node-type="extension"
				data-top-level={isTopLevel || undefined}
				data-forge-inline={isNativeForgeInline || undefined}
				data-migrated-inline={isMigratedInlineBodied || undefined}
			>
				<div
					tabIndex={options.tabIndex}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={`${RendererCssClassName.EXTENSION_INNER_WRAPPER} ${overflowContainerClass}`}
					css={[
						(!isInsideOfTable ||
							isExperimentEnabled('platform_editor_table_fit_to_content_patch_2')) &&
							!isInsideOfInlineExtension &&
							containerStyle,
					]}
				>
					{asInlineAnalytics}
					{content}
				</div>
			</div>
		);
		return centerAlignClass ? (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={
					RendererCssClassName.STICKY_SAFE_CENTER_WRAPPER +
					' ' +
					RendererCssClassName.FLEX_CENTER_WRAPPER
				}
			>
				{extensionDiv}
			</div>
		) : (
			extensionDiv
		);
	}

	return (
		<WidthConsumer>
			{({ width }) => {
				const extensionDiv = (
					<div
						ref={options.handleRef}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={`${RendererCssClassName.EXTENSION} ${inlineClassName} ${options.shadowClassNames} ${centerAlignClass}`}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							width: isInline
								? undefined
								: (
											expValEquals(
												'platform_editor_remove_important_in_render_ext',
												'isEnabled',
												true,
											)
												? isCustomLayout
												: isTopLevel
									  )
									? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										calcBreakoutWidth(layout, width)
									: expValEquals(
												'platform_editor_remove_important_in_render_ext',
												'isEnabled',
												true,
										  )
										? undefined
										: '100%',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							minHeight: isInline ? undefined : `${extensionHeight}px`,
						}}
						data-layout={layout}
						data-local-id={localId}
						data-top-level={isTopLevel || undefined}
						data-forge-inline={isNativeForgeInline || undefined}
						data-migrated-inline={isMigratedInlineBodied || undefined}
					>
						<div
							tabIndex={options.tabIndex}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
							className={`${RendererCssClassName.EXTENSION_INNER_WRAPPER} ${overflowContainerClass}`}
							css={[
								(!isInsideOfTable ||
									isExperimentEnabled('platform_editor_table_fit_to_content_patch_2')) &&
									!isInsideOfInlineExtension &&
									containerStyle,
							]}
						>
							{asInlineAnalytics}
							{content}
						</div>
					</div>
				);
				return centerAlignClass ? (
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
						className={
							RendererCssClassName.STICKY_SAFE_CENTER_WRAPPER +
							' ' +
							RendererCssClassName.FLEX_CENTER_WRAPPER
						}
					>
						{extensionDiv}
					</div>
				) : (
					extensionDiv
				);
			}}
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
		localId,
		isInsideOfInlineExtension,
	} = props;
	const isInsideOfTable = path.some((node) => node.type.name === 'table');

	return (
		<ExtensionRenderer
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			type="extension"
		>
			{({ isExtensionProviderPending, result }) => {
				try {
					// Return the result directly if it's a valid JSX.Element
					if (result && React.isValidElement(result)) {
						return renderExtension(
							result,
							layout,
							{
								isTopLevel: path.length < 1,
								isInsideOfTable,
								handleRef,
								shadowClassNames,
								tabIndex: props.tabIndex,
								rendererAppearance: props.rendererAppearance,
							},
							undefined,
							parameters?.extensionId,
							extensionViewportSizes,
							nodeHeight,
							localId,
							undefined,
							undefined,
							isInsideOfInlineExtension,
						);
					}
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (e) {
					/** We don't want this error to block renderer */
					/** We keep rendering the default content */
				}

				if (
					isExtensionProviderPending &&
					props.hideExtensionKeysWhilePending?.includes(props.extensionKey)
				) {
					return <React.Fragment />;
				}

				// Always return default content if anything goes wrong
				return renderExtension(
					text || 'extension',
					layout,
					{
						isTopLevel: path.length < 1,
						isInsideOfTable,
						handleRef,
						shadowClassNames,
						tabIndex: props.tabIndex,
						rendererAppearance: props.rendererAppearance,
					},
					undefined,
					parameters?.extensionId,
					extensionViewportSizes,
					nodeHeight,
					localId,
					undefined,
					undefined,
					isInsideOfInlineExtension,
				);
			}}
		</ExtensionRenderer>
	);
};

const _default_1: React.ComponentClass<Props & OverflowShadowProps, OverflowShadowState> =
	overflowShadow(Extension, {
		overflowSelector: `.${RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER}`,
	});
export default _default_1;
