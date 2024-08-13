import React from 'react';
import { breakoutConsts } from '@atlaskit/editor-common/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import { FullPagePadding } from './style';
/**
 * Inline Script that updates breakout node width on client side,
 * before main JavaScript bundle is ready.
 *
 * More info: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1216218119/Renderer+SSR+for+Breakout+Nodes
 */
export function BreakoutSSRInlineScript() {
	/**
	 * Should only inline this script while SSR,
	 * not needed on the client side.
	 */
	if (typeof window !== 'undefined' && !window.navigator.userAgent.includes('jsdom')) {
		return null;
	}

	const id = Math.floor(Math.random() * (9999999999 - 9999 + 1)) + 9999;
	const context = createBreakoutInlineScript(id);

	return (
		<script
			data-breakout-script-id={id}
			// To investigate if we can replace this.
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: context }}
		></script>
	);
}

export function createBreakoutInlineScript(id: number) {
	const shouldFixTableResizing = String(Boolean(fg('platform-fix-table-ssr-resizing')));
	return `
  (function(window){
    ${breakoutInlineScriptContext};
    (${applyBreakoutAfterSSR.toString()})("${id}", breakoutConsts, ${shouldFixTableResizing});
  })(window);
`;
}

export const breakoutInlineScriptContext = `
  var breakoutConsts = ${JSON.stringify(breakoutConsts)};
  breakoutConsts.mapBreakpointToLayoutMaxWidth = ${breakoutConsts.mapBreakpointToLayoutMaxWidth.toString()};
  breakoutConsts.getBreakpoint = ${breakoutConsts.getBreakpoint.toString()};
  breakoutConsts.calcBreakoutWidth = ${breakoutConsts.calcBreakoutWidth.toString()};
  breakoutConsts.calcLineLength = ${breakoutConsts.calcLineLength.toString()};
  breakoutConsts.calcWideWidth = ${breakoutConsts.calcWideWidth.toString()};
  breakoutConsts.FullPagePadding = ${FullPagePadding.toString()};
`;

function applyBreakoutAfterSSR(id: string, breakoutConsts: any, shouldFixTableResizing: boolean) {
	const MEDIA_NODE_TYPE = 'mediaSingle';
	const WIDE_LAYOUT_MODES = ['full-width', 'wide', 'custom'];

	function findUp(element: HTMLElement | null, condition: (elem: HTMLElement) => boolean) {
		if (!element) {
			return;
		}

		while (element.parentElement) {
			if (condition(element)) {
				return element.parentElement;
			}
			element = element.parentElement;
		}
	}

	const renderer: HTMLElement | undefined = findUp(
		document.querySelector('[data-breakout-script-id="' + id + '"]'),
		(elem) => !!elem.parentElement?.classList.contains('ak-renderer-wrapper'),
	);

	if (!renderer) {
		return;
	}

	const observer = new MutationObserver((mutationsList) => {
		mutationsList.forEach((item) => {
			if (item.target.nodeType !== Node.ELEMENT_NODE) {
				return;
			}

			if ((item.target as HTMLElement).classList.contains('ak-renderer-document')) {
				item.addedNodes.forEach((maybeNode) => {
					// maybeNode may contain comments which doesn't have a dataset property
					if (maybeNode.nodeType !== Node.ELEMENT_NODE) {
						return;
					}

					let width;
					const node = maybeNode as HTMLElement;
					const mode = node.dataset.mode || node.dataset.layout || '';

					if (!mode || !WIDE_LAYOUT_MODES.includes(mode)) {
						return;
					}

					if (node.classList.contains('pm-table-container') && mode === 'custom') {
						const isFullPage = renderer!.classList.contains('is-full-page');
						const rendererWidth = renderer!.offsetWidth;

						let effectiveWidth;
						if (shouldFixTableResizing) {
							// Logic from https://stash.atlassian.com/projects/atlassian/repos/atlassian-frontend-monorepo/browse/platform/packages/editor/renderer/src/react/nodes/table.tsx?at=d3af2ef54521ccf10e9b094996ad9528ec05c7e3#610
							effectiveWidth = isFullPage
								? rendererWidth - 2 * breakoutConsts.FullPagePadding
								: rendererWidth;
						} else {
							effectiveWidth = rendererWidth - breakoutConsts.padding;
						}
						width = `${Math.min(parseInt(node.style.width), effectiveWidth)}px`;
					} else {
						width = breakoutConsts.calcBreakoutWidth(mode, renderer!.offsetWidth);
					}

					if (node.style.width === width) {
						return;
					}
					node.style.width = width;

					// Tables require some special logic, as they are not using common css transform approach,
					// because it breaks with sticky headers. This logic is copied from a table node:
					// https://bitbucket.org/atlassian/atlassian-frontend/src/77938aee0c140d02ff99b98a03849be1236865b4/packages/editor/renderer/src/react/nodes/table.tsx#table.tsx-235:245
					if (
						node.classList.contains('pm-table-container') &&
						!renderer!.classList.contains('is-full-width')
					) {
						const lineLength = breakoutConsts.calcLineLength();
						const left = lineLength / 2 - parseInt(width) / 2;
						if (left < 0 && parseInt(width) > lineLength) {
							node.style.left = left + 'px';
						} else {
							node.style.left = '';
						}
					}
				});
			} else if (
				/**
				 * The mutation observer is only called once per added node.
				 * The above condition only deals with direct children of <div class="ak-renderer-document" />
				 * When it is initially called on the direct children, not all the sub children have loaded.
				 * So nested media elements which are not immediately loaded as sub children are not available in the above conditional.
				 * Thus adding this conditional to deal with all media elements directly.
				 */
				(item.target as HTMLElement).dataset.nodeType === MEDIA_NODE_TYPE
			) {
				applyMediaBreakout(item.target as HTMLElement);
			}
		});

		// Renderer is initially set to hidden until we figure out the proper width in packages/editor/editor-common/src/ui/WidthProvider/index.tsx
		if (renderer.style.visibility === 'hidden') {
			// Hiding until we get the correct width. But didn't remove them from the DOM so vertical scrollbar can still be correctly calculated.
			renderer.style.visibility = '';
			// Since we don't have a screen width to use as initial value.
			// The width is set to a fix number. This will cause horizontal scrollbar to appear.
			// Hide it until we have the correct width.
			renderer.style.overflowX = '';
		}
	});

	const applyMediaBreakout = (card: HTMLElement) => {
		// width was already set by another breakout script
		if (card.style.width) {
			return;
		}

		const tableParent = findUp(card, (elem) => elem instanceof HTMLTableCellElement);

		// only apply the breakout to media elements not nested inside table
		// table sizing is not based on percentage width
		if (tableParent) {
			return;
		}

		const mode = card.dataset.mode || card.dataset.layout || '';
		const width = card.dataset.width;
		const isPixelBasedResizing = card.dataset.widthType === 'pixel';

		if (WIDE_LAYOUT_MODES.includes(mode)) {
			card.style.width = '100%';
		} else if (width && !isPixelBasedResizing) {
			// Pixel based resizing has width set in pixels based on its width attribute
			// Thus, no need to override for non-wide layouts
			card.style.width = `${width}%`;
		}
	};

	observer.observe(renderer, {
		childList: true,
		subtree: true,
	});

	/**
	 * Using window load event to unsubscribe from mutation observer, as at this stage document is fully rendered.
	 * Experiment with DOMContentLoaded showed that some of the blocks were not processed at all.
	 * That's why window load is necessary.
	 *
	 * More info:
	 * – https://html.spec.whatwg.org/multipage/parsing.html#the-end
	 * – https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
	 * – https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
	 */
	const disconnect = () => {
		observer.disconnect();
		window.removeEventListener('load', disconnect);
	};
	window.addEventListener('load', disconnect);
}

export const calcLineLength = breakoutConsts.calcLineLength;
