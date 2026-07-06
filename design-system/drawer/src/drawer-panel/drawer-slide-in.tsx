import { type Direction } from '@atlaskit/motion/types';
import { type TAnimationPreset } from '@atlaskit/top-layer/animations';

/**
 * Off-screen transform per entry edge. A drawer slides in from the edge it is
 * pinned to and exits back to the same edge (legacy `SlideIn` used
 * `exitTo={enterFrom}`), so enter and exit are symmetric.
 */
const HIDDEN_TRANSFORM: Record<Direction, string> = {
	left: 'translateX(-100%)',
	right: 'translateX(100%)',
	top: 'translateY(-100%)',
	bottom: 'translateY(100%)',
};

// Match the legacy `CustomSlideIn`: `duration="small"` (100ms) on enter,
// `small * 0.5` (50ms) on exit, `ease-out` timing. Drawer slides with no panel
// fade (`fade="none"`); only the backdrop fades.
const ENTER_MS = 100;
const EXIT_MS = 50;
const EASE = 'cubic-bezier(0.2,0,0,1)'; // @atlaskit/motion `easeOut`

/**
 * Builds the slide CSS for a single entry edge, scoped to
 * `[data-ds-dialog-drawer-slide-{from}]` (the `Dialog` primitive stamps
 * `data-ds-dialog-{name}` on the `<dialog>` element).
 *
 * - base selector  → hidden/exit state + exit duration
 * - `[open]`        → visible state + enter duration
 * - `@starting-style` → initial (pre-paint) state so the entry transition runs
 *
 * The `::backdrop` fades its blanket colour in step with the panel. Stacked
 * drawers hide their backdrop via the `Dialog` `shouldHideBackdrop` prop (an
 * ID-scoped `<style>` whose specificity beats this rule).
 */
function buildCss(name: string, hidden: string): string {
	const sel = `[data-ds-dialog-${name}]`;
	return `
${sel} {
  transform: ${hidden};
  transition:
    transform ${EXIT_MS}ms ${EASE},
    overlay ${EXIT_MS}ms allow-discrete,
    display ${EXIT_MS}ms allow-discrete;
}

${sel}[open] {
  transform: none;
  transition-duration: ${ENTER_MS}ms;
}

@starting-style {
  ${sel}[open] {
    transform: ${hidden};
  }
}

${sel}::backdrop {
  background-color: transparent;
  transition:
    background-color ${EXIT_MS}ms ${EASE},
    overlay ${EXIT_MS}ms allow-discrete,
    display ${EXIT_MS}ms allow-discrete;
}

${sel}[open]::backdrop {
  background-color: var(--ds-blanket, #050C1F75);
  transition-duration: ${ENTER_MS}ms;
}

@starting-style {
  ${sel}[open]::backdrop {
    background-color: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  ${sel},
  ${sel}[open],
  ${sel}::backdrop,
  ${sel}[open]::backdrop {
    transition-duration: 0s;
  }
}
`;
}

type TDrawerSlideInOptions = {
	/**
	 * The edge the drawer slides in from. Defaults to `left`.
	 */
	from?: Direction;
};

/**
 * Directional slide animation for the top-layer `Drawer`, passed to the
 * `Dialog` primitive's `animate` prop. Local to `@atlaskit/drawer` (not a
 * shared top-layer preset). The panel slides in from its pinned viewport edge
 * while the `::backdrop` fades.
 *
 * @example
 * ```tsx
 * <Dialog animate={drawerSlideIn({ from: 'left' })} isOpen={isOpen} onClose={onClose} label="...">
 *   ...
 * </Dialog>
 * ```
 */
export function drawerSlideIn({ from = 'left' }: TDrawerSlideInOptions = {}): TAnimationPreset {
	const name = `drawer-slide-${from}`;
	return {
		name,
		css: buildCss(name, HIDDEN_TRANSFORM[from]),
		enterDurationMs: ENTER_MS,
		exitDurationMs: EXIT_MS,
	};
}
