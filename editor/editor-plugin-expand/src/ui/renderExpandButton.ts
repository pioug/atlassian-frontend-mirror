import type { IntlShape } from 'react-intl';

import { expandClassNames } from '@atlaskit/editor-common/styles/expand';
import { messages } from '@atlaskit/editor-common/ui-expand';

interface ExpandButtonProps {
	allowInteractiveExpand: boolean;
	expanded: boolean;
	intl?: IntlShape;
}

/** Update the existing control without a React portal or tooltip positioning work. */
export function renderExpandButton(
	container: HTMLElement,
	{ allowInteractiveExpand, expanded, intl }: ExpandButtonProps,
): void {
	let button = container.querySelector<HTMLButtonElement>(`.${expandClassNames.iconButton}`);
	if (!button) {
		const doc = container.ownerDocument;
		button = doc.createElement('button');
		button.type = 'button';
		// Confluence comment navigation and focusIcon locate and click iconContainer.
		// Dropping that class broke revealing comments inside collapsed expands in ED-29205.
		button.className = `${expandClassNames.iconButton} ${expandClassNames.iconContainer}`;

		const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('class', expandClassNames.iconSvg);
		svg.setAttribute('width', '12');
		svg.setAttribute('height', '12');
		svg.setAttribute('viewBox', '0 0 16 16');
		svg.setAttribute('aria-hidden', 'true');
		svg.setAttribute('focusable', 'false');
		const path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('fill', 'currentColor');
		// The ADS small ChevronRightIcon, matching the existing React control.
		path.setAttribute(
			'd',
			'm6.03 1.47 6 6a.75.75 0 0 1 .052 1.004l-.052.056-6 6-1.06-1.06L10.44 8 4.97 2.53z',
		);
		svg.appendChild(path);
		button.appendChild(svg);
		container.appendChild(button);
	}

	const message = expanded ? messages.collapseNode : messages.expandNode;
	const label = intl?.formatMessage(message) ?? message.defaultMessage;
	button.setAttribute('aria-label', label);
	button.setAttribute('aria-expanded', String(expanded));
	button.disabled = !allowInteractiveExpand;
	if (allowInteractiveExpand) {
		button.title = label;
	} else {
		button.removeAttribute('title');
	}
}
