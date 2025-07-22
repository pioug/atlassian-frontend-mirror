import React from 'react';

import InternalModalWrapper from './internal/components/modal-wrapper';
import type { ModalDialogProps } from './types';

export interface FullScreenModalDialogProps
	extends Omit<
		ModalDialogProps,
		'width' | 'height' | 'shouldScrollInViewport' | 'shouldCloseOnOverlayClick' | 'isBlanketHidden'
	> {}

export function FullScreenModalDialog(props: FullScreenModalDialogProps) {
	return (
		<InternalModalWrapper
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
			/**
			 * Making this an internal-only prop and exposing it through a facade
			 * component so that we can keep public types simple.
			 *
			 * Otherwise we need complex conditional types that are harder to
			 * understand / maintain and aren't actually any better for consumers.
			 */
			isFullScreen
			/**
			 * Setting width and height to 100% because the `isFullScreen` prop just
			 * removes the spacing around the modal. We still need to set the size to
			 * be 100%.
			 *
			 * Intentionally reusing the existing internals as much as possible to
			 * keep complexity low and avoid duplication. It also makes the fullscreen
			 * changes easier to remove.
			 */
			width="100%"
			height="100%"
			/**
			 * Full screen modals only support body scrolling, so that the header
			 * and close button will always stay visible.
			 */
			shouldScrollInViewport={false}
			/**
			 * This prop is a noop for fullscreen modals, so we aren't exposing it to consumers.
			 * Using `false` internally to avoid potential bugs.
			 */
			shouldCloseOnOverlayClick={false}
			/**
			 * The blanket is only briefly visible for fullscreen modals when fading in,
			 * but provides a bit more of a visual cue that it has appeared on top.
			 *
			 * We don't want consumers to disable it.
			 */
			isBlanketHidden={false}
		/>
	);
}

export { default as ModalTransition } from './modal-transition';
export { default as ModalHeader } from './modal-header';
export { default as ModalTitle } from './modal-title';
export { default as ModalBody } from './modal-body';
export { default as ModalFooter } from './modal-footer';
