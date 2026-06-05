/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useState } from 'react';

import { bindAll } from 'bind-event-listener';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- mirror existing renderer pattern
import uuid from 'uuid/v4';

import { cssMap, jsx } from '@atlaskit/css';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import Tooltip, { type TriggerProps as TooltipTriggerProps } from '@atlaskit/tooltip';

const styles = cssMap({
	// Visually-hidden trigger surface for ADS `<Tooltip>`. The tooltip's ref
	// is forwarded onto the real chip element, so this span is never the
	// actual trigger surface — it just needs to be in the React tree to keep
	// `<Tooltip>`'s render-prop API happy.
	hiddenTrigger: {
		display: 'none',
	},
});

/**
 * ADS `<Tooltip>` hands us a ref via its render-prop child. That ref may be
 * either a callback ref or a mutable ref object — React supports both shapes
 * and ADS's typing keeps both possible. This helper assigns the supplied
 * element to whichever ref shape was provided so the tooltip ends up using
 * the chip's bounding box for positioning and its DOM for trigger events.
 */
const assignRef = (ref: React.Ref<HTMLElement> | null | undefined, element: HTMLElement): void => {
	if (typeof ref === 'function') {
		ref(element);
	} else if (ref) {
		(ref as React.MutableRefObject<HTMLElement | null>).current = element;
	}
};

/**
 * Names of the React-style trigger-prop handlers we forward from ADS
 * `<Tooltip>` onto the chip element.
 */
type BridgedHandlerName =
	| 'onBlur'
	| 'onFocus'
	| 'onMouseDown'
	| 'onMouseMove'
	| 'onMouseOut'
	| 'onMouseOver';

/**
 * Maps each React-style trigger-prop handler ADS `<Tooltip>` hands us in its
 * render-prop callback to the DOM event name we attach to the chip via
 * `bind-event-listener`. The chip lives in the ProseMirror document and is
 * not a React child of the tooltip, so we have to bridge React handlers to
 * native event listeners ourselves.
 *
 * Names are listed in the same order ADS internally registers them.
 */
const TRIGGER_EVENT_MAP: ReadonlyArray<readonly [BridgedHandlerName, string]> = [
	['onMouseOver', 'mouseover'],
	['onMouseOut', 'mouseout'],
	['onMouseMove', 'mousemove'],
	['onMouseDown', 'mousedown'],
	['onFocus', 'focusin'],
	['onBlur', 'focusout'],
];

/**
 * Anchors an ADS `<Tooltip>` to a ProseMirror chip element that is **not** a
 * React child of the tooltip. The chip itself stays in the PM document; this
 * renderer mounts an always-present React subtree via `portalProviderAPI` whose
 * sole job is to host the tooltip and forward the ADS-provided trigger ref +
 * event handlers onto the chip.
 *
 * The forwarding is deliberate: ADS `<Tooltip>` expects to attach its hover /
 * focus / blur listeners to its render-prop child, but our render-prop child
 * is a `display: none` placeholder span that no real event can reach. We bridge
 * those listeners to the chip via `addEventListener` so the tooltip opens and
 * closes in response to the user actually interacting with the chip — keyboard
 * focus, mouse hover, screen-reader focus, the lot.
 */
export interface DisabledTooltipController {
	/** Tear down the React subtree. */
	destroy: () => void;
	/** Update the tooltip text. Passing `undefined` hides the tooltip. */
	setTooltip: (text: string | undefined) => void;
}

interface AnchoredTooltipProps {
	getInitialTooltip: () => string | undefined;
	referenceElement: HTMLElement;
	subscribe: (listener: (tooltip: string | undefined) => void) => () => void;
}

/**
 * Hook that mirrors ADS Tooltip's React trigger props onto a DOM element
 * which is not a React child of the tooltip. Re-attaches whenever ADS hands
 * us a fresh set of props (which happens on every render of the render-prop
 * child) and cleans up on unmount.
 *
 * We use `bind-event-listener`'s `bindAll` rather than raw
 * `addEventListener` / `removeEventListener` calls so the lifetime of every
 * subscription is paired with a single `UnbindFn` — the AFM-mandated pattern
 * for keeping listener bookkeeping leak-free.
 */
const useBridgedTriggerListeners = (chip: HTMLElement, triggerProps: TooltipTriggerProps): void => {
	useEffect(() => {
		// Build the bindAll bindings array out of only the handlers ADS actually
		// supplied. Each React handler is wrapped in a thin adapter so the
		// listener signature matches the native `EventListener` shape; ADS
		// handlers ignore the synthetic-event-only fields they don't use
		// (target, currentTarget), so passing the raw DOM event through
		// `unknown` is safe in practice.
		const bindings = TRIGGER_EVENT_MAP.flatMap(([propName, eventName]) => {
			const handler = triggerProps[propName];
			if (!handler) {
				return [];
			}
			return [
				{
					type: eventName,
					listener: (event: Event) => {
						(handler as (e: unknown) => void)(event);
					},
				},
			];
		});

		if (bindings.length === 0) {
			return;
		}

		const unbind = bindAll(chip, bindings);
		return unbind;
	}, [chip, triggerProps]);
};

const AnchoredTooltip = ({
	subscribe,
	getInitialTooltip,
	referenceElement,
}: AnchoredTooltipProps): React.JSX.Element | null => {
	const [tooltip, setTooltipState] = useState<string | undefined>(getInitialTooltip);

	useEffect(() => subscribe(setTooltipState), [subscribe]);

	if (!tooltip) {
		return null;
	}

	return (
		<Tooltip content={tooltip} position="top">
			{(tooltipProps) => (
				<TriggerBridge referenceElement={referenceElement} tooltipProps={tooltipProps} />
			)}
		</Tooltip>
	);
};

/**
 * Render-prop child for ADS `<Tooltip>`. The element it returns is a
 * `display: none` placeholder that satisfies the render-prop API; the
 * real trigger surface is the chip in the PM document, which receives
 * both the ADS ref and the bridged event listeners via the side-effects
 * declared on this component.
 */
const TriggerBridge = ({
	referenceElement,
	tooltipProps,
}: {
	referenceElement: HTMLElement;
	tooltipProps: TooltipTriggerProps;
}): React.JSX.Element => {
	useBridgedTriggerListeners(referenceElement, tooltipProps);

	return (
		<span
			ref={() => assignRef(tooltipProps.ref, referenceElement)}
			aria-hidden="true"
			css={styles.hiddenTrigger}
		/>
	);
};

export const disabledTooltipRenderer = ({
	chipElement,
	portalProviderAPI,
}: {
	chipElement: HTMLElement;
	portalProviderAPI: PortalProviderAPI;
}): DisabledTooltipController => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- mirror existing renderer pattern
	const key = uuid();

	let currentTooltip: string | undefined;
	const listeners = new Set<(tooltip: string | undefined) => void>();

	const broadcast = () => {
		listeners.forEach((listener) => listener(currentTooltip));
	};

	const getInitialTooltip = (): string | undefined => currentTooltip;
	const subscribe = (listener: (tooltip: string | undefined) => void): (() => void) => {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	};

	const renderElement = (): React.JSX.Element => (
		<AnchoredTooltip
			referenceElement={chipElement}
			getInitialTooltip={getInitialTooltip}
			subscribe={subscribe}
		/>
	);

	portalProviderAPI.render(renderElement, chipElement, key);

	return {
		setTooltip(text) {
			currentTooltip = text;
			broadcast();
		},
		destroy() {
			portalProviderAPI.remove(key);
			listeners.clear();
		},
	};
};
