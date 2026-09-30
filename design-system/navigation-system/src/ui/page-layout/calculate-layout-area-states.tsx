import type {
	LayoutArea,
	LayoutAreaAllocation,
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
}): Partial<Record<LayoutArea, LayoutAreaAllocation>> {
	const mainMinWidth = resolveLayoutWidth(mainMinWidthBound, viewportWidth);
	const availableWidth = Math.max(0, layoutWidth - occupiedWidth);
	const sideNav = areas['side-nav'];
	const panel = areas.panel;
	const chatPanel = areas['chat-panel'];
	const sideNavMinWidth = sideNav ? resolveLayoutWidth(sideNav.minWidth, viewportWidth) : 0;
	const panelMinWidth = panel ? resolveLayoutWidth(panel.minWidth, viewportWidth) : 0;
	const chatPanelMinWidth = chatPanel ? resolveLayoutWidth(chatPanel.minWidth, viewportWidth) : 0;

	const isSideNavOpenInline = Boolean(
		sideNav?.isOpen && !isSideNavOverlay && availableWidth >= mainMinWidth + sideNavMinWidth,
	);
	const isChatPanelOpenInline = Boolean(
		chatPanel?.isOpen &&
		!isChatPanelOverlay &&
		availableWidth >=
			mainMinWidth + chatPanelMinWidth + (isSideNavOpenInline ? sideNavMinWidth : 0),
	);
	const isPanelInline = Boolean(
		panel?.isOpen &&
		availableWidth >=
			mainMinWidth +
				panelMinWidth +
				(isChatPanelOpenInline ? chatPanelMinWidth : 0) +
				(isSideNavOpenInline ? sideNavMinWidth : 0),
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
		const baselineWidth = resizeSession?.baselineWidths[areaName];
		const requestedTarget =
			resizeSession && areaName !== resizeSession.area && baselineWidth !== undefined
				? baselineWidth
				: getTargetWidth(area, isSideNavOverlay);
		const target = clampTargetWidth({
			target: requestedTarget,
			min,
			max,
		});
		minimums.set(areaName, min);
		widths.set(areaName, target);
	}

	let overflow = Math.max(
		0,
		Array.from(widths.values()).reduce((total, width) => total + width, 0) -
			(availableWidth - mainMinWidth),
	);
	const compressionOrder: LayoutArea[] = ['panel', 'chat-panel', 'side-nav'];
	// User resizing consumes only Main's spare width. Viewport changes clear the
	// snapshot and retain the normal automatic compression order.
	const shrinkOrder: LayoutArea[] = resizeSession ? [resizeSession.area] : compressionOrder;

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

	const totalInlineWidth = Array.from(widths.values()).reduce((total, width) => total + width, 0);
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
					Math.min(configuredMax, availableWidth - mainMinWidth - totalInlineWidth + width),
				),
			},
		};
	}

	const inlineSideNavWidth = states['side-nav']?.width ?? 0;
	const inlineChatPanelWidth = states['chat-panel']?.width ?? 0;
	const mainAreaWidth = Math.max(0, availableWidth - inlineSideNavWidth - inlineChatPanelWidth);

	for (const areaName of ['side-nav', 'panel', 'chat-panel'] as const) {
		const area = areas[areaName];
		if (!area?.isOpen || states[areaName]?.mode === 'inline') {
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
