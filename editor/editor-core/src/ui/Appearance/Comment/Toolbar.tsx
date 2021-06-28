import React, { RefObject, useEffect, useState } from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N30 } from '@atlaskit/theme/colors';
import {
  akEditorToolbarKeylineHeight,
  akEditorGridLineZIndex,
  akEditorMenuZIndex,
} from '@atlaskit/editor-shared-styles';

export const TableControlsPadding = 20;

export const MainToolbarWrapper = styled.div`
  position: relative;
  align-items: center;
  padding: ${gridSize()}px ${gridSize()}px 0;
  display: flex;
  height: auto;
  background-color: white;
  box-shadow: none;
  padding-left: ${TableControlsPadding}px;

  & > div > *:first-child {
    margin-left: 0;
  }

  .block-type-btn {
    padding-left: 0;
  }
`;
MainToolbarWrapper.displayName = 'MainToolbar';

const StickyToolbarWrapper = styled(MainToolbarWrapper)<{ top: number }>`
  position: relative;
  position: sticky;
  top: ${(props) => `${props.top}px`};
  padding-bottom: ${gridSize()}px;
  z-index: ${akEditorGridLineZIndex + akEditorMenuZIndex};
  transition: box-shadow ease-in-out 0.2s;
  &.show-keyline {
    box-shadow: 0 ${akEditorToolbarKeylineHeight}px 0 0 ${N30};
  }
`;
StickyToolbarWrapper.displayName = 'MainToolbarSticky';

type StickyToolbarProps = {
  externalToolbarRef?: RefObject<HTMLElement>;
};

const StickyToolbar: React.FC<StickyToolbarProps> = (props) => {
  const [top, setTop] = useState(0);

  useEffect(() => {
    setTop(props.externalToolbarRef?.current?.clientHeight || 0);
  }, [setTop, props.externalToolbarRef]);

  return (
    <StickyToolbarWrapper
      data-testid="ak-editor-main-toolbar"
      className={'show-keyline'}
      top={top}
    >
      {props.children}
    </StickyToolbarWrapper>
  );
};

const FixedToolbar: React.FC = (props) => (
  <MainToolbarWrapper data-testid="ak-editor-main-toolbar">
    {props.children}
  </MainToolbarWrapper>
);

type MainToolbarProps = {
  useStickyToolbar?: boolean | RefObject<HTMLElement>;
};

export const MainToolbar: React.FC<MainToolbarProps> = ({
  useStickyToolbar,
  children,
}) => {
  if (!!useStickyToolbar) {
    return (
      <StickyToolbar
        externalToolbarRef={
          typeof useStickyToolbar === 'boolean' ? undefined : useStickyToolbar
        }
      >
        {children}
      </StickyToolbar>
    );
  }
  return <FixedToolbar>{children}</FixedToolbar>;
};

export const MainToolbarCustomComponentsSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
  padding-right: ${TableControlsPadding}px;
  > div {
    display: flex;
    flex-shrink: 0;
  }
`;
MainToolbarCustomComponentsSlot.displayName = 'MainToolbar';
