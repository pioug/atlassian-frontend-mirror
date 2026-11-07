import React from 'react';

import { token } from '@atlaskit/tokens';

import { gridRootChatFitId, gridRootId } from './root';

/**
 * CSS owns fitting before hydration and lazy resize activation. Each slot hoists
 * its own minimum and target into Root's capacity containers during rendering;
 * the local shell supplies its minimum without waiting for effect registration.
 */
export function LayoutOverlayClearance({
	panelMinWidth,
	mainMinWidth,
}: {
	panelMinWidth: number;
	mainMinWidth: number;
}): JSX.Element {
	const navMin = 'var(--n_clearanceNavMin, 0px)';
	const navTarget = 'var(--n_clearanceNavTarget, 0px)';
	const chatMinimum = 'var(--n_clearanceChatMin, 0px)';
	const chatTarget = 'var(--n_clearanceChatTarget, 0px)';
	const extra = Math.max(0, panelMinWidth + 32 - mainMinWidth);
	const available =
		'calc(var(--n_layoutW) - var(--n_fitAside, 0px) - var(--n_fitRibbon, 0px) - var(--n_fitPanel, 0px))';
	const root = `#${gridRootId}:has(> nav[data-layout-side-nav-open])`;
	const fit = `#${gridRootChatFitId}:has(> #${gridRootId} > nav[data-layout-side-nav-open])`;
	const rule = (chatInline: boolean, selector: string) => {
		const chatMin = chatInline ? chatMinimum : '0px';
		const baselineNav = `min(${navTarget}, calc(${available} - ${mainMinWidth}px - ${chatMin}))`;
		const baselineChat = chatInline
			? `max(${chatMin}, min(${chatTarget}, calc(${available} - ${mainMinWidth}px - ${navTarget})))`
			: '0px';
		const deficit = `max(0px, calc(${mainMinWidth + extra}px + ${baselineNav} + ${baselineChat} - ${available}))`;
		const navWidth = `max(${navMin}, calc(${baselineNav} - ${deficit}))`;
		const chatWidth = `max(${chatMin}, calc(${baselineChat} - max(0px, calc(${deficit} - (${baselineNav} - ${navMin})))))`;
		const container = chatInline ? 'navigation-panel-chat-space' : 'navigation-panel-nav-space';
		return `@container ${container} (width >= ${extra + 1}px) and (width < ${panelMinWidth + 1}px) {
${selector} { --n_localPanelOverlayMax: calc(100% - 32px); ${chatInline ? `--n_chatTrack: ${chatWidth};` : ''} }
${selector} > nav[data-layout-slot] { width: ${navWidth}; }
${chatInline ? `${selector} > [data-layout-chat-panel] { width: var(--n_chatTrack); }` : ''}
}`;
	};
	const inlineRule = (chatInline: boolean, selector: string) => {
		const chatMin = chatInline ? chatMinimum : '0px';
		const navWidth = `max(${navMin}, min(${navTarget}, calc(${available} - ${mainMinWidth + panelMinWidth}px - ${chatMin})))`;
		const chatWidth = `max(${chatMin}, min(${chatTarget}, calc(${available} - ${mainMinWidth + panelMinWidth}px - ${navTarget})))`;
		return `@container ${chatInline ? 'navigation-panel-chat-space' : 'navigation-panel-nav-space'} (width >= ${panelMinWidth + 1}px) {
${selector} > nav[data-layout-slot] { width: ${navWidth}; }
${
	chatInline
		? `${selector} { --n_chatTrack: ${chatWidth}; }
${selector} > [data-layout-chat-panel] { width: var(--n_chatTrack); }`
		: ''
}
}`;
	};
	// Without inline navigation, only Main and the two panels share the width.
	// Reserve local's minimum before allowing Chat to consume spare capacity.
	const inlineWithoutNav = (selector: string) => `
@container navigation-panel-chat-space (width >= ${panelMinWidth + 1}px) {
${selector} { --n_chatTrack: min(${chatTarget}, calc(${available} - ${mainMinWidth + panelMinWidth}px)); }
${selector} > [data-layout-chat-panel] { width: var(--n_chatTrack); }
}`;
	const withoutChat = `${root}:not(:has(> [data-layout-chat-panel]))`;
	const withChat = `${root}:has(> [data-layout-chat-panel])`;
	// React 18 escapes comparison operators in style children during SSR. The
	// stylesheet contains only internal selectors/tokens and numeric width props.
	const css = `@media (min-width: 64rem) {
@container navigation-panel-nav-space (width < ${extra + 1}px) {
${fit} { --n_fitNav: 0px; }
${root} > nav[data-layout-slot] { grid-area: main; width: min(90%, ${navTarget}); background-color: ${token('elevation.surface.overlay')}; box-shadow: ${token('elevation.shadow.overlay')}; border-inline-end: none; }
}
@container navigation-panel-nav-space (width >= ${extra + 1}px) {
  @container navigation-panel-chat-space (width < ${panelMinWidth + 1}px) {
    ${fit} { --n_fitNav: calc(${navMin} + ${extra}px); }
  }
}
${rule(false, withoutChat)}
${inlineRule(false, withoutChat)}
@container navigation-panel-chat-space (width < ${extra + 1}px) {
${rule(false, withChat)}
${inlineRule(false, withChat)}
}
${rule(true, withChat)}
${inlineRule(true, withChat)}
${inlineWithoutNav(`#${gridRootId}:not(:has(> nav[data-layout-side-nav-open]))`)}
}
@media (min-width: 40rem) and (width < 64rem) {
${inlineWithoutNav(`#${gridRootId}:has(> [data-layout-chat-panel])`)}
}`;
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, react/no-danger -- Root-scoped, internally generated CSS must retain query operators during SSR.
		<style dangerouslySetInnerHTML={{ __html: css }} />
	);
}
