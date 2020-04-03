import React from 'react';
import styled from 'styled-components';
import {
  blockNodesVerticalMargin,
  calcBreakoutWidth,
  WidthConsumer,
} from '@atlaskit/editor-common';

export const Wrapper = styled.div`
  margin: ${blockNodesVerticalMargin} 0;
  margin-left: 50%;
  transform: translateX(-50%);
`;

export default function Breakout(props: {
  children: React.ReactChild;
  mode: string;
}) {
  return (
    <WidthConsumer>
      {({ width }) => (
        <Wrapper
          data-mode={props.mode}
          style={{ width: calcBreakoutWidth(props.mode, width) }}
          className="fabric-editor-breakout-mark"
        >
          {props.children}
        </Wrapper>
      )}
    </WidthConsumer>
  );
}
