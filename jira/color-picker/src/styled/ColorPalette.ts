import styled from 'styled-components';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize, colors } from '@atlaskit/theme';
import { getWidth } from '../utils';
import { Mode } from '../types';
import { token } from '@atlaskit/tokens';

type Props = {
  mode?: Mode;
};

type ColorPaletteMenuProps = {
  cols: number;
  mode?: Mode;
};

export const ColorCardWrapper = styled.div`
  display: flex;
  margin: ${token('space.025', '2px')};
`;

export const ColorPaletteContainer = styled.div<
  Props & JSX.IntrinsicElements['div']
>`
  display: flex;
  flex-wrap: wrap;
  padding: ${(props) =>
    props.mode === Mode.Compact ? `0` : `${token('space.050', '4px')}`};
`;

export const ColorPaletteMenu = styled.div<
  ColorPaletteMenuProps & JSX.IntrinsicElements['div']
>`
  position: relative;
  margin: 0;
  background-color: ${token('elevation.surface.overlay', colors.N0)};
  width: ${(props) => getWidth(props.cols)}px;
  ${(props) =>
    props.mode &&
    props.mode === Mode.Standard &&
    `
    box-radius: ${token('border.radius.100', '3px')};
    box-shadow: ${token(
      'elevation.shadow.overlay',
      `0 0 0 1px ${colors.N40}, 0 0 8px ${colors.N40}`,
    )};
    width: ${getWidth(props.cols) + gridSize()}px;
  `}
`;
