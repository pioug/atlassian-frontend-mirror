import { startTransition, useState } from 'react';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';

import type { TopNavBreakpoints } from './top-nav-element-context';

export function useMeasuredTopNavBreakpoints(
	topNav: HTMLElement | null,
	remProbe: HTMLElement | null,
): TopNavBreakpoints {
	const [breakpoints, setBreakpoints] = useState<TopNavBreakpoints>({
		belowSm: false,
		hasMeasured: false,
	});

	useLayoutEffect(() => {
		const view = topNav?.ownerDocument.defaultView;
		if (!topNav || !view) {
			return;
		}
		const updateWidth = (width: number) => {
			const rootFontSize =
				parseFloat(view.getComputedStyle(topNav.ownerDocument.documentElement).fontSize) || 16;
			const belowSm = width < 48 * rootFontSize;
			// Navigation can still be hydrating inside Suspense. An urgent context
			// update would discard its server DOM and show the loading fallback.
			startTransition(() => {
				setBreakpoints((previous) =>
					previous.hasMeasured && previous.belowSm === belowSm
						? previous
						: { belowSm, hasMeasured: true },
				);
			});
		};
		let width = topNav.getBoundingClientRect().width;
		updateWidth(width);
		if (!view.ResizeObserver) {
			return;
		}
		const observer = new view.ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === topNav) {
					width = entry.borderBoxSize?.[0]?.inlineSize ?? topNav.getBoundingClientRect().width;
				}
			}
			// The rem probe resizes when the root font changes, even if the header
			// stays the same pixel width. Reevaluate against the last measured width.
			updateWidth(width);
		});
		observer.observe(topNav, { box: 'border-box' });
		if (remProbe) {
			observer.observe(remProbe);
		}
		return () => observer.disconnect();
	}, [topNav, remProbe]);

	return breakpoints;
}
