import {
  akEditorBreakoutPadding,
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorWideLayoutWidth,
  breakoutWideScaleRatio,
} from '../styles/consts';
import { mapBreakpointToLayoutMaxWidth as mapBreakpointToLayoutMaxWidthExported } from '../ui/BaseTheme';
import { getBreakpoint as getBreakpointExported } from '../ui/WidthProvider';

/**
 * Variables required to get better naming and
 * cleaner context for breakout ssr inline script.
 *
 * E.g.:
 * – getBreakpoint vs ModuleName.getBreakpoint
 * – breakoutConsts.padding vs consts_1.akEditorBreakoutPadding
 *
 * TODO: Clean this up after: https://product-fabric.atlassian.net/browse/ED-8942
 */
const mapBreakpointToLayoutMaxWidth = mapBreakpointToLayoutMaxWidthExported;
const getBreakpoint = getBreakpointExported;
const breakoutConsts = {
  padding: akEditorBreakoutPadding,
  defaultLayoutWidth: akEditorDefaultLayoutWidth,
  wideScaleRatio: breakoutWideScaleRatio,
  fullWidthLayoutWidth: akEditorFullWidthLayoutWidth,
  wideLayoutWidth: akEditorWideLayoutWidth,
};

const calcBreakoutWidth = (
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
      return calcWideWidth(containerWidth);
    default:
      return '100%';
  }
};

const calcWideWidth = (
  containerWidth: number = breakoutConsts.defaultLayoutWidth,
  maxWidth: number = Infinity,
  fallback: string = '100%',
) => {
  const effectiveFullWidth = containerWidth - breakoutConsts.padding;
  const layoutMaxWidth = mapBreakpointToLayoutMaxWidth(
    getBreakpoint(containerWidth),
  );
  const wideWidth = Math.min(
    Math.ceil(layoutMaxWidth * breakoutConsts.wideScaleRatio),
    effectiveFullWidth,
  );
  return layoutMaxWidth > wideWidth
    ? fallback
    : `${Math.min(maxWidth, wideWidth)}px`;
};

export const absoluteBreakoutWidth = (
  layout: 'full-width' | 'wide' | string,
  containerWidth: number,
) => {
  const breakoutWidth = calcBreakoutWidth(layout, containerWidth);

  // If it's percent, map to max layout size
  if (breakoutWidth.endsWith('%')) {
    switch (layout) {
      case 'full-width':
        return akEditorFullWidthLayoutWidth;
      case 'wide':
        return akEditorWideLayoutWidth;
      default:
        return mapBreakpointToLayoutMaxWidth(getBreakpoint(containerWidth));
    }
  }

  return parseInt(breakoutWidth, 10);
};

export { calcBreakoutWidth, calcWideWidth, breakoutConsts };
