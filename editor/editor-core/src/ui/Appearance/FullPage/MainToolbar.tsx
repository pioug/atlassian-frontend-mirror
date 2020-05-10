import styled from 'styled-components';
import { N30 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme';
import {
  akEditorMenuZIndex,
  akEditorSwoopCubicBezier,
} from '@atlaskit/editor-common';
import { akEditorToolbarKeylineHeight } from '../../../styles';

export interface MainToolbarProps {
  showKeyline: boolean;
}

export const MainToolbar = styled.div<MainToolbarProps>`
  position: relative;
  align-items: center;
  box-shadow: ${(props: MainToolbarProps) =>
    props.showKeyline
      ? `0 ${akEditorToolbarKeylineHeight}px 0 0 ${N30}`
      : 'none'};
  transition: box-shadow 200ms ${akEditorSwoopCubicBezier};
  z-index: ${akEditorMenuZIndex};
  display: flex;
  height: 80px;
  flex-shrink: 0;

  & object {
    height: 0 !important;
  }
`;
MainToolbar.displayName = 'MainToolbar';

export const MainToolbarIconBefore = styled.div`
  margin: ${gridSize() * 2}px;
  height: ${gridSize() * 4}px;
  width: ${gridSize() * 4}px;
`;
MainToolbarIconBefore.displayName = 'MainToolbarIconBefore';

export const MainToolbarCustomComponentsSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;
MainToolbarCustomComponentsSlot.displayName = 'MainToolbar';

export const SecondaryToolbar = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  display: flex;
  padding: 24px 0;
`;
SecondaryToolbar.displayName = 'SecondaryToolbar';
