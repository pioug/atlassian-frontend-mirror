/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import React, { type FC, memo, useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import NodeResolver from 'react-node-resolver';

import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import { UNSAFE_LAYERING, useCloseOnEscapePress } from '@atlaskit/layering';
import { fg } from '@atlaskit/platform-feature-flags';
import { Manager, Popper, Reference } from '@atlaskit/popper';

import type { InlineDialogProps } from '../types';

import { Container } from './styled/container';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const checkIsChildOfPortal = (node: HTMLElement | null): boolean => {
	if (!node) {
		return false;
	}

	return (
		(node.classList && node.classList.contains('atlaskit-portal-container')) ||
		checkIsChildOfPortal(node.parentElement)
	);
};

// escape close manager for layering
const EscapeCloseManager = ({ handleClose }: { handleClose: (event: KeyboardEvent) => void }) => {
	useCloseOnEscapePress({ onClose: handleClose });
	// only create a dummy component for using ths hook in class component
	return <span />;
};

const InlineDialog: FC<InlineDialogProps> = memo<InlineDialogProps>(function InlineDialog({
	isOpen = false,
	onContentBlur = noop,
	onContentClick = noop,
	onContentFocus = noop,
	onClose = noop,
	placement = 'bottom-start',
	strategy = 'fixed',
	testId,
	content,
	children,
}) {
	const containerRef = useRef<HTMLElement | null>(null);
	const triggerRef = useRef<HTMLElement | null>(null);
	// we put this into a ref to avoid handleCloseRequest having this as a dependency
	const onCloseRef = useRef<typeof onClose>(onClose);

	const isLayeringEnabled =
		fg('platform.design-system-team.inline-message-layering_wfp1p') && isOpen;

	useEffect(() => {
		onCloseRef.current = onClose;
	});

	const handleCloseRequest = useCallback(
		(event: MouseEvent | KeyboardEvent) => {
			const { target } = event;
			// checks for when target is not HTMLElement
			if (!(target instanceof HTMLElement)) {
				return;
			}

			// TODO: This is to handle the case where the target is no longer in the DOM.
			// This happens with react-select in datetime picker. There might be other
			// edge cases for this.
			if (!document.body.contains(target)) {
				return;
			}

			if (isLayeringEnabled) {
				onCloseRef.current?.({ isOpen: false, event });
				return;
			}

			// handles the case where inline dialog opens portalled elements such as modal
			if (checkIsChildOfPortal(target)) {
				return;
			}

			// call onClose if the click originated from outside the dialog
			if (containerRef.current && !containerRef.current.contains(target)) {
				onCloseRef.current?.({ isOpen: false, event });
			}
		},
		[isLayeringEnabled],
	);

	const handleClick = useCallback(
		(event: MouseEvent) => {
			// exit if we click outside but on the trigger — it can handle the clicks itself
			if (triggerRef.current && triggerRef.current.contains(event.target as Node)) {
				return;
			}

			// if feature flag is enabled we won't file the close event when clicking inside dialog
			if (isLayeringEnabled && containerRef.current?.contains(event.target as Node)) {
				return;
			}

			handleCloseRequest(event);
		},
		[handleCloseRequest, isLayeringEnabled],
	);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		return bind(window, {
			type: 'click',
			listener: handleClick,
			options: { capture: true },
		});
	}, [isOpen, handleClick]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				handleCloseRequest(event);
			}
		},
		[handleCloseRequest],
	);

	useEffect(() => {
		// if layering is enabled, we will use useCloseOnEscapePress hook instead
		if (!isOpen || isLayeringEnabled) {
			return;
		}

		const unbind = bind(window, {
			type: 'keydown',
			listener: handleKeyDown,
			options: { capture: true },
		});

		return unbind;
	}, [isOpen, handleKeyDown, isLayeringEnabled]);

	const popper = isOpen ? (
		<Popper placement={placement} strategy={strategy}>
			{({ ref, style }) => (
				<Container
					onBlur={onContentBlur}
					onFocus={onContentFocus}
					onClick={onContentClick}
					ref={(node) => {
						if (node) {
							containerRef.current = node;
							if (typeof ref === 'function') {
								ref(node);
							} else {
								(ref as React.MutableRefObject<HTMLElement>).current = node;
							}
						}
					}}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={style}
					testId={testId}
				>
					{content}
				</Container>
			)}
		</Popper>
	) : null;

	return (
		<Manager>
			<Reference>
				{({ ref }) => (
					<NodeResolver
						innerRef={(node: HTMLElement) => {
							triggerRef.current = node;
							if (typeof ref === 'function') {
								ref(node);
							} else {
								(ref as React.MutableRefObject<HTMLElement>).current = node;
							}
						}}
					>
						<React.Fragment>{children}</React.Fragment>
					</NodeResolver>
				)}
			</Reference>
			{isLayeringEnabled ? (
				<UNSAFE_LAYERING isDisabled={false}>
					{popper}
					<EscapeCloseManager handleClose={handleCloseRequest} />
				</UNSAFE_LAYERING>
			) : (
				popper
			)}
		</Manager>
	);
});

InlineDialog.displayName = 'InlineDialog';

export { InlineDialog as InlineDialogWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
	componentName: 'inlineDialog',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onClose: createAndFireEventOnAtlaskit({
			action: 'closed',
			actionSubject: 'inlineDialog',

			attributes: {
				componentName: 'inlineDialog',
				packageName,
				packageVersion,
			},
		}),
	})(InlineDialog),
);
