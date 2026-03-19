import type { Command, HigherOrderCommand } from '@atlaskit/editor-common/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const withScrollIntoView: HigherOrderCommand =
	(command: Command): Command =>
	(state, dispatch, view) =>
		command(
			state,
			(tr) => {
				if (expValEquals('platform_editor_editor_centre_content_on_find', 'isEnabled', true) && view) {
					let targetPos = tr.selection.anchor;
					let coords = view.coordsAtPos(targetPos);

					// If element is not visible (coords are invalid), try parent nodes
					if (coords.top === coords.bottom || coords.top === 0) {
						const $pos = tr.selection.$anchor;
						let depth = $pos.depth;

						while (depth > 0 && (coords.top === coords.bottom || coords.top === 0)) {
							targetPos = $pos.before(depth);
							coords = view.coordsAtPos(targetPos);
							depth--;
						}
					}

					// Find the closest scrollable parent element
					let scrollParent: HTMLElement | null = view.dom;
					while (scrollParent && scrollParent !== document.documentElement) {
						const style = window.getComputedStyle(scrollParent);
						const overflowY = style.overflowY;
						const overflowX = style.overflowX;

						const isScrollable = (overflowY === 'auto' || overflowY === 'scroll' || overflowX === 'auto' || overflowX === 'scroll') &&
							(scrollParent.scrollHeight > scrollParent.clientHeight || scrollParent.scrollWidth > scrollParent.clientWidth);

						if (isScrollable) {
							break;
						}
						scrollParent = scrollParent.parentElement;
					}

					// Scroll to center the content
					if (scrollParent && scrollParent !== document.documentElement) {
						const parentRect = scrollParent.getBoundingClientRect();
						const scrollTop = scrollParent.scrollTop + coords.top - parentRect.top - (parentRect.height / 2) + ((coords.bottom - coords.top) / 2);
						scrollParent.scrollTo({ top: scrollTop, behavior: 'smooth' });
					}
				} else {
					tr.scrollIntoView();
				}
				if (dispatch) {
					dispatch(tr);
				}
			},
			view,
		);
