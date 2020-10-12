import memoizeOne from 'memoize-one';
import { Target } from '../types';

export const getPopupProps = memoizeOne(
  (
    width: string | number,
    target: Target,
    onFlip: (data: any) => any,
    popupTitle?: string,
    boundariesElement?: HTMLElement,
  ) => ({
    searchThreshold: -1,
    controlShouldRenderValue: true,
    minMenuWidth: width,
    maxMenuWidth: width,
    autoFocus: false,
    target,
    popupTitle,
    popperProps: {
      modifiers: {
        handleFlipStyle: {
          enabled: true,
          order: 910,
          fn: (data: any) => onFlip(data),
        },
        preventOverflow: {
          boundariesElement: boundariesElement || 'viewport',
        },
      },
    },
  }),
);
