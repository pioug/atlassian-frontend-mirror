import type { IntlShape } from 'react-intl-next';

import { getDocument } from '@atlaskit/browser-apis';
import { expandClassNames } from '@atlaskit/editor-common/styles';
import { expandMessages } from '@atlaskit/editor-common/ui';

interface ButtonProps {
	/** Indicates whether interactive expand is allowed */
	allowInteractiveExpand: boolean;
	/** Indicates whether the expand is currently expanded */
	expanded: boolean;
	/** Internationalization object for formatting messages */
	intl: IntlShape;
}

/**
 * Renders or updates the expand/collapse button inside the provided container element.
 *
 * @param container - The HTML element that will contain the expand/collapse button.
 * @param buttonProps - Properties for configuring the button's behavior and appearance.
 */
export function renderExpandButton(container: HTMLElement, buttonProps: ButtonProps): void {
	const { allowInteractiveExpand, expanded, intl } = buttonProps;

	// Update existing button attributes
	const label = intl.formatMessage(
		expanded ? expandMessages.collapseNode : expandMessages.expandNode,
	);

	const existingButton = container.querySelector(`.${expandClassNames.iconButton}`);

	if (existingButton) {
		existingButton.setAttribute('aria-label', label);
		existingButton.setAttribute('aria-expanded', String(expanded));
		if (allowInteractiveExpand) {
			existingButton.setAttribute('title', label);
			existingButton.removeAttribute('disabled');
		} else {
			existingButton.removeAttribute('title');
			existingButton.setAttribute('disabled', 'true');
		}
	} else {
		const doc = getDocument();
		if (!doc) {
			return;
		}

		const button = doc.createElement('button');
		button.className = expandClassNames.iconButton;
		button.setAttribute('aria-label', label);
		button.setAttribute('aria-expanded', String(expanded));
		if (allowInteractiveExpand) {
			button.setAttribute('title', label);
		} else {
			button.setAttribute('disabled', 'true');
		}
		container.appendChild(button);

		const svgIcon = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgIcon.setAttribute('class', expandClassNames.iconSvg);
		svgIcon.setAttribute('width', '12');
		svgIcon.setAttribute('height', '12');
		svgIcon.setAttribute('viewBox', '0 0 16 16');
		svgIcon.setAttribute('role', 'presentation');
		const path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('fill', 'currentcolor');
		path.setAttribute(
			'd',
			'm6.03 1.47 6 6a.75.75 0 0 1 .052 1.004l-.052.056-6 6-1.06-1.06L10.44 8 4.97 2.53z',
		);
		svgIcon.appendChild(path);
		button.appendChild(svgIcon);
	}
}
