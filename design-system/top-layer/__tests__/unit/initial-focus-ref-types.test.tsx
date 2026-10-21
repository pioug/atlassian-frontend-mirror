/**
 * Type tests: `initialFocusRef` is accepted only when `role` moves focus on open
 * (`dialog`, `alertdialog`, `menu`, `listbox`). The typecheck runs these. Each
 * `@ts-expect-error` line must fail to compile.
 */
import React, { type RefObject } from 'react';

import { type TRoleWithInitialFocus } from '../../src/internal/role-types';
import { Popover } from '../../src/popover/popover';
import { type TPopoverProps } from '../../src/popover/types';

declare const ref: RefObject<HTMLElement | null>;
declare const focusRole: TRoleWithInitialFocus;
declare const anyRole: 'dialog' | 'tooltip';

export const componentCases = (): React.ReactNode[] => [
	// Roles that move focus accept the ref.
	<Popover isOpen role="dialog" label="Dialog" initialFocusRef={ref}>
		<button type="button">Item</button>
	</Popover>,
	<Popover isOpen role="alertdialog" label="Alert dialog" initialFocusRef={ref}>
		<button type="button">Item</button>
	</Popover>,
	<Popover isOpen role="menu" label="Menu" initialFocusRef={ref}>
		<button type="button">Item</button>
	</Popover>,
	<Popover isOpen role="listbox" initialFocusRef={ref}>
		<div role="option" aria-selected="false" />
	</Popover>,
	<Popover isOpen role={focusRole} label="Narrowed role" initialFocusRef={ref}>
		<button type="button">Item</button>
	</Popover>,
	// Every role, and no role, still works without the ref.
	<Popover isOpen role="tooltip">
		Tooltip
	</Popover>,
	<Popover isOpen>Content</Popover>,
	// @ts-expect-error a tooltip does not move focus
	<Popover isOpen role="tooltip" initialFocusRef={ref}>
		Tooltip
	</Popover>,
	// @ts-expect-error a note does not move focus
	<Popover isOpen role="note" initialFocusRef={ref}>
		Note
	</Popover>,
	// @ts-expect-error no role: focus does not move
	<Popover isOpen initialFocusRef={ref}>
		Content
	</Popover>,
	// @ts-expect-error a role that can be a tooltip does not get the ref
	<Popover isOpen role={anyRole} label="Maybe a tooltip" initialFocusRef={ref}>
		Content
	</Popover>,
];

export const propsCases = (): TPopoverProps[] => [
	{
		isOpen: true,
		role: 'dialog',
		label: 'Dialog',
		onClose: () => {},
		initialFocusRef: ref,
		children: null,
	},
	{ isOpen: true, role: 'listbox', onClose: () => {}, initialFocusRef: ref, children: null },
	// @ts-expect-error a status does not move focus
	{ isOpen: true, role: 'status', onClose: () => {}, initialFocusRef: ref, children: null },
];

describe('initialFocusRef types', () => {
	it('is checked by the typecheck (see the @ts-expect-error cases in this file)', () => {
		expect(componentCases).toBeDefined();
		expect(propsCases).toBeDefined();
	});
});
