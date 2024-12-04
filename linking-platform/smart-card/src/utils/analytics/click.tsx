import React from 'react';

import { type GasPayload } from '@atlaskit/analytics-gas-types';
import { type AnalyticsEventPayload, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type LinkProps } from '@atlaskit/link';
import { browser } from '@atlaskit/linking-common/user-agent';

import { useLinkClicked, useMouseDownEvent } from '../../state/analytics/useLinkClicked';
import { type AnalyticsPayload } from '../types';

import { ANALYTICS_CHANNEL } from './analytics';
import { type ClickOutcome, type ClickType, type UiLinkClickedEventProps } from './types';

export const buttonMap = new Map<number | undefined, 'none' | 'left' | 'middle' | 'right'>([
	[undefined, 'none'],
	[0, 'left'],
	[1, 'middle'],
	[2, 'right'],
]);

export const getKeys = (e: React.MouseEvent) => {
	return (['alt', 'ctrl', 'meta', 'shift'] as const).filter((key) => e[`${key}Key`] === true);
};

const isContentEditable = (el: Element) => {
	return el instanceof HTMLElement && el.isContentEditable;
};

export function getLinkClickOutcome(e: React.MouseEvent, clickType: ClickType): ClickOutcome {
	const { mac, safari } = browser();

	/**
	 * If the link/parent is content editable then left click won't have typical effect
	 */
	if (isContentEditable(e.currentTarget) && ['left', 'middle'].includes(clickType)) {
		return 'contentEditable';
	}

	switch (clickType) {
		case 'left':
		case 'keyboard': {
			// Meta key = Cmd for macOS, Windows key sometimes for Windows (otherwise false)
			// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey
			if (e.metaKey) {
				return mac ? 'clickThroughNewTabOrWindow' : 'clickThrough';
			}

			if (e.shiftKey) {
				// Alt/option click in safari typically adds the link to bookmarks
				if (safari) {
					return 'alt';
				}
				return 'clickThroughNewTabOrWindow';
			}

			if (e.ctrlKey) {
				// Ctrl+Left on macOS defaults to triggering a right click instead (so won't trigger onClick)
				// but if this behaviour is disabled, likely outcome is clickThrough
				if (mac) {
					return 'clickThrough';
				}
				return 'clickThroughNewTabOrWindow';
			}

			if (e.altKey) {
				return 'alt';
			}

			const target = e.currentTarget.getAttribute('target');

			if (target === '_blank') {
				return 'clickThroughNewTabOrWindow';
			}

			return 'clickThrough';
		}

		case 'middle': {
			return 'clickThroughNewTabOrWindow';
		}

		case 'right': {
			return 'contextMenu';
		}
	}

	return 'unknown';
}

const linkClickedEvent = ({
	clickType,
	clickOutcome,
	keysHeld,
	defaultPrevented,
}: UiLinkClickedEventProps): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'link',
	eventType: 'ui',
	attributes: {
		clickType,
		clickOutcome,
		keysHeld,
		defaultPrevented,
	},
});

export const createLinkClickedPayload = (event: React.MouseEvent) => {
	// Through the `detail` property, we're able to determine if the event is (most likely) triggered via keyboard
	// https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
	const isKeyboard = event.nativeEvent.detail === 0;
	const clickType = isKeyboard ? 'keyboard' : buttonMap.get(event.button);

	if (!clickType) {
		return;
	}
	const clickOutcome = getLinkClickOutcome(event, clickType);
	const keysHeld = getKeys(event);
	const defaultPrevented = event.defaultPrevented;

	const linkClickedEventResult = linkClickedEvent({
		clickType,
		clickOutcome,
		keysHeld,
		defaultPrevented,
	});

	// if the current target is an anchor tag, we can get the href from it and use that as the url being navigated too.
	if (event.currentTarget instanceof HTMLAnchorElement) {
		const url = event.currentTarget.href;
		return {
			...linkClickedEventResult,
			nonPrivacySafeAttributes: {
				url,
			},
		};
	} else {
		// We can't get the href from the event target, so dont include the url or any non privacy safe attributes
		return linkClickedEventResult;
	}
};

type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;

export const fireLinkClickedEvent =
	(
		createAnalyticsEvent: (payload: AnalyticsEventPayload) => UIAnalyticsEvent,
	): ((
		event: React.MouseEvent,
		overrides?: DeepPartial<
			Omit<GasPayload, 'attributes'> & { attributes: UiLinkClickedEventProps }
		>,
	) => void) =>
	(event, overrides = {}) => {
		const payload = createLinkClickedPayload(event);
		if (payload) {
			createAnalyticsEvent({
				...payload,
				...overrides,
				attributes: {
					...payload.attributes,
					...overrides?.attributes,
				},
				nonPrivacySafeAttributes: {
					...payload.nonPrivacySafeAttributes,
					...overrides?.nonPrivacySafeAttributes,
				},
			}).fire(ANALYTICS_CHANNEL);
		}
	};

const getDisplayName = (WrappedComponent: React.ElementType<any> | string): string => {
	if (typeof WrappedComponent === 'string') {
		return WrappedComponent;
	}
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export function withLinkClickedEvent<
	Component extends Extract<React.ElementType, 'a'> | React.ComponentType<LinkProps>,
>(WrappedComponent: Component) {
	const Component = (props: LinkProps) => {
		const onClick = useLinkClicked(props.onClick);
		const onMouseDown = useMouseDownEvent(props.onMouseDown);
		return React.createElement(WrappedComponent, {
			...props,
			onClick,
			onMouseDown,
		});
	};

	Component.displayName = `withLinkClickedEvent(${getDisplayName(WrappedComponent)})`;

	return Component;
}
