import { type MutableRefObject, useCallback, useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';

export const useFocusWithin = (ref: MutableRefObject<HTMLDivElement | undefined> | undefined) => {
	const [active, setActive] = useState<Element | null>(null);

	const updateFocusedElement = useCallback(() => {
		const doc = getDocument();
		const activeElement = doc?.activeElement || null;

		if (!ref || !ref.current) {
			setActive(null);
			return;
		}

		if (!activeElement) {
			setActive(null);
			return;
		}

		// Check if the focused element is within the ref element
		if (!ref.current.contains(activeElement)) {
			setActive(null);
			return;
		}

		setActive(activeElement);
	}, [ref]);

	useEffect(() => {
		const doc = getDocument();
		if (!doc) {
			return;
		}

		updateFocusedElement();

		const unbindFocusIn = bind(doc, {
			type: 'focusin',
			listener: updateFocusedElement,
		});

		return () => {
			unbindFocusIn();
		};
	}, [updateFocusedElement]);

	return active;
};
