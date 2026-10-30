import { type TRoleRequiringAccessibleName } from './role-types';

/**
 * Roles accepted by `getAriaForTrigger`.
 *
 * Tooltip-family roles (`tooltip`, `note`, `status`, `alert`, `log`) are not accepted. Their
 * trigger uses `aria-describedby`, not `aria-haspopup`, `aria-expanded` and `aria-controls`. Set
 * `aria-describedby` yourself on a tooltip trigger.
 */
type TAriaForTriggerRole = TRoleRequiringAccessibleName | 'listbox' | 'tree' | 'grid';

type TAriaHasPopupByRole = {
	dialog: 'dialog';
	alertdialog: 'dialog';
	menu: 'menu';
	listbox: 'listbox';
	tree: 'tree';
	grid: 'grid';
};

/**
 * The `aria-haspopup` value for each role in `TAriaForTriggerRole`: the popup type that the
 * trigger announces. ARIA has no `alertdialog` value, so `alertdialog` uses `'dialog'`.
 *
 * `true` is not a value. The function returns only the explicit tokens, never
 * `aria-haspopup="true"`.
 */
const roleToAriaHasPopup: TAriaHasPopupByRole = {
	dialog: 'dialog',
	alertdialog: 'dialog',
	menu: 'menu',
	listbox: 'listbox',
	tree: 'tree',
	grid: 'grid',
};

type TGetAriaForTriggerOptions<TRole extends TAriaForTriggerRole | undefined> = {
	/**
	 * The `role` of the `Popover`. It sets the `aria-haspopup` value of the trigger. No role gives
	 * no `aria-haspopup`.
	 */
	role?: TRole;
	/**
	 * Whether the popover is open. It sets `aria-expanded`.
	 */
	isOpen: boolean;
	/**
	 * The `id` of the popover: the value from `usePopoverId()`, also passed as `id` to `Popover`.
	 * `aria-controls` refers to it.
	 */
	popoverId: string;
};

type TAriaForTrigger<TRole extends TAriaForTriggerRole | undefined> = {
	'aria-haspopup': TRole extends TAriaForTriggerRole ? TAriaHasPopupByRole[TRole] : undefined;
	'aria-expanded': boolean;
	/**
	 * `undefined` while the popover is closed, because the popover element is in the DOM only while
	 * it is open or animating closed. Assistive technology tolerates an `aria-controls` that points
	 * to a missing `id`, but some accessibility tools flag it. See
	 * `notes/decisions/aria-controls-trigger-contract.md`.
	 */
	'aria-controls': string | undefined;
};

/**
 * Returns the ARIA attributes to spread onto the trigger of a popover that opens on click or key
 * press.
 *
 * It sets three attributes that are easy to forget or get wrong:
 *
 * - `aria-haspopup`: from the popover role (for example `dialog` gives `"dialog"`, `menu` gives
 *   `"menu"`). No role gives `undefined`, so React renders no attribute.
 * - `aria-expanded`: the open state.
 * - `aria-controls`: the popover `id` while the popover is open. `undefined` while it is closed,
 *   because the closed popover is not in the DOM.
 *
 * **Use it only for popovers that open on click or key press.** The trigger of a tooltip that
 * opens on hover uses `aria-describedby` instead.
 *
 * @example
 * ```tsx
 * import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
 * import { Popover } from '@atlaskit/top-layer/popover/popover';
 * import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
 *
 * const popoverId = usePopoverId();
 * const [isOpen, setIsOpen] = useState(false);
 *
 * return (
 *   <>
 *     <button
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
 *       onClose={() => setIsOpen(false)}
 *     >
 *       …
 *     </Popover>
 *   </>
 * );
 * ```
 */
export function getAriaForTrigger<TRole extends TAriaForTriggerRole | undefined = undefined>(
	options: TGetAriaForTriggerOptions<TRole>,
): TAriaForTrigger<TRole>;
export function getAriaForTrigger({
	role,
	isOpen,
	popoverId,
}: TGetAriaForTriggerOptions<TAriaForTriggerRole | undefined>): TAriaForTrigger<
	TAriaForTriggerRole | undefined
> {
	// `aria-controls` is `undefined` while closed: the popover element is not in the DOM after its
	// exit animation, so the `id` would point to nothing.
	return {
		'aria-haspopup': role ? roleToAriaHasPopup[role] : undefined,
		'aria-expanded': isOpen,
		'aria-controls': isOpen ? popoverId : undefined,
	};
}
