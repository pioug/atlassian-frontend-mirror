/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import type { State } from '@atlaskit/popper/main'` instead.
 */
export type { State } from '@popperjs/core';

/**
 * @deprecated Use `import { Popper, placements } from '@atlaskit/popper/main'` instead.
 */
export { Popper, placements } from '../popper';
/**
 * @deprecated Use `import type { CustomPopperProps, ManagerProps, Modifier, Placement, PopperArrowProps, PopperChildrenProps, PopperProps, ReferenceProps, StrictModifier, VirtualElement } from '@atlaskit/popper/main'` instead.
 */
export type {
	CustomPopperProps,
	ManagerProps,
	Modifier,
	Placement,
	PopperArrowProps,
	PopperChildrenProps,
	PopperProps,
	ReferenceProps,
	StrictModifier,
	VirtualElement,
} from '../popper';
