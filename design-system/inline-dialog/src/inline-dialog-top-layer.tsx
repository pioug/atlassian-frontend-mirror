/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, Fragment, memo, type ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import { token } from '@atlaskit/tokens';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { createPopoverCloseEvent } from '@atlaskit/top-layer/create-close-event';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { fromLegacyPlacement, type TLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import { Popover, type TPopoverCloseReason } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import type { InlineDialogProps } from './types';

const displayContentsStyles = cssMap({
	root: {
		display: 'contents',
	},
});

const styles = cssMap({
	container: {
		boxSizing: 'content-box',
		maxWidth: '448px',
		maxHeight: '448px',
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small', '3px'),
		boxShadow: token('elevation.shadow.overlay'),
		color: token('color.text'),
		paddingBlockEnd: token('space.200', '16px'),
		paddingBlockStart: token('space.200', '16px'),
		paddingInlineEnd: token('space.300', '24px'),
		paddingInlineStart: token('space.300', '24px'),
	},
});

const animation = slideAndFade();

type TAriaAttributes = {
	'aria-controls': string;
	'aria-expanded': boolean;
	'aria-haspopup': boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
};

/**
 * Applies ARIA attributes to the child trigger element via an effect,
 * keeping them in sync with popup state.
 */
function TriggerWrapper({
	children,
	triggerRef,
	ariaAttributes,
}: {
	children: ReactNode;
	triggerRef: React.MutableRefObject<HTMLElement | null>;
	ariaAttributes: TAriaAttributes;
}) {
	useEffect(() => {
		const trigger = triggerRef.current;
		if (!trigger) {
			return;
		}
		Object.entries(ariaAttributes).forEach(([key, value]) => {
			// Skip undefined entries (e.g. aria-haspopup may be undefined for non-popup roles).
			if (value === undefined) {
				return;
			}
			trigger.setAttribute(key, String(value));
		});
	}, [ariaAttributes, triggerRef]);

	return (
		// We wrap in a div with `display: contents` so it does not affect layout.
		// We resolve the ref to `firstElementChild` because CSS Anchor Positioning
		// needs a real rendered element to anchor to. `display: contents` elements
		// do not generate a box and cannot serve as anchors.
		<div
			css={displayContentsStyles.root}
			ref={(node: HTMLDivElement | null) => {
				const firstElementChild = (node?.firstElementChild ?? null) as HTMLElement | null;
				triggerRef.current = firstElementChild;
			}}
		>
			{children}
		</div>
	);
}

/**
 * Top-layer implementation of InlineDialog.
 *
 * Replaces the legacy rendering pipeline (Popper.js + Portal + @atlaskit/layering)
 * with the native Popover API + CSS Anchor Positioning via @atlaskit/top-layer.
 *
 * Gated behind the `platform-dst-top-layer` feature flag.
 */
const InlineDialogTopLayer: FC<InlineDialogProps> = memo(function InlineDialogTopLayer({
	isOpen = false,
	onContentBlur = noop,
	onContentClick = noop,
	onContentFocus = noop,
	onClose: providedOnClose = noop,
	placement = 'bottom-start',
	testId,
	content,
	children,

	// No-op props.
	// These props are accepted for API compatibility but have no effect
	// in the top-layer path. Each is documented with why it is unnecessary.

	// top-layer: CSS Anchor Positioning replaces Popper strategy. No-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	strategy: _strategy,
	// top-layer: Popper.js fallbackPlacements not applicable. No-op.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	fallbackPlacements: _fallbackPlacements,
}) {
	const triggerRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	const popoverId = usePopoverId();

	const onClose = usePlatformLeafEventHandler<{ isOpen: boolean; event: Event }>({
		fn: (event) => providedOnClose(event),
		action: 'closed',
		componentName: 'inlineDialog',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
	});

	// Placement conversion.
	const topLayerPlacement = useMemo(
		() => fromLegacyPlacement({ legacy: placement as TLegacyPlacement }),
		[placement],
	);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: topLayerPlacement,
	});

	// onClose bridge.
	// Translates top-layer's { reason } into the legacy onClose({ isOpen, event }) shape.
	// Focus restoration is handled automatically by the Popover based on the content role
	// (role="dialog" -> auto-restore).
	const handleOnClose = useCallback(
		({ reason }: { reason: TPopoverCloseReason }) => {
			const syntheticEvent = createPopoverCloseEvent({ reason });
			onClose({ isOpen: false, event: syntheticEvent });
		},
		[onClose],
	);

	const ariaAttributes = getAriaForTrigger({ role: 'dialog', isOpen, popoverId });

	return (
		<Fragment>
			<TriggerWrapper triggerRef={triggerRef} ariaAttributes={ariaAttributes}>
				{children}
			</TriggerWrapper>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				// TODO: i18n. Hardcoded label is not translatable.
				// Acceptable given this component is intent-to-deprecate.
				label="Inline dialog"
				isOpen={isOpen}
				onClose={handleOnClose}
				animate={animation}
				placement={topLayerPlacement}
				testId={testId}
			>
				{/*
				 * This wrapper forwards legacy consumer callbacks (onContentBlur/onClick/onFocus).
				 * role="presentation" hides it from AT since Popover provides role="dialog".
				 * Same pattern as legacy inline-dialog-container.tsx (intent-to-deprecate).
				 * Exempted from a11y ratchet in no-eslint-disable-a11y-rules.ts.
				 */}
				{/* eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions */}
				<div
					css={styles.container}
					role="presentation"
					onBlur={onContentBlur}
					onClick={onContentClick}
					onFocus={onContentFocus}
				>
					{typeof content === 'function' ? content() : content}
				</div>
			</Popover>
		</Fragment>
	);
});

export default InlineDialogTopLayer;
