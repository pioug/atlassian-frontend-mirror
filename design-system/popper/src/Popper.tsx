import React from 'react';

import memoizeOne from 'memoize-one';
import {
  PopperChildrenProps,
  PopperProps,
  Popper as ReactPopper,
} from 'react-popper';

import { Placement } from './types';

export { Manager, Reference } from 'react-popper';

interface State {}

export interface Props {
  /**
   * Returns the element to be positioned.
   */
  children: (childrenProps: PopperChildrenProps) => React.ReactNode;

  /**
   * Distance the popup should be away from the trigger in the format of "x,y".
   * Defaults to "0,8px" - which means the popup will be 8px away of the trigger on the y-axis.
   */
  offset: number | string;

  /**
   * Which side of the Reference to show on.
   */
  placement: Placement;

  /**
   * Replacement reference element to position popper relative to.
   */
  referenceElement?: HTMLElement;

  /**
   * Additional modifiers and modifier overwrites.
   */
  modifiers?: PopperProps['modifiers'];
}

type Position = 'top' | 'right' | 'bottom' | 'left';

const FlipBehavior: { [index: string]: Position[] } = {
  auto: [],
  top: ['top', 'bottom', 'top'],
  right: ['right', 'left', 'right'],
  bottom: ['bottom', 'top', 'bottom'],
  left: ['left', 'right', 'left'],
};

const getFlipBehavior = (side: string): Position[] => FlipBehavior[side];

export class Popper extends React.Component<Props, State> {
  static defaultProps: Props = {
    children: () => null,
    offset: '0, 8px',
    placement: 'bottom-start',
  };

  getModifiers: (placement: Placement) => PopperProps['modifiers'] = memoizeOne(
    placement => {
      const flipBehavior = getFlipBehavior(placement.split('-')[0]);
      const modifiers: PopperProps['modifiers'] = {
        flip: {
          enabled: true,
          behavior: flipBehavior,
          boundariesElement: 'viewport',
        },
        hide: {
          enabled: true,
        },
        offset: {
          enabled: true,
          offset: this.props.offset,
        },
        preventOverflow: {
          enabled: true,
          escapeWithReference: false,
          boundariesElement: 'window',
        },
      };

      if (this.props.modifiers) {
        return { ...modifiers, ...this.props.modifiers };
      }

      return modifiers;
    },
  );

  render() {
    const { placement, children, referenceElement } = this.props;
    const modifiers: PopperProps['modifiers'] = this.getModifiers(
      this.props.placement,
    );

    return (
      <ReactPopper
        positionFixed
        modifiers={modifiers}
        placement={placement}
        {...(referenceElement ? { referenceElement } : {})}
      >
        {children}
      </ReactPopper>
    );
  }
}
