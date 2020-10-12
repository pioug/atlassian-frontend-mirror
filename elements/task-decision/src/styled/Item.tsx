import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { N20A, DN50 } from '@atlaskit/theme/colors';

export const ContentWrapper: ComponentClass<
  HTMLAttributes<{}> & {
    innerRef?: any;
  }
> = styled.div`
  margin: 0;
  word-wrap: break-word;
  min-width: 0;
  flex: 1 1 auto;
`;

export const TaskWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: row;
  padding: 6px 3px;
  position: relative;
`;

export const DecisionWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: row;
  margin: ${gridSize()}px 0 0 0;
  padding: ${gridSize()}px;
  padding-left: ${gridSize() * 1.5}px;
  border-radius: ${borderRadius()}px;
  background-color: ${themed({ light: N20A, dark: DN50 })};
  position: relative;

  .decision-item {
    cursor: initial;
  }
`;

export const ParticipantWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin: -2px 8px;
`;
