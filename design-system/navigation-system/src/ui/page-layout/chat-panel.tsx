/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import type { StrictXCSSProp } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { useSkipLinkInternal } from '../../context/skip-links/use-skip-link-internal';
import {
	chatPanelLiveWidthVar,
	chatPanelVar,
	localSlotLayers,
	mainMinimumWidthVar,
} from './constants';
import { convertResizeBoundToPixels } from './panel-splitter/convert-resize-bound-to-pixels';
import { PanelSplitterProvider } from './panel-splitter/provider';
import type { ResizeBound, ResizeBounds } from './panel-splitter/types';
import { resolveLayoutWidth } from './resolve-layout-width';
import { gridRootId } from './root';
import type { CommonSlotProps } from './types';
import { useLayoutAreaSizing } from './use-layout-area-sizing';
import { useLayoutId } from './use-layout-id';
import { useResizingWidthCssVarOnRootElement } from './use-resizing-width-css-var-on-root-element';
import { useSafeDefaultWidth } from './use-safe-default-width';

const chatPanelPanelSplitterId = Symbol('ChatPanel PanelSplitter');
const panelSplitterResizingVar = '--n_cPnlRsz';
const chatPanelOverlayWidthVar = '--n_cPnlOverlayW';
const fallbackDefaultWidth = 400;
const fallbackCompactDefaultWidth = 320;
const fallbackMinWidth: ResizeBound = '320px';
const inlineMediaQuery = '(min-width: 40rem)';

function getPixelCustomProperty(
	element: HTMLElement,
	propertyName: string,
	fallback: number,
): number {
	const raw = getComputedStyle(element).getPropertyValue(propertyName).trim();
	const value = Number.parseFloat(raw);
	return Number.isFinite(value)
		? resolveLayoutWidth(raw.endsWith('vw') ? `${value}vw` : value, window.innerWidth)
		: fallback;
}

const styles = cssMap({
	root: {
		gridArea: '2 / 1 / -1 / -1',
		justifySelf: 'end',
		boxSizing: 'border-box',
		// Root can constrain the initial inline track before the sizing effects run.
		maxWidth: '100%',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		zIndex: localSlotLayers.chatPanelOverlay,
		height: 'calc(100vh - var(--n_bnrM, 0px))',
		position: 'sticky',
		insetBlockStart: 'var(--n_bnrM, 0px)',
		backgroundColor: token('elevation.surface.overlay'),
		width: `var(${panelSplitterResizingVar}, var(${chatPanelOverlayWidthVar}))`,
		'@media (min-width: 40rem)': {
			gridArea: 'chat-panel',
			zIndex: 'auto',
			backgroundColor: token('elevation.surface'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `var(${panelSplitterResizingVar}, var(${chatPanelVar}))`,
		},
	},
	managedInline: {
		// Increased specificity ensures calculated modes override the responsive fallback.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&&': {
			gridArea: 'chat-panel',
			zIndex: 'auto',
			backgroundColor: token('elevation.surface'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `var(${panelSplitterResizingVar}, var(${chatPanelVar}))`,
		},
	},
	managedOverlay: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&&': {
			gridArea: '2 / 1 / -1 / -1',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			zIndex: localSlotLayers.chatPanelOverlay,
			backgroundColor: token('elevation.surface.overlay'),
			width: `var(${panelSplitterResizingVar}, var(${chatPanelOverlayWidthVar}))`,
		},
	},
	scrollContainer: {
		overflow: 'auto',
		height: '100%',
	},
	border: {
		boxShadow: token('elevation.shadow.overlay'),
		borderInlineStart: 'none',
		'@media (min-width: 40rem)': {
			boxShadow: 'initial',
			borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
		},
	},
	managedInlineBorder: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&&': {
			boxShadow: 'initial',
			borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
		},
	},
	managedOverlayBorder: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&&': {
			boxShadow: token('elevation.shadow.overlay'),
			borderInlineStart: 'none',
		},
	},
});

/**
 * The ChatPanel layout area is rendered below the banner and to the right (inline end) of the app.
 *
 * Below 40rem it overlays the app. At 40rem and above it is rendered as the final
 * full-height column in the page layout grid.
 *
 * You can optionally render a `PanelSplitter` as a child to make the chat panel resizable.
 */
export function ChatPanel({
	children,
	defaultWidth: defaultWidthProp,
	minWidth = fallbackMinWidth,
	maxWidth,
	label = 'Chat panel',
	skipLinkLabel = label,
	testId,
	id: providedId,
	xcss,
	hasBorder = true,
	onClose,
}: CommonSlotProps & {
	/**
	 * The content of the layout area.
	 */
	children: React.ReactNode;
	/**
	 * The accessible name of the slot, announced by screen readers.
	 */
	label?: string;
	/**
	 * The default width of the layout area in pixels.
	 */
	defaultWidth?: number;
	/**
	 * The minimum width the chat panel can be resized to.
	 */
	minWidth?: ResizeBound;
	/**
	 * The maximum width the chat panel can be resized to.
	 */
	maxWidth?: ResizeBound;
	/**
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
	/**
	 * Whether the slot has a border when inline, or a shadow when overlaying the app.
	 *
	 * @default true
	 */
	hasBorder?: boolean;
	/**
	 * Required for controlled dismissal. Unmount ChatPanel when called, including
	 * when opening SideNav replaces the chat overlay. Remount it to open it again.
	 */
	onClose: () => void;
}): JSX.Element {
	const id = useLayoutId({ providedId });
	const defaultWidth = useSafeDefaultWidth({
		defaultWidthProp: defaultWidthProp ?? fallbackDefaultWidth,
		fallbackDefaultWidth,
		slotName: 'ChatPanel',
	});
	const compactDefaultWidth =
		defaultWidthProp === undefined ? fallbackCompactDefaultWidth : defaultWidth;

	useSkipLinkInternal({
		id,
		label: skipLinkLabel,
		isHidden: defaultWidth === 0 || fg('platform_dst_nav4_skip_link_a11y_1'),
	});

	const ref = useRef<HTMLDivElement | null>(null);
	const [inlineWidth, setInlineWidth] = useState(defaultWidth);
	const [overlayWidth, setOverlayWidth] = useState(compactDefaultWidth);
	const [isInline, setIsInline] = useState(false);
	const {
		state: managedSizing,
		getResizeBounds: getManagedResizeBounds,
		startResize,
		resize,
		completeResize,
	} = useLayoutAreaSizing({
		area: 'chat-panel',
		config: {
			defaultWidth,
			compactDefaultWidth,
			minWidth,
			maxWidth,
			isOpen: true,
			onRequestClose: onClose,
		},
	});

	useEffect(() => {
		const mediaQuery = window.matchMedia(inlineMediaQuery);
		setIsInline(mediaQuery.matches);

		const onChange = (event: MediaQueryListEvent) => {
			setIsInline(event.matches);
		};

		return bind(mediaQuery, { type: 'change', listener: onChange });
	}, []);

	const mode = managedSizing?.mode ?? (isInline ? 'inline' : 'overlay');
	const renderedWidth = managedSizing?.width ?? (mode === 'inline' ? inlineWidth : overlayWidth);

	useResizingWidthCssVarOnRootElement({
		isEnabled: !managedSizing,
		cssVar: panelSplitterResizingVar,
		panelId: chatPanelPanelSplitterId,
	});

	const getResizeBounds = useCallback((): ResizeBounds => {
		const managedBounds = getManagedResizeBounds();
		if (managedBounds) {
			return managedBounds;
		}
		const chatPanel = ref.current;
		const layoutRoot = chatPanel?.parentElement;
		const main = layoutRoot?.querySelector<HTMLElement>(':scope > [data-layout-slot][role="main"]');

		if (!chatPanel || !main || getComputedStyle(chatPanel).gridArea !== 'chat-panel') {
			return { min: minWidth, max: maxWidth ?? '90vw' };
		}

		const chatPanelWidth = chatPanel.getBoundingClientRect().width;
		const mainWidth = main.getBoundingClientRect().width;
		if (chatPanelWidth === 0 || mainWidth === 0) {
			return { min: minWidth, max: maxWidth ?? '90vw' };
		}

		const localPanel = main.querySelector<HTMLElement>('[data-layout-with-panel-slot]');
		const isLocalPanelInline = localPanel && getComputedStyle(localPanel).gridArea === 'panel';
		const localPanelWidth = isLocalPanelInline ? localPanel.getBoundingClientRect().width : 0;
		const mainMinimumWidth = getPixelCustomProperty(main, mainMinimumWidthVar, 320);
		const mainContentWidth = mainWidth - localPanelWidth;
		const availableWidth = Math.max(0, mainContentWidth - mainMinimumWidth);
		const availableInlineWidth = Math.floor(chatPanelWidth + availableWidth);
		const constrainedMaxWidth = maxWidth
			? Math.min(convertResizeBoundToPixels(maxWidth), availableInlineWidth)
			: availableInlineWidth;

		return {
			min: minWidth,
			max: `${Math.max(convertResizeBoundToPixels(minWidth), constrainedMaxWidth)}px`,
		};
	}, [getManagedResizeBounds, maxWidth, minWidth]);
	const configuredMaxWidth = maxWidth ?? '100vw';
	const chatPanelVariableWidth = managedSizing
		? `${renderedWidth}px`
		: `clamp(${minWidth}, ${inlineWidth}px, ${configuredMaxWidth})`;
	const chatPanelOverlayVariableWidth = managedSizing
		? `${renderedWidth}px`
		: `clamp(${minWidth}, ${overlayWidth}px, min(90vw, ${configuredMaxWidth}))`;
	const onCompleteResize = useCallback(
		(finalWidth: number) => {
			if (mode === 'inline') {
				setInlineWidth(finalWidth);
			} else {
				setOverlayWidth(finalWidth);
			}
			completeResize(mode, finalWidth);
		},
		[completeResize, mode],
	);
	const onResizeStartInternal = useCallback(() => {
		startResize(mode);
	}, [mode, startResize]);
	const onResizeInternal = useCallback((width: number) => resize(mode, width), [mode, resize]);

	return (
		<section
			id={id}
			data-layout-slot
			aria-label={label}
			css={[
				styles.root,
				hasBorder && styles.border,
				managedSizing?.mode === 'inline' && styles.managedInline,
				managedSizing?.mode === 'overlay' && styles.managedOverlay,
				hasBorder && managedSizing?.mode === 'inline' && styles.managedInlineBorder,
				hasBorder && managedSizing?.mode === 'overlay' && styles.managedOverlayBorder,
			]}
			className={xcss}
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Shared layout CSS variable name.
					[chatPanelVar]: chatPanelVariableWidth,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-unsafe-values
					[chatPanelOverlayWidthVar]: chatPanelOverlayVariableWidth,
				} as CSSProperties
			}
			data-testid={testId}
			data-layout-chat-panel=""
			ref={ref}
		>
			{
				// Hoist the committed or actively resizing inline width so SideNav can yield
				// space to ChatPanel without allowing the page layout to overflow.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
				<style>{`
#${gridRootId} { ${chatPanelLiveWidthVar}: var(${panelSplitterResizingVar}, ${chatPanelVariableWidth}); }
`}</style>
			}
			<PanelSplitterProvider
				panelId={chatPanelPanelSplitterId}
				panelRef={ref}
				panelWidth={renderedWidth}
				onCompleteResize={onCompleteResize}
				onResizeStartInternal={managedSizing ? onResizeStartInternal : undefined}
				onResizeInternal={managedSizing ? onResizeInternal : undefined}
				getResizeBounds={getResizeBounds}
				resizingCssVar={panelSplitterResizingVar}
				position="start"
			>
				<div css={styles.scrollContainer}>{children}</div>
			</PanelSplitterProvider>
		</section>
	);
}
