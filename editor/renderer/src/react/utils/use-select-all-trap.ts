import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import React from 'react';
import AnalyticsContext from '../../analytics/analyticsContext';
import { ElementSelection } from './element-selection';

export const useSelectAllTrap = <T extends HTMLElement>(): React.MutableRefObject<T | null> => {
	const { fireAnalyticsEvent } = React.useContext(AnalyticsContext);
	const ref = React.useRef<T | null>(null);
	const clicked = React.useRef<boolean>(false);
	const caught = React.useRef<ElementSelection>();

	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;

	const onKeyDown = React.useCallback(
		(e: KeyboardEvent) => {
			const el = ref.current;

			if (!el) {
				return;
			}

			const modKey = mac ? e.metaKey : e.ctrlKey;

			if (!modKey || e.code !== 'KeyA' || e.shiftKey) {
				return;
			}

			const elementSelection = ElementSelection.fromWindow();
			const isInput = (e.target as HTMLInputElement)?.matches?.('input');
			if (elementSelection.eq(caught.current) || isInput) {
				fireAnalyticsEvent({
					eventType: EVENT_TYPE.TRACK,
					action: ACTION.SELECT_ALL_ESCAPED,
					actionSubject: ACTION_SUBJECT.RENDERER,
				});
				return;
			}

			if (elementSelection.inside(el) || (elementSelection.type === 'None' && clicked.current)) {
				fireAnalyticsEvent({
					eventType: EVENT_TYPE.TRACK,
					action: ACTION.SELECT_ALL_CAUGHT,
					actionSubject: ACTION_SUBJECT.RENDERER,
				});

				e.preventDefault();
				caught.current = elementSelection.select(el);
			}
		},
		[mac, ref, fireAnalyticsEvent, clicked, caught],
	);

	const onClick = React.useCallback(
		(e: MouseEvent) => {
			clicked.current = ref.current?.contains(e.target as Node) ?? false;
		},
		[ref, clicked],
	);

	React.useEffect(() => {
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.addEventListener('keydown', onKeyDown);
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.addEventListener('click', onClick);

		return () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			window.removeEventListener('keydown', onKeyDown);
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			window.removeEventListener('click', onClick);
		};
	}, [onKeyDown, onClick]);

	return ref;
};
