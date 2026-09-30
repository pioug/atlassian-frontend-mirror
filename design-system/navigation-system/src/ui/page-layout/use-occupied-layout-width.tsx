import { type RefObject, useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

/**
 * Measures the existing Root slots that are not managed by the chat-layout allocator.
 * Only count separate inline columns: Aside stacks below Main on mobile, and the
 * legacy Panel spans other areas while overlaying. Read the grid rather than duplicating
 * its responsive breakpoints. Border boxes include slot borders and live splitter widths.
 */
export function useOccupiedLayoutWidth(layoutRef?: RefObject<HTMLDivElement | null>): number {
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const root = layoutRef?.current;
		if (!root) {
			return;
		}
		let occupiedSlots: HTMLElement[] = [];
		const measure = () => {
			if (occupiedSlots.length === 0) {
				setWidth(0);
				return;
			}
			const rows = getComputedStyle(root).gridTemplateAreas.match(/"[^"]+"/g) ?? [];
			const mainRow =
				rows.map((row) => row.replace(/"/g, '').split(/\s+/)).find((row) => row.includes('main')) ??
				[];
			let occupiedWidth = 0;
			for (const child of occupiedSlots) {
				const style = getComputedStyle(child);
				const area = style.gridArea.split('/').map((part) => part.trim());
				const slot = area[0];
				if (
					['ribbon', 'aside', 'panel'].includes(slot) &&
					area.every((part) => part === slot) &&
					mainRow.includes(slot) &&
					style.display !== 'none' &&
					style.position !== 'absolute' &&
					style.position !== 'fixed'
				) {
					occupiedWidth += child.getBoundingClientRect().width;
				}
			}
			setWidth(occupiedWidth);
		};
		const resizeObserver = new ResizeObserver(measure);
		const observeSlots = () => {
			resizeObserver.disconnect();
			resizeObserver.observe(root);
			// Managed regions resize on every drag frame but cannot consume extra tracks.
			// Keep them out of both the observer and the measurement loop. Slot identity,
			// unlike gridArea, remains stable when a region switches to overlay mode.
			// TopNav and Banner also span columns rather than consuming independent tracks.
			occupiedSlots = Array.from(root.children).filter(
				(child): child is HTMLElement =>
					child instanceof HTMLElement &&
					child.hasAttribute('data-layout-slot') &&
					!child.matches('nav, header, [role="main"], [data-layout-chat-panel]') &&
					getComputedStyle(child).gridArea.split('/')[0].trim() !== 'banner',
			);
			for (const child of occupiedSlots) {
				resizeObserver.observe(child);
			}
			measure();
		};
		const mutationObserver = new MutationObserver(observeSlots);
		mutationObserver.observe(root, { childList: true });
		observeSlots();
		const unbind = bind(window, { type: 'resize', listener: measure });
		return () => {
			unbind();
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [layoutRef]);

	return width;
}
