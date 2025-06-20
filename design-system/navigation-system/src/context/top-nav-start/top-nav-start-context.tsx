import { createContext } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

/**
 * Context for the TopNavStart container element
 * Used to power the side nav flyout by allowing the side nav to bind event listeners to the element, so we can
 * keep the flyout open while the user mouses from the top bar to the side nav.
 */
export const TopNavStartElement = createContext<HTMLDivElement | null>(null);

/**
 * Context for the callback ref used to respond to the TopNavStart element ref being attached. It is used to update the
 * `TopNavStartElement` state so consumers can react to the ref being attached.
 *
 * e.g. Once the TopNavStart element has been mounted, the side nav can bind mouse event listeners to it.
 *
 * A callback ref is needed because the side nav can be mounted before elements in the top bar (e.g. if the element is lazy loaded),
 * which happens in Jira and Confluence), which would prevent the event listeners from being set up.
 */
export const TopNavStartAttachRef = createContext<(newVal: HTMLDivElement | null) => void>(__noop);
