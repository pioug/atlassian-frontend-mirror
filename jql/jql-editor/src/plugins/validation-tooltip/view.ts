import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { JQLSyntaxError } from '@atlaskit/jql-ast';

import getDocumentPosition from '../common/get-document-position';
import { getJastFromState } from '../jql-ast';

import {
	JQLValidationTooltipPluginKey,
	TOOLTIP_CLASSNAME,
	TOOLTIP_ENTER_CLASSNAME,
	TOOLTIP_EXIT_CLASSNAME,
} from './constants';

type Coords = { bottom: number; left: number; right: number; top: number };
export class ValidationTooltipPluginView {
	tooltip: HTMLElement;
	constructor(mainId: string) {
		this.tooltip = document.createElement('div');
		this.tooltip.setAttribute('data-testid', 'jql-validation-tooltip');
		this.tooltip.classList.add(TOOLTIP_CLASSNAME);
		document.getElementById(mainId)?.appendChild(this.tooltip);
	}

	showTooltip = (error: JQLSyntaxError, start: Coords, end: Coords): void => {
		// Find a center position from the selection endpoints
		const left = (start.left + end.left) / 2;

		// The box in which the container is positioned, to use as base
		const box = this.tooltip.offsetParent?.getBoundingClientRect();
		this.tooltip.style.left = `${left - (box?.left ?? 0)}px`;
		this.tooltip.style.top = `${start.top - (box?.top ?? 0)}px`;

		this.tooltip.textContent = error.message;
		this.tooltip.classList.remove(TOOLTIP_EXIT_CLASSNAME);
		this.tooltip.classList.add(TOOLTIP_ENTER_CLASSNAME);
	};

	hideTooltip = (): void => {
		this.tooltip.classList.remove(TOOLTIP_ENTER_CLASSNAME);
		this.tooltip.classList.add(TOOLTIP_EXIT_CLASSNAME);
	};

	update(view: EditorView, lastState: EditorState): void {
		const state = view.state;

		const isHovered = JQLValidationTooltipPluginKey.getState(state);
		const lastIsHovered = JQLValidationTooltipPluginKey.getState(lastState);
		const jast = getJastFromState(state);
		const [error] = jast.errors;

		if (isHovered === lastIsHovered) {
			return;
		}

		if (isHovered) {
			if (error instanceof JQLSyntaxError) {
				const start = getDocumentPosition(state.doc, error.start);
				const stop = getDocumentPosition(state.doc, error.stop);

				const startCoords = view.coordsAtPos(start);
				const stopCoords = view.coordsAtPos(stop);
				this.showTooltip(error, startCoords, stopCoords);
			}
		} else {
			this.hideTooltip();
		}
	}

	destroy(): void {
		this.tooltip.remove();
	}
}
