import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';

// Question circle icon SVG — source: @atlaskit/icon/core/question-circle.
const QUESTION_ICON_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation" style="display:block">
  <path fill="currentColor" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-3c-.586 0-1 .414-1 1H5.5c0-1.414 1.086-2.5 2.5-2.5s2.5 1.086 2.5 2.5c0 1.133-.713 1.706-1.162 2.058-.511.402-.588.494-.588.692v.75h-1.5v-.75c0-.977.689-1.507 1.078-1.806l.084-.065C8.838 6.544 9 6.367 9 6c0-.586-.414-1-1-1"/>
  <path fill="currentColor" d="M9 11.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
</svg>`;

/**
 * Parsing the SVG markup is the same work for every unsupported node, so the template is
 * built once and reused.
 *
 * Only the parse is cached: appending a `DocumentFragment` moves its children out of it, so
 * each caller needs its own clone — sharing one fragment would leave every icon after the
 * first empty.
 */
const getIconFragment = (() => {
	let template: HTMLTemplateElement | undefined;

	return (): DocumentFragment => {
		if (!template) {
			template = document.createElement('template');
			template.innerHTML = QUESTION_ICON_SVG;
		}

		return template.content.cloneNode(true) as DocumentFragment;
	};
})();

/**
 * Builds the accessible question-circle icon spec used as an unsupported-content tooltip trigger.
 */
export function getUnsupportedContentIconSpec(iconClassName: string): DOMOutputSpec {
	return ['span', { class: iconClassName, role: 'img', 'aria-label': '?' }, getIconFragment()];
}
