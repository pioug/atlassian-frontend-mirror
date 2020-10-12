import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { borderRadius } from '@atlaskit/theme/constants';
import { N500 } from '@atlaskit/theme/colors';
import { h400 } from '@atlaskit/theme/typography';

export const MentionListErrorStyle: ComponentClass<HTMLAttributes<{}>> = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: white;
  color: ${N500};
  border: 1px solid #fff;
  border-radius: ${borderRadius()}px;
`;

export const GenericErrorVisualStyle: ComponentClass<HTMLAttributes<{}>> = styled.div`
  height: 108px;
  margin-bottom: 8px;
  margin-top: 36px;
  width: 83px;
`;

// TODO: Figure out why the themed css function is causing type errors when passed prop children
export const MentionListErrorHeadlineStyle: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ${h400()};
  margin-bottom: 8px;
`;

export const MentionListAdviceStyle: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-bottom: 48px;
`;
