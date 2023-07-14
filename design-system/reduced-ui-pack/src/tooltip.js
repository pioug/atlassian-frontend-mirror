// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors, gridSize } from '@atlaskit/theme';
import css from './utils/evaluate-inner';

const grid = gridSize() / 2;
const fontSize = 3 * grid;
const lineHeight = (4 * grid) / fontSize;
const fontColor = 'white';
const maxWidth = 105 * grid; // ~420px
const borderRadius = '3px';
const leftAndRightTextPadding = 2 * grid;
const topAndBottomPadding = grid / 2;
const marginDistance = 2 * grid;

export default css`
  a[href][data-ak-tooltip],
  button[data-ak-tooltip] {
    overflow: visible;
    position: relative;
  }
  a[href][data-ak-tooltip]:hover::after,
  button[data-ak-tooltip]:hover::after,
  a[href][data-ak-tooltip]:focus::after,
  button[data-ak-tooltip]:focus::after {
    background-color: ${colors.N900};
    border-radius: ${borderRadius};
    box-sizing: border-box;
    color: ${fontColor};
    content: attr(data-ak-tooltip);
    display: inline-block;
    font-size: ${fontSize}px;
    line-height: ${lineHeight};
    max-width: ${maxWidth}px;
    overflow: hidden;
    padding: ${topAndBottomPadding}px ${leftAndRightTextPadding}px;
    pointer-events: none;
    position: absolute;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
    z-index: 10000;
  }
  a[href][data-ak-tooltip][data-ak-tooltip-position='top']::after,
  button[data-ak-tooltip][data-ak-tooltip-position='top']::after {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-${marginDistance}px);
  }
  a[href][data-ak-tooltip][data-ak-tooltip-position='right']::after,
  button[data-ak-tooltip][data-ak-tooltip-position='right']::after {
    left: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(${marginDistance}px);
  }
  a[href][data-ak-tooltip][data-ak-tooltip-position='bottom']::after,
  button[data-ak-tooltip][data-ak-tooltip-position='bottom']::after {
    left: 50%;
    top: 100%;
    transform: translateX(-50%) translateY(${marginDistance}px);
  }
  a[href][data-ak-tooltip][data-ak-tooltip-position='left']::after,
  button[data-ak-tooltip][data-ak-tooltip-position='left']::after {
    top: 50%;
    transform: translateY(-50%) translateX(-${marginDistance}px);
    right: 100%;
  }
`;
