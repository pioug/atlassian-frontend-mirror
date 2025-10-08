import { useContext, useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';

import { SpotlightContext } from '../../controllers/context';

export const useOnClickOutside = (onClickOutside: (event: MouseEvent) => void) => {
	const { card } = useContext(SpotlightContext);
	const ref = card.ref;

	useEffect(() => {
		const doc = getDocument();
		if (!doc) {
			return;
		}

		const unbindMouseDown = bind(doc, {
			type: 'mousedown',
			listener: (event) => {
				if (!ref || !ref.current) {
					return;
				}

				const target = event.target instanceof Node ? event.target : null;

				if (ref.current.contains(target)) {
					return;
				}

				onClickOutside(event);
			},
		});

		return () => {
			unbindMouseDown();
		};
	}, [onClickOutside, ref]);
};
