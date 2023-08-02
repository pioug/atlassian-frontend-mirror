/** @jsx jsx */
import type { RefObject } from 'react';
import React, { useEffect, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import {
  akEditorToolbarKeylineHeight,
  akEditorMenuZIndex,
} from '@atlaskit/editor-shared-styles';
import type { UseStickyToolbarType } from '@atlaskit/editor-common/ui';

export const TableControlsPadding = 20;

const mainToolbarWrapperStyle = css`
  position: relative;
  align-items: center;
  padding: ${token('space.100', '8px')} ${token('space.100', '8px')} 0;
  display: flex;
  height: auto;
  background-color: ${token('elevation.surface', 'white')};
  box-shadow: none;
  padding-left: ${token('space.250', '20px')};

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
  padding-bottom: ${token('space.100', '8px')};
  z-index: ${akEditorMenuZIndex};
  transition: box-shadow ease-in-out 0.2s;
  &.show-keyline {
    box-shadow: 0 ${akEditorToolbarKeylineHeight}px 0 0
      ${token('color.border', N30)};
  }
`;

type StickyToolbarProps = {
  externalToolbarRef?: RefObject<HTMLElement>;
  offsetTop?: number;
};

const StickyToolbar: React.FC<StickyToolbarProps> = (props) => {
  const [top, setTop] = useState(0);

  // ED-15802: if externalToolbarRef is passed in, set top to externalToolbarRef?.current?.clientHeight
  // else if offsetTop is a number set top to offsetTop
  // otherwise top is 0 as initial state
  useEffect(() => {
    if (props.externalToolbarRef?.current?.clientHeight) {
      setTop(props.externalToolbarRef.current.clientHeight);
    } else {
      setTop(props.offsetTop || 0);
    }
  }, [props.externalToolbarRef, props.offsetTop]);

  return (
    <div
      css={[
        mainToolbarWrapperStyle,
        stickyToolbarWrapperStyle,
        css`
          top: ${top}px;
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

/**
 * ED-15802: Scenarios when a sticky bar is used:
 * 1. useStickyToolbar is true
 * 2. useStickyToolbar is a DOM element
 * 3. useStickyToolbar is an object and has offsetTop key;
 */
const getStickyParameters = (configuration: UseStickyToolbarType) => {
  // const isUsingStickyOffset, isHTMLElement is used so TS can properly infer types.
  const isHTMLElement =
    typeof configuration === 'object' && !('offsetTop' in configuration);
  const isUsingStickyOffset =
    typeof configuration === 'object' && 'offsetTop' in configuration;

  if (typeof configuration !== 'object') {
    return { externalToolbarRef: undefined, offsetTop: undefined };
  }
  if (isUsingStickyOffset) {
    return { offsetTop: configuration.offsetTop };
  }
  if (isHTMLElement) {
    return {
      externalToolbarRef: configuration,
    };
  }
};

type MainToolbarProps = {
  useStickyToolbar?: UseStickyToolbarType;
};

export const MainToolbar: React.FC<MainToolbarProps> = ({
  useStickyToolbar,
  children,
}) => {
  if (useStickyToolbar) {
    return (
      <StickyToolbar {...getStickyParameters(useStickyToolbar)}>
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
  padding-right: ${token('space.250', '20px')};
  > div {
    display: flex;
    flex-shrink: 0;
  }
`;
