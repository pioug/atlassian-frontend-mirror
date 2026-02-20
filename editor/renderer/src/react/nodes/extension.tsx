/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import React from 'react';
import { type Mark as PMMark, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type RendererContext, type ExtensionViewportSize } from '../types';
import { type ExtensionLayout } from '@atlaskit/adf-schema';
import ExtensionRenderer from '../../ui/ExtensionRenderer';

import type {
	ExtensionHandlers,
	ExtensionParams,
	Parameters,
} from '@atlaskit/editor-common/extensions';
import { type ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { overflowShadow, WidthConsumer } from '@atlaskit/editor-common/ui';
import type {
	OverflowShadowProps,
	OverflowShadowState,
	ShadowObserver,
} from '@atlaskit/editor-common/ui';
import { calcBreakoutWidth } from '@atlaskit/editor-common/utils';
import { RendererCssClassName } from '../../consts';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { calcBreakoutWidthCss } from '../utils/breakout';
import { fg } from '@atlaskit/platform-feature-flags';
import type { RendererAppearance } from '../../ui/Renderer/types';

interface Props {
	extensionHandlers?: ExtensionHandlers;
	extensionKey: string;
	extensionType: string;
	extensionViewportSizes?: ExtensionViewportSize[];
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
	isTopLevel?: boolean;
	rendererAppearance?: RendererAppearance;
} & AllOrNone<OverflowShadowProps>;

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
	const { isTopLevel = true, rendererAppearance } = options || {};
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
	const isInline =
		shouldDisplayExtensionAsInline?.(node) &&
		expValEquals('platform_editor_render_bodied_extension_as_inline', 'isEnabled', true);
	const inlineClassName = isInline ? RendererCssClassName.EXTENSION_AS_INLINE : '';

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
			>
				<div
					tabIndex={fg('platform_editor_dec_a11y_fixes') ? options.tabIndex : undefined}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={overflowContainerClass}
					css={[
						!(
							isInsideOfInlineExtension &&
							expValEquals('confluence_inline_insert_excerpt_width_bugfix', 'isEnabled', true)
						) &&
							fg('platform_fix_macro_renders_in_layouts') &&
							containerStyle,
					]}
				>
					{content}
				</div>
			</div>
		);
		return centerAlignClass && expValEquals('platform_editor_flex_based_centering', 'isEnabled', true) ? (
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
					>
						<div
							tabIndex={fg('platform_editor_dec_a11y_fixes') ? options.tabIndex : undefined}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
							className={overflowContainerClass}
							css={[
								!(
									isInsideOfInlineExtension &&
									expValEquals('confluence_inline_insert_excerpt_width_bugfix', 'isEnabled', true)
								) &&
									fg('platform_fix_macro_renders_in_layouts') &&
									containerStyle,
							]}
						>
							{content}
						</div>
					</div>
				);
				return centerAlignClass && expValEquals('platform_editor_flex_based_centering', 'isEnabled', true) ? (
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
								tabIndex: fg('platform_editor_dec_a11y_fixes') ? props.tabIndex : undefined,
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
				// Always return default content if anything goes wrong
				return renderExtension(
					text || 'extension',
					layout,
					{
						isTopLevel: path.length < 1,
						handleRef,
						shadowClassNames,
						tabIndex: fg('platform_editor_dec_a11y_fixes') ? props.tabIndex : undefined,
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

const _default_1: {
	new (props: Props & OverflowShadowProps): {
		calcOverflowDiff: () => number;
		calcScrollableWidth: () => number;
		componentDidCatch?: (error: Error, errorInfo: React.ErrorInfo) => void;
		componentDidMount?: () => void;
		componentDidUpdate: () => void;
		componentWillMount?: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentWillReceiveProps?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		componentWillUnmount: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentWillUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		container?: HTMLElement;
		context: unknown;
		diff?: number;
		forceUpdate: (callback?: (() => void) | undefined) => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getSnapshotBeforeUpdate?: (
			prevProps: Readonly<Props & OverflowShadowProps>,
			prevState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		) => any;
		handleContainer: (container: HTMLElement | null) => void;
		handleScroll: (event: Event) => void;
		initShadowObserver: () => void;
		overflowContainer?: HTMLElement | null;
		overflowContainerWidth: number;
		readonly props: Readonly<Props & OverflowShadowProps>;
		refs: {
			[key: string]: React.ReactInstance;
		};
		render: () => React.JSX.Element;
		scrollable?: NodeList;
		setState: <K extends keyof OverflowShadowState>(
			state:
				| OverflowShadowState
				| ((
						prevState: Readonly<OverflowShadowState>,
						props: Readonly<Props & OverflowShadowProps>,
				  ) => OverflowShadowState | Pick<OverflowShadowState, K> | null)
				| Pick<OverflowShadowState, K>
				| null,
			callback?: (() => void) | undefined,
		) => void;
		shadowObserver?: ShadowObserver;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		shouldComponentUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => boolean;
		showLeftShadow: (overflowContainer: HTMLElement | null | undefined) => boolean;
		state: {
			showLeftShadow: boolean;
			showRightShadow: boolean;
		};
		UNSAFE_componentWillMount?: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		UNSAFE_componentWillReceiveProps?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		UNSAFE_componentWillUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		updateShadows: () => void;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (
		props: Props & OverflowShadowProps,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		context: any,
	): {
		calcOverflowDiff: () => number;
		calcScrollableWidth: () => number;
		componentDidCatch?: (error: Error, errorInfo: React.ErrorInfo) => void;
		componentDidMount?: () => void;
		componentDidUpdate: () => void;
		componentWillMount?: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentWillReceiveProps?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		componentWillUnmount: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentWillUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		container?: HTMLElement;
		context: unknown;
		diff?: number;
		forceUpdate: (callback?: (() => void) | undefined) => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getSnapshotBeforeUpdate?: (
			prevProps: Readonly<Props & OverflowShadowProps>,
			prevState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		) => any;
		handleContainer: (container: HTMLElement | null) => void;
		handleScroll: (event: Event) => void;
		initShadowObserver: () => void;
		overflowContainer?: HTMLElement | null;
		overflowContainerWidth: number;
		readonly props: Readonly<Props & OverflowShadowProps>;
		refs: {
			[key: string]: React.ReactInstance;
		};
		render: () => React.JSX.Element;
		scrollable?: NodeList;
		setState: <K extends keyof OverflowShadowState>(
			state:
				| OverflowShadowState
				| ((
						prevState: Readonly<OverflowShadowState>,
						props: Readonly<Props & OverflowShadowProps>,
				  ) => OverflowShadowState | Pick<OverflowShadowState, K> | null)
				| Pick<OverflowShadowState, K>
				| null,
			callback?: (() => void) | undefined,
		) => void;
		shadowObserver?: ShadowObserver;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		shouldComponentUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => boolean;
		showLeftShadow: (overflowContainer: HTMLElement | null | undefined) => boolean;
		state: {
			showLeftShadow: boolean;
			showRightShadow: boolean;
		};
		UNSAFE_componentWillMount?: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		UNSAFE_componentWillReceiveProps?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		UNSAFE_componentWillUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		updateShadows: () => void;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	contextType?: React.Context<any> | undefined;
} = overflowShadow(Extension, {
	overflowSelector: `.${RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER}`,
});
export default _default_1;
