import { type RefObject, useEffect, useState } from 'react';

import { bindAll } from 'bind-event-listener';

import type { LayoutArea, LayoutAreaMode } from './layout-area-sizing-context';

/**
 * Observe CSS's responsive modes without loading the drag allocator or publishing
 * measured widths back into CSS. Observe the host and independent occupied tracks;
 * managed panels, TopNav and Banner are deliberately not observed during dragging.
 */
export function useCssLayoutAreaStates(
	layoutRef: RefObject<HTMLDivElement | null> | undefined,
	revision: number,
	isEnabled: boolean,
): Partial<Record<LayoutArea, LayoutAreaMode>> {
	const [modes, setModes] = useState<Partial<Record<LayoutArea, LayoutAreaMode>>>({});
	useEffect(() => {
		const root = layoutRef?.current;
		if (!root || !isEnabled) {
			return;
		}
		const measure = () => {
			const selectors = {
				'side-nav': ':scope > nav[data-layout-slot]',
				panel: '[data-layout-with-panel-slot]',
				'chat-panel': ':scope > [data-layout-chat-panel]',
			};
			const next: Partial<Record<LayoutArea, LayoutAreaMode>> = {};
			for (const area of ['side-nav', 'panel', 'chat-panel'] as const) {
				const element = root.querySelector(selectors[area]);
				if (element) {
					next[area] =
						getComputedStyle(element).gridArea.split('/')[0].trim() === area ? 'inline' : 'overlay';
				}
			}
			setModes((previous) =>
				['side-nav', 'panel', 'chat-panel'].every(
					(area) => previous[area as LayoutArea] === next[area as LayoutArea],
				)
					? previous
					: next,
			);
		};
		const widths = new Map<Element, number>();
		const observer = new ResizeObserver((entries) => {
			let changed = false;
			for (const entry of entries) {
				if (widths.get(entry.target) !== entry.contentRect.width) {
					widths.set(entry.target, entry.contentRect.width);
					changed = true;
				}
			}
			if (changed) {
				measure();
			}
		});
		const observeSlots = () => {
			observer.disconnect();
			widths.clear();
			const occupied = Array.from(root.children).filter(
				(element) =>
					element.matches(
						'[data-layout-slot]:not(nav):not(header):not([role="main"]):not([data-layout-chat-panel])',
					) &&
					['aside', 'ribbon', 'panel'].includes(
						getComputedStyle(element).gridArea.split('/')[0].trim(),
					),
			);
			for (const element of [root, ...occupied]) {
				widths.set(element, element.getBoundingClientRect().width);
				observer.observe(element);
			}
			measure();
		};
		observeSlots();
		const mutations = new MutationObserver(observeSlots);
		mutations.observe(root, { childList: true });
		const queries = [
			window.matchMedia('(min-width: 40rem)'),
			window.matchMedia('(min-width: 64rem)'),
		];
		const unbind = [
			bindAll(window, [{ type: 'resize', listener: measure }]),
			...queries.map((query) => bindAll(query, [{ type: 'change', listener: measure }])),
		];
		return () => {
			observer.disconnect();
			mutations.disconnect();
			unbind.forEach((cleanup) => cleanup());
		};
	}, [isEnabled, layoutRef, revision]);
	return modes;
}
