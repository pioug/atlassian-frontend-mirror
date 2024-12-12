import React, { type FC, memo, type Ref, useCallback, useEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import { Layering, useCloseOnEscapePress, useLayering } from '@atlaskit/layering';
import { fg } from '@atlaskit/platform-feature-flags';
import { Manager, Popper, Reference } from '@atlaskit/popper';

import type { InlineDialogProps } from '../types';

import NodeResolverWrapper from './node-resolver-wrapper';
import { Container } from './styled/container';

interface ReferenceChildrenProps {
	ref: Ref<HTMLElement>;
	style?: React.CSSProperties;
}

const checkIsChildOfPortal = (node: HTMLElement | null): boolean => {
	if (!node) {
		return false;
	}

	return (
		(node.classList && node.classList.contains('atlaskit-portal-container')) ||
		checkIsChildOfPortal(node.parentElement)
	);
};

// Close manager for layering
const CloseManager = ({
	handleEscapeClose,
	handleClick,
}: {
	handleEscapeClose: (event: KeyboardEvent) => void;
	handleClick: (event: MouseEvent) => void;
}) => {
	useCloseOnEscapePress({ onClose: handleEscapeClose });

	const { isLayerDisabled } = useLayering();

	useEffect(() => {
		return bind(window, {
			type: 'click',
			listener: (e) => {
				if (isLayerDisabled()) {
					return;
				}
				handleClick(e);
			},
			options: { capture: true },
		});
	}, [handleClick, isLayerDisabled]);

	// only create a dummy component for using ths hook in class component
	return <span />;
};

const InlineDialog: FC<InlineDialogProps> = memo<InlineDialogProps>(function InlineDialog({
	isOpen = false,
	onContentBlur = noop,
	onContentClick = noop,
	onContentFocus = noop,
	onClose: providedOnClose = noop,
	placement = 'bottom-start',
	strategy = 'fixed',
	testId,
	content,
	children,
}) {
	const containerRef = useRef<HTMLElement | null>(null);
	const triggerRef = useRef<HTMLElement | null>(null);

	const onClose = usePlatformLeafEventHandler<{ isOpen: boolean; event: Event }>({
		fn: (event) => providedOnClose(event),
		action: 'closed',
		componentName: 'inlineDialog',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
	});

	// we put this into a ref to avoid handleCloseRequest having this as a dependency
	const onCloseRef = useRef<typeof onClose>(onClose);

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

			if (isOpen) {
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
		[isOpen],
	);

	const handleClick = useCallback(
		(event: MouseEvent) => {
			// exit if we click outside but on the trigger — it can handle the clicks itself
			if (triggerRef.current && triggerRef.current.contains(event.target as Node)) {
				return;
			}

			if (containerRef.current?.contains(event.target as Node)) {
				return;
			}

			handleCloseRequest(event);
		},
		[handleCloseRequest, containerRef, triggerRef],
	);

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
					{typeof content === 'function' ? content() : content}
				</Container>
			)}
		</Popper>
	) : null;

	return (
		<Manager>
			<Reference>
				{({ ref }: ReferenceChildrenProps) => (
					<NodeResolverWrapper
						innerRef={(node: HTMLElement) => {
							triggerRef.current = node;
							if (typeof ref === 'function') {
								ref(node);
							} else {
								(ref as React.MutableRefObject<HTMLElement>).current = node;
							}
							// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
						}}
						hasNodeResolver={!fg('platform_design_system_team_portal_logic_r18_fix')}
					>
						<React.Fragment>{children}</React.Fragment>
					</NodeResolverWrapper>
				)}
			</Reference>
			{isOpen ? (
				<Layering isDisabled={false}>
					{popper}
					<CloseManager handleEscapeClose={handleCloseRequest} handleClick={handleClick} />
				</Layering>
			) : (
				popper
			)}
		</Manager>
	);
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default InlineDialog;
