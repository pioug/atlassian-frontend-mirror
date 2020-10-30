import memoizeOne from 'memoize-one';
import { Placement } from '@atlaskit/popper';

import { Target, BoundariesElement, RootBoundary } from '../types';

export const getPopupProps = memoizeOne(
  (
    width: string | number,
    target: Target,
    onFlip: (data: any) => any,
    boundariesElement?: BoundariesElement,
    offset?: number[],
    placement?: Placement,
    rootBoundary?: RootBoundary,
    shouldFlip?: boolean,
    popupTitle?: string,
  ) => ({
    searchThreshold: -1,
    controlShouldRenderValue: true,
    minMenuWidth: width,
    maxMenuWidth: width,
    autoFocus: false,
    target,
    popupTitle,
    popperProps: {
      placement: placement || 'auto',
      strategy: 'fixed',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset,
          },
        },
        {
          name: 'handleFlipStyle',
          enabled: true,
          order: 910,
          fn: (data: any) => onFlip(data),
        },
        {
          name: 'preventOverflow',
          options: {
            rootBoundary: rootBoundary,
            boundary: boundariesElement,
          },
        },
        {
          name: 'flip',
          enabled: shouldFlip,
        },
      ],
    },
  }),
);
