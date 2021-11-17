import styled from 'styled-components';
import { N30 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import {
  akEditorMenuZIndex,
  akEditorSwoopCubicBezier,
  akEditorToolbarKeylineHeight,
  akEditorMobileMaxWidth,
} from '@atlaskit/editor-shared-styles';

export const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 868;

export interface MainToolbarProps {
  showKeyline: boolean;
  twoLineEditorToolbar: boolean;
}

interface MainToolbarChildProps {
  twoLineEditorToolbar: boolean;
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

  @media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px) {
    ${(props: MainToolbarProps) =>
      props.twoLineEditorToolbar &&
      `
        flex-wrap: wrap;
        height: calc(${toolbarLineHeight}px * 2);
      `}
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

export const MainToolbarFirstChild = styled.div<MainToolbarChildProps>`
  display: flex;
  flex-grow: 1;

  @media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px) {
    ${(props: MainToolbarChildProps) =>
      props.twoLineEditorToolbar &&
      `
        flex: 1 1 100%;
        height: ${toolbarLineHeight}px;
        justify-content: flex-end;
        // ED-10241: We add fit-content to ensure that MainToolbar does not
        // shrink more than the size of its contents. This will prevent the
        // find/replace icon from being overlapped during a confluence
        // publish operation
        min-width: fit-content;
      `}
  }
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    grid-column: 1;
    grid-row: 1;
  }
`;
MainToolbarFirstChild.displayName = 'MainToolbarFirstChild';

export const MainToolbarSecondChild = styled.div<MainToolbarChildProps>`
  // ED-10241: We add fit-content to ensure that MainToolbar does not
  // shrink more than the size of its contents. This will prevent the
  // find/replace icon from being overlapped during a confluence
  // publish operation
  min-width: fit-content;
  @media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px) {
    ${(props: MainToolbarChildProps) =>
      props.twoLineEditorToolbar &&
      `
        display: flex;
        flex-grow: 1;
        flex: 1 1 100%;
        margin: auto;
        height: ${toolbarLineHeight}px;
        min-width: 0;
      `}
  }
`;
MainToolbarSecondChild.displayName = 'MainToolbarSecondChild';

export const SecondaryToolbar = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  display: flex;
  padding: 24px 0;
`;
SecondaryToolbar.displayName = 'SecondaryToolbar';

export const NonCustomToolbarWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
`;
NonCustomToolbarWrapper.displayName = 'NonCustomToolbar';

export const CustomToolbarWrapper = styled.div`
  align-items: center;
  display: flex;
`;
CustomToolbarWrapper.displayName = 'CustomToolbar';
