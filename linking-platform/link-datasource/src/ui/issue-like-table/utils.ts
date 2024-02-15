export const COLUMN_BASE_WIDTH = 8;
export const COLUMN_MIN_WIDTH = COLUMN_BASE_WIDTH * 3;

export type GetWidthCss = (arg: {
  shouldUseWidth: boolean;
  width: number;
}) => React.CSSProperties;

/**
 * Generate width related portion of css for table cell.
 *
 * @param shouldUseWidth boolean argument defines if a given width is user defined / baked in value
 * or rather default width that should be treated as a maximum width. When table inserted initially
 * and no user custom width defined we set this value to `false`. As soon as user changes any of the
 * column widths we treat all width as custom hardcoded widths.
 * @param width
 */
export const getWidthCss: GetWidthCss = ({ shouldUseWidth, width }) =>
  shouldUseWidth
    ? {
        width,
      }
    : { maxWidth: width };
