import styled from 'styled-components';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize, borderRadius, colors } from '@atlaskit/theme';
import { getWidth } from '../utils';
import { Mode } from '../types';

type Props = {
  mode?: Mode;
};

type ColorPaletteMenuProps = {
  cols: number;
  mode?: Mode;
};

export const ColorCardWrapper = styled.div`
  display: flex;
  margin: ${gridSize() / 4}px;
`;

export const ColorPaletteContainer = styled.div<
  Props & JSX.IntrinsicElements['div']
>`
  display: flex;
  flex-wrap: wrap;
  padding: ${(props) =>
    props.mode === Mode.Compact ? `0` : `${gridSize() / 2}px`};
`;

export const ColorPaletteMenu = styled.div<
  ColorPaletteMenuProps & JSX.IntrinsicElements['div']
>`
  position: relative;
  margin: 0;
  background-color: ${colors.N0};
  width: ${(props) => getWidth(props.cols)}px;
  ${(props) =>
    props.mode &&
    props.mode === Mode.Standard &&
    `
    box-radius: ${borderRadius}px;
    box-shadow: 0 0 0 1px ${colors.N40}, 0 0 8px ${colors.N40};
    width: ${getWidth(props.cols) + gridSize()}px;
  `}
`;
