/* Used to adjust flex parent height to account for the subtraction in children below */
export const IEMaxHeightCalcPx = 1;

/* A bug exists in IE where flex column children overflow the height of their parents.
 * The workaround is to set a pixel max-height on the flex children.
 * For more information see https://github.com/philipwalton/flexbugs/issues/216
 */
export const flexMaxHeightIEFix = `
  max-height: 100%;
  @media only screen and (-ms-high-contrast:active), (-ms-high-contrast:none) {
    max-height: calc(100% - ${IEMaxHeightCalcPx}px);
  }
`;
