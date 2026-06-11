import { roleToAriaHasPopup } from './role-to-aria-has-popup';
import { type TAriaHasPopupValue, type TRoleRequiringAccessibleName } from './role-types';

/**
 * Roles accepted by `getAriaForTrigger`.
 *
 * Excludes tooltip-family roles (`tooltip`, `note`, `status`, `alert`, `log`)
 * because the correct trigger wiring for those is `aria-describedby`, not
 * `aria-haspopup` / `aria-expanded` / `aria-controls`. Use `aria-describedby`
 * manually for tooltip triggers.
 */
type TAriaForTriggerRole = TRoleRequiringAccessibleName | 'listbox' | 'tree' | 'grid';

type TGetAriaForTriggerOptions = {
	/**
	 * The `role` that will be set on the `<Popover>` element. Used to derive
	 * the correct `aria-haspopup` value for the trigger.
	 */
	role: TAriaForTriggerRole;
	/**
	 * Whether the popover is currently open. Drives `aria-expanded`.
	 */
	isOpen: boolean;
	/**
	 * The popover identifier - the value returned by `usePopoverId()`,
	 * passed as `id` to `<Popover>` and referenced here via `aria-controls`.
	 */
	popoverId: string;
};

/**
 * Non-undefined subset of `TAriaHasPopupValue`. Every role accepted by
 * `getAriaForTrigger` maps to a concrete `aria-haspopup` string, so the
 * trigger always receives a defined attribute value.
 */
type TAriaHasPopupForTrigger = Exclude<TAriaHasPopupValue, undefined>;

type TAriaForTrigger = {
	'aria-haspopup': TAriaHasPopupForTrigger;
	'aria-expanded': boolean;
	/**
	 * `aria-controls` is `undefined` while the popover is closed, because
	 * the popover host element is only rendered in the DOM while open. A
	 * dangling `aria-controls` reference (pointing at a missing ID) is
	 * tolerated by assistive tech but flagged by some a11y tooling, so
	 * we leave it unset until the target exists.
	 */
	'aria-controls': string | undefined;
};

/**
 * Returns the ARIA attributes to spread onto a click-activated popover trigger.
 *
 * Centralises three attributes that are easy to forget or get wrong individually:
 *
 * - `aria-haspopup` - derived from the popover's role (e.g. `dialog → "dialog"`,
 *   `menu → "menu"`, `tooltip → undefined`). React omits the attribute when
 *   the value is `undefined`.
 * - `aria-expanded` - reflects the current open state.
 * - `aria-controls` - references the popover element by its id, even
 *   while the popover is closed. The relationship is stable; `aria-expanded`
 *   carries the current visibility state.
 *
 * **This function is for click/keyboard-activated popovers only.** For
 * hover-driven tooltips, the trigger should use `aria-describedby` instead.
 *
 * @example
 * ```tsx
 * import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
 * import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
 *
 * const popoverId = usePopoverId();
 * const [isOpen, setIsOpen] = useState(false);
 *
 * return (
 *   <>
 *     <button
 *       ref={triggerRef}
 *       onClick={() => setIsOpen((previous) => !previous)}
 *       {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId })}
 *     >
 *       Open
 *     </button>
 *     <Popover
 *       id={popoverId}
 *       role="dialog"
 *       label="My dialog"
 *       isOpen={isOpen}
 *       triggerRef={triggerRef}
 *       onClose={() => setIsOpen(false)}
 *     >
 *       …
 *     </Popover>
 *   </>
 * );
 * ```
 */
export function getAriaForTrigger({
	role,
	isOpen,
	popoverId,
}: TGetAriaForTriggerOptions): TAriaForTrigger {
	// `roleToAriaHasPopup` accepts a wider role union (including tooltip-family
	// roles that map to `undefined`). `TAriaForTriggerRole` excludes those, so
	// the returned value is guaranteed to be a defined string. The cast narrows
	// the wider helper signature to match.
	const ariaHasPopup = roleToAriaHasPopup({ role }) as TAriaHasPopupForTrigger;
	// `aria-controls` is set to `undefined` while closed. The `Popover` /
	// `Dialog` primitives unmount their host element after the exit
	// animation finishes, so a closed-state `aria-controls` would point
	// at a node that is not in the DOM. Returning `undefined` here means
	// JSX spread renders no `aria-controls` attribute on the trigger
	// until the target exists, avoiding the dangling reference while
	// keeping the relationship live whenever it is meaningful.
	return {
		'aria-haspopup': ariaHasPopup,
		'aria-expanded': isOpen,
		'aria-controls': isOpen ? popoverId : undefined,
	};
}
