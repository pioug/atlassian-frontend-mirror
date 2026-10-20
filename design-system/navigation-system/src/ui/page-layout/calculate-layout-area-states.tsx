import type {
	LayoutArea,
	LayoutAreaAllocation,
	LayoutAreaMode,
	LayoutWidthBound,
	ResizeSession,
	StoredLayoutArea,
} from './layout-area-sizing-context';
import { resolveLayoutWidth } from './resolve-layout-width';

function clampTargetWidth({
	target,
	min,
	max,
}: {
	target: number;
	min: number;
	max: number;
}): number {
	return Math.max(min, Math.min(target, max));
}

function getTargetWidth(area: StoredLayoutArea, isSideNavOverlay: boolean): number {
	const defaultWidth = isSideNavOverlay
		? (area.compactDefaultWidth ?? area.defaultWidth)
		: area.defaultWidth;

	return area.liveResize?.mode === 'inline'
		? area.liveResize.width
		: (area.requestedWidth ?? area.preferredInlineWidth ?? defaultWidth);
}

function getOverlayTargetWidth(area: StoredLayoutArea, isSideNavOverlay: boolean): number {
	const defaultWidth = isSideNavOverlay
		? (area.compactDefaultWidth ?? area.defaultWidth)
		: area.defaultWidth;

	return area.liveResize?.mode === 'overlay'
		? area.liveResize.width
		: (area.requestedWidth ?? area.preferredOverlayWidth ?? defaultWidth);
}

export function calculateLayoutAreaStates({
	viewportWidth,
	layoutWidth = viewportWidth,
	isChatPanelOverlay,
	isSideNavOverlay,
	occupiedWidth = 0,
	mainMinWidth: mainMinWidthBound,
	areas,
	resizeSession,
	initialModes,
}: {
	viewportWidth: number;
	/**
	 * Root's content width, excluding scrollbars, borders and padding.
	 */
	layoutWidth?: number;
	/**
	 * Whether the viewport is below Root's 40rem inline-chat breakpoint.
	 */
	isChatPanelOverlay: boolean;
	/**
	 * Whether the viewport is below Root and SideNav's 64rem desktop breakpoint.
	 */
	isSideNavOverlay: boolean;
	occupiedWidth?: number;
	mainMinWidth: LayoutWidthBound;
	areas: Partial<Record<LayoutArea, StoredLayoutArea>>;
	resizeSession?: ResizeSession | null;
	/**
	 * The CSS-rendered modes during deferred activation. Bounds must describe the
	 * existing layout until the user actually resizes it.
	 */
	initialModes?: Partial<Record<LayoutArea, LayoutAreaMode>>;
}): Partial<Record<LayoutArea, LayoutAreaAllocation>> {
	const mainMinWidth = resolveLayoutWidth(mainMinWidthBound, viewportWidth);
	const availableWidth = Math.max(0, layoutWidth - occupiedWidth);
	const sideNav = areas['side-nav'];
	const panel = areas.panel;
	const chatPanel = areas['chat-panel'];
	const sideNavMinWidth = sideNav ? resolveLayoutWidth(sideNav.minWidth, viewportWidth) : 0;
	const panelMinWidth = panel ? resolveLayoutWidth(panel.minWidth, viewportWidth) : 0;
	const chatPanelMinWidth = chatPanel ? resolveLayoutWidth(chatPanel.minWidth, viewportWidth) : 0;
	const resizingArea = resizeSession && areas[resizeSession.area];
	const isAcknowledged =
		resizeSession?.completedWidth !== undefined &&
		(resizingArea?.requestedWidth === undefined ||
			resizingArea.requestedWidth === resizeSession.completedWidth);
	const baselineWidths =
		(isAcknowledged ? resizeSession?.completedWidths : undefined) ?? resizeSession?.baselineWidths;
	const layoutModes = resizeSession?.overlayModes ?? initialModes;
	// A growing panel cascades towards inline-start. Chat is on the other side
	// of the local rail, so local growth must reserve its full starting width.
	const shouldCollapseSideNav = Boolean(
		resizeSession &&
		resizeSession.area !== 'side-nav' &&
		resizeSession.baselineWidths['side-nav'] !== undefined &&
		resizeSession.baselineWidths[resizeSession.area] !== undefined &&
		resizingArea &&
		!isSideNavOverlay &&
		clampTargetWidth({
			target: getTargetWidth(resizingArea, isSideNavOverlay),
			min: resolveLayoutWidth(resizingArea.minWidth, viewportWidth),
			max:
				resizingArea.maxWidth !== undefined
					? resolveLayoutWidth(resizingArea.maxWidth, viewportWidth)
					: Number.POSITIVE_INFINITY,
		}) >
			availableWidth -
				mainMinWidth -
				sideNavMinWidth -
				(resizeSession.area === 'panel'
					? resizeSession.baselineWidths['chat-panel'] !== undefined
						? (baselineWidths?.['chat-panel'] ?? chatPanelMinWidth)
						: 0
					: resizeSession.baselineWidths.panel !== undefined
						? panelMinWidth
						: 0),
	);

	const isSideNavOpenInline = Boolean(
		sideNav?.isOpen &&
		!shouldCollapseSideNav &&
		(layoutModes
			? layoutModes['side-nav'] === 'inline'
			: !isSideNavOverlay && availableWidth >= mainMinWidth + sideNavMinWidth),
	);
	const isChatPanelOpenInline = Boolean(
		chatPanel?.isOpen &&
		(!resizeSession || resizeSession.baselineWidths['chat-panel'] !== undefined) &&
		(layoutModes
			? layoutModes['chat-panel'] === 'inline'
			: !isChatPanelOverlay &&
				availableWidth >=
					mainMinWidth + chatPanelMinWidth + (isSideNavOpenInline ? sideNavMinWidth : 0)),
	);
	const isPanelInline = Boolean(
		panel?.isOpen &&
		(!resizeSession || resizeSession.baselineWidths.panel !== undefined) &&
		(layoutModes
			? layoutModes.panel === 'inline'
			: availableWidth >=
				mainMinWidth +
					panelMinWidth +
					(isChatPanelOpenInline ? chatPanelMinWidth : 0) +
					(isSideNavOpenInline ? sideNavMinWidth : 0)),
	);

	const inlineAreas = (
		[
			isSideNavOpenInline && 'side-nav',
			isPanelInline && 'panel',
			isChatPanelOpenInline && 'chat-panel',
		] as const
	).filter((area): area is LayoutArea => Boolean(area));

	const widths = new Map<LayoutArea, number>();
	const minimums = new Map<LayoutArea, number>();

	for (const areaName of inlineAreas) {
		const area = areas[areaName];
		if (!area) {
			continue;
		}

		const min = resolveLayoutWidth(area.minWidth, viewportWidth);
		const max = area.maxWidth
			? resolveLayoutWidth(area.maxWidth, viewportWidth)
			: Number.POSITIVE_INFINITY;
		const baselineWidth = baselineWidths?.[areaName];
		const requestedTarget =
			resizeSession && areaName !== resizeSession.area
				? shouldCollapseSideNav && resizeSession.area === 'chat-panel'
					? min
					: (baselineWidth ?? getTargetWidth(area, isSideNavOverlay))
				: getTargetWidth(area, isSideNavOverlay);
		const target = clampTargetWidth({
			target: requestedTarget,
			min,
			max,
		});
		minimums.set(areaName, min);
		widths.set(areaName, target);
	}
	// Narrowing Chat moves the shared rail towards inline-end. Give the released
	// space to its inline neighbour so local grows instead of sliding across Main.
	// Use effective (clamped) widths and the session baseline, not each drag frame,
	// so reversing direction and completing a controlled resize do not add it twice.
	if (resizeSession?.area === 'chat-panel' && isChatPanelOpenInline && isPanelInline && panel) {
		const chatWidth = widths.get('chat-panel') ?? 0;
		const releasedWidth = Math.max(0, (baselineWidths?.['chat-panel'] ?? chatWidth) - chatWidth);
		const panelMaxWidth =
			panel.maxWidth !== undefined
				? Math.max(panelMinWidth, resolveLayoutWidth(panel.maxWidth, viewportWidth))
				: Number.POSITIVE_INFINITY;
		widths.set('panel', Math.min(panelMaxWidth, (widths.get('panel') ?? 0) + releasedWidth));
	}
	// Continuing to pull the local rail towards Chat after local reaches its
	// minimum gives Main the remaining space available in inline Chat.
	if (
		resizeSession?.area === 'panel' &&
		panel?.liveResize?.mode === 'inline' &&
		isChatPanelOpenInline
	) {
		const remainingDrag = Math.max(0, panelMinWidth - panel.liveResize.width);
		const chatWidth = widths.get('chat-panel') ?? 0;
		widths.set('chat-panel', Math.max(chatPanelMinWidth, chatWidth - remainingDrag));
	}

	let overflow = Math.max(
		0,
		Array.from(widths.values()).reduce((total, width) => total + width, 0) -
			(availableWidth - mainMinWidth),
	);
	const compressionOrder: LayoutArea[] = ['panel', 'chat-panel', 'side-nav'];
	// Main gives up spare space first. Only regions beyond the moving rail may
	// then compress: local growth moves towards SideNav, never towards Chat.
	// SideNav and Chat growth can reach both other regions in their direction.
	const shrinkOrder: LayoutArea[] = resizeSession
		? resizeSession.area === 'panel'
			? ['side-nav', 'panel']
			: [...compressionOrder.filter((area) => area !== resizeSession.area), resizeSession.area]
		: compressionOrder;

	for (const areaName of shrinkOrder) {
		if (overflow <= 0) {
			break;
		}

		const width = widths.get(areaName) ?? 0;
		const min = minimums.get(areaName) ?? 0;
		const reduction = Math.min(overflow, Math.max(0, width - min));
		widths.set(areaName, width - reduction);
		overflow -= reduction;
	}

	const states: Partial<Record<LayoutArea, LayoutAreaAllocation>> = {};
	for (const areaName of inlineAreas) {
		const width = widths.get(areaName) ?? 0;
		const min = minimums.get(areaName) ?? 0;
		const maxWidth = areas[areaName]?.maxWidth;
		const configuredMax =
			maxWidth !== undefined
				? resolveLayoutWidth(maxWidth, viewportWidth)
				: Number.POSITIVE_INFINITY;
		states[areaName] = {
			mode: 'inline',
			width,
			minWidth: min,
			resizeBounds: {
				min,
				max: Math.max(
					min,
					Math.min(
						configuredMax,
						availableWidth -
							mainMinWidth -
							inlineAreas.reduce(
								(total, sibling) =>
									sibling === areaName || (sibling === 'side-nav' && areaName !== 'side-nav')
										? total
										: total +
											(areaName === 'panel' && sibling === 'chat-panel'
												? (widths.get(sibling) ?? 0)
												: (minimums.get(sibling) ?? 0)),
								0,
							),
					),
				),
			},
		};
	}

	const inlineSideNavWidth = states['side-nav']?.width ?? 0;
	const inlineChatPanelWidth = states['chat-panel']?.width ?? 0;
	const mainAreaWidth = Math.max(0, availableWidth - inlineSideNavWidth - inlineChatPanelWidth);

	for (const areaName of ['side-nav', 'panel', 'chat-panel'] as const) {
		const area = areas[areaName];
		if (
			!area?.isOpen ||
			states[areaName]?.mode === 'inline' ||
			(areaName === 'side-nav' && shouldCollapseSideNav)
		) {
			continue;
		}

		const min = resolveLayoutWidth(area.minWidth, viewportWidth);
		const configuredMax = area.maxWidth
			? resolveLayoutWidth(area.maxWidth, viewportWidth)
			: Number.POSITIVE_INFINITY;
		// Chat covers Root; SideNav and the local panel overlay Main's grid track.
		// Occupied tracks and inline chat are not part of that covered region.
		const layoutMax = (areaName === 'chat-panel' ? layoutWidth : mainAreaWidth) * 0.9;
		const max = Math.max(0, Math.min(configuredMax, layoutMax));
		const effectiveMin = Math.min(min, max);
		const target = getOverlayTargetWidth(area, isSideNavOverlay);
		const width = clampTargetWidth({ target, min: effectiveMin, max });

		states[areaName] = {
			mode: 'overlay',
			width,
			minWidth: effectiveMin,
			resizeBounds: { min: effectiveMin, max },
		};
	}

	return states;
}
