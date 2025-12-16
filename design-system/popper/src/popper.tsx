import React, { useMemo } from 'react';

import { type Placement, type VirtualElement } from '@popperjs/core';
import {
	type Modifier,
	type PopperChildrenProps,
	type PopperProps,
	Popper as ReactPopper,
} from 'react-popper';

import { getMaxSizeModifiers } from './max-size';

export { placements } from '@popperjs/core';
// Export types from PopperJS / React Popper
export type { Placement, VirtualElement } from '@popperjs/core';
export type {
	ManagerProps,
	ReferenceProps,
	PopperProps,
	PopperArrowProps,
	PopperChildrenProps,
	StrictModifier,
	Modifier,
} from 'react-popper';

type Offset = [number | null | undefined, number | null | undefined];

export interface CustomPopperProps<Modifiers> {
	/**
	 * Returns the element to be positioned.
	 */
	children?: (childrenProps: PopperChildrenProps) => React.ReactNode;

	/**
	 * Distance the popup should be offset from the reference in the format of [along, away] (units in px).
	 * Defaults to [0, 8] - which means the popup will be 8px away from the edge of the reference specified
	 * by the `placement` prop.
	 */
	offset?: Offset;

	/**
	 * Which side of the Reference to show on.
	 */
	placement?: Placement;

	/**
	 * Replacement reference element to position popper relative to.
	 */
	referenceElement?: HTMLElement | VirtualElement;

	/**
	 * Additional modifiers and modifier overwrites.
	 */
	modifiers?: PopperProps<Modifiers>['modifiers'];

	/**
	 * Placement strategy used. Can be 'fixed' or 'absolute'
	 */
	strategy?: PopperProps<Modifiers>['strategy'];

	/**
	 * Determines if the popper will have a `max-width` and `max-height` set to
	 * constrain it to the viewport.
	 */
	shouldFitViewport?: boolean;
}

type InternalModifierNames =
	| 'flip'
	| 'hide'
	| 'offset'
	| 'preventOverflow'
	| 'maxSizeData'
	| 'maxSize';
type ModifierProps = Modifier<InternalModifierNames>[];

const viewportPadding = 5;

const constantModifiers: ModifierProps = [
	{
		name: 'flip',
		options: {
			flipVariations: false,
			padding: viewportPadding,
			boundary: 'clippingParents',
			rootBoundary: 'viewport',
		},
	},
];

function defaultChildrenFn() {
	return null;
}

const defaultOffset: Offset = [0, 8];

export function Popper<CustomModifiers>({
	children = defaultChildrenFn,
	offset = defaultOffset,
	placement = 'bottom-start',
	referenceElement = undefined,
	modifiers,
	strategy = 'fixed',
	shouldFitViewport = false,
}: CustomPopperProps<CustomModifiers>): React.JSX.Element {
	const [offsetX, offsetY] = offset;

	type CombinedModifiers = Partial<Modifier<InternalModifierNames | CustomModifiers>>[];

	const internalModifiers = useMemo((): CombinedModifiers => {
		const preventOverflowModifier: Modifier<'preventOverflow'> = {
			name: 'preventOverflow',
			options: {
				padding: viewportPadding,
				rootBoundary: shouldFitViewport ? 'viewport' : 'document',
			},
		};

		const offsetModifier: Modifier<'offset'> = {
			name: 'offset',
			options: {
				offset: [offsetX, offsetY],
			},
		};

		const maxSizeModifiers = shouldFitViewport ? getMaxSizeModifiers({ viewportPadding }) : [];

		// @ts-ignore Type errors from incompatible @popperjs/core versions between Jira and AFM Platform... we are using ts-ignore here because ts-expect-error will cause an "Unused '@ts-expect-error' directive." error
		return [...constantModifiers, preventOverflowModifier, offsetModifier, ...maxSizeModifiers];
	}, [offsetX, offsetY, shouldFitViewport]);

	// Merge custom props and memoize
	const mergedModifiers = useMemo(() => {
		if (modifiers == null) {
			return internalModifiers;
		}
		return [...internalModifiers, ...modifiers];
	}, [internalModifiers, modifiers]);

	return (
		<ReactPopper
			// @ts-expect-error - No overload matches this call
			// This error was introduced after upgrading to TypeScript 5
			modifiers={mergedModifiers}
			placement={placement}
			strategy={strategy}
			referenceElement={referenceElement}
		>
			{children}
		</ReactPopper>
	);
}
