/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type KeyboardEvent as ReactKeyboardEvent,
	type MouseEvent as ReactMouseEvent,
	type ReactNode,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import Link from '@atlaskit/link';

const skipLinkListItemStyles = css({ marginBlockStart: 0 });
const focusTargetRef = (href: string) => (event: ReactMouseEvent | ReactKeyboardEvent) => {
	event.preventDefault();
	const targetRef = document.querySelector(href);

	// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
	// @ts-ignore
	const key = event.which || event.keycode;
	// if it is a keypress and the key is not
	// space or enter, just ignore it.
	if (key && key !== 13 && key !== 32) {
		return;
	}

	if (targetRef) {
		targetRef.setAttribute('tabindex', '-1');
		// @ts-ignore
		targetRef.addEventListener('blur', handleBlur);
		// @ts-ignore
		targetRef.focus();
		document.activeElement &&
			document.activeElement.scrollIntoView({
				// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
				behavior: 'smooth',
				// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
			});
		window.scrollTo(0, 0);
	}

	return false;
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SkipLink = ({
	href,
	children,
	isFocusable,
}: {
	href: string;
	children: ReactNode;
	isFocusable: boolean;
}): ReactNode => {
	return (
		<li css={skipLinkListItemStyles}>
			<Link tabIndex={isFocusable ? 0 : -1} href={href} onClick={focusTargetRef(href)}>
				{children}
			</Link>
		</li>
	);
};
