import React from 'react';
import { breakoutConsts, type BreakoutConstsType } from '@atlaskit/editor-common/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import { FullPagePadding } from './style';
declare global {
	interface Window {
		__RENDERER_BYPASS_BREAKOUT_SSR__?: boolean;
	}
}

/**
 * Inline Script that updates breakout node width on client side,
 * before main JavaScript bundle is ready.
 * More info: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1216218119/Renderer+SSR+for+Breakout+Nodes
 */
export function BreakoutSSRInlineScript({ noOpSSRInlineScript }: { noOpSSRInlineScript: Boolean }) {
	/**
	 * Should only inline this script while SSR,
	 * not needed on the client side.
	 */
	// For hydrateRoot there is a mismatch on client for this script.
	// So we want to add the script on client side but guard it with check to
	// not execute logic
	if (typeof window !== 'undefined' && !window.navigator.userAgent.includes('jsdom')) {
		if (!noOpSSRInlineScript) {
			return null;
		} else {
			window.__RENDERER_BYPASS_BREAKOUT_SSR__ = true;
		}
	}

	const id = Math.floor(Math.random() * (9999999999 - 9999 + 1)) + 9999;
	const shouldSkipScript = {
		table: fg('platform-ssr-table-resize'),
		breakout: fg('platform_breakout_cls'),
	};

	return (
		<script
			data-breakout-script-id={id}
			// To investigate if we can replace this.
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{
				__html: createBreakoutInlineScript(id, shouldSkipScript),
			}}
			data-testid="breakout-ssr-inline-script"
		/>
	);
}

export function createBreakoutInlineScript(
	id: number,
	shouldSkipScript: { table: boolean; breakout: boolean },
) {
	return `
	 (function(window){
		if(typeof window !== 'undefined' && window.__RENDERER_BYPASS_BREAKOUT_SSR__) {
			return;
		}
    ${breakoutInlineScriptContext};
    (${applyBreakoutAfterSSR.toString()})("${id}", breakoutConsts, ${JSON.stringify(shouldSkipScript)});
  })(window);
`;
}

export const breakoutInlineScriptContext = `
  var breakoutConsts = ${JSON.stringify(breakoutConsts)};
  breakoutConsts.mapBreakpointToLayoutMaxWidth = ${breakoutConsts.mapBreakpointToLayoutMaxWidth.toString()};
  breakoutConsts.getBreakpoint = ${breakoutConsts.getBreakpoint.toString()};
  breakoutConsts.calcBreakoutWidth = ${breakoutConsts.calcBreakoutWidth.toString()};
  breakoutConsts.calcBreakoutWithCustomWidth = ${breakoutConsts.calcBreakoutWithCustomWidth.toString()};
  breakoutConsts.calcLineLength = ${breakoutConsts.calcLineLength.toString()};
  breakoutConsts.calcWideWidth = ${breakoutConsts.calcWideWidth.toString()};
  breakoutConsts.FullPagePadding = ${FullPagePadding.toString()};
`;

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyBreakoutAfterSSR(
	id: string,
	breakoutConsts: BreakoutConstsType,
	shouldSkipBreakoutScript: { table: boolean; breakout: boolean },
) {
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
		document.querySelector(`[data-breakout-script-id="${id}"]`),
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

			// Remove with feature gate 'platform-ssr-table-resize'
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			if ((item.target as HTMLElement).classList.contains('ak-renderer-document')) {
				item.addedNodes.forEach((maybeNode) => {
					// maybeNode may contain comments which doesn't have a dataset property
					if (maybeNode.nodeType !== Node.ELEMENT_NODE) {
						return;
					}

					let width;
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					const node = maybeNode as HTMLElement;
					const mode = node.dataset.mode || node.dataset.layout || '';
					const resizedBreakout = node.dataset.hasWidth === 'true';

					if (!mode || !WIDE_LAYOUT_MODES.includes(mode)) {
						return;
					}

					// When flag is on we are using CSS to calculate the table width thus don't need logic below to set the width and left.
					if (shouldSkipBreakoutScript.table && node.classList.contains('pm-table-container')) {
						return;
					}

					if (
						shouldSkipBreakoutScript.breakout &&
						node.classList.contains('fabric-editor-breakout-mark')
					) {
						return;
					}

					// use breakout script for all other types of nodes
					if (node.classList.contains('pm-table-container') && mode === 'custom') {
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						const rendererWidth = renderer!.offsetWidth;
						const effectiveWidth = rendererWidth - breakoutConsts.padding;
						width = `${Math.min(parseInt(node.style.width), effectiveWidth)}px`;
					} else if (resizedBreakout) {
						width = breakoutConsts.calcBreakoutWithCustomWidth(
							mode as 'full-width' | 'wide',
							Number(node.dataset.width) || null,
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							renderer!.offsetWidth,
						);
					} else {
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				(item.target as HTMLElement).dataset.nodeType === MEDIA_NODE_TYPE
			) {
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				applyMediaBreakout(item.target as HTMLElement);
			}
		});
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
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.removeEventListener('load', disconnect);
	};
	// Ignored via go/ees005
	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	window.addEventListener('load', disconnect);
}

export const calcLineLength = breakoutConsts.calcLineLength;
