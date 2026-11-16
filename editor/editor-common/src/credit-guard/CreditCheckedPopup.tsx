import React, {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type ComponentProps,
} from 'react';

import { bind } from 'bind-event-listener';

import { cssMap } from '@atlaskit/css';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles/constants';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import type { AICreditCheck, GetAICreditStatus } from './types';
import { useAICreditGuard, type AICreditGuard } from './useAICreditGuard';

type PopupProps = ComponentProps<typeof Popup>;
export type CreditPopupTriggerProps = Parameters<PopupProps['trigger']>[0] & { id: string };
type ControlledCreditPopupProps = {
	guard: Pick<AICreditGuard, 'feedback' | 'close'>;
	/** Restore nested insert-menu search focus on Escape and use the Editor dialog layer. */
	isNestedMenu?: boolean;
	placement?: PopupProps['placement'];
	renderTrigger: (props: CreditPopupTriggerProps) => React.ReactNode;
	shouldRenderToParent?: boolean;
};
const CreditPopupTrigger = ({
	props,
	id,
	renderTrigger,
	onElement,
}: {
	id: string;
	onElement: (element: HTMLElement | null) => void;
	props: Parameters<PopupProps['trigger']>[0];
	renderTrigger: ControlledCreditPopupProps['renderTrigger'];
}): React.ReactNode => {
	const popupRef = props.ref;
	const ref = useCallback(
		(element: HTMLElement | null) => {
			onElement(element);
			if (typeof popupRef === 'function') {
				popupRef(element);
			} else if (popupRef) {
				Object.assign(popupRef, { current: element });
			}
		},
		[onElement, popupRef],
	);
	return renderTrigger({ ...props, ref, id });
};

const styles = cssMap({
	content: {
		width: '176px',
		maxWidth: '100%',
		boxSizing: 'border-box',
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});
const stopPropagation = (event: React.SyntheticEvent) => event.stopPropagation();

const focusReturnTarget = (
	preferredTarget: HTMLElement | null,
	fallbackTarget: HTMLElement | null,
): void => {
	const isUsableTarget = (target: HTMLElement | null): target is HTMLElement =>
		Boolean(
			target?.isConnected &&
			target !== target.ownerDocument.body &&
			target !== target.ownerDocument.documentElement,
		);
	const target = isUsableTarget(preferredTarget)
		? preferredTarget
		: isUsableTarget(fallbackTarget)
			? fallbackTarget
			: null;
	target?.focus();
};

/** Editor owns popup behavior; products supply content through getAICreditStatus. */
const CreditPopup = ({
	guard: { feedback, close },
	renderTrigger,
	placement = 'right-start',
	isNestedMenu = false,
	shouldRenderToParent,
}: ControlledCreditPopupProps): React.JSX.Element => {
	const id = useId();
	const [contentElement, setContentElement] = useState<HTMLDivElement | null>(null);
	const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
	// Menu search and editor inputs can keep focus when feedback opens.
	// Remember that element so Escape returns focus there instead of to the trigger.
	const returnFocus = useRef<HTMLElement | null>(null);
	const isOpen = useRef(feedback !== null);
	isOpen.current = feedback !== null;
	const restoreFocusAfterClose = useRef(false);
	useEffect(() => {
		if (!triggerElement) {
			return;
		}
		const ownerDocument = triggerElement.ownerDocument;
		const rememberFocus = (target: EventTarget | null) => {
			if (
				!isOpen.current &&
				!restoreFocusAfterClose.current &&
				target instanceof HTMLElement &&
				target !== ownerDocument.body &&
				target !== ownerDocument.documentElement
			) {
				returnFocus.current = target;
			}
		};
		rememberFocus(ownerDocument.activeElement);
		return bind(ownerDocument, {
			type: 'focusin',
			options: { capture: true },
			listener: (event) => rememberFocus(event.target),
		});
	}, [triggerElement]);
	useEffect(() => {
		if (feedback || contentElement || !restoreFocusAfterClose.current) {
			return;
		}
		restoreFocusAfterClose.current = false;
		const previousFocus = returnFocus.current?.isConnected ? returnFocus.current : triggerElement;
		focusReturnTarget(previousFocus, triggerElement);
	}, [feedback, contentElement, triggerElement]);
	useLayoutEffect(() => {
		if (!feedback || !contentElement) return;
		const ownerDocument = contentElement.ownerDocument;
		return bind(ownerDocument, {
			type: 'keydown',
			options: { capture: true },
			listener: (event) => {
				if (event.key !== 'Escape') return;
				// The popup can leave focus in the editor, whose Escape handler cancels its draft.
				event.preventDefault();
				event.stopPropagation();
				restoreFocusAfterClose.current = true;
				close();
			},
		});
	}, [feedback, contentElement, close]);
	useEffect(() => {
		if (!feedback || !contentElement || !isNestedMenu) {
			return;
		}
		return bind(contentElement.ownerDocument, {
			type: 'scroll',
			options: { capture: true },
			listener: (event) => {
				if (event.target instanceof Node && contentElement.contains(event.target)) {
					return;
				}
				close();
			},
		});
	}, [feedback, contentElement, isNestedMenu, close]);
	const onKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			event.stopPropagation();
			if (event.key === 'Escape') {
				event.preventDefault();
				restoreFocusAfterClose.current = true;
				close();
			}
		},
		[close],
	);
	const content = useCallback(
		() => (
			<Box
				ref={setContentElement}
				xcss={styles.content}
				role="none"
				onClick={stopPropagation}
				onKeyDown={onKeyDown}
			>
				{feedback?.renderCustomContent()}
			</Box>
		),
		[feedback, onKeyDown],
	);
	const trigger = useCallback(
		(props: Parameters<PopupProps['trigger']>[0]) => (
			<CreditPopupTrigger
				props={props}
				id={id}
				renderTrigger={renderTrigger}
				onElement={setTriggerElement}
			/>
		),
		[renderTrigger, id],
	);
	return (
		<Popup
			isOpen={feedback !== null}
			onClose={close}
			role="dialog"
			titleId={triggerElement?.id || id}
			placement={placement}
			shouldFitViewport
			shouldRenderToParent={shouldRenderToParent ?? false}
			// Credit feedback must share the modal layer when opened from a modal editor surface.
			zIndex={akEditorFloatingDialogZIndex}
			strategy={isNestedMenu ? 'fixed' : undefined}
			// Our Escape handler restores focus after the popup unmounts.
			// Disable automatic restoration so outside clicks keep focus on their target.
			shouldReturnFocus={false}
			shouldUseCaptureOnOutsideClick
			content={content}
			trigger={trigger}
		/>
	);
};

type TriggerEvent = React.MouseEvent | React.KeyboardEvent;
/** Props the trigger applies to anchor the popup and guard its native action. */
export type CreditCheckedTriggerProps = CreditPopupTriggerProps & {
	'aria-haspopup': 'dialog';
	isSelected: boolean;
	onClick: (event?: TriggerEvent) => void;
};
type CreditCheckedActionPopupProps = {
	creditCheck: AICreditCheck;
	getAICreditStatus: GetAICreditStatus;
	onAllowed: (event?: TriggerEvent) => void;
	placement: PopupProps['placement'];
	renderTrigger: (props: CreditCheckedTriggerProps) => React.ReactNode;
};
export type CreditCheckedPopupProps = CreditCheckedActionPopupProps | ControlledCreditPopupProps;

const CreditCheckedActionPopup = ({
	creditCheck,
	getAICreditStatus,
	onAllowed,
	placement,
	renderTrigger,
}: CreditCheckedActionPopupProps): React.JSX.Element => {
	const guard = useAICreditGuard(getAICreditStatus);
	const { check, close, feedback } = guard;
	const activate = useCallback(
		(event?: TriggerEvent) => {
			if (feedback) {
				close();
				return;
			}
			if (check(creditCheck)) {
				onAllowed(event);
			}
		},
		[feedback, close, check, creditCheck, onAllowed],
	);
	const trigger = useCallback(
		(props: CreditPopupTriggerProps) =>
			renderTrigger({
				...props,
				'aria-haspopup': 'dialog',
				isSelected: feedback !== null,
				onClick: activate,
			}),
		[renderTrigger, feedback, activate],
	);
	return <CreditPopup guard={guard} placement={placement} renderTrigger={trigger} />;
};

/** Reuses the toolbar action contract; insert-menu adapters can supply an externally triggered guard. */
export const CreditCheckedPopup = (props: CreditCheckedPopupProps): React.JSX.Element => {
	if ('guard' in props) {
		return (
			<CreditPopup
				guard={props.guard}
				placement={props.placement}
				renderTrigger={props.renderTrigger}
				isNestedMenu={props.isNestedMenu}
				shouldRenderToParent={props.shouldRenderToParent}
			/>
		);
	}
	return (
		<CreditCheckedActionPopup
			creditCheck={props.creditCheck}
			getAICreditStatus={props.getAICreditStatus}
			onAllowed={props.onAllowed}
			placement={props.placement}
			renderTrigger={props.renderTrigger}
		/>
	);
};
