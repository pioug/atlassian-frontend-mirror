import { useContext, useEffect } from 'react';

import { getDocument } from '@atlaskit/browser-apis';

import { SpotlightContext } from '../../controllers/context';

interface UpdateOnChangeProps {
	selectors?: string[];
	options?: MutationObserverInit;
}

const defaultOptions = {
	childList: true,
	subtree: true,
};

export const UNSAFE_UpdateOnChange = ({
	selectors = ['body'],
	options = defaultOptions,
}: UpdateOnChangeProps) => {
	const { popoverContent } = useContext(SpotlightContext);
	const { update } = popoverContent;

	useEffect(() => {
		if (!update || selectors.length === 0) {
			return;
		}

		const doc = getDocument();
		if (!doc) {
			return;
		}

		const elements: Set<Element> = new Set<Element>();

		selectors.forEach((selector) => {
			const element: Element | null = doc.querySelector(selector);

			if (!element) {
				return;
			}

			elements.add(element);
		});

		if (elements.size === 0) {
			return;
		}

		const observers: MutationObserver[] = [];

		elements.forEach((element) => {
			const observer = new MutationObserver((mutations) => {
				if (mutations.length === 0) {
					return;
				}

				update();
			});

			observer.observe(element, options);
			observers.push(observer);
		});

		return () => {
			observers.forEach((observer) => observer.disconnect());
		};
	}, [selectors, options, update]);

	return null;
};
