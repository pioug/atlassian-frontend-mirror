import React, { useMemo } from 'react';

import { Placement, VirtualElement } from '@popperjs/core';
import {
  Modifier,
  PopperChildrenProps,
  PopperProps,
  Popper as ReactPopper,
} from 'react-popper';

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

export interface Props<Modifiers> {
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
}

type InternalModifierNames = 'flip' | 'hide' | 'offset' | 'preventOverflow';
type ModifierProps = Modifier<InternalModifierNames>[];

const constantModifiers: ModifierProps = [
  {
    name: 'flip',
    options: {
      flipVariations: false,
      padding: 5,
      boundary: 'clippingParents',
      rootBoundary: 'viewport',
    },
  },
  {
    name: 'preventOverflow',
    options: {
      padding: 5,
      rootBoundary: 'document',
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
}: Props<CustomModifiers>) {
  const [offsetX, offsetY] = offset;

  type CombinedModifiers = Partial<
    Modifier<InternalModifierNames | CustomModifiers>
  >[];

  // Merge a new offset modifier only if new offset values passed in
  const internalModifiers = useMemo((): CombinedModifiers => {
    const offsetModifier: Modifier<'offset'> = {
      name: 'offset',
      options: {
        offset: [offsetX, offsetY],
      },
    };

    return [...constantModifiers, offsetModifier];
  }, [offsetX, offsetY]);

  // Merge custom props and memoize
  const mergedModifiers = useMemo(() => {
    if (modifiers == null) {
      return internalModifiers;
    }
    return [...internalModifiers, ...modifiers];
  }, [internalModifiers, modifiers]);

  return (
    <ReactPopper
      modifiers={mergedModifiers}
      placement={placement}
      strategy={strategy}
      referenceElement={referenceElement}
    >
      {children}
    </ReactPopper>
  );
}
