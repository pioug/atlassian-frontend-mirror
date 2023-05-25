import React from 'react';
import {
  AnalyticsEventPayload,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { browser } from '@atlaskit/linking-common/user-agent';

import { ClickOutcome, ClickType, UiLinkClickedEventProps } from './types';
import { ANALYTICS_CHANNEL } from './analytics';
import { AnalyticsPayload } from '../types';
import {
  useLinkClicked,
  useMouseDownEvent,
} from '../../state/analytics/useLinkClicked';

export const buttonMap = new Map<
  number | undefined,
  'none' | 'left' | 'middle' | 'right'
>([
  [undefined, 'none'],
  [0, 'left'],
  [1, 'middle'],
  [2, 'right'],
]);

export const getKeys = (e: React.MouseEvent) => {
  return (['alt', 'ctrl', 'meta', 'shift'] as const).filter(
    (key) => e[`${key}Key`] === true,
  );
};

const isContentEditable = (el: Element) => {
  return el instanceof HTMLElement && el.isContentEditable;
};

export function getLinkClickOutcome(
  e: React.MouseEvent,
  clickType: ClickType,
): ClickOutcome {
  const { mac, safari } = browser();

  /**
   * If the link/parent is content editable then left click won't have typical effect
   */
  if (
    isContentEditable(e.currentTarget) &&
    ['left', 'middle'].includes(clickType)
  ) {
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

  return linkClickedEvent({
    clickType,
    clickOutcome,
    keysHeld,
    defaultPrevented,
  });
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
      }).fire(ANALYTICS_CHANNEL);
    }
  };

const getDisplayName = (
  WrappedComponent: React.ElementType<any> | string,
): string => {
  if (typeof WrappedComponent === 'string') {
    return WrappedComponent;
  }
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export function withLinkClickedEvent<
  Component extends React.ElementType<{
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    onMouseDown?: React.MouseEventHandler<HTMLAnchorElement>;
  }>,
>(WrappedComponent: Component) {
  const Component = (props: React.ComponentProps<Component>) => {
    const onClick = useLinkClicked(props.onClick);
    const onMouseDown = useMouseDownEvent(props.onMouseDown);

    return React.createElement(WrappedComponent, {
      ...props,
      onClick,
      onMouseDown,
    });
  };

  Component.displayName = `withLinkClickedEvent(${getDisplayName(
    WrappedComponent,
  )})`;

  return Component;
}
