/** @jsx jsx */
import React, { RefObject, useEffect, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { gridSize } from '@atlaskit/theme/constants';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import {
  akEditorToolbarKeylineHeight,
  akEditorGridLineZIndex,
  akEditorMenuZIndex,
} from '@atlaskit/editor-shared-styles';

export const TableControlsPadding = 20;

const mainToolbarWrapperStyle = css`
  position: relative;
  align-items: center;
  padding: ${gridSize()}px ${gridSize()}px 0;
  display: flex;
  height: auto;
  background-color: ${token('elevation.surface', 'white')};
  box-shadow: none;
  padding-left: ${TableControlsPadding}px;

  & > div {
    > :first-child:not(style),
    > style:first-child + * {
      margin-left: 0;
    }
  }

  .block-type-btn {
    padding-left: 0;
  }
`;

const stickyToolbarWrapperStyle = css`
  /* stylelint-disable declaration-block-no-duplicate-properties */
  position: relative;
  position: sticky;
  /* stylelint-enable declaration-block-no-duplicate-properties */
  padding-bottom: ${gridSize()}px;
  z-index: ${akEditorGridLineZIndex + akEditorMenuZIndex};
  transition: box-shadow ease-in-out 0.2s;
  &.show-keyline {
    box-shadow: 0 ${akEditorToolbarKeylineHeight}px 0 0
      ${token('color.border', N30)};
  }
`;

type StickyToolbarProps = {
  externalToolbarRef?: RefObject<HTMLElement>;
};

const StickyToolbar: React.FC<StickyToolbarProps> = (props) => {
  const [top, setTop] = useState(0);

  useEffect(() => {
    setTop(props.externalToolbarRef?.current?.clientHeight || 0);
  }, [setTop, props.externalToolbarRef]);

  return (
    <div
      css={[
        mainToolbarWrapperStyle,
        stickyToolbarWrapperStyle,
        css`
          top: ${top};
        `,
      ]}
      data-testid="ak-editor-main-toolbar"
      className={'show-keyline'}
    >
      {props.children}
    </div>
  );
};

const FixedToolbar: React.FC = (props) => (
  <div css={mainToolbarWrapperStyle} data-testid="ak-editor-main-toolbar">
    {props.children}
  </div>
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

export const mainToolbarCustomComponentsSlotStyle = css`
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
