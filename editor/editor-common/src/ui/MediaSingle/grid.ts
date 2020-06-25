import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';

const handleMargin = 12;
const gutterSize = handleMargin * 2;

const validWidthModes: MediaSingleLayout[] = [
  'center',
  'wrap-left',
  'wrap-right',
  'align-start',
  'align-end',
];

export const layoutSupportsWidth = (layout: MediaSingleLayout) =>
  validWidthModes.indexOf(layout) > -1;

export function calcPxFromColumns(
  columns: number,
  lineLength: number,
  gridSize: number,
): number {
  const maxWidth = lineLength + gutterSize;
  return (maxWidth / gridSize) * columns - gutterSize;
}

export function calcColumnsFromPx(
  width: number,
  lineLength: number,
  gridSize: number,
): number {
  const maxWidth = lineLength + gutterSize;
  return ((width + gutterSize) * gridSize) / maxWidth;
}

export function calcPxFromPct(pct: number, lineLength: number): number {
  const maxWidth = lineLength + gutterSize;
  return maxWidth * pct - gutterSize;
}

export function calcPctFromPx(width: number, lineLength: number): number {
  const maxWidth = lineLength + gutterSize;
  return (width + gutterSize) / maxWidth;
}

export const snapToGrid = (
  gridWidth: number,
  width: number,
  height: number,
  lineLength: number,
  gridSize: number,
) => {
  const pxWidth = calcPxFromPct(gridWidth / 100, lineLength);

  const columnSpan = Math.round(
    calcColumnsFromPx(pxWidth, lineLength, gridSize),
  );

  const alignedWidth = calcPxFromColumns(columnSpan, lineLength, gridSize);

  return {
    height: (height / width) * alignedWidth,
    width: alignedWidth,
  };
};
