import styled from 'styled-components';
import { N30 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import {
  akEditorMenuZIndex,
  akEditorSwoopCubicBezier,
  akEditorToolbarKeylineHeight,
  akEditorMobileMaxWidth,
} from '@atlaskit/editor-shared-styles';

export interface MainToolbarProps {
  showKeyline: boolean;
}

const toolbarLineHeight = 56;
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
  height: ${toolbarLineHeight}px;
  flex-shrink: 0;
  background-color: white;

  & object {
    height: 0 !important;
  }

  @media (max-width: ${akEditorMobileMaxWidth}px) {
    display: grid;
    height: calc(${toolbarLineHeight}px * 2);
  }
`;
MainToolbar.displayName = 'MainToolbar';

export const MainToolbarIconBefore = styled.div`
  margin: ${gridSize() * 2}px;
  height: ${gridSize() * 4}px;
  width: ${gridSize() * 4}px;
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    grid-column: 1;
    grid-row: 1;
  }
`;
MainToolbarIconBefore.displayName = 'MainToolbarIconBefore';

export const MainToolbarCustomComponentsSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  // ED-10241: We add fit-content to ensure that MainToolbar does not
  // shrink more than the size of its contents. This will prevent the
  // find/replace icon from being overlapped during a confluence
  // publish operation
  min-width: fit-content;
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    grid-column: 1;
    grid-row: 1;
  }
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
