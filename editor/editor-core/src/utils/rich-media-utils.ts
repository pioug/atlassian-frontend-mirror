import { RichMediaAttributes, RichMediaLayout } from '@atlaskit/adf-schema';
export const wrappedLayouts: RichMediaLayout[] = [
  'wrap-left',
  'wrap-right',
  'align-end',
  'align-start',
];

export const nonWrappedLayouts: RichMediaLayout[] = [
  'center',
  'wide',
  'full-width',
];

export const floatingLayouts = ['wrap-left', 'wrap-right'];

export const alignAttributes = (
  layout: RichMediaLayout,
  oldAttrs: RichMediaAttributes,
  gridSize: number = 12,
  originalWidth: number,
  lineLength?: number,
): RichMediaAttributes => {
  let width = oldAttrs.width;
  const oldLayout: RichMediaLayout = oldAttrs.layout;
  const oldLayoutIsNonWrapped = nonWrappedLayouts.indexOf(oldLayout) > -1;
  const newLayoutIsNonWrapped = nonWrappedLayouts.indexOf(layout) > -1;
  const newLayoutIsWrapped = wrappedLayouts.indexOf(layout) > -1;
  const oldLayoutIsWrapped = wrappedLayouts.indexOf(oldLayout) > -1;
  if (
    oldLayoutIsNonWrapped &&
    newLayoutIsWrapped &&
    originalWidth &&
    lineLength &&
    originalWidth > 0.5 * lineLength
  ) {
    // 'full-width' or 'wide' or 'center' -> 'wrap-left' or 'wrap-right' or 'align-end' or 'align-start'
    if (
      !width ||
      width >= 100 ||
      oldLayout !== 'center' // == 'full-width' or 'wide'
    ) {
      width = 50;
    }
  } else if (
    layout !== oldLayout &&
    ['full-width', 'wide'].indexOf(oldLayout) > -1
  ) {
    // 'full-width' -> 'center' or 'wide'
    // 'wide' -> 'center' or 'full-width'
    // unset width
    width = undefined;
  } else if (width) {
    const cols = Math.round((width / 100) * gridSize);
    let targetCols = cols;

    if (oldLayoutIsWrapped && newLayoutIsNonWrapped) {
      // wrap -> center needs to align to even grid
      targetCols = Math.floor(targetCols / 2) * 2;
      width = undefined;
    } else if (oldLayoutIsNonWrapped && newLayoutIsWrapped) {
      // Can be here only if
      // 'full-width' or 'wide' or 'center' -> 'wrap-left' or 'wrap-right' or 'align-end' or 'align-start'
      // AND
      // !originalWidth || !lineLength || small image
      // AND
      // width defined!

      // cannot resize to full column width, and cannot resize to 1 column
      if (cols <= 1) {
        targetCols = 2;
      } else if (cols >= gridSize) {
        targetCols = 10;
      }
    }

    if (targetCols !== cols) {
      width = (targetCols / gridSize) * 100;
    }
  }

  return {
    ...oldAttrs,
    layout,
    width,
  };
};
