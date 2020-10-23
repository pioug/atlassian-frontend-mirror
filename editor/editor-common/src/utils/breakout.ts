import {
  akEditorBreakoutPadding,
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorWideLayoutWidth,
  breakoutWideScaleRatio,
} from '@atlaskit/editor-shared-styles';

import { mapBreakpointToLayoutMaxWidth } from '../ui/BaseTheme';
import { getBreakpoint } from '../ui/WidthProvider';

/**
 * Variables required to construct a context for breakout ssr inline script.
 *
 * TODO: Clean this up after: https://product-fabric.atlassian.net/browse/ED-8942
 */
const breakoutConsts: any = {
  padding: akEditorBreakoutPadding,
  defaultLayoutWidth: akEditorDefaultLayoutWidth,
  wideScaleRatio: breakoutWideScaleRatio,
  fullWidthLayoutWidth: akEditorFullWidthLayoutWidth,
  wideLayoutWidth: akEditorWideLayoutWidth,
  mapBreakpointToLayoutMaxWidth,
  getBreakpoint,
  calcBreakoutWidth: (
    layout: 'full-width' | 'wide' | string,
    containerWidth: number,
  ) => {
    const effectiveFullWidth = containerWidth - breakoutConsts.padding;

    switch (layout) {
      case 'full-width':
        return `${Math.min(
          effectiveFullWidth,
          breakoutConsts.fullWidthLayoutWidth,
        )}px`;
      case 'wide':
        return breakoutConsts.calcWideWidth(containerWidth);
      default:
        return '100%';
    }
  },
  calcLineLength: (containerWidth?: number, allowDynamicTextSizing?: boolean) =>
    allowDynamicTextSizing && containerWidth
      ? breakoutConsts.mapBreakpointToLayoutMaxWidth(
          breakoutConsts.getBreakpoint(containerWidth),
        )
      : breakoutConsts.defaultLayoutWidth,
  calcWideWidth: (
    containerWidth: number = breakoutConsts.defaultLayoutWidth,
    maxWidth: number = Infinity,
    fallback: string = '100%',
  ) => {
    const effectiveFullWidth = containerWidth - breakoutConsts.padding;
    const layoutMaxWidth = breakoutConsts.mapBreakpointToLayoutMaxWidth(
      breakoutConsts.getBreakpoint(containerWidth),
    );
    const wideWidth = Math.min(
      Math.ceil(layoutMaxWidth * breakoutConsts.wideScaleRatio),
      effectiveFullWidth,
    );
    return layoutMaxWidth > wideWidth
      ? fallback
      : `${Math.min(maxWidth, wideWidth)}px`;
  },
} as const;

export const absoluteBreakoutWidth = (
  layout: 'full-width' | 'wide' | string,
  containerWidth: number,
) => {
  const breakoutWidth = breakoutConsts.calcBreakoutWidth(
    layout,
    containerWidth,
  );

  // If it's percent, map to max layout size
  if (breakoutWidth.endsWith('%')) {
    switch (layout) {
      case 'full-width':
        return akEditorFullWidthLayoutWidth;
      case 'wide':
        return akEditorWideLayoutWidth;
      default:
        return breakoutConsts.mapBreakpointToLayoutMaxWidth(
          breakoutConsts.getBreakpoint(containerWidth),
        );
    }
  }

  return parseInt(breakoutWidth, 10);
};

export { breakoutConsts };
export const calcWideWidth = breakoutConsts.calcWideWidth;
export const calcBreakoutWidth = breakoutConsts.calcBreakoutWidth;
